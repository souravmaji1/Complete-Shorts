"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@supabase/supabase-js"
import {
  Target,
  Globe,
  Eye,
  MousePointer,
  DollarSign,
  Zap,
  BarChart3,
  Activity,
  Plus,
  Rocket,
  User,
  ChevronDown,
  Grid3X3,
  List,
  Search,
  Settings,
  Pause,
  Play,
  Edit3,
  Copy,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  X,
  AlertCircle,
} from "lucide-react"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function CampaignsList() {
  const { user } = useUser()
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [statistics, setStatistics] = useState(null)
  const [error, setError] = useState("")
  const [statsError, setStatsError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStatsLoading, setIsStatsLoading] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isVisible, setIsVisible] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)

  const managerCustomerId = "2500236286"

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchCampaigns = async () => {
      setIsLoading(true)
      setError("")
      try {
        const { data, error } = await supabase
          .from("ad_campaigns")
          .select("*")
          .eq("clerk_user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw new Error(error.message)
        console.log("Fetched campaigns:", data)
        setCampaigns(data || [])
      } catch (err) {
        setError(`Failed to fetch campaigns: ${err.message}`)
        console.error("Error fetching campaigns:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [user])

  const fetchCampaignStatistics = async (campaignId, customerId) => {
    setIsStatsLoading(true)
    setStatsError("")
    setStatistics(null)
    try {
      const refreshToken = localStorage.getItem("googleAdsRefreshToken")
      console.log("Fetching stats with:", {
        campaignId,
        customerId,
        refreshToken: refreshToken ? "Present" : "Missing",
        managerCustomerId,
      })

      if (!refreshToken) {
        throw new Error("No refresh token found. Please reconnect Google Ads.")
      }

      const response = await fetch("/api/getcampaignstats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          campaignId,
          refreshToken,
          managerCustomerId,
        }),
      })

      const data = await response.json()
      console.log("Stats API response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch campaign statistics")
      }

      const transformedStats = {
        impressions: Number.parseInt(data.impressions) || 0,
        clicks: Number.parseInt(data.clicks) || 0,
        cost_micros: Number.parseInt(data.cost_micros) || 0,
        conversions: Number.parseFloat(data.conversions) || 0,
        ctr:
          Number.parseInt(data.impressions) > 0
            ? (Number.parseInt(data.clicks) / Number.parseInt(data.impressions)) * 100
            : 0,
        conversionRate:
          Number.parseInt(data.clicks) > 0
            ? (Number.parseFloat(data.conversions) / Number.parseInt(data.clicks)) * 100
            : 0,
        costPerClick:
          Number.parseInt(data.clicks) > 0
            ? Number.parseInt(data.cost_micros) / 1000000 / Number.parseInt(data.clicks)
            : 0,
        costPerConversion:
          Number.parseFloat(data.conversions) > 0
            ? Number.parseInt(data.cost_micros) / 1000000 / Number.parseFloat(data.conversions)
            : 0,
      }

      setStatistics(transformedStats)
    } catch (err) {
      setStatsError(err.message)
      console.error("Error fetching statistics:", err)
    } finally {
      setIsStatsLoading(false)
    }
  }

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign)
    setShowStatsModal(true)
    console.log("Selected campaign:", campaign)
    if (campaign.campaign_id && campaign.customer_id) {
      fetchCampaignStatistics(campaign.campaign_id, campaign.customer_id)
    } else {
      setStatsError("Missing campaign ID or customer ID.")
      setStatistics(null)
    }
  }

  const formatCurrency = (micros) => {
    return (micros / 1000000).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    })
  }

  const formatNumber = (num) => {
    return num.toLocaleString("en-US")
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "enabled":
      case "active":
        return "text-green-400 bg-green-400/20"
      case "paused":
        return "text-yellow-400 bg-yellow-400/20"
      case "removed":
      case "ended":
        return "text-red-400 bg-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  const getCampaignTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "search":
        return Search
      case "display":
        return Eye
      case "shopping":
        return Target
      case "video":
        return Play
      default:
        return Globe
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filterStatus === "all") return true
    return campaign.status?.toLowerCase() === filterStatus.toLowerCase()
  })

  const totalStats = campaigns.reduce(
    (acc, campaign) => {
      acc.total += 1
      if (campaign.status?.toLowerCase() === "enabled" || campaign.status?.toLowerCase() === "active") acc.active += 1
      if (campaign.status?.toLowerCase() === "paused") acc.paused += 1
      return acc
    },
    { total: 0, active: 0, paused: 0 },
  )

  const quickStats = [
    {
      label: "Total Campaigns",
      value: totalStats.total.toString(),
      trend: "+2",
      color: "text-blue-400",
      icon: BarChart3,
    },
    {
      label: "Active Campaigns",
      value: totalStats.active.toString(),
      trend: "+1",
      color: "text-green-400",
      icon: Activity,
    },
    {
      label: "Paused Campaigns",
      value: totalStats.paused.toString(),
      trend: "0",
      color: "text-yellow-400",
      icon: Pause,
    },
    { label: "This Month", value: "$2.4K", trend: "+15%", color: "text-purple-400", icon: DollarSign },
  ]

  // Statistics Modal Component
  const StatsModal = () => {
    if (!showStatsModal || !selectedCampaign) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-black border border-gray-700/50 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-3 rounded-xl">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedCampaign.campaign_name}</h2>
                <p className="text-gray-400">Campaign Analytics</p>
              </div>
            </div>
            <button
              onClick={() => setShowStatsModal(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {isStatsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw size={32} className="text-gray-300 animate-spin" />
                <p className="text-gray-400">Loading campaign statistics...</p>
              </div>
            </div>
          ) : statsError ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-400" />
                <p className="text-red-400 font-medium">Error Loading Statistics</p>
              </div>
              <p className="text-gray-300 mt-2">{statsError}</p>
            </div>
          ) : statistics ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Eye size={20} className="text-blue-400" />
                    <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">Impressions</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatNumber(statistics.impressions)}</p>
                  <p className="text-xs text-gray-400 mt-1">Total views</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <MousePointer size={20} className="text-green-400" />
                    <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-full">Clicks</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatNumber(statistics.clicks)}</p>
                  <p className="text-xs text-gray-400 mt-1">User clicks</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign size={20} className="text-purple-400" />
                    <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">Cost</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(statistics.cost_micros)}</p>
                  <p className="text-xs text-gray-400 mt-1">Total spend</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Target size={20} className="text-amber-400" />
                    <span className="text-xs text-amber-300 bg-amber-500/20 px-2 py-1 rounded-full">Conversions</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{statistics.conversions.toFixed(1)}</p>
                  <p className="text-xs text-gray-400 mt-1">Goal completions</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Click Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Click-Through Rate (CTR)</span>
                      <span className="text-white font-bold">{statistics.ctr.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Cost Per Click (CPC)</span>
                      <span className="text-white font-bold">${statistics.costPerClick.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Conversion Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Conversion Rate</span>
                      <span className="text-white font-bold">{statistics.conversionRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Cost Per Conversion</span>
                      <span className="text-white font-bold">
                        {statistics.costPerConversion > 0 ? `$${statistics.costPerConversion.toFixed(2)}` : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-700/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Campaign Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Campaign ID</p>
                    <p className="text-white font-mono">{selectedCampaign.campaign_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCampaign.status)}`}
                    >
                      {selectedCampaign.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Created</p>
                    <p className="text-white">{new Date(selectedCampaign.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Customer ID</p>
                    <p className="text-white font-mono">{selectedCampaign.customer_id}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800/50 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/30 to-gray-700/30 rounded-lg blur"></div>
                <div className="relative bg-gradient-to-r from-gray-600 to-gray-700 p-2 rounded-lg">
                  <Zap size={20} className="text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                AdOne Pro
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Settings size={20} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600 rounded-full"></div>
              </button>
              <div className="flex items-center space-x-3 bg-gray-800/50 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-white font-medium">John</span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-400 bg-clip-text text-transparent">
                  Your Campaigns
                </span>
                <span className="text-white block mt-2">Performance Dashboard</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl">
                Monitor and manage all your advertising campaigns in one place.
              </p>
            </div>

            <div className="mt-6 lg:mt-0">
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-800/50 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    <List size={18} />
                  </button>
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-800/50 text-white border border-gray-700/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                >
                  <option value="all">All Campaigns</option>
                  <option value="enabled">Active</option>
                  <option value="paused">Paused</option>
                  <option value="removed">Ended</option>
                </select>

                <Link href="/create">
                  <button className="bg-gradient-to-r from-slate-300 to-slate-400 hover:from-slate-200 hover:to-slate-300 px-6 py-2 rounded-xl font-medium text-slate-900 hover:text-black hover:shadow-xl hover:shadow-slate-300/40 transition-all duration-300 flex items-center space-x-2 border border-slate-200/50 hover:border-slate-100">
                    <Plus size={18} />
                    <span>New Campaign</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon size={24} className={stat.color} />
                  <div className={`text-sm font-medium ${stat.color}`}>{stat.trend}</div>
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">All Campaigns</h2>
            <button
              onClick={() => window.location.reload()}
              className="text-gray-300 hover:text-gray-300 transition-colors flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-400" />
                <p className="text-red-400 font-medium">Error Loading Campaigns</p>
              </div>
              <p className="text-gray-300 mt-2">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw size={32} className="text-gray-300 animate-spin" />
                <p className="text-gray-400">Loading your campaigns...</p>
              </div>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-700/30 rounded-2xl p-8">
                <Rocket size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Campaigns Yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Start creating your first advertising campaign to see it here.
                </p>
                <Link href="/create">
                  <button className="bg-gradient-to-r from-slate-300 to-slate-400 hover:from-slate-200 hover:to-slate-300 px-6 py-3 rounded-xl font-medium text-slate-900 hover:text-black hover:shadow-xl hover:shadow-slate-300/40 transition-all duration-300 flex items-center space-x-2 mx-auto border border-slate-200/50 hover:border-slate-100">
                    <Plus size={18} />
                    <span>Create First Campaign</span>
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* Campaigns Grid/List */
            <div
              className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
            >
              {filteredCampaigns.map((campaign) => {
                const IconComponent = getCampaignTypeIcon(campaign.campaign_type)
                return (
                  <div key={campaign.id} className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/20 via-gray-700/20 to-gray-800/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 hover:border-gray-500/30 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-3 rounded-xl">
                          <IconComponent size={24} className="text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                          >
                            {campaign.status}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gray-300 transition-colors line-clamp-2">
                        {campaign.campaign_name}
                      </h3>

                      <div className="space-y-2 mb-4 text-sm text-gray-400">
                        <div className="flex items-center justify-between">
                          <span>Campaign ID:</span>
                          <span className="font-mono text-xs">{campaign.campaign_id?.slice(-8)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Created:</span>
                          <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Type:</span>
                          <span className="capitalize">{campaign.campaign_type || "N/A"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                        <div className="flex items-center space-x-3">
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Copy size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleCampaignSelect(campaign)}
                          className="bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-100 hover:to-slate-200 px-4 py-2 rounded-lg font-medium text-slate-900 hover:text-black hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex items-center space-x-2 group-hover:scale-105 border border-slate-100/50 hover:border-white/70"
                        >
                          <BarChart3 size={16} />
                          <span>View Stats</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Statistics Modal */}
      <StatsModal />
    </div>
  )
}
