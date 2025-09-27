import { NextResponse } from 'next/server';

async function getAccessToken(clientId, clientSecret, refreshToken) {
  try {
    console.log('🔑 Starting access token request...');
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

    console.log('🔑 Token response status:', response.status);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Token error:', data);
      throw new Error(data.error_description || 'Failed to obtain access token');
    }
    
    console.log('✅ Successfully obtained access token');
    return data.access_token;
  } catch (err) {
    console.error('❌ Access token error:', err);
    throw new Error(`Access token error: ${err.message}`);
  }
}

async function createMediaBundleAsset(customerId, accessToken, imageUrl, developerToken, managerCustomerId, apiVersion) {
  try {
    console.log('🖼️ Starting media asset creation for:', imageUrl);
    
    // 1. Fetch the image
    console.log('🔍 Fetching image from URL...');
    const imageResponse = await fetch(imageUrl);
    console.log('🖼 Image fetch status:', imageResponse.status);
    
    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error('❌ Image fetch failed:', errorText.substring(0, 200));
      throw new Error(`Failed to fetch image from ${imageUrl} (Status: ${imageResponse.status})`);
    }

    // Get content type and validate
    const contentType = imageResponse.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);

    // Map to Google Ads supported MIME types
    const googleAdsMimeTypes = {
      'image/jpeg': 'IMAGE_JPEG',
      'image/png': 'IMAGE_PNG',
      'image/gif': 'IMAGE_GIF',
      'image/bmp': 'IMAGE_BMP'
    };

    const mimeType = googleAdsMimeTypes[contentType];
    if (!mimeType) {
      throw new Error(`Unsupported image type (${contentType}). Supported: ${Object.keys(googleAdsMimeTypes).join(', ')}`);
    }

    // 2. Get image as base64
    console.log('🔄 Converting image to base64...');
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    
    // Validate image size
    const imageSizeKB = Math.ceil(base64Image.length * 0.75 / 1024);
    console.log('📏 Image size:', imageSizeKB, 'KB');
    if (imageSizeKB > 5120) {
      throw new Error(`Image too large (${imageSizeKB}KB). Max size is 5120KB.`);
    }

    // 3. Prepare Google Ads upload request
    const uploadUrl = `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/assets:mutate`;
    console.log('📤 Uploading to Google Ads:', uploadUrl);

    const requestBody = {
      operations: [{
        create: {
          type: "IMAGE",
          imageAsset: {
            data: base64Image,
            fileSize: imageBuffer.byteLength,
            mimeType: mimeType // Using Google's enum value
          },
          name: "Display Ad Image Asset"
        }
      }]
    };

    console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Developer-Token': developerToken,
        ...(managerCustomerId && { 'login-customer-id': managerCustomerId }),
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📨 Upload response status:', uploadResponse.status);
    
    const responseText = await uploadResponse.text();
    console.log('📄 Raw upload response:', responseText.substring(0, 500));

    try {
      const uploadData = JSON.parse(responseText);
      if (!uploadResponse.ok) {
        console.error('❌ Upload error details:', uploadData);
        throw new Error(uploadData.error?.message || 'Google Ads upload failed');
      }
      
      console.log('✅ Media asset created successfully:', uploadData.results[0].resourceName);
      return uploadData.results[0].resourceName;
    } catch (e) {
      console.error('❌ Failed to parse response:', e);
      throw new Error(`Failed to parse response: ${responseText.substring(0, 200)}`);
    }
  } catch (error) {
    console.error('❌ Full upload error:', error);
    throw new Error(`Media asset creation failed: ${error.message}`);
  }
}

// Then update your ad creation to use the assets correctly:


export async function POST(request) {
  console.log('🚀 Starting display ads creation request');
  
  try {
    const requestData = await request.json();
    console.log('📦 Request data received:', JSON.stringify(requestData, null, 2));

    const { customerId, refreshToken, campaignDetails, managerCustomerId } = requestData;

    // Validate input
    console.log('🔍 Validating input...');
    if (!customerId || !campaignDetails) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing customer ID or campaign details' },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(customerId)) {
      console.error('❌ Invalid customer ID format');
      return NextResponse.json(
        { error: 'Customer ID must be a 10-digit number' },
        { status: 400 }
      );
    }

    // Load environment variables
    console.log('🔧 Loading environment variables...');
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
    const developerToken = process.env.NEXT_PUBLIC_GOOGLE_ADS_DEVELOPER_TOKEN;
    const apiVersion = process.env.NEXT_PUBLIC_GOOGLE_ADS_API_VERSION || '21';

    console.log('⚙️ Using API version:', apiVersion);
    console.log('🔑 Developer token:', developerToken ? '*****' : 'MISSING');

    if (!clientId || !clientSecret || !developerToken) {
      console.error('❌ Missing environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing required environment variables' },
        { status: 500 }
      );
    }

    // Obtain access token
    console.log('🔑 Obtaining access token...');
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
    console.log('✅ Access token obtained');

    // Create media bundle assets first
    console.log('🖼️ Creating media bundle assets...');
    const assetResourceNames = await Promise.all(
      campaignDetails.adContent.images.map(async (url, index) => {
        console.log(`🖼️ Processing image ${index + 1}: ${url}`);
        try {
          const resourceName = await createMediaBundleAsset(
            customerId,
            accessToken,
            url,
            developerToken,
            managerCustomerId,
            apiVersion
          );
          console.log(`✅ Image ${index + 1} processed successfully`);
          return resourceName;
        } catch (error) {
          console.error(`❌ Failed to process image ${index + 1}:`, error);
          throw error;
        }
      })
    );

    console.log('🎨 All media assets created:', assetResourceNames);

    // Create campaign budget
    console.log('💰 Creating campaign budget...');
    const budgetResponse = await fetch(
      `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/campaignBudgets:mutate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Developer-Token': developerToken,
          'Authorization': `Bearer ${accessToken}`,
          ...(managerCustomerId && { 'login-customer-id': managerCustomerId }),
        },
        body: JSON.stringify({
          operations: [{
            create: {
              name: `Budget for ${campaignDetails.name}`,
              deliveryMethod: 'STANDARD',
              amountMicros: campaignDetails.budgetMicros || 100000000,
            }
          }]
        }),
      }
    );

    const budgetData = await budgetResponse.json();
    console.log('💰 Budget response:', JSON.stringify(budgetData, null, 2));
    
    if (!budgetResponse.ok) {
      console.error('❌ Budget creation failed:', budgetData);
      throw new Error(budgetData.error?.message || 'Failed to create campaign budget');
    }

    const campaignBudgetResourceName = budgetData.results[0]?.resourceName;
    if (!campaignBudgetResourceName) {
      console.error('❌ No budget resource name returned');
      throw new Error('No campaign budget resource name returned');
    }

    console.log('✅ Budget created:', campaignBudgetResourceName);

    // Create Display campaign
    console.log('📢 Creating display campaign...');
    const campaignResponse = await fetch(
      `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/campaigns:mutate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Developer-Token': developerToken,
          'Authorization': `Bearer ${accessToken}`,
          ...(managerCustomerId && { 'login-customer-id': managerCustomerId }),
        },
        body: JSON.stringify({
          operations: [{
            create: {
              campaignBudget: campaignBudgetResourceName,
              name: campaignDetails.name,
              advertisingChannelType: 'DISPLAY',
              status: 'PAUSED',
              startDate: campaignDetails.startDate,
              endDate: campaignDetails.endDate,
              manualCpc: { enhancedCpcEnabled: false },
              networkSettings: {
                targetGoogleSearch: false,
                targetSearchNetwork: false,
                targetContentNetwork: true,
                targetPartnerSearchNetwork: false,
              }
            }
          }]
        }),
      }
    );

    const campaignData = await campaignResponse.json();
    console.log('📢 Campaign response:', JSON.stringify(campaignData, null, 2));
    
    if (!campaignResponse.ok) {
      console.error('❌ Campaign creation failed:', campaignData);
      throw new Error(campaignData.error?.message || 'Failed to create campaign');
    }

    const campaignResourceName = campaignData.results[0]?.resourceName;
    if (!campaignResourceName) {
      console.error('❌ No campaign resource name returned');
      throw new Error('No campaign resource name returned');
    }

    console.log('✅ Campaign created:', campaignResourceName);

    // Create ad group
    console.log('📌 Creating ad group...');
    const adGroupResponse = await fetch(
      `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/adGroups:mutate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Developer-Token': developerToken,
          'Authorization': `Bearer ${accessToken}`,
          ...(managerCustomerId && { 'login-customer-id': managerCustomerId }),
        },
        body: JSON.stringify({
          operations: [{
            create: {
              campaign: campaignResourceName,
              name: `Ad Group for ${campaignDetails.name}`,
              status: 'ENABLED',
              type: 'DISPLAY_STANDARD',
              cpcBidMicros: 1000000,
            }
          }]
        }),
      }
    );

    const adGroupData = await adGroupResponse.json();
    console.log('📌 Ad group response:', JSON.stringify(adGroupData, null, 2));
    
    if (!adGroupResponse.ok) {
      console.error('❌ Ad group creation failed:', adGroupData);
      throw new Error(adGroupData.error?.message || 'Failed to create ad group');
    }

    const adGroupResourceName = adGroupData.results[0]?.resourceName;
    if (!adGroupResourceName) {
      console.error('❌ No ad group resource name returned');
      throw new Error('No ad group resource name returned');
    }

    console.log('✅ Ad group created:', adGroupResourceName);

    // Create display upload ad using the first media bundle asset
    console.log('🖼️ Creating display upload ad...');
   const adResponse = await fetch(
  `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId}/adGroupAds:mutate`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Developer-Token': developerToken,
      'Authorization': `Bearer ${accessToken}`,
      ...(managerCustomerId && { 'login-customer-id': managerCustomerId }),
    },
    body: JSON.stringify({
      operations: [{
        create: {
          status: 'PAUSED',
          ad: {
            name: campaignDetails.name,
            finalUrls: [campaignDetails.adContent.finalUrl],
            responsiveDisplayAd: {
              marketingImages: [{ asset: assetResourceNames[0] }],
              squareMarketingImages: [{ asset: assetResourceNames[1] }],
              logoImages: [{ asset: assetResourceNames[2] }],
              headlines: [
                { text: campaignDetails.adContent.headline, pinnedField: 'HEADLINE_1' },
                { text: campaignDetails.adContent.headline.substring(0, 30), pinnedField: null },
              ],
              descriptions: [
                { text: campaignDetails.adContent.description, pinnedField: 'DESCRIPTION_1' },
                { text: campaignDetails.adContent.description.substring(0, 90), pinnedField: null },
              ],
              businessName: campaignDetails.adContent.businessName,
              callToActionText: campaignDetails.adContent.callToAction || 'LEARN_MORE',
            }
          },
          adGroup: adGroupResourceName
        }
      }]
    }),
  }
);

    const adData = await adResponse.json();
    console.log('🖼️ Ad creation response:', JSON.stringify(adData, null, 2));
    
    if (!adResponse.ok) {
      console.error('❌ Ad creation failed:', adData);
      throw new Error(adData.error?.message || 'Failed to create ad');
    }

    const adResourceName = adData.results[0]?.resourceName;
    if (!adResourceName) {
      console.error('❌ No ad resource name returned');
      throw new Error('No ad resource name returned');
    }

    console.log('✅ Ad created successfully:', adResourceName);

    return NextResponse.json({
      message: 'Display campaign created successfully',
      campaign: { resourceName: campaignResourceName },
      budget: { resourceName: campaignBudgetResourceName },
      adGroup: { resourceName: adGroupResourceName },
      ad: { resourceName: adResourceName },
      assets: assetResourceNames
    });

  } catch (error) {
    console.error('❌ Error in display ads creation:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create display campaign',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}