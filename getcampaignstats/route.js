
import { NextResponse } from "next/server";

async function getAccessToken(clientId, clientSecret, refreshToken) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error_description || "Failed to obtain access token");
    }
    return data.access_token;
  } catch (err) {
    throw new Error(`Access token error: ${err.message}`);
  }
}

export async function POST(request) {
  try {
    const { customerId, campaignId, refreshToken, managerCustomerId } = await request.json();
    console.log("Request parameters:", { customerId, campaignId, refreshToken: refreshToken ? "Present" : "Missing", managerCustomerId });

    if (!customerId || !campaignId || !refreshToken) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Validate customerId and campaignId
    if (!/^\d{10}$/.test(customerId)) {
      return NextResponse.json({ error: "Customer ID must be a 10-digit number" }, { status: 400 });
    }
    if (!/^\d+$/.test(campaignId)) {
      return NextResponse.json({ error: "Campaign ID must be a numeric value" }, { status: 400 });
    }

    // Load environment variables
   
    const defaultManagerCustomerId = "2500236286";


    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
    const developerToken = process.env.NEXT_PUBLIC_GOOGLE_ADS_DEVELOPER_TOKEN;
    const apiVersion = process.env.NEXT_PUBLIC_GOOGLE_ADS_API_VERSION || "20";

    if (!clientId || !clientSecret || !developerToken) {
      return NextResponse.json(
        { error: "Server configuration error: Missing required environment variables" },
        { status: 500 }
      );
    }

    // Use managerCustomerId from request or environment
    const effectiveManagerCustomerId = managerCustomerId || defaultManagerCustomerId;

    // Obtain access token
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
    console.log("Access token obtained:", accessToken);

    // Perform Google Ads API search request
    const response = await fetch(
      `https://googleads.googleapis.com/v${apiVersion}/customers/${customerId.replace(/-/g, "")}/googleAds:search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Developer-Token": developerToken,
          "Authorization": `Bearer ${accessToken}`,
          ...(effectiveManagerCustomerId && { "login-customer-id": effectiveManagerCustomerId }),
        },
        body: JSON.stringify({
          query: `
            SELECT
              campaign.id,
              metrics.impressions,
              metrics.clicks,
              metrics.cost_micros,
              metrics.conversions
            FROM campaign
            WHERE campaign.id = '${campaignId}'
            AND segments.date DURING LAST_30_DAYS
          `,
        }),
      }
    );

    const data = await response.json();
    console.log("Google Ads API response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Google Ads API error details:", JSON.stringify(data.error?.details, null, 2));
      throw new Error(data.error?.message || "Failed to fetch campaign statistics");
    }

    const stats = data.results[0]?.metrics || {};
    return NextResponse.json({
      impressions: Number(stats.impressions) || 0,
      clicks: Number(stats.clicks) || 0,
      cost_micros: Number(stats.cost_micros) || 0,
      conversions: Number(stats.conversions) || 0,
    });
  } catch (error) {
    console.error("Error fetching campaign statistics:", error);
    return NextResponse.json(
      { error: `Failed to fetch campaign statistics: ${error.message}` },
      { status: 500 }
    );
  }
}