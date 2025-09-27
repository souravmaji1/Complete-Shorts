// app/connection/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Zap,
  User,
  Bell,
  ChevronDown,
  ArrowLeft,
  Search,
  Shield,
  RadioTower,
  CheckCircle,
  AlertCircle,
  Loader,
  ExternalLink,
  LinkIcon,
  Settings,
  ChevronRight,
  Building2,
  Users,
  Facebook,
} from "lucide-react";
import { useAdContext } from "../../lib/Allcontext";
import Image from "next/image";

export default function ConnectPage() {
  /* ------------------------------------------------------------------ */
  /* Context – new API only                                             */
  /* ------------------------------------------------------------------ */
 const {
  googleAds,          // <-- add
  facebookAds,        // <-- add
  updateGoogleAds,
  updateFacebookAds,
  selectedPlatform,
  setSelectedPlatform,
} = useAdContext();

  /* ------------------------------------------------------------------ */
  /* Local UI state                                                     */
  /* ------------------------------------------------------------------ */
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [manualCustomerId, setManualCustomerId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [managerAccounts, setManagerAccounts] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [subAccounts, setSubAccounts] = useState({});
  const [subAccountsLoading, setSubAccountsLoading] = useState({});
  const [expandedManagerId, setExpandedManagerId] = useState(null);
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [selectedSubAccount, setSelectedSubAccount] = useState(null);
  const [selectedAccountDetails, setSelectedAccountDetails] = useState(null);
  const [adAccounts, setAdAccounts] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAdAccount, setSelectedAdAccount] = useState("");
  const [selectedPage, setSelectedPage] = useState("");

  /* ------------------------------------------------------------------ */
  /* Router hooks                                                       */
  /* ------------------------------------------------------------------ */
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorFromUrl = searchParams.get("error");
  const customerIdFromUrl = searchParams.get("customerId");
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  const platformFromUrl = searchParams.get("platform");

  /* ------------------------------------------------------------------ */
  /* Side-effects                                                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    setIsVisible(true);
    if (platformFromUrl) setSelectedPlatform(platformFromUrl);

    // Google returned with customer + refresh-token
    if (
      platformFromUrl === "google" &&
      customerIdFromUrl &&
      refreshTokenFromUrl
    ) {
      updateGoogleAds({
        customerId: customerIdFromUrl,
        refreshToken: refreshTokenFromUrl,
        isConnected: true,
      });
      localStorage.setItem("googleAdsCustomerId", customerIdFromUrl);
      localStorage.setItem("googleAdsRefreshToken", refreshTokenFromUrl);
      fetchCustomerAccounts(refreshTokenFromUrl);
    }

    // Facebook returned with access-token
    if (platformFromUrl === "facebook" && accessTokenFromUrl) {
      updateFacebookAds({
        accessToken: accessTokenFromUrl,
        isConnected: true,
      });
      localStorage.setItem("facebookAccessToken", accessTokenFromUrl);
      fetchFacebookAccounts(accessTokenFromUrl);
    }
  }, [customerIdFromUrl, refreshTokenFromUrl, accessTokenFromUrl, platformFromUrl]);

  /* ------------------------------------------------------------------ */
  /* Google helpers                                                     */
  /* ------------------------------------------------------------------ */

  
  const fetchCustomerAccounts = async (refreshToken) => {
    setIsLoadingCustomers(true);
    try {
      const res = await fetch("/api/getcustomerids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data.customers || []);
      setManagerAccounts(data.managerCustomerIds || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsConnecting(true);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirect = `${window.location.origin}/api/auth/callback`;
    const scope = "https://www.googleapis.com/auth/adwords";
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirect)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=google`;
    window.location.href = url;
  };

  const handleCompleteGoogleConnection = () => {
    if (!selectedAccountDetails) return;
    updateGoogleAds({
      customerId: selectedAccountDetails.id,
      managerId: selectedAccountDetails.managerId,
      isConnected: true,
    });
    router.push("/model");
  };

  /* ------------------------------------------------------------------ */
  /* Facebook helpers                                                   */
  /* ------------------------------------------------------------------ */
  const fetchFacebookAccounts = async (token) => {
    setLoading(true);
    try {
      const [accRes, pageRes] = await Promise.all([
        fetch(
          `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status&access_token=${token}`
        ),
        fetch(
          `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,category&access_token=${token}`
        ),
      ]);
      if (!accRes.ok || !pageRes.ok) throw new Error("FB fetch failed");
      const accData = await accRes.json();
      const pageData = await pageRes.json();
      setAdAccounts(accData.data || []);
      setPages(pageData.data || []);
      if (accData.data?.length) setSelectedAdAccount(accData.data[0].id);
      if (pageData.data?.length) setSelectedPage(pageData.data[0].id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    setIsConnecting(true);
    const clientId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID;
    const redirect = `${window.location.origin}/api/auth/facebook/callback`;
    const scope = "ads_management,pages_show_list";
    window.location.href =
      `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirect)}&` +
      `scope=${scope}&` +
      `response_type=code&` +
      `state=facebook`;
  };

  const handleCompleteFacebookConnection = () => {
    if (!selectedAdAccount || !selectedPage) {
      setError("Please select both an ad account and a page");
      return;
    }
    updateFacebookAds({
      adAccountId: selectedAdAccount,
      pageId: selectedPage,
      isConnected: true,
    });
    setSuccessMessage("Successfully connected Facebook account!");
    setTimeout(() => router.push("/model"), 1500);
  };

  const fetchManagerAccounts = async (managerId) => {
    try {
      setSubAccountsLoading((prev) => ({ ...prev, [managerId]: true }))

      const refreshToken = localStorage.getItem("googleAdsRefreshToken")
      if (!refreshToken) {
        throw new Error("No refresh token found")
      }

      const response = await fetch("/api/fetchManagerAccounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
          managerId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch manager accounts")
      }

      const data = await response.json()
      setSubAccounts((prev) => ({
        ...prev,
        [managerId]: data.customers || [],
      }))
    } catch (err) {
      console.error(`Error fetching accounts for manager ${managerId}:`, err)
      setSubAccounts((prev) => ({
        ...prev,
        [managerId]: [],
      }))
    } finally {
      setSubAccountsLoading((prev) => ({ ...prev, [managerId]: false }))
    }
  }

   const handleSelectSubAccount = (subAccount) => {
    setSelectedSubAccount(subAccount.id)
    setSelectedAccountDetails({
      id: subAccount.id,
      name: subAccount.name,
      managerId: selectedManagerId,
    })
  }

  /* ------------------------------------------------------------------ */
/* Helpers used by both platforms                                     */
/* ------------------------------------------------------------------ */
const handleSelectCustomer = (managerId, managerName) => {
  const wasExpanded = expandedManagerId === managerId;

  // collapse if it was already open
  setExpandedManagerId(null);
  setSelectedManagerId(null);
  setSelectedSubAccount(null);
  setSelectedAccountDetails(null);

  if (wasExpanded) return;          // nothing else to do

  // open the new one
  setExpandedManagerId(managerId);
  setSelectedManagerId(managerId);
  fetchManagerAccounts(managerId);  // Google only – see note below
};



  /* ------------------------------------------------------------------ */
  /* UI renders                                                         */
  /* ------------------------------------------------------------------ */
  const GoogleCard = () => (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-blue-700/20 to-blue-800/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="relative bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-3 rounded-xl">
            <RadioTower size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Google Ads</h3>
            <p className="text-gray-400">Connect your Google Ads account</p>
          </div>
        </div>
        <p className="text-gray-300 mb-6 leading-relaxed">
          Connect your Google Ads account to create and manage search, display, and video campaigns with AI assistance.
        </p>
        <button
          onClick={handleGoogleLogin}
          disabled={isConnecting}
          className={`w-full px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
            isConnecting
              ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:shadow-lg hover:shadow-gray-500/25 hover:scale-[1.02]"
          }`}
        >
          {isConnecting ? (
            <>
              <Loader size={20} className="animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <ExternalLink size={20} />
              <span>Connect Google Ads</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const FacebookCard = () => (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-blue-700/20 to-blue-800/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="relative bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl">
            <Facebook size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Facebook Ads</h3>
            <p className="text-gray-400">Connect your Facebook Ads account</p>
          </div>
        </div>
        <p className="text-gray-300 mb-6 leading-relaxed">
          Connect your Facebook Ads account to create and manage social-media campaigns with AI assistance.
        </p>
        <button
          onClick={handleFacebookLogin}
          disabled={isConnecting}
          className={`w-full px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
            isConnecting
              ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]"
          }`}
        >
          {isConnecting ? (
            <>
              <Loader size={20} className="animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <ExternalLink size={20} />
              <span>Connect Facebook Ads</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderPlatformCards = () => {
    // Nothing connected → show both (Google first)
    if (!googleAds.isConnected && !facebookAds.isConnected) {
      return (
        <div className="max-w-2xl mx-auto space-y-8 mb-12">
          <GoogleCard />
          <FacebookCard />
        </div>
      );
    }

    // Only Google connected → Facebook on top
    if (googleAds.isConnected && !facebookAds.isConnected) {
      return (
        <div className="max-w-2xl mx-auto space-y-8 mb-12">
          <FacebookCard />
          <GoogleCard />
        </div>
      );
    }

    // Only Facebook connected → Google on top
    if (!googleAds.isConnected && facebookAds.isConnected) {
      return (
        <div className="max-w-2xl mx-auto space-y-8 mb-12">
          <GoogleCard />
          <FacebookCard />
        </div>
      );
    }

    // Both connected → still show both (Google first) so user can re-connect if desired
    return (
      <div className="max-w-2xl mx-auto space-y-8 mb-12">
        <GoogleCard />
        <FacebookCard />
      </div>
    );
  };

  /* ---------- Google account selection ---------- */
  const renderGoogleAccountSelection = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {selectedAccountDetails && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 rounded-2xl blur-lg opacity-75"></div>
          <div className="relative bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-xl border border-green-500/30 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
                  <CheckCircle size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Account Selected</h2>
                  <p className="text-white">{selectedAccountDetails.name}</p>
                  <p className="text-green-400">Account ID: {selectedAccountDetails.id}</p>
                  {selectedAccountDetails.managerId && (
                    <p className="text-gray-400 text-sm">Manager ID: {selectedAccountDetails.managerId}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleCompleteGoogleConnection}
                className="w-full md:w-auto bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-3 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-gray-500/25 transition-all duration-300 flex items-center justify-center space-x-3 group"
              >
                <span>Go Ahead</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Users size={20} />
          <span>Your Google Ads Accounts</span>
        </h3>

        {isLoadingCustomers ? (
          <div className="flex justify-center py-12">
            <Loader size={24} className="animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-300">Manager Accounts</h4>
              <div className="space-y-6">
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <div key={customer.id} className="space-y-4">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div
                          className={`relative bg-gradient-to-br from-gray-900/80 via-slate-900/60 to-black/80 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
                            selectedManagerId === customer.id
                              ? "border-blue-500/50 bg-blue-900/10"
                              : "border-gray-700/40 hover:border-gray-500/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-gray-700/50 p-3 rounded-xl">
                                <User size={24} className="text-white" />
                              </div>
                              <div>
                                <h5 className="text-lg font-bold text-white">{customer.name}</h5>
                                <p className="text-blue-400 font-mono text-sm">Manager ID: {customer.id}</p>
                                <p className="text-gray-400 text-xs mt-1">Click to view sub-accounts</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleSelectCustomer(customer.id, customer.name)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                selectedManagerId === customer.id
                                  ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                              }`}
                            >
                              {selectedManagerId === customer.id ? "Hide Accounts" : "View Accounts"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {expandedManagerId === customer.id && (
                        <div className="ml-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <div className="w-4 h-px bg-gray-600"></div>
                            <span>Sub-Accounts under {customer.name}</span>
                            <div className="flex-1 h-px bg-gray-600"></div>
                          </div>

                          {subAccountsLoading[customer.id] ? (
                            <div className="flex justify-center py-8">
                              <div className="flex items-center space-x-3">
                                <Loader size={20} className="animate-spin text-blue-400" />
                                <span className="text-gray-400">Loading sub-accounts...</span>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {subAccounts[customer.id]?.length > 0 ? (
                                subAccounts[customer.id].map((subAccount) => (
                                  <div
                                    key={subAccount.id}
                                    onClick={() => handleSelectSubAccount(subAccount)}
                                    className={`relative group cursor-pointer transition-all duration-300 ${
                                      selectedSubAccount === subAccount.id ? "scale-105" : "hover:scale-102"
                                    }`}
                                  >
                                    <div
                                      className={`absolute -inset-1 rounded-xl blur-lg transition-all duration-300 ${
                                        selectedSubAccount === subAccount.id
                                          ? "bg-gradient-to-r from-emerald-500/30 to-teal-500/30 opacity-100"
                                          : "bg-gradient-to-r from-gray-600/20 to-gray-700/20 opacity-0 group-hover:opacity-100"
                                      }`}
                                    ></div>
                                    <div
                                      className={`relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border rounded-xl p-4 transition-all duration-300 ${
                                        selectedSubAccount === subAccount.id
                                          ? "border-emerald-500/50 bg-emerald-900/20"
                                          : "border-gray-600/30 hover:border-gray-500/50"
                                      }`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-2 mb-2">
                                            <div
                                              className={`w-3 h-3 rounded-full ${
                                                selectedSubAccount === subAccount.id
                                                  ? "bg-emerald-400"
                                                  : "bg-gray-500"
                                              }`}
                                            ></div>
                                            <h6 className="font-semibold text-white text-sm truncate">
                                              {subAccount.name}
                                            </h6>
                                          </div>
                                          <p className="text-xs text-gray-400 font-mono mb-2">
                                            {subAccount.id}
                                          </p>
                                          <div className="flex items-center space-x-1">
                                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                            <span className="text-xs text-blue-400">Active Account</span>
                                          </div>
                                        </div>
                                        {selectedSubAccount === subAccount.id && (
                                          <div className="flex-shrink-0">
                                            <CheckCircle size={18} className="text-emerald-400" />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-full">
                                  <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-600/30 rounded-xl p-8 text-center">
                                    <div className="flex flex-col items-center space-y-3">
                                      <div className="bg-gray-700/50 p-3 rounded-full">
                                        <Users size={24} className="text-gray-400" />
                                      </div>
                                      <p className="text-gray-400 font-medium">No sub-accounts found</p>
                                      <p className="text-gray-500 text-sm">
                                        This manager account has no associated sub-accounts
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 backdrop-blur-xl border border-gray-700/30 rounded-xl p-8 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-gray-700/50 p-4 rounded-full">
                        <Building2 size={32} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium text-lg">No manager accounts found</p>
                        <p className="text-gray-500 text-sm mt-1">Please check your Google Ads account setup</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  /* ---------- Facebook account selection ---------- */
  const renderFacebookAccountSelection = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 rounded-2xl blur-lg opacity-75"></div>
        <div className="relative bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-xl border border-green-500/30 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
                <CheckCircle size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Account Connected</h2>
                <p className="text-green-400">Select your ad account and page to continue</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="fade-in space-y-6">
          <h3 className="text-xl font-semibold mb-5 bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400 bg-clip-text text-transparent flex items-center">
            <div className="relative mr-2">
              <Building2 size={20} className="text-gray-400" />
              <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-md"></div>
            </div>
            Select Ad Account
          </h3>

          {adAccounts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {adAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`relative group transition-all duration-300 border rounded-2xl overflow-hidden cursor-pointer backdrop-blur-sm ${
                    selectedAdAccount === account.id
                      ? "border-gray-500 bg-gradient-to-br from-gray-900/20 via-gray-900/20 to-gray-900/80 shadow-lg shadow-gray-500/20"
                      : "border-gray-700/30 bg-gray-900/30 hover:bg-gray-800/50 hover:border-gray-500/30"
                  }`}
                  onClick={() => setSelectedAdAccount(account.id)}
                >
                  {selectedAdAccount === account.id && (
                    <div className="absolute inset-0 border border-gray-500/50 rounded-2xl animate-pulse"></div>
                  )}

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                            selectedAdAccount === account.id
                              ? "bg-gradient-to-r from-gray-600 to-gray-600"
                              : "bg-gray-800/60"
                          }`}
                        >
                          <Building2
                            size={18}
                            className={`${selectedAdAccount === account.id ? "text-white" : "text-gray-400"}`}
                          />
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-white text-lg">{account.name}</p>
                          <p className="text-sm text-gray-400">{account.id}</p>
                        </div>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                          account.account_status === 1
                            ? "bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 text-emerald-400 border border-emerald-500/30"
                            : "bg-gradient-to-r from-red-900/40 to-red-800/40 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {account.account_status === 1 ? "Active" : "Inactive"}
                      </div>
                    </div>

                    {selectedAdAccount === account.id && (
                      <div className="mt-4 bg-gray-500/10 p-3 rounded-lg border border-gray-500/20 flex items-center animate-pulse">
                        <CheckCircle size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-300">Selected for campaign</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-gray-700/30 rounded-2xl bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-sm p-8 text-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-gray-800/60 flex items-center justify-center mx-auto mb-4">
                <Building2 size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-300 font-medium">No ad accounts found</p>
              <p className="text-sm text-gray-500 mt-2">Create an ad account in Meta Business Manager first</p>
              <button className="mt-4 bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 rounded-lg text-sm text-gray-300 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 border border-gray-600/50 shadow-lg hover:shadow-xl transform hover:scale-105">
                Create Ad Account
              </button>
            </div>
          )}
        </div>

        <div className="my-6 border-t border-gray-700/50"></div>

        <div className="fade-in space-y-6">
          <h3 className="text-xl font-semibold mb-5 bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400 bg-clip-text text-transparent flex items-center">
            <div className="relative mr-2">
              <Facebook size={20} className="text-gray-400" />
              <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-md"></div>
            </div>
            Select Facebook Page
          </h3>

          {pages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`relative group transition-all duration-300 border rounded-2xl overflow-hidden cursor-pointer backdrop-blur-sm ${
                    selectedPage === page.id
                      ? "border-gray-500 bg-gradient-to-br from-gray-900/20 via-gray-900/20 to-gray-900/80 transform scale-[1.02] shadow-lg shadow-gray-500/20"
                      : "border-gray-700/30 bg-gray-900/30 hover:bg-gray-800/50 hover:border-gray-500/30 hover:scale-[1.01]"
                  }`}
                  onClick={() => setSelectedPage(page.id)}
                >
                  {selectedPage === page.id && (
                    <div className="absolute inset-0 border border-gray-500/50 rounded-2xl animate-pulse"></div>
                  )}

                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                            selectedPage === page.id ? "bg-gradient-to-r from-gray-600 to-gray-600" : "bg-blue-900/40"
                          }`}
                        >
                          <span className="text-white font-bold text-xl">{page.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-white text-lg">{page.name}</p>
                          <p className="text-sm text-gray-400">{page.category}</p>
                        </div>
                      </div>
                      {selectedPage === page.id && (
                        <div className="ml-2 bg-gray-500/20 h-8 w-8 rounded-full flex items-center justify-center">
                          <CheckCircle size={16} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-gray-700/30 rounded-2xl bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-sm p-8 text-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-gray-800/60 flex items-center justify-center mx-auto mb-4">
                <Facebook size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-300 font-medium">No Facebook pages found</p>
              <p className="text-sm text-gray-500 mt-2">Create a Facebook page first</p>
              <button className="mt-4 bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 rounded-lg text-sm text-gray-300 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 border border-gray-600/50 shadow-lg hover:shadow-xl transform hover:scale-105">
                Create Page
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleCompleteFacebookConnection}
          disabled={loading || !selectedAdAccount || !selectedPage}
          className={`group relative px-8 py-4 bg-gradient-to-r from-gray-600 via-gray-600 to-gray-600 rounded-2xl text-white font-semibold hover:shadow-2xl hover:shadow-gray-500/40 transition-all duration-300 flex items-center disabled:opacity-50 transform hover:scale-105 overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-700 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {loading ? (
            <div className="relative z-10 flex items-center">
              <span className="mr-3">Connecting...</span>
              <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="relative z-10 flex items-center">
              <span>Complete Connection</span>
              <CheckCircle size={20} className="ml-3" />
            </div>
          )}
        </button>
      </div>
    </div>
  );

  /* ------------------------------------------------------------------ */
  /* Main render                                                        */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <nav className="border-b border-gray-800/50 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/")}
                className="p-2 text-gray-400 hover:text-white transition-colors mr-2"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-lg blur"></div>
                <div className="relative p-2 rounded-lg">
                  <Image src="/goblin.png" alt="Gobler Pro Logo" width={40} height={40} className="rounded-2xl" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                Gobler Pro
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell size={20} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600 rounded-full"></div>
              </button>
              <div className="flex items-center space-x-3 bg-gray-800/50 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-white font-medium">John Doe</span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-2xl blur-lg"></div>
                <div className="relative bg-gradient-to-r from-gray-600 to-gray-700 p-6 rounded-2xl">
                  <RadioTower size={48} className="text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-400 bg-clip-text text-transparent">
                Connect Your
              </span>
              <span className="text-white block mt-2">Advertising Account</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Seamlessly integrate your advertising accounts to create and manage high-converting campaigns with AI assistance.
            </p>
          </div>

          {(errorFromUrl || error) && (
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-red-900/60 to-red-800/40 backdrop-blur-xl border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle size={24} className="text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-300 font-semibold mb-1">Connection Error</h3>
                    <p className="text-red-200">{errorFromUrl || error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-emerald-900/60 to-emerald-800/40 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={24} className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-emerald-300 font-semibold mb-1">Success</h3>
                    <p className="text-emerald-200">{successMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ALWAYS show the two connect cards (order changes dynamically) */}
          {renderPlatformCards()}

          {/* Show Google selector only if authorised */}
          {googleAds.isConnected && renderGoogleAccountSelection()}

          {/* Show Facebook selector only if authorised */}
          {facebookAds.isConnected && renderFacebookAccountSelection()}
        </div>
      </div>
    </div>
  );
}