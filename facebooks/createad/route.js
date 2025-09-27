import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { accessToken, adAccountId, adDetails } = await request.json();
    
      const cleanAdAccountId = adAccountId.replace(/^act_/i, '');

    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${cleanAdAccountId}/ads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...adDetails,
          access_token: accessToken,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to create ad' },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}