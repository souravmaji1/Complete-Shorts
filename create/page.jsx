"use client"

import { useState, useEffect } from "react"
import {
  Facebook,
  Instagram,
  Youtube,
  Search,
  Link,
  ArrowRight,
  Plus,
  Folder,
  Clock,
  Settings,
  User,
  ChevronDown,
  Grid3X3,
  List,
  Filter,
  Zap,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import FacebookAdCreator from "../../components/FacebookAd"
import InstagramAdCreator from "../../components/InstagramAd"
import Linktree from "../../components/linktree"
import GoogleAd from "../../components/GoogleAd"
import YoutubeAd from "../../components/YoutubeNew"

const CreationDashboard = () => {
  const [selectedService, setSelectedService] = useState(null)
  const [viewMode, setViewMode] = useState("grid")
  const [isVisible, setIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const router = useRouter()
  const { user, isLoaded } = useUser()

  const platformComponents = {
    "facebook-ad": FacebookAdCreator,
    "instagram-ad": InstagramAdCreator,
    linktree: Linktree,
    "google-ad": GoogleAd,
    "youtube-ad": YoutubeAd,
  }

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const creationOptions = [
    {
      id: "facebook-ad",
      title: "Facebook Ad",
      description: "Create targeted Facebook advertisements",
      icon: Facebook,
      color: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-600",
      estimatedTime: "5-10 min",
      templates: 12,
      category: "Social Media Ads",
      route: "/create/facebook-ad",
    },
    {
      id: "instagram-ad",
      title: "Instagram Ad",
      description: "Design visual Instagram campaigns",
      icon: Instagram,
      color: "from-pink-500 to-purple-700",
      bgColor: "bg-gradient-to-br from-pink-500 to-purple-600",
      estimatedTime: "3-8 min",
      templates: 18,
      category: "Social Media Ads",
      route: "/create/instagram-ad",
    },
    {
      id: "google-ad",
      title: "Google Ad",
      description: "Build search and display campaigns",
      icon: Search,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-500",
      estimatedTime: "4-12 min",
      templates: 8,
      category: "Search Ads",
      route: "/create/google-ad",
    },
    {
      id: "youtube-ad",
      title: "YouTube Ad",
      description: "Create video advertising campaigns",
      icon: Youtube,
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-600",
      estimatedTime: "6-15 min",
      templates: 6,
      category: "Video Ads",
      route: "/create/youtube-ad",
    },
    {
      id: "linktree",
      title: "Link in Bio",
      description: "Build custom link pages",
      icon: Link,
      color: "from-green-500 to-emerald-700",
      bgColor: "bg-green-600",
      estimatedTime: "2-5 min",
      templates: 24,
      category: "Landing Pages",
      route: "/create/link-in-bio",
    },
  ]

  const handleSettingClick = () => {
    router.push("./connect")
  }

  // New handler for Projects navigation
  const handleProjectsClick = () => {
    router.push("/campaign")
  }

  const recentProjects = [
    {
      id: 1,
      name: "Summer Sale Campaign",
      type: "Facebook Ad",
      status: "Active",
      lastEdited: "2 hours ago",
      performance: "+24%",
      icon: Facebook,
    },
    {
      id: 2,
      name: "Product Launch Video",
      type: "YouTube Ad",
      status: "Draft",
      lastEdited: "1 day ago",
      performance: "N/A",
      icon: Youtube,
    },
    {
      id: 3,
      name: "Brand Awareness",
      type: "Instagram Ad",
      status: "Paused",
      lastEdited: "3 days ago",
      performance: "+12%",
      icon: Instagram,
    },
  ]

  const quickStats = [
    { label: "Active Campaigns", value: "12", trend: "+3", color: "text-green-400" },
    { label: "Total Reach", value: "45.2K", trend: "+12%", color: "text-blue-400" },
    { label: "This Month Spend", value: "$2,340", trend: "-8%", color: "text-amber-400" },
    { label: "Avg. ROI", value: "3.2x", trend: "+0.4x", color: "text-purple-400" },
  ]

  const handleCreateNew = (serviceId) => {
    const service = creationOptions.find((option) => option.id === serviceId)
    if (service) {
      setSelectedService(service)
      setCurrentPage("creation")
      console.log(`Navigating to: ${service.route}`)
    }
  }

  const CreationPage = ({ service }) => {
    const PlatformComponent =
      platformComponents[service.id] ||
      (() => <div className="text-white p-8">No creator available for this platform.</div>)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <nav className="border-b border-gray-800/50 backdrop-blur-xl bg-black/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className="p-2 text-gray-400 hover:text-white transition-colors mr-2"
                >
                  <ArrowLeft size={20} />
                </button>
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
                <button
                  onClick={handleProjectsClick}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Folder size={20} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600 rounded-full"></div>
                </button>
                <button
                  onClick={handleSettingClick}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Settings size={20} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600 rounded-full"></div>
                </button>
                <div className="flex items-center space-x-3 bg-gray-800/50 rounded-xl px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-white font-medium">
                    {isLoaded && user ? user.username || "John" : "Loading..."}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className={`${service.bgColor} p-4 rounded-xl`}>
              <service.icon size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Create {service.title}</h1>
              <p className="text-gray-400 text-lg">{service.description}</p>
            </div>
          </div>

          <PlatformComponent service={service} />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-900/60 via backdrop-blur-xl border border-gray-700/30 rounded-xl p-6">
              <h3 className="text-white font-bold mb-2">Templates Available</h3>
              <p className="text-3xl font-bold text-gray-300">{service.templates}</p>
              <p className="text-gray-400 text-sm">Pre-built templates ready to use</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900/60 via backdrop-blur-xl to-black/60 backdrop-blur-xl p-6">
              <h3 className="text-white font-bold mb-2">Estimated Time</h3>
              <p className="text-xl-3 font-bold text-blue-400">{service.estimatedTime}</p>
              <p className="text-gray-400 text-sm">Average creation time</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-xl p-6">
              <h3 className="text-white font-bold mb-2">Category</h3>
              <p className="text-3xl font-bold text-purple-400">{service.category}</p>
              <p className="text-gray-400 text-sm">Campaign type</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === "creation" && selectedService) {
    return <CreationPage service={selectedService} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
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
              <button
                onClick={handleProjectsClick}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Folder size={20} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600 rounded-full"></div>
              </button>
              <button
                onClick={handleSettingClick}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Settings size={20} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600 rounded-full"></div>
              </button>
              <div className="flex items-center space-x-3 bg-gray-800/50 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-white font-medium">
                  {isLoaded && user ? user.username || "John" : "Loading..."}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-400 bg-clip-text text-transparent">
                  Create Something
                </span>
                <span className="text-white block mt-2">Amazing Today</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl">
                Choose what you'd like to create and let our AI help you build high-converting campaigns in minutes.
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
                <button className="flex items-center space-x-2 text-gray-300 hover:text-gray-200 transition-colors">
                  <Filter size={18} />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Start Creating</h2>
            <button className="text-gray-300 hover:text-gray-200 transition-colors flex items-center space-x-2">
              <span>View All Templates</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div
            className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
          >
            {creationOptions.map((option, index) => (
              <div key={option.id} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/20 via-gray-700/20 to-gray-800/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div
                  className="relative bg-gradient-to-br from-gray-900/60 via-slate-900/40 to-black/60 backdrop-blur-xl border border-gray-700/30 rounded-2xl p-6 hover:border-gray-500/30 transition-all duration-300 cursor-pointer"
                  onClick={() => handleCreateNew(option.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${option.bgColor} p-3 rounded-xl`}>
                      <option.icon size={28} className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">{option.category}</div>
                      <div className="flex items-center text-gray-500 text-xs mt-1">
                        <Clock size={12} className="mr-1" />
                        {option.estimatedTime}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    {option.title}
                  </h3>

                  <p className="text-gray-400 mb-4 leading-relaxed">{option.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Folder size={14} className="mr-1" />
                      {option.templates} templates
                    </div>

                    <button
                      className="bg-gradient-to-r from-slate-300 to-slate-400 hover:from-slate-200 hover:to-slate-300 px-4 py-2 rounded-lg font-medium text-slate-900 hover:text-black hover:shadow-xl hover:shadow-slate-300/40 transition-all duration-300 flex items-center space-x-2 group-hover:scale-105 border border-slate-200/50 hover:border-slate-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCreateNew(option.id)
                      }}
                    >
                      <Plus size={16} />
                      <span>Create</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreationDashboard
