// app/connect-ads/page.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ConnectAds() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [manualCustomerId, setManualCustomerId] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const customerIdFromUrl = searchParams.get("customerId");
  const refreshTokenFromUrl = searchParams.get("refreshToken");

  useEffect(() => {
    if (customerIdFromUrl && refreshTokenFromUrl) {
      setCustomerId(customerIdFromUrl);
      localStorage.setItem("googleAdsCustomerId", customerIdFromUrl);
      localStorage.setItem("googleAdsRefreshToken", refreshTokenFromUrl);
    } else if (customerIdFromUrl) {
      setCustomerId(customerIdFromUrl);
      localStorage.setItem("googleAdsCustomerId", customerIdFromUrl);
    }
  }, [customerIdFromUrl, refreshTokenFromUrl]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error("Google Client ID is not defined");
      }
      const redirectUri = `${window.location.origin}/api/auth/callback`;
      const scope = "https://www.googleapis.com/auth/adwords";
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline&` +
        `prompt=consent`;

      window.location.href = authUrl;
    } catch (err) {
      console.error("Error initiating OAuth:", err);
      setIsConnecting(false);
    }
  };

  const handleManualCustomerId = () => {
    if (!manualCustomerId || !/^\d{10}$/.test(manualCustomerId)) {
      alert("Please enter a valid 10-digit customer ID");
      return;
    }
    // Check if refresh_token exists for manual customer ID
    const refreshToken = localStorage.getItem("googleAdsRefreshToken");
    if (!refreshToken) {
      alert("Please connect via Google Ads to authenticate before using a manual customer ID.");
      return;
    }
    setCustomerId(manualCustomerId);
    localStorage.setItem("googleAdsCustomerId", manualCustomerId);
    router.push(`/createcampaign?customerId=${manualCustomerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Head>
        <title>Connect Google Ads</title>
        <meta name="description" content="Connect your Google Ads account" />
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Connect Google Ads</h1>
        {error && (
          <p className="text-red-500 mb-4 text-center">
            Error: {decodeURIComponent(error)}. Please try again.
          </p>
        )}
        {customerId ? (
          <div className="text-center">
            <p className="text-green-500 mb-4">
              Successfully connected! Customer ID: {customerId}
            </p>
            <Link href={`/google?customerId=${customerId}`}>
              <button className="w-full py-2 px-4 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700">
                Create Campaign
              </button>
            </Link>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full mt-4 py-2 px-4 rounded-md text-white font-semibold bg-gray-600 hover:bg-gray-700"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600 text-center">
              Connect your Google Ads account or enter a customer ID manually to create and manage campaigns.
            </p>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
                isConnecting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isConnecting ? "Connecting..." : "Connect Google Ads"}
            </button>
            <div className="mt-6">
              <label className="block text-gray-700 mb-2">
                Or enter Customer ID manually:
              </label>
              <input
                type="text"
                value={manualCustomerId}
                onChange={(e) => setManualCustomerId(e.target.value)}
                placeholder="Enter 10-digit Customer ID"
                className="w-full py-2 px-4 border rounded-md mb-4"
              />
              <button
                onClick={handleManualCustomerId}
                className="w-full py-2 px-4 rounded-md text-white font-semibold bg-green-600 hover:bg-green-700"
              >
                Use Manual Customer ID
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}