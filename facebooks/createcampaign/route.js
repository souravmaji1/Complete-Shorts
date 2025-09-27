import { NextResponse } from 'next/server';

// Facebook API version to use


// Map our internal objectives to Facebook's API values


export async function POST(request) {
  try {
    const { accessToken, adAccountId, campaignDetails } = await request.json();
const FB_API_VERSION = 'v18.0';
    const OBJECTIVE_MAP = {
  'OUTCOME_AWARENESS': 'OUTCOME_AWARENESS',
  'OUTCOME_TRAFFIC': 'OUTCOME_TRAFFIC', 
  'OUTCOME_ENGAGEMENT': 'OUTCOME_ENGAGEMENT',
  'OUTCOME_LEADS': 'OUTCOME_LEADS',
  'OUTCOME_SALES': 'OUTCOME_SALES'
};
    
    // Validate required fields
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    // Clean ad account ID by removing any duplicate 'act_' prefix
    const cleanAdAccountId = adAccountId.replace(/^act_/i, '');
    if (!cleanAdAccountId) {
      return NextResponse.json(
        { error: "Ad account ID is required" },
        { status: 400 }
      );
    }

    if (!campaignDetails?.name) {
      return NextResponse.json(
        { error: "Campaign name is required" },
        { status: 400 }
      );
    }
    
    if (!campaignDetails?.objective) {
  return NextResponse.json(
    { 
      error: "Objective is required. Valid values: OUTCOME_AWARENESS, OUTCOME_TRAFFIC, OUTCOME_ENGAGEMENT, OUTCOME_LEADS, OUTCOME_SALES",
      validObjectives: Object.keys(OBJECTIVE_MAP)
    },
    { status: 400 }
  );
}
    // Convert our objective to Facebook's value
    const fbObjective = OBJECTIVE_MAP[campaignDetails.objective] || campaignDetails.objective;

   const formData = new FormData();
formData.append('name', campaignDetails.name);
formData.append('objective', fbObjective); // Now using correct value
formData.append('status', campaignDetails.status || 'PAUSED');
formData.append('access_token', accessToken);
formData.append('special_ad_categories', JSON.stringify(campaignDetails.special_ad_categories || []));

    const apiUrl = `https://graph.facebook.com/${FB_API_VERSION}/act_${cleanAdAccountId}/campaigns`;
    console.log('Making Facebook API request to:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Facebook API Error:', {
        endpoint: `act_${cleanAdAccountId}/campaigns`,
        error: errorData.error,
        params: {
          name: campaignDetails.name,
          objective: fbObjective,
          status: campaignDetails.status
        }
      });
      
      return NextResponse.json(
        { 
          error: errorData.error?.message || 'Failed to create campaign',
          details: errorData.error,
          type: 'FACEBOOK_API_ERROR'
        },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      campaignId: data.id,
      name: campaignDetails.name,
      objective: fbObjective
    });
    
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An error occurred',
        type: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}