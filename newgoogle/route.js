// app/api/creategoogle/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

export async function POST(request) {
  try {
    const {
      customerId,
      refreshToken,
      campaignDetails,
      managerCustomerId,
      imageUrl // Added imageUrl to the request body
    } = await request.json();

    console.log('Request body:', { 
      customerId, 
      managerCustomerId,
      campaignDetails,
      imageUrl: imageUrl ? 'Provided' : 'Not provided' 
    });

    // Validate input
    if (!customerId || !/^\d{10}$/.test(customerId)) {
      return NextResponse.json(
        { error: 'Valid customer ID required (10-digit number)' },
        { status: 400 }
      );
    }

    if (!managerCustomerId || !/^\d{10}$/.test(managerCustomerId)) {
      return NextResponse.json(
        { error: 'Valid manager customer ID required (10-digit number)' },
        { status: 400 }
      );
    }

    if (!campaignDetails?.name || campaignDetails.name.length < 3) {
      return NextResponse.json(
        { error: 'Campaign name must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (!['SEARCH', 'DISPLAY', 'VIDEO', 'SHOPPING'].includes(campaignDetails.channelType)) {
      return NextResponse.json(
        { error: 'Invalid channel type. Must be SEARCH, DISPLAY, VIDEO, or SHOPPING' },
        { status: 400 }
      );
    }

    const budgetMicros = campaignDetails.budgetMicros || 100000000;
    if (budgetMicros <= 0) {
      return NextResponse.json(
        { error: 'Budget must be greater than zero' },
        { status: 400 }
      );
    }

    // Validate dates
    const today = new Date().toISOString().split('T')[0];
    if (!campaignDetails.startDate || campaignDetails.startDate < today) {
      return NextResponse.json(
        { error: 'Valid future start date required (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    if (!campaignDetails.endDate || campaignDetails.endDate < campaignDetails.startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Validate ad content for SEARCH campaigns
    if (campaignDetails.channelType === 'SEARCH') {
      if (!campaignDetails.adContent?.headlines || campaignDetails.adContent.headlines.length < 3) {
        return NextResponse.json(
          { error: 'At least 3 headlines required for SEARCH campaigns' },
          { status: 400 }
        );
      }

      if (!campaignDetails.adContent?.descriptions || campaignDetails.adContent.descriptions.length < 2) {
        return NextResponse.json(
          { error: 'At least 2 descriptions required for SEARCH campaigns' },
          { status: 400 }
        );
      }

      if (!campaignDetails.adContent?.finalUrl) {
        return NextResponse.json(
          { error: 'Final URL required for SEARCH campaigns' },
          { status: 400 }
        );
      }
    }

    // Validate image for DISPLAY campaigns
    if (campaignDetails.channelType === 'DISPLAY' && !imageUrl) {
      return NextResponse.json(
        { error: 'Image URL required for DISPLAY campaigns' },
        { status: 400 }
      );
    }

    // Load environment variables
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
    const developerToken = process.env.NEXT_PUBLIC_GOOGLE_ADS_DEVELOPER_TOKEN;
    const apiVersion = process.env.NEXT_PUBLIC_GOOGLE_ADS_API_VERSION || '20';

    if (!clientId || !clientSecret || !developerToken) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing required environment variables' },
        { status: 500 }
      );
    }

    // Obtain access token
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
    console.log('Access token obtained');

    // Step 1: Create campaign budget
    const budgetResponse = await fetch(
      `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/campaignBudgets:mutate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Developer-Token': developerToken,
          'Authorization': `Bearer ${accessToken}`,
          'login-customer-id': managerCustomerId,
        },
        body: JSON.stringify({
          operations: [{
            create: {
              name: `Budget for ${campaignDetails.name}`,
              deliveryMethod: 'STANDARD',
              amountMicros: budgetMicros,
            },
          }],
        }),
      }
    );

    const budgetData = await budgetResponse.json();
    if (!budgetResponse.ok) {
      throw new Error(budgetData.error?.message || 'Failed to create campaign budget');
    }

    const campaignBudgetResourceName = budgetData.results?.[0]?.resourceName;
    if (!campaignBudgetResourceName) {
      throw new Error('No campaign budget resource name returned');
    }

    // Step 2: Create campaign
    const campaignResponse = await fetch(
      `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/campaigns:mutate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Developer-Token': developerToken,
          'Authorization': `Bearer ${accessToken}`,
          'login-customer-id': managerCustomerId,
        },
        body: JSON.stringify({
          operations: [{
            create: {
              campaignBudget: campaignBudgetResourceName,
              name: campaignDetails.name,
              advertisingChannelType: campaignDetails.channelType,
              status: 'PAUSED', // Start paused so we can review
              startDate: campaignDetails.startDate,
              endDate: campaignDetails.endDate,
              manualCpc: { enhancedCpcEnabled: false },
              networkSettings: {
                targetGoogleSearch: true,
                targetSearchNetwork: true,
                targetContentNetwork: campaignDetails.channelType === 'DISPLAY',
              },
            },
          }],
        }),
      }
    );

    const campaignData = await campaignResponse.json();
    if (!campaignResponse.ok) {
      throw new Error(campaignData.error?.message || 'Failed to create campaign');
    }

    const campaignResourceName = campaignData.results?.[0]?.resourceName;
    if (!campaignResourceName) {
      throw new Error('No campaign resource name returned');
    }

    // Step 3: Create ad group
    const adGroupResponse = await fetch(
      `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/adGroups:mutate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Developer-Token': developerToken,
          'Authorization': `Bearer ${accessToken}`,
          'login-customer-id': managerCustomerId,
        },
        body: JSON.stringify({
          operations: [{
            create: {
              campaign: campaignResourceName,
              name: `Ad Group for ${campaignDetails.name}`,
              status: 'ENABLED',
              type: campaignDetails.channelType === 'SEARCH' ? 'SEARCH_STANDARD' : 'DISPLAY_STANDARD',
              cpcBidMicros: 1000000, // $1.00 default bid
            },
          }],
        }),
      }
    );

    const adGroupData = await adGroupResponse.json();
    if (!adGroupResponse.ok) {
      throw new Error(adGroupData.error?.message || 'Failed to create ad group');
    }

    const adGroupResourceName = adGroupData.results?.[0]?.resourceName;
    if (!adGroupResourceName) {
      throw new Error('No ad group resource name returned');
    }

    // Step 4: Create appropriate ad type
    let adResourceName = '';
    if (campaignDetails.channelType === 'SEARCH') {
      // Create responsive search ad
      const adResponse = await fetch(
        `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/adGroupAds:mutate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Developer-Token': developerToken,
            'Authorization': `Bearer ${accessToken}`,
            'login-customer-id': managerCustomerId,
          },
          body: JSON.stringify({
            operations: [{
              create: {
                adGroup: adGroupResourceName,
                status: 'ENABLED',
                ad: {
                  finalUrls: [campaignDetails.adContent.finalUrl],
                  responsiveSearchAd: {
                    headlines: campaignDetails.adContent.headlines.map((text) => ({
                      text,
                      pinnedField: null,
                    })),
                    descriptions: campaignDetails.adContent.descriptions.map((text) => ({
                      text,
                      pinnedField: null,
                    })),
                  },
                },
              },
            }],
          }),
        }
      );

      const adData = await adResponse.json();
      if (!adResponse.ok) {
        throw new Error(adData.error?.message || 'Failed to create search ad');
      }
      adResourceName = adData.results?.[0]?.resourceName || '';
    } 
    else if (campaignDetails.channelType === 'DISPLAY' && imageUrl) {
      // First upload image to Google Ads
      const imageUploadResponse = await fetch(
        `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/images:upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Developer-Token': developerToken,
            'Authorization': `Bearer ${accessToken}`,
            'login-customer-id': managerCustomerId,
          },
          body: JSON.stringify({
            imageUrl: imageUrl
          }),
        }
      );

      const imageUploadData = await imageUploadResponse.json();
      if (!imageUploadResponse.ok) {
        throw new Error(imageUploadData.error?.message || 'Failed to upload image to Google Ads');
      }

      const imageResourceName = imageUploadData.resourceName;

      // Then create display ad with the image
      const adResponse = await fetch(
        `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/adGroupAds:mutate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Developer-Token': developerToken,
            'Authorization': `Bearer ${accessToken}`,
            'login-customer-id': managerCustomerId,
          },
          body: JSON.stringify({
            operations: [{
              create: {
                adGroup: adGroupResourceName,
                status: 'ENABLED',
                ad: {
                  finalUrls: [campaignDetails.adContent?.finalUrl || 'https://example.com'],
                  displayUploadAd: {
                    displayUploadProductType: 'IMAGE',
                    mediaBundle: imageResourceName
                  }
                },
              },
            }],
          }),
        }
      );

      const adData = await adResponse.json();
      if (!adResponse.ok) {
        throw new Error(adData.error?.message || 'Failed to create display ad');
      }
      adResourceName = adData.results?.[0]?.resourceName || '';
    }


    return NextResponse.json({
      success: true,
      campaignId: campaignResourceName.split('/').pop(),
      budgetId: campaignBudgetResourceName.split('/').pop(),
      adGroupId: adGroupResourceName.split('/').pop(),
      adId: adResourceName ? adResourceName.split('/').pop() : null,
      imageUrl,
    });

  } catch (err) {
    console.error('Error creating campaign:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create campaign' },
      { status: 500 }
    );
  }
}