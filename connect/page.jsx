"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
} from "lucide-react"
import { useGoogleAdsContext } from "../../lib/GoogleAdContext"
import { useAdContext } from "../../lib/Allcontext"
import Image from 'next/image'

export default function Connect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [customerId, setCustomerId] = useState("")
  const [manualCustomerId, setManualCustomerId] = useState("")
  const [customers, setCustomers] = useState([])
  const [managerAccounts, setManagerAccounts] = useState([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [subAccounts, setSubAccounts] = useState({})
  const [subAccountsLoading, setSubAccountsLoading] = useState({})
  const [expandedManagerId, setExpandedManagerId] = useState(null)
  const [selectedManagerId, setSelectedManagerId] = useState(null)
  const [selectedSubAccount, setSelectedSubAccount] = useState(null)
  const [selectedAccountDetails, setSelectedAccountDetails] = useState(null)

 const { googleAds, updateGoogleAds } = useAdContext();
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error")
  const customerIdFromUrl = searchParams.get("customerId")
  const refreshTokenFromUrl = searchParams.get("refreshToken")


  useEffect(() => {
    setIsVisible(true)
    if (customerIdFromUrl && refreshTokenFromUrl) {
      setCustomerId(customerIdFromUrl)
      localStorage.setItem("googleAdsCustomerId", customerIdFromUrl)
      localStorage.setItem("googleAdsRefreshToken", refreshTokenFromUrl)
      fetchCustomerAccounts(refreshTokenFromUrl)
    } else if (customerIdFromUrl) {
      setCustomerId(customerIdFromUrl)
      localStorage.setItem("googleAdsCustomerId", customerIdFromUrl)
    }
  }, [customerIdFromUrl, refreshTokenFromUrl])

  const fetchCustomerAccounts = async (refreshToken) => {
    setIsLoadingCustomers(true)
    try {
      const response = await fetch("/api/getcustomerids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Failed to fetch customer accounts:", errorData)
        throw new Error("Failed to fetch customer accounts")
      }

      const data = await response.json()
      setCustomers(data.customers || [])
      setManagerAccounts(data.managerCustomerIds || [])
    } catch (err) {
      console.error("Error fetching customer accounts:", err)
    } finally {
      setIsLoadingCustomers(false)
    }
  }

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

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      if (!clientId) {
        throw new Error("Google Client ID is not defined")
      }
      const redirectUri = `${window.location.origin}/api/auth/callback`
      const scope = "https://www.googleapis.com/auth/adwords"
      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline&` +
        `prompt=consent`
      window.location.href = authUrl
    } catch (err) {
      console.error("Error initiating OAuth:", err)
      setIsConnecting(false)
    }
  }

  const handleManualCustomerId = () => {
    if (!manualCustomerId || !/^\d{10}$/.test(manualCustomerId)) {
      alert("Please enter a valid 10-digit customer ID")
      return
    }
    const refreshToken = localStorage.getItem("googleAdsRefreshToken")
    if (!refreshToken) {
      alert("Please connect via Google Ads to authenticate before using a manual customer ID.")
      return
    }
    setCustomerId(manualCustomerId)
    localStorage.setItem("googleAdsCustomerId", manualCustomerId)
    router.push(`/createcampaign?customerId=${manualCustomerId}`)
  }

  const handleSelectCustomer = async (customerId, customerName) => {
    // Always close all dropdowns first
    const wasExpanded = expandedManagerId === customerId

    // Reset all states
    setExpandedManagerId(null)
    setSelectedManagerId(null)
    setSelectedSubAccount(null)
    setSelectedAccountDetails(null)

    // If it was already expanded, keep it closed (toggle behavior)
    if (wasExpanded) {
      return
    }

    // Small delay to ensure UI updates, then open the new dropdown
    setTimeout(() => {
      setExpandedManagerId(customerId)
      setSelectedManagerId(customerId)
      fetchManagerAccounts(customerId)
    }, 50)
  }

  const handleSelectSubAccount = (subAccount) => {
    setSelectedSubAccount(subAccount.id)
    setSelectedAccountDetails({
      id: subAccount.id,
      name: subAccount.name,
      managerId: selectedManagerId,
    })
  }

  const handleProceed = () => {
    if (!selectedAccountDetails) return

  

     updateGoogleAds({
      customerId: selectedAccountDetails.id,
      managerId: selectedAccountDetails.managerId,
      refreshToken: localStorage.getItem("googleAdsRefreshToken"),
      isConnected: true,
      selectedAccount: selectedAccountDetails
    });
    router.push("model")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <nav className="border-b border-gray-800/50 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/create")}
                className="p-2 text-gray-400 hover:text-white transition-colors mr-2"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-lg blur"></div>
                <div className="relative  p-2 rounded-lg">
                  <Image 
                               src="/goblin.png" 
                               alt="Gobler Pro Logo"
                               width={40}
                               height={40}
                               className="rounded-2xl"
                             />
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
              <span className="text-white block mt-2">Google Ads Account</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Seamlessly integrate your Google Ads account to create and manage high-converting campaigns with AI
              assistance.
            </p>
          </div>

          {error && (
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-red-900/60 to-red-800/40 backdrop-blur-xl border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle size={24} className="text-red-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-red-300 font-semibold mb-1">Connection Error</h3>
                    <p className="text-red-200">{decodeURIComponent(error)}. Please try again.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {customerId ? (
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
                        onClick={handleProceed}
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
                              {/* Manager Account Card */}
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

                              {/* Sub-Accounts Grid */}
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
          ) : (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/20 via-gray-700/20 to-gray-800/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-8 hover:border-gray-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-3 rounded-xl">
                      <Shield size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Secure OAuth Connection</h3>
                      <p className="text-gray-400">Recommended method for secure access</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Connect your Google Ads account securely using OAuth authentication. This allows AdMaster Pro to
                    create and manage campaigns on your behalf.
                  </p>
                  <button
                    onClick={handleConnect}
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
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-600/20 via-slate-700/20 to-slate-800/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-8 hover:border-slate-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-3 rounded-xl">
                      <Settings size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Manual Customer ID</h3>
                      <p className="text-gray-400">For advanced users with existing tokens</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    If you already have authentication tokens, you can manually enter your Google Ads Customer ID to
                    proceed directly to campaign creation.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Customer ID (10 digits)</label>
                      <input
                        type="text"
                        value={manualCustomerId}
                        onChange={(e) => setManualCustomerId(e.target.value)}
                        placeholder="Enter 10-digit Customer ID"
                        className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-slate-500/50 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all"
                      />
                    </div>
                    <button
                      onClick={handleManualCustomerId}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-4 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-gray-500/25 transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-[1.02]"
                    >
                      <LinkIcon size={20} />
                      <span>Use Manual Customer ID</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="bg-gradient-to-br from-gray-900/40 to-black/40 backdrop-blur-xl border border-gray-700/30 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield size={20} className="text-gray-400" />
                    <h4 className="text-white font-semibold">Secure & Safe</h4>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Your Google Ads data is protected with enterprise-grade security and OAuth 2.0 authentication.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/40 to-black/40 backdrop-blur-xl border border-gray-700/30 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Zap size={20} className="text-gray-400" />
                    <h4 className="text-white font-semibold">AI-Powered</h4>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Leverage artificial intelligence to create optimized campaigns that drive better results.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
