import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { customerId, refreshToken, managerCustomerId } = await request.json();

    // Validate required inputs
    if (!customerId || !refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: customerId and refreshToken are required' },
        { status: 400 }
      );
    }

    // Load environment variables
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
    const developerToken = process.env.NEXT_PUBLIC_GOOGLE_ADS_DEVELOPER_TOKEN;
    const apiVersion = process.env.NEXT_PUBLIC_GOOGLE_ADS_API_VERSION || 'v21';

    if (!clientId || !clientSecret || !developerToken) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: Missing required environment variables' },
        { status: 500 }
      );
    }

    // Helper function to get access token
    async function getAccessToken(clientId, clientSecret, refreshToken) {
      try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error_description || 'Failed to obtain access token');
        }
        return data.access_token;
      } catch (err) {
        throw new Error(`Access token error: ${err.message}`);
      }
    }

    // Obtain access token
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    // First query to get campaign-level data
    const campaignQuery = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign.advertising_channel_sub_type,
        campaign.bidding_strategy_type,
        campaign.start_date,
        campaign.end_date,
        campaign_budget.amount_micros,
        campaign_budget.delivery_method,
        metrics.clicks,
        metrics.impressions,
        metrics.ctr,
        metrics.average_cpc,
        metrics.cost_micros,
        metrics.conversions,
        metrics.cost_per_conversion
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
      ORDER BY campaign.name
    `;

    const campaignResponse = await fetch(
      `https://googleads.googleapis.com/${apiVersion}/customers/${customerId}/googleAds:search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'developer-token': developerToken,
          'Authorization': `Bearer ${accessToken}`,
          ...(managerCustomerId && { 'login-customer-id': managerCustomerId }),
        },
        body: JSON.stringify({ query: campaignQuery.trim() }),
      }
    );

    const campaignData = await campaignResponse.json();
    if (!campaignResponse.ok) {
      throw new Error(campaignData.error?.message || 'Failed to fetch campaign details');
    }

    // Second query to get ad group and ad data
    const adGroupQuery = `
      SELECT
        campaign.id,
        campaign.name,
        ad_group.id,
        ad_group.name,
        ad_group.status,
        ad_group.type,
        ad_group_ad.ad.id,
        ad_group_ad.ad.name,
        ad_group_ad.ad.final_urls,
        ad_group_ad.ad.responsive_search_ad.headlines,
        ad_group_ad.ad.responsive_search_ad.descriptions,
        ad_group_ad.ad.expanded_text_ad.headline_part1,
        ad_group_ad.ad.expanded_text_ad.headline_part2,
        ad_group_ad.ad.expanded_text_ad.description,
        ad_group_ad.ad.expanded_text_ad.path1,
        ad_group_ad.ad.expanded_text_ad.path2,
        ad_group_ad.ad.type,
        ad_group_ad.status
      FROM ad_group_ad
      WHERE segments.date DURING LAST_30_DAYS
      ORDER BY campaign.name, ad_group.name
    `;

    const adGroupResponse = await fetch(
      `https://googleads.googleapis.com/${apiVersion}/customers/${customerId}/googleAds:search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'developer-token': developerToken,
          'Authorization': `Bearer ${accessToken}`,
          ...(managerCustomerId && { 'login-customer-id': managerCustomerId }),
        },
        body: JSON.stringify({ query: adGroupQuery.trim() }),
      }
    );

    const adGroupData = await adGroupResponse.json();
    if (!adGroupResponse.ok) {
      throw new Error(adGroupData.error?.message || 'Failed to fetch ad group details');
    }

    // Process campaign data
    const campaignsMap = new Map();
    
    (campaignData.results || []).forEach(result => {
      const campaignId = result.campaign.id;
      campaignsMap.set(campaignId, {
        id: campaignId,
        name: result.campaign.name,
        status: result.campaign.status,
        type: result.campaign.advertisingChannelType,
        subType: result.campaign.advertisingChannelSubType,
        strategy: result.campaign.biddingStrategyType,
        dates: {
          start: result.campaign.startDate,
          end: result.campaign.endDate
        },
        budget: {
          amount: result.campaignBudget?.amountMicros ? 
            parseInt(result.campaignBudget.amountMicros) / 1000000 : 0,
          delivery: result.campaignBudget?.deliveryMethod
        },
        metrics: {
          clicks: result.metrics?.clicks || 0,
          impressions: result.metrics?.impressions || 0,
          ctr: result.metrics?.ctr ? (result.metrics.ctr * 100).toFixed(2) + '%' : '0%',
          avgCpc: result.metrics?.averageCpc ? 
            '$' + (parseInt(result.metrics.averageCpc) / 1000000).toFixed(2) : '$0',
          cost: result.metrics?.costMicros ? 
            '$' + (parseInt(result.metrics.costMicros) / 1000000).toFixed(2) : '$0',
          conversions: result.metrics?.conversions || 0,
          conversionRate: result.metrics?.conversionRate ? 
            (result.metrics.conversionRate * 100).toFixed(2) + '%' : '0%',
          costPerConversion: result.metrics?.costPerConversion ? 
            '$' + (parseInt(result.metrics.costPerConversion) / 1000000).toFixed(2) : '$0'
        },
        adGroups: []
      });
    });

    // Process ad group data
    (adGroupData.results || []).forEach(result => {
      const campaignId = result.campaign.id;
      const campaign = campaignsMap.get(campaignId);
      
      if (campaign) {
        const adGroupId = result.adGroup.id;
        let adGroup = campaign.adGroups.find(ag => ag.id === adGroupId);
        
        if (!adGroup) {
          adGroup = {
            id: adGroupId,
            name: result.adGroup.name,
            status: result.adGroup.status,
            type: result.adGroup.type,
            ads: []
          };
          campaign.adGroups.push(adGroup);
        }

        const adData = {
          id: result.adGroupAd.ad.id,
          name: result.adGroupAd.ad.name,
          type: result.adGroupAd.ad.type,
          status: result.adGroupAd.status,
          finalUrls: result.adGroupAd.ad.finalUrls || [],
          creative: {}
        };

        // Handle different ad types
        if (result.adGroupAd.ad.responsiveSearchAd) {
          adData.creative.type = 'Responsive Search Ad';
          adData.creative.headlines = result.adGroupAd.ad.responsiveSearchAd.headlines?.map(h => h.text) || [];
          adData.creative.descriptions = result.adGroupAd.ad.responsiveSearchAd.descriptions?.map(d => d.text) || [];
        } else if (result.adGroupAd.ad.expandedTextAd) {
          adData.creative.type = 'Expanded Text Ad';
          adData.creative.headline1 = result.adGroupAd.ad.expandedTextAd.headlinePart1;
          adData.creative.headline2 = result.adGroupAd.ad.expandedTextAd.headlinePart2;
          adData.creative.description = result.adGroupAd.ad.expandedTextAd.description;
          adData.creative.path1 = result.adGroupAd.ad.expandedTextAd.path1;
          adData.creative.path2 = result.adGroupAd.ad.expandedTextAd.path2;
        }

        adGroup.ads.push(adData);
      }
    });

    return NextResponse.json({ 
      success: true, 
      campaigns: Array.from(campaignsMap.values()),
      metadata: {
        customerId,
        dateRange: 'LAST_30_DAYS',
        apiVersion,
        fetchedAt: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('API Error:', err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}