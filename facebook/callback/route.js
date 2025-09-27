//app/api/auth/facebook/callback
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/connection?error=No authorization code provided`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}&` +
      `client_secret=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET}&` +
      `redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/facebook/callback&` +
      `code=${code}`
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/connection?error=${encodeURIComponent(errorData.error?.message || 'Failed to get access token')}`
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Redirect with token
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/connection?accessToken=${accessToken}&platform=facebook`
    );
  } catch (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/connection?error=${encodeURIComponent(error.message || 'An error occurred during authentication')}`
    );
  }
}