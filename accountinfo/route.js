import { NextResponse } from 'next/server';

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
    const { refreshToken, managerId } = await request.json();
    
    if (!refreshToken || !managerId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Load environment variables
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
    const developerToken = process.env.NEXT_PUBLIC_GOOGLE_ADS_DEVELOPER_TOKEN;
    const apiVersion = process.env.NEXT_PUBLIC_GOOGLE_ADS_API_VERSION || '20';

    // Obtain access token
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    // Fetch sub-accounts
    const endpoint = `https://googleads.googleapis.com/v${apiVersion}/customers/${managerId}/googleAds:searchStream`;
    const query = `
      SELECT customer_client.client_customer, customer_client.descriptive_name 
      FROM customer_client 
      WHERE customer_client.level = 1 AND customer_client.status = 'DISABLED'
    `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken,
        'login-customer-id': managerId,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Sub-account fetch error:', JSON.stringify(data.error?.details, null, 2));
      throw new Error(data.error?.message || 'Failed to fetch sub-accounts');
    }

    const customers = [];
    for (const streamResponse of data) {
      if (streamResponse.results) {
        for (const result of streamResponse.results) {
          const clientCustomerId = result.customerClient.clientCustomer.split('/')[1];
          customers.push({
            id: clientCustomerId,
            name: result.customerClient.descriptiveName || clientCustomerId,
          });
        }
      }
    }

    return NextResponse.json(
      { 
        message: 'Sub-accounts fetched successfully',
        customers 
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error fetching sub-accounts:', err);
    return NextResponse.json(
      { error: `Failed to fetch sub-accounts: ${err.message}` },
      { status: 500 }
    );
  }
}