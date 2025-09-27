import { NextRequest, NextResponse } from 'next/server';

// Environment variables
const API_URL = process.env.NAMECOM_API_URL || 'https://api.dev.name.com'; // Default to sandbox
const USERNAME = process.env.NAMECOM_USERNAME;
const TOKEN = process.env.NAMECOM_TOKEN;

// Validate environment variables
if (!USERNAME || !TOKEN) {
  console.error('Missing NAMECOM_USERNAME or NAMECOM_TOKEN');
  throw new Error('API configuration is incomplete');
}

// Authentication header
const auth = Buffer.from(`${USERNAME}:${TOKEN}`).toString('base64');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${auth}`,
};

export async function POST(req) {
  // Parse request body
  let action, domain, years, contacts, enablePrivacy;
  try {
    ({ action, domain, years = 1, contacts, enablePrivacy = true } = await req.json());
  } catch (error) {
    console.error('Invalid request body:', error.message);
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  // Helper function to handle API responses
  async function handleResponse(res) {
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      throw new Error(`Expected JSON, received ${contentType || 'no content-type'}`);
    }
    const data = await res.json();
    if (!res.ok) {
      console.error('API error:', data);
      throw new Error(JSON.stringify(data));
    }
    return data;
  }

  try {
    if (action === 'check') {
      // Check domain availability
      const body = { domainNames: [domain] };
      const res = await fetch(`${API_URL}/v4/domains:checkAvailability`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await handleResponse(res);
      return NextResponse.json(data);
    }

    if (action === 'buy') {
      // Step 1: Check domain availability and get price
      const checkRes = await fetch(`${API_URL}/v4/domains:checkAvailability`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ domainNames: [domain] }),
      });
      const checkData = await handleResponse(checkRes);
      const result = checkData.results?.[0];

      if (!result?.purchasable || !result?.purchasePrice) {
        return NextResponse.json(
          { error: 'Domain not available or price unavailable' },
          { status: 400 }
        );
      }

      // Step 2: Purchase domain
      const body = {
        domain: {
          domainName: domain,
          contacts, // Must include registrant, admin, tech, billing
          privacyEnabled: enablePrivacy,
        },
        purchasePrice: result.purchasePrice,
        years,
      };
      const res = await fetch(`${API_URL}/v4/domains`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await handleResponse(res);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}