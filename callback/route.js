// app/api/auth/callback/route.js
import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";
import { GoogleAdsApi } from "google-ads-api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/connect-ads?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/connect-ads?error=Invalid%20or%20missing%20authorization%20code", request.url)
    );
  }

  // Validate environment variables
  if (
    !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ||
    !process.env.NEXT_PUBLIC_BASE_URL ||
    !process.env.NEXT_PUBLIC_GOOGLE_ADS_DEVELOPER_TOKEN
  ) {
    console.error("Missing environment variables");
    return NextResponse.redirect(
      new URL("/connect-ads?error=Missing%20OAuth%20configuration", request.url)
    );
  }

  try {
    const client = new OAuth2Client(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    );

    // Exchange code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
    });

    const { refresh_token } = tokens;

    // Initialize Google Ads API client
    const adsClient = new GoogleAdsApi({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      developer_token: process.env.NEXT_PUBLIC_GOOGLE_ADS_DEVELOPER_TOKEN,
    });

    // Fetch customer IDs
    const customerIds = await adsClient.listAccessibleCustomers(refresh_token);

    // Assuming you want the first customer ID
    const customerId = customerIds.resource_names?.[0]?.split("/")[1] || null;

    if (!customerId) {
      throw new Error("No customer ID found");
    }

    // Store refresh_token and customerId in localStorage (for testing)
    // In production, use a secure database
    const response = NextResponse.redirect(
      new URL(`/connection?customerId=${encodeURIComponent(customerId)}&refreshToken=${encodeURIComponent(refresh_token)}&platform=google`, request.url)
    );

    // Set tokens in cookies or pass via redirect for client-side storage
    response.cookies.set("googleAdsRefreshToken", refresh_token, { httpOnly: true, secure: true });
    response.cookies.set("googleAdsCustomerId", customerId, { httpOnly: true, secure: true });

    return response;
  } catch (err) {
    console.error("Error in auth callback:", err);
    return NextResponse.redirect(
      new URL("/connect-ads?error=Failed%20to%20authenticate", request.url)
    );
  }
}