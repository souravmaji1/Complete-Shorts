import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { accessToken, adAccountId, creativeDetails } = await request.json();

    // Validate required fields
    if (!accessToken || !adAccountId || !creativeDetails) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate object_story_spec structure
    if (!creativeDetails.object_story_spec || 
        !creativeDetails.object_story_spec.page_id ||
        !creativeDetails.object_story_spec.link_data ||
        !creativeDetails.object_story_spec.link_data.link ||
        !creativeDetails.object_story_spec.link_data.message) {
      return NextResponse.json(
        { error: 'Invalid creative details structure' },
        { status: 400 }
      );
    }

    const cleanAdAccountId = adAccountId.replace(/^act_/i, '');
    
    // Prepare the Facebook API payload
    const fbPayload = {
      name: creativeDetails.name || 'Ad Creative',
      object_story_spec: {
        page_id: creativeDetails.object_story_spec.page_id,
        link_data: {
          link: creativeDetails.object_story_spec.link_data.link,
          message: creativeDetails.object_story_spec.link_data.message,
          ...(creativeDetails.object_story_spec.link_data.name && { 
            name: creativeDetails.object_story_spec.link_data.name 
          }),
          ...(creativeDetails.object_story_spec.link_data.description && { 
            description: creativeDetails.object_story_spec.link_data.description 
          }),
          ...(creativeDetails.object_story_spec.link_data.image_url && { 
            picture: creativeDetails.object_story_spec.link_data.image_url 
          }),
          ...(creativeDetails.object_story_spec.link_data.caption && { 
            caption: creativeDetails.object_story_spec.link_data.caption 
          })
        }
      },
      access_token: accessToken
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${cleanAdAccountId}/adcreatives`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fbPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Facebook Creative Creation Error:', {
        payload: fbPayload,
        error: errorData
      });
      return NextResponse.json(
        { 
          error: errorData.error?.message || 'Failed to create ad creative',
          details: errorData.error
        },
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