import { NextResponse } from 'next/server';


export async function POST(request) {
  try {
    const { accessToken, adAccountId, adSetDetails } = await request.json();
    
    // Clean the ad account ID
    const cleanAdAccountId = adAccountId.replace(/^act_/i, '');
    
    // Validate the ID is numeric
    if (!/^\d+$/.test(cleanAdAccountId)) {
      return NextResponse.json(
        { error: 'Invalid ad account ID format' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${cleanAdAccountId}/adsets`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: adSetDetails.name,
          campaign_id: adSetDetails.campaign_id,
          daily_budget: adSetDetails.daily_budget,
          billing_event: adSetDetails.billing_event,
          bid_strategy: "LOWEST_COST_WITHOUT_CAP",
          optimization_goal: adSetDetails.optimization_goal,
          targeting: adSetDetails.targeting,
          status: adSetDetails.status,
          access_token: accessToken,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Facebook API Error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to create ad set' },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}