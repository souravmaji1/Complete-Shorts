// app/api/scrape-domains/route.js
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

class ExpiredDomainsScraper {
    constructor() {
        this.baseUrl = 'https://www.expireddomains.net/deleted-domains/';
        this.domains = [];
    }

    async scrapeWithPuppeteer() {
        let browser;
        try {
            console.log('Launching Puppeteer browser...');
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu'
                ]
            });

            const page = await browser.newPage();
            
            // Set user agent and other headers
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            await page.setExtraHTTPHeaders({
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'DNT': '1',
                'Upgrade-Insecure-Requests': '1'
            });

            console.log('Navigating to page...');
            await page.goto(this.baseUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for the main table to load
            console.log('Waiting for table to load...');
            await page.waitForSelector('table.base1', { timeout: 10000 });

            // Extract table data
            console.log('Extracting table data...');
            const domains = await page.evaluate(() => {
                const table = document.querySelector('table.base1');
                if (!table) return [];

                const headers = [];
                const headerRow = table.querySelector('tr');
                if (headerRow) {
                    headerRow.querySelectorAll('th, td').forEach(cell => {
                        headers.push(cell.textContent.trim());
                    });
                }

                const domains = [];
                const rows = table.querySelectorAll('tr:not(:first-child)');

                rows.forEach(row => {
                    const domainData = {};
                    const cells = row.querySelectorAll('td');
                    
                    cells.forEach((cell, index) => {
                        if (headers[index]) {
                            let value = cell.textContent.trim();
                            
                            // Special handling for domain links
                            if (headers[index].toLowerCase().includes('domain')) {
                                const link = cell.querySelector('a');
                                if (link) {
                                    value = link.textContent.trim();
                                }
                            }
                            
                            domainData[headers[index]] = value;
                        }
                    });

                    if (domainData.Domain && domainData.Domain.length > 0) {
                        domains.push(domainData);
                    }
                });

                return domains;
            });

            console.log(`Found ${domains.length} domains with Puppeteer`);
            this.domains = domains;

            // Calculate statistics
            const stats = this.calculateStats(domains);

            return {
                success: true,
                totalDomains: domains.length,
                domains: domains,
                stats: stats,
                scrapedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error with Puppeteer scraping:', error.message);
            return {
                success: false,
                message: error.message,
                domains: []
            };
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    calculateStats(domains) {
        const stats = {
            total: domains.length,
            available: 0,
            registered: 0,
            withBacklinks: 0,
            comDomains: 0,
            netDomains: 0,
            orgDomains: 0,
            withArchiveData: 0,
            avgBacklinks: 0,
            maxBacklinks: 0,
            domainsByTld: {},
            domainsByStatus: {}
        };

        let totalBacklinks = 0;

        domains.forEach(domain => {
            // Status stats
            const status = domain.Status?.toLowerCase() || 'unknown';
            if (status.includes('available')) stats.available++;
            if (status.includes('registered')) stats.registered++;
            
            stats.domainsByStatus[status] = (stats.domainsByStatus[status] || 0) + 1;

            // Backlinks stats
            const backlinks = parseInt(domain.BL || '0');
            if (backlinks > 0) {
                stats.withBacklinks++;
                totalBacklinks += backlinks;
                stats.maxBacklinks = Math.max(stats.maxBacklinks, backlinks);
            }

            // TLD stats
            if (domain.Domain) {
                if (domain.Domain.endsWith('.com')) stats.comDomains++;
                if (domain.Domain.endsWith('.net')) stats.netDomains++;
                if (domain.Domain.endsWith('.org')) stats.orgDomains++;

                const tld = domain.Domain.split('.').pop();
                stats.domainsByTld[tld] = (stats.domainsByTld[tld] || 0) + 1;
            }

            // Archive stats
            const archiveResults = parseInt(domain.ACR || '0');
            if (archiveResults > 0) stats.withArchiveData++;
        });

        stats.avgBacklinks = stats.withBacklinks > 0 ? Math.round(totalBacklinks / stats.withBacklinks) : 0;

        return stats;
    }
}

// GET handler
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'json';
        const limit = parseInt(searchParams.get('limit') || '0');
        const filter = searchParams.get('filter');

        const scraper = new ExpiredDomainsScraper();
        const result = await scraper.scrapeWithPuppeteer();

        if (!result.success) {
            return NextResponse.json({
                error: 'Scraping failed',
                message: result.message
            }, { status: 500 });
        }

        let { domains } = result;

        // Apply filters
        if (filter) {
            switch (filter) {
                case 'available':
                    domains = domains.filter(d => d.Status?.toLowerCase().includes('available'));
                    break;
                case 'with-backlinks':
                    domains = domains.filter(d => parseInt(d.BL || '0') > 0);
                    break;
                case 'com':
                    domains = domains.filter(d => d.Domain?.endsWith('.com'));
                    break;
                case 'short':
                    domains = domains.filter(d => d.Domain && d.Domain.length <= 10);
                    break;
            }
        }

        // Apply limit
        if (limit > 0) {
            domains = domains.slice(0, limit);
        }

        // Return CSV format if requested
        if (format === 'csv') {
            const csvContent = convertToCSV(domains);
            return new Response(csvContent, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="expired-domains.csv"'
                }
            });
        }

        return NextResponse.json({
            ...result,
            domains,
            filteredCount: domains.length
        });

    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            message: error.message
        }, { status: 500 });
    }
}

// POST handler for more complex filtering
export async function POST(request) {
    try {
        const body = await request.json();
        const { filters = {}, sortBy, sortOrder = 'desc', limit = 0 } = body;

        const scraper = new ExpiredDomainsScraper();
        const result = await scraper.scrapeWithPuppeteer();

        if (!result.success) {
            return NextResponse.json({
                error: 'Scraping failed',
                message: result.message
            }, { status: 500 });
        }

        let { domains } = result;

        // Apply complex filters
        if (Object.keys(filters).length > 0) {
            domains = domains.filter(domain => {
                let match = true;

                if (filters.status && !domain.Status?.toLowerCase().includes(filters.status.toLowerCase())) {
                    match = false;
                }

                if (filters.minBacklinks && parseInt(domain.BL || '0') < filters.minBacklinks) {
                    match = false;
                }

                if (filters.maxBacklinks && parseInt(domain.BL || '0') > filters.maxBacklinks) {
                    match = false;
                }

                if (filters.tld && !domain.Domain?.endsWith(`.${filters.tld}`)) {
                    match = false;
                }

                if (filters.minLength && domain.Domain && domain.Domain.length < filters.minLength) {
                    match = false;
                }

                if (filters.maxLength && domain.Domain && domain.Domain.length > filters.maxLength) {
                    match = false;
                }

                if (filters.hasArchive && parseInt(domain.ACR || '0') === 0) {
                    match = false;
                }

                return match;
            });
        }

        // Apply sorting
        if (sortBy) {
            domains.sort((a, b) => {
                let aVal = a[sortBy] || '';
                let bVal = b[sortBy] || '';

                // Convert to numbers if numeric
                if (!isNaN(aVal) && !isNaN(bVal)) {
                    aVal = parseFloat(aVal);
                    bVal = parseFloat(bVal);
                }

                if (sortOrder === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
        }

        // Apply limit
        if (limit > 0) {
            domains = domains.slice(0, limit);
        }

        return NextResponse.json({
            ...result,
            domains,
            filteredCount: domains.length,
            appliedFilters: filters
        });

    } catch (error) {
        console.error('POST API route error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            message: error.message
        }, { status: 500 });
    }
}

// Helper function to convert to CSV
function convertToCSV(data) {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header] || '';
            // Escape quotes and wrap in quotes if contains comma
            return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}