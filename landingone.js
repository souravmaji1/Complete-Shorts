"use client"
import { useState, useEffect } from "react"
import {
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  Play,
  Instagram,
  Youtube,
  Facebook,
  Search,
  ChevronRight,
  Users,
  DollarSign,
  BarChart3,
  Rocket,
  Star,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import React from "react"

const MultiPlatformAdLanding = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [activePlatform, setActivePlatform] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow",
      image: "bg-gradient-to-br from-gray-600 to-gray-700",
      quote: "This platform transformed our ad strategy. We saw 400% ROI increase in just 3 months!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "E-commerce Owner",
      company: "StyleHub",
      image: "bg-gradient-to-br from-gray-500 to-gray-600",
      quote: "Managing ads across all platforms was a nightmare. Now it's seamless and automated.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Agency Founder",
      company: "Digital Boost",
      image: "bg-gradient-to-br from-gray-700 to-gray-800",
      quote: "Our clients love the unified reporting. We've scaled from 10 to 100+ campaigns effortlessly.",
      rating: 5,
    },
  ]

  const platformFeatures = [
    {
      platform: "Google Ads",
      icon: Search,
      features: [
        "Smart Keyword Research",
        "Automated Bidding",
        "Performance Max Campaigns",
        "Landing Page Optimization",
      ],
      color: "from-gray-600 to-gray-700",
      users: "4B+ Users",
      description: "Dominate search results with AI-powered Google Ads that convert",
      demoVideo: "https://example.com/videos/google-ads-demo.mp4",
      demoPoster: "https://example.com/images/google-ads-poster.jpg",
    },
    {
      platform: "Facebook",
      icon: Facebook,
      features: ["Advanced Audience Targeting", "Creative Testing", "Conversion Optimization", "Retargeting Campaigns"],
      color: "from-gray-700 to-gray-800",
      users: "3B+ Users",
      description: "Reach your ideal customers with precision Facebook advertising",
      demoVideo: "https://example.com/videos/facebook-demo.mp4",
      demoPoster: "https://example.com/images/facebook-poster.jpg",
    },
    {
      platform: "Instagram",
      icon: Instagram,
      features: ["Story Ads Creation", "Shopping Integration", "Influencer Matching", "Visual Content AI"],
      color: "from-gray-500 to-gray-600",
      users: "2B+ Users",
      description: "Create stunning visual campaigns that drive engagement and sales",
      demoVideo: "https://example.com/videos/instagram-demo.mp4",
      demoPoster: "https://example.com/images/instagram-poster.jpg",
    },
    {
      platform: "YouTube",
      icon: Youtube,
      features: ["Video Ad Creation", "Audience Insights", "Campaign Optimization", "Brand Safety Tools"],
      color: "from-gray-600 to-gray-700",
      users: "2B+ Users",
      description: "Captivate audiences with powerful video advertising campaigns",
      demoVideo: "https://example.com/videos/youtube-demo.mp4",
      demoPoster: "https://example.com/images/youtube-poster.jpg",
    },
  ]

  const features = [
    {
      icon: Zap,
      title: "One-Click Campaign Creation",
      description: "Create ads across all platforms simultaneously with our unified dashboard",
    },
    {
      icon: Target,
      title: "AI-Powered Targeting",
      description: "Smart audience optimization that adapts to each platform's unique algorithms",
    },
    {
      icon: TrendingUp,
      title: "Cross-Platform Analytics",
      description: "Unified reporting dashboard to track performance across all your campaigns",
    },
    {
      icon: Rocket,
      title: "Auto-Optimization",
      description: "AI continuously optimizes your campaigns for maximum ROI across platforms",
    },
    {
      icon: Users,
      title: "Audience Sync",
      description: "Seamlessly sync audiences between platforms for consistent targeting",
    },
    {
      icon: BarChart3,
      title: "Smart Bidding",
      description: "Intelligent bid management across Google, Facebook, Instagram, and YouTube",
    },
  ]

  const stats = [
    { value: "500%", label: "Average ROI Increase" },
    { value: "10x", label: "Faster Campaign Setup" },
    { value: "95%", label: "Time Saved" },
    { value: "50K+", label: "Active Users" },
  ]

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute -inset-2 bg-gray-700/30 rounded-xl blur-lg"></div>
                <div className="relative bg-gray-700 p-3 rounded-xl">
                  <Rocket size={24} className="text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold text-white">AdOne Pro</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Platforms", "Pricing", "Testimonials", "Resources"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">
                Login
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-white">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-800/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-gray-700/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-800/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gray-500 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Hero Section */}
        <div
          className={`grid lg:grid-cols-2 gap-16 items-center mb-32 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Left Content */}
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -inset-8 bg-gray-800/20 rounded-[4rem] blur-3xl"></div>
              <h1 className="relative text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-white block">Create Ads</span>
                <span className="text-gray-300 block mt-2">Everywhere</span>
                <span className="text-gray-400 block mt-2">From One Dashboard</span>
              </h1>
            </div>

            <p className="text-lg lg:text-xl text-gray-400 font-light leading-relaxed">
              The ultimate AI-powered platform to create, manage, and optimize ads across
              <span className="text-gray-300 font-semibold"> Google, Facebook, Instagram, and YouTube </span>
              with unprecedented ease and efficiency.
            </p>

            {/* Platform Icons */}
            <div className="flex flex-wrap gap-4">
              {platformFeatures.map((platform, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -inset-2 bg-gray-700/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                  <div
                    className={`relative bg-gradient-to-br ${platform.color} p-3 rounded-xl shadow-xl transform group-hover:scale-110 transition-all duration-300 flex items-center space-x-2`}
                  >
                    <platform.icon size={20} className="text-white" />
                    <span className="text-white text-sm font-medium">{platform.platform}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/campaign">
                <button className="group relative bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 text-white">
                  <span className="relative z-10 flex items-center justify-center">
                    <Rocket size={20} className="mr-2" />
                    Start Creating Now
                    <ArrowRight
                      size={18}
                      className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </span>
                </button>
              </Link>
              <button className="group flex items-center justify-center px-8 py-4 rounded-xl border border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm">
                <Play size={18} className="mr-2" />
                <span className="font-medium">Watch Demo</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-gray-700 ${
                      i === 0
                        ? "bg-gradient-to-br from-gray-600 to-gray-700"
                        : i === 1
                          ? "bg-gradient-to-br from-gray-500 to-gray-600"
                          : i === 2
                            ? "bg-gradient-to-br from-gray-700 to-gray-800"
                            : i === 3
                              ? "bg-gradient-to-br from-gray-600 to-gray-700"
                              : "bg-gradient-to-br from-gray-500 to-gray-600"
                    } flex items-center justify-center`}
                  >
                    <Star size={12} className="text-white" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                Trusted by <span className="text-gray-300 font-bold">50,000+</span> marketers
              </div>
            </div>
          </div>

          {/* Right Content - Two Reel Videos */}
          <div className="relative lg:justify-self-end">
            <div className="flex gap-6 justify-center">
              {/* First Phone Frame */}
              <div className="relative w-64 h-[480px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-gray-800/20 transform rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative">
                  {/* Phone Screen Bezels */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-900 rounded-full"></div>

                  {/* Video Container */}
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 overflow-hidden">
                    {/* Simulated Video Content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 via-gray-600/20 to-gray-500/20 animate-pulse"></div>

                    {/* Dashboard Preview Animation */}
                    <div className="absolute inset-3 space-y-3 animate-pulse">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-gray-700 to-gray-600 h-8 rounded-lg flex items-center justify-center">
                        <Target size={16} className="text-white animate-spin" />
                      </div>

                      {/* Ad Creation Flow */}
                      <div className="space-y-2">
                        <div className="bg-gray-800 h-12 rounded-lg p-2 flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                            <Users size={12} className="text-white" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="bg-gray-600 h-2 rounded w-3/4"></div>
                            <div className="bg-gray-700 h-1 rounded w-1/2"></div>
                          </div>
                        </div>

                        <div className="bg-gray-800 h-12 rounded-lg p-2 flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                            <BarChart3 size={12} className="text-white" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="bg-gray-600 h-2 rounded w-2/3"></div>
                            <div className="bg-gray-700 h-1 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800 p-2 rounded-lg text-center">
                          <div className="text-gray-300 font-bold text-sm">2.5M</div>
                          <div className="text-gray-500 text-xs">Reach</div>
                        </div>
                        <div className="bg-gray-800 p-2 rounded-lg text-center">
                          <div className="text-gray-300 font-bold text-sm">12%</div>
                          <div className="text-gray-500 text-xs">CTR</div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Action Elements */}
                    <div
                      className="absolute top-16 right-3 bg-gray-600 p-2 rounded-full animate-bounce"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <Sparkles size={10} className="text-white" />
                    </div>
                    <div
                      className="absolute top-32 left-3 bg-gray-500 p-2 rounded-full animate-bounce"
                      style={{ animationDelay: "1.5s" }}
                    >
                      <TrendingUp size={10} className="text-white" />
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30">
                        <Play size={20} className="text-white ml-1" />
                      </div>
                    </div>

                    {/* Video Progress Bar */}
                    <div className="absolute bottom-16 left-3 right-3">
                      <div className="bg-white/20 h-1 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-400 to-gray-300 h-full w-2/5 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* Reel-style Indicators */}
                    <div className="absolute right-3 bottom-24 space-y-4">
                      <div className="text-center">
                        <div className="bg-white/20 p-2 rounded-full mb-1">
                          <Users size={14} className="text-white" />
                        </div>
                        <span className="text-white text-xs">2.5M</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-white/20 p-2 rounded-full mb-1">
                          <DollarSign size={14} className="text-white" />
                        </div>
                        <span className="text-white text-xs">300%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Phone Frame */}
              <div className="relative w-64 h-[480px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-gray-700/20 transform -rotate-3 hover:rotate-0 transition-all duration-500 mt-8">
                <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative">
                  {/* Phone Screen Bezels */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-900 rounded-full"></div>

                  {/* Video Container */}
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500 overflow-hidden">
                    {/* Simulated Video Content */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-gray-600/20 via-gray-500/20 to-gray-400/20 animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>

                    {/* Dashboard Preview Animation */}
                    <div className="absolute inset-3 space-y-3 animate-pulse" style={{ animationDelay: "0.5s" }}>
                      {/* Header */}
                      <div className="bg-gradient-to-r from-gray-600 to-gray-500 h-8 rounded-lg flex items-center justify-center">
                        <Zap size={16} className="text-white animate-spin" />
                      </div>

                      {/* Multi-Platform Display */}
                      <div className="grid grid-cols-2 gap-1">
                        {platformFeatures.slice(0, 4).map((platform, index) => (
                          <div
                            key={index}
                            className={`bg-gradient-to-br ${platform.color} h-16 rounded-lg flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-300`}
                            style={{ animationDelay: `${index * 0.3}s` }}
                          >
                            <platform.icon size={12} className="text-white mb-1" />
                            <span className="text-white text-xs font-medium">{platform.platform}</span>
                          </div>
                        ))}
                      </div>

                      {/* Analytics Chart */}
                      <div className="bg-gray-800 h-16 rounded-lg p-2 flex items-end space-x-1">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-gray-600 to-gray-400 rounded-sm flex-1 animate-pulse"
                            style={{
                              height: `${20 + Math.random() * 60}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: "2.5s",
                            }}
                          ></div>
                        ))}
                      </div>

                      {/* ROI Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800 p-2 rounded-lg text-center">
                          <div className="text-gray-300 font-bold text-sm">500%</div>
                          <div className="text-gray-500 text-xs">ROI</div>
                        </div>
                        <div className="bg-gray-800 p-2 rounded-lg text-center">
                          <div className="text-gray-300 font-bold text-sm">95%</div>
                          <div className="text-gray-500 text-xs">Automated</div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Action Elements */}
                    <div
                      className="absolute top-16 left-3 bg-gray-500 p-2 rounded-full animate-bounce"
                      style={{ animationDelay: "2s" }}
                    >
                      <Target size={10} className="text-white" />
                    </div>
                    <div
                      className="absolute bottom-28 right-6 bg-gray-600 p-2 rounded-full animate-bounce"
                      style={{ animationDelay: "2.5s" }}
                    >
                      <Rocket size={10} className="text-white" />
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30">
                        <Play size={20} className="text-white ml-1" />
                      </div>
                    </div>

                    {/* Video Progress Bar */}
                    <div className="absolute bottom-16 left-3 right-3">
                      <div className="bg-white/20 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-gray-400 to-gray-300 h-full w-3/5 rounded-full animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                      </div>
                    </div>

                    {/* Reel-style Indicators */}
                    <div className="absolute right-3 bottom-24 space-y-4">
                      <div className="text-center">
                        <div className="bg-white/20 p-2 rounded-full mb-1">
                          <BarChart3 size={14} className="text-white" />
                        </div>
                        <span className="text-white text-xs">500%</span>
                      </div>
                      <div className="text-center">
                        <div className="bg-white/20 p-2 rounded-full mb-1">
                          <Zap size={14} className="text-white" />
                        </div>
                        <span className="text-white text-xs">AI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Glow Effect */}
            <div className="absolute -inset-12 bg-gradient-to-r from-gray-700/10 via-gray-600/20 to-gray-500/10 rounded-[6rem] blur-3xl -z-10"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="relative">
                <div className="absolute -inset-4 bg-gray-700/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-2xl border border-gray-700/30 rounded-2xl p-8 transform group-hover:scale-105 transition-all duration-300">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Mastery Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Master Every Platform</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Deep dive into platform-specific features and see how our AI optimizes for each channel
            </p>
          </div>

          {/* Platform Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {platformFeatures.map((platform, index) => (
              <button
                key={index}
                onClick={() => setActivePlatform(index)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activePlatform === index
                    ? "bg-gray-700 text-white shadow-lg"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
                }`}
              >
                <platform.icon size={20} />
                <span>{platform.platform}</span>
                <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">{platform.users}</span>
              </button>
            ))}
          </div>

          {/* Active Platform Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Platform Details */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`bg-gradient-to-br ${platformFeatures[activePlatform].color} p-4 rounded-2xl`}>
                    {React.createElement(platformFeatures[activePlatform].icon, { size: 32, className: "text-white" })}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">{platformFeatures[activePlatform].platform}</h3>
                    <p className="text-gray-400">{platformFeatures[activePlatform].users} reach potential</p>
                  </div>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">{platformFeatures[activePlatform].description}</p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white mb-4">Key Features</h4>
                {platformFeatures[activePlatform].features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-300 transition-colors duration-300"></div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex space-x-4">
                <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-105">
                  Start Campaign
                </button>
                <button className="border border-gray-600 hover:border-gray-500 px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-gray-300 transition-all duration-300">
                  View Demo
                </button>
              </div>
            </div>

            {/* Right: Interactive Demo */}
            <div className="relative">
              <div className="bg-gray-800/60 backdrop-blur-2xl border border-gray-700/30 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/5 via-transparent to-gray-600/5 rounded-3xl"></div>

                {/* Demo Header */}
                <div className="relative z-10 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">Campaign Dashboard</h4>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Platform Indicator */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`bg-gradient-to-br ${platformFeatures[activePlatform].color} p-2 rounded-lg`}>
                      {React.createElement(platformFeatures[activePlatform].icon, {
                        size: 16,
                        className: "text-white",
                      })}
                    </div>
                    <span className="text-gray-300 font-medium">
                      {platformFeatures[activePlatform].platform} Campaign
                    </span>
                  </div>
                </div>

                {/* Demo Content */}
                <div className="relative z-10 space-y-6">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-white mb-1">
                        {activePlatform === 0
                          ? "2.5M"
                          : activePlatform === 1
                            ? "1.8M"
                            : activePlatform === 2
                              ? "3.2M"
                              : "1.1M"}
                      </div>
                      <div className="text-gray-400 text-sm">Impressions</div>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-white mb-1">
                        {activePlatform === 0
                          ? "12.5%"
                          : activePlatform === 1
                            ? "8.3%"
                            : activePlatform === 2
                              ? "15.7%"
                              : "6.2%"}
                      </div>
                      <div className="text-gray-400 text-sm">CTR</div>
                    </div>
                  </div>

                  {/* Chart Visualization */}
                  <div className="bg-gray-700/30 p-4 rounded-xl">
                    <div className="flex items-end space-x-2 h-24">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`bg-gradient-to-t ${platformFeatures[activePlatform].color} rounded-sm flex-1 transition-all duration-500`}
                          style={{
                            height: `${Math.random() * 80 + 20}%`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="text-gray-400 text-sm mt-2">Performance over last 7 days</div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-gray-700/30 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles size={16} className="text-gray-400" />
                      <span className="text-gray-300 font-medium">AI Insights</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {activePlatform === 0 && "Increase bid by 15% for 'marketing automation' keywords"}
                      {activePlatform === 1 && "Lookalike audiences performing 23% better than interests"}
                      {activePlatform === 2 && "Story ads generating 2x more engagement than feed posts"}
                      {activePlatform === 3 && "Video completion rate improved by 18% with shorter hooks"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gray-600 p-3 rounded-full shadow-lg animate-bounce">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 bg-gray-500 p-3 rounded-full shadow-lg animate-bounce"
                style={{ animationDelay: "1s" }}
              >
                <Target size={20} className="text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* Platform Showcase Section */}
        <section className="mb-24 overflow-hidden">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">See Your Ads Come to Life</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Preview how your ads will look on mobile devices across all platforms
            </p>
          </div>

          {/* Infinite Scrolling Container */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>

            <div className="flex animate-scroll">
              {/* Ad items */}
              {[
                // Google Search Ad
                {
                  platform: "Google Search",
                  icon: Search,
                  color: "from-gray-600 to-gray-700",
                  content: (
                    <div className="bg-white text-black p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-green-600 font-medium">Ad</span>
                      </div>
                      <h3 className="text-blue-600 font-semibold text-sm mb-1">Best Marketing Tools | Free Trial</h3>
                      <p className="text-xs text-gray-600 mb-2">www.example.com</p>
                      <p className="text-xs text-gray-800 leading-relaxed">
                        Boost your ROI with AI-powered ad campaigns. Get started free today and see results in 24 hours.
                      </p>
                    </div>
                  ),
                },
                // Instagram Story Ad
                {
                  platform: "Instagram Stories",
                  icon: Instagram,
                  color: "from-gray-600 to-gray-700",
                  content: (
                    <div className="bg-gradient-to-br from-gray-700 to-gray-600 p-4 rounded-lg relative overflow-hidden">
                      <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-white text-xs font-medium">Sponsored</span>
                      </div>
                      <div className="h-32 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 mx-auto">
                            <Sparkles className="text-white" size={24} />
                          </div>
                          <p className="text-white font-bold text-sm">Transform Your Business</p>
                          <p className="text-white/80 text-xs">Swipe up to learn more</p>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <ArrowRight className="text-white" size={16} />
                        </div>
                      </div>
                    </div>
                  ),
                },
                // Facebook Feed Ad
                {
                  platform: "Facebook Feed",
                  icon: Facebook,
                  color: "from-gray-700 to-gray-800",
                  content: (
                    <div className="bg-white text-black rounded-lg overflow-hidden">
                      <div className="p-3 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mr-3">
                            <Rocket className="text-white" size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">AdOne Pro</p>
                            <p className="text-xs text-gray-500">Sponsored</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-500 to-gray-600 h-20 flex items-center justify-center">
                        <p className="text-white font-bold text-sm">Create Ads Everywhere</p>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-800 mb-2">
                          The ultimate platform for multi-platform advertising
                        </p>
                        <button className="bg-gray-600 text-white px-4 py-1 rounded text-xs font-medium">
                          Learn More
                        </button>
                      </div>
                    </div>
                  ),
                },
                // YouTube Ad
                {
                  platform: "YouTube",
                  icon: Youtube,
                  color: "from-gray-600 to-gray-700",
                  content: (
                    <div className="bg-black text-white rounded-lg overflow-hidden relative">
                      <div className="bg-gray-800 h-24 flex items-center justify-center relative">
                        <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold">
                          Ad
                        </div>
                        <div className="text-center">
                          <Play className="text-gray-400 mx-auto mb-1" size={24} />
                          <p className="text-xs">Video Ad Preview</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium mb-1">AdOne Pro - Create Ads Everywhere</p>
                        <p className="text-xs text-gray-400 mb-2">AdOne Pro • 1.2M views</p>
                        <p className="text-xs text-gray-300">Transform your advertising strategy...</p>
                      </div>
                    </div>
                  ),
                },
              ]
                .concat([
                  // Duplicate for seamless scrolling
                  {
                    platform: "Google Search",
                    icon: Search,
                    color: "from-gray-600 to-gray-700",
                    content: (
                      <div className="bg-white text-black p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-green-600 font-medium">Ad</span>
                        </div>
                        <h3 className="text-blue-600 font-semibold text-sm mb-1">Best Marketing Tools | Free Trial</h3>
                        <p className="text-xs text-gray-600 mb-2">www.example.com</p>
                        <p className="text-xs text-gray-800 leading-relaxed">
                          Boost your ROI with AI-powered ad campaigns. Get started free today and see results in 24
                          hours.
                        </p>
                      </div>
                    ),
                  },
                  {
                    platform: "Instagram Stories",
                    icon: Instagram,
                    color: "from-gray-600 to-gray-700",
                    content: (
                      <div className="bg-gradient-to-br from-gray-700 to-gray-600 p-4 rounded-lg relative overflow-hidden">
                        <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-white text-xs font-medium">Sponsored</span>
                        </div>
                        <div className="h-32 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 mx-auto">
                              <Sparkles className="text-white" size={24} />
                            </div>
                            <p className="text-white font-bold text-sm">Transform Your Business</p>
                            <p className="text-white/80 text-xs">Swipe up to learn more</p>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                            <ArrowRight className="text-white" size={16} />
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    platform: "Facebook Feed",
                    icon: Facebook,
                    color: "from-gray-700 to-gray-800",
                    content: (
                      <div className="bg-white text-black rounded-lg overflow-hidden">
                        <div className="p-3 border-b border-gray-200">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mr-3">
                              <Rocket className="text-white" size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">AdOne Pro</p>
                              <p className="text-xs text-gray-500">Sponsored</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-500 to-gray-600 h-20 flex items-center justify-center">
                          <p className="text-white font-bold text-sm">Create Ads Everywhere</p>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-800 mb-2">
                            The ultimate platform for multi-platform advertising
                          </p>
                          <button className="bg-gray-600 text-white px-4 py-1 rounded text-xs font-medium">
                            Learn More
                          </button>
                        </div>
                      </div>
                    ),
                  },
                  {
                    platform: "YouTube",
                    icon: Youtube,
                    color: "from-gray-600 to-gray-700",
                    content: (
                      <div className="bg-black text-white rounded-lg overflow-hidden relative">
                        <div className="bg-gray-800 h-24 flex items-center justify-center relative">
                          <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold">
                            Ad
                          </div>
                          <div className="text-center">
                            <Play className="text-gray-400 mx-auto mb-1" size={24} />
                            <p className="text-xs">Video Ad Preview</p>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium mb-1">AdOne Pro - Create Ads Everywhere</p>
                          <p className="text-xs text-gray-400 mb-2">AdOne Pro • 1.2M views</p>
                          <p className="text-xs text-gray-300">Transform your advertising strategy...</p>
                        </div>
                      </div>
                    ),
                  },
                ])
                .map((ad, index) => (
                  <div key={index} className="flex-shrink-0 w-72 mx-4">
                    <div className="relative">
                      {/* Mobile Frame */}
                      <div className="w-64 h-[480px] bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-[2.5rem] p-4 shadow-2xl">
                        {/* Phone Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>

                        {/* Screen Content */}
                        <div className="w-full h-full bg-gray-100 rounded-[2rem] p-4 overflow-hidden relative">
                          {/* Status Bar */}
                          <div className="flex justify-between items-center mb-4 text-black">
                            <span className="text-xs font-medium">9:41</span>
                            <div className="flex items-center space-x-1">
                              <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                              <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                              <div className="w-6 h-3 bg-green-500 rounded-sm"></div>
                            </div>
                          </div>

                          {/* Platform Header */}
                          <div className="flex items-center mb-4 pb-2 border-b border-gray-300">
                            <div className={`bg-gradient-to-br ${ad.color} p-2 rounded-lg mr-3`}>
                              <ad.icon size={16} className="text-white" />
                            </div>
                            <span className="font-semibold text-sm text-gray-800">{ad.platform}</span>
                          </div>

                          {/* Ad Content */}
                          <div className="flex-1">{ad.content}</div>
                        </div>
                      </div>

                      {/* Floating Platform Badge */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className={`bg-gradient-to-r ${ad.color} px-3 py-1 rounded-full shadow-lg`}>
                          <span className="text-white text-xs font-medium">{ad.platform}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Why Choose Our Platform?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of digital advertising with our comprehensive suite of AI-powered tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-2 bg-gray-700/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-2xl border border-gray-700/30 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700/5 via-transparent to-gray-600/5 rounded-2xl"></div>
                  <div className="relative z-10">
                    <div className="relative mb-6">
                      <feature.icon
                        size={48}
                        className="text-gray-300 group-hover:text-white transition-colors duration-300"
                      />
                      <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-lg group-hover:bg-gray-300/20 transition-all duration-300"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <section id="testimonials" className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Loved by Marketers Worldwide</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how our platform has transformed businesses across industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-2 bg-gray-700/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-2xl border border-gray-700/30 rounded-2xl p-8 h-full transform group-hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-16 h-16 rounded-full ${testimonial.image} flex items-center justify-center text-white font-bold text-xl mr-4`}
                    >
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-gray-300 text-sm">{testimonial.role}</p>
                      <p className="text-gray-500 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-gray-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-400 leading-relaxed italic">"{testimonial.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-6 lg:px-24 bg-gray-800/10 relative overflow-hidden mb-32">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/5 left-1/5 w-80 h-80 bg-gray-700/15 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/5 right-1/5 w-80 h-80 bg-gray-600/15 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight">
                <span className="text-white">How It Works</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-90">
                Create powerful ad campaigns in just three simple steps
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-500/60 to-transparent rounded-full hidden lg:block z-0"></div>
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-px h-36 bg-gradient-to-b from-gray-500/60 to-transparent hidden lg:block z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
                {[
                  {
                    step: "01",
                    title: "Connect Your Accounts",
                    description:
                      "Securely link your Google, Facebook, Instagram, and YouTube advertising accounts in one click",
                    icon: Users,
                  },
                  {
                    step: "02",
                    title: "AI Creates Your Campaigns",
                    description:
                      "Our AI analyzes your business and creates optimized campaigns across all platforms simultaneously",
                    icon: Sparkles,
                  },
                  {
                    step: "03",
                    title: "Monitor & Optimize",
                    description:
                      "Watch your campaigns perform in real-time with automated optimization and detailed analytics",
                    icon: TrendingUp,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center group relative transform transition-all duration-700 hover:-translate-y-3 hover:scale-105"
                  >
                    <div className="bg-gray-800/70 backdrop-blur-2xl border border-gray-700/40 rounded-3xl p-8 shadow-xl hover:shadow-gray-700/30 transition-all duration-500">
                      <div className="relative mb-8">
                        <div className="absolute -inset-6 bg-gray-600/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                        <div className="relative bg-gray-700/25 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-500">
                          <item.icon
                            size={28}
                            className="text-gray-300 group-hover:text-white transition-colors duration-300"
                          />
                        </div>
                        <div className="absolute -top-3 -right-3 bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center text-sm font-extrabold text-white shadow-lg">
                          {item.step}
                        </div>
                      </div>

                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm lg:text-base leading-relaxed max-w-xs mx-auto opacity-90">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-20">
              <button className="relative bg-gray-700 hover:bg-gray-600 px-10 py-4 rounded-xl font-semibold text-white text-lg shadow-lg transition-all duration-500">
                <span className="relative z-10">
                  Get Started Now
                  <span className="ml-3 inline-block transform group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Simple, Transparent Pricing</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Choose the plan that fits your business needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$49",
                period: "/month",
                description: "Perfect for small businesses",
                features: ["Up to 5 campaigns", "Basic analytics", "Email support", "Single platform focus"],
                popular: false,
              },
              {
                name: "Professional",
                price: "$149",
                period: "/month",
                description: "Best for growing businesses",
                features: [
                  "Unlimited campaigns",
                  "Advanced analytics",
                  "Priority support",
                  "All platforms",
                  "AI optimization",
                  "Team collaboration",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$399",
                period: "/month",
                description: "For large organizations",
                features: [
                  "Everything in Pro",
                  "Custom integrations",
                  "Dedicated manager",
                  "White-label options",
                  "Advanced reporting",
                  "SLA guarantee",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <div key={index} className={`group relative ${plan.popular ? "scale-105" : ""}`}>
                <div className="absolute -inset-2 bg-gray-700/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div
                  className={`relative bg-gray-800/60 backdrop-blur-2xl border ${plan.popular ? "border-gray-500/50" : "border-gray-700/30"} rounded-2xl p-8 h-full transform group-hover:scale-105 transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-600 px-6 py-2 rounded-full text-sm font-bold text-white">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-2">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                      plan.popular
                        ? "bg-gray-700 hover:bg-gray-600 hover:shadow-lg transform hover:scale-105 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <div className="text-center bg-gray-800/60 backdrop-blur-2xl border border-gray-700/30 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700/5 via-transparent to-gray-600/5 rounded-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Ready to Transform Your Advertising?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Join thousands of marketers who have revolutionized their ad campaigns with our platform
            </p>
            <button className="group bg-gray-700 hover:bg-gray-600 px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-white">
              <span className="flex items-center">
                <Sparkles size={24} className="mr-3" />
                Start Your Free Trial
                <ChevronRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="group relative">
          <div className="absolute -inset-4 bg-gray-600/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <button className="relative bg-gray-700 hover:bg-gray-600 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110">
            <DollarSign size={24} className="text-white" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-24 bg-gray-800/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/6 w-64 h-64 bg-gray-700/15 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-gray-600/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2.5s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
            {/* Brand Info */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-extrabold mb-4">
                <span className="text-white">AdOne Pro</span>
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto lg:mx-0 opacity-90">
                Empowering businesses with AI-driven ad campaigns across multiple platforms.
              </p>
              <div className="flex justify-center lg:justify-start gap-4 mt-6">
                {["Twitter", "Facebook", "Instagram", "LinkedIn"].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-gray-300 transition-colors duration-300 group"
                  >
                    <span className="sr-only">{social}</span>
                    <svg
                      className="w-6 h-6 fill-current group-hover:scale-110 transition-transform duration-300"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {["Home", "Features", "Pricing", "About", "Contact"].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-300 text-sm hover:text-gray-200 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-bold text-white mb-4">Support</h4>
              <ul className="space-y-3">
                {["FAQ", "Help Center", "Terms of Service", "Privacy Policy"].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-300 text-sm hover:text-gray-200 transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="text-center lg:text-left">
              <h4 className="text-lg font-bold text-white mb-4">Stay Updated</h4>
              <p className="text-gray-300 text-sm mb-4 max-w-xs mx-auto lg:mx-0 opacity-90">
                Subscribe to our newsletter for the latest updates and tips.
              </p>
              <div className="relative max-w-sm mx-auto lg:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-3 px-4 bg-gray-800/50 border border-gray-700/40 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/50 backdrop-blur-sm transition-all duration-300"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-white text-sm font-medium hover:opacity-90 transition-all duration-300 shadow-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent my-8"></div>

          <div className="text-center">
            <p className="text-gray-400 text-sm opacity-90">
              &copy; {new Date().getFullYear()} AdSpark. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MultiPlatformAdLanding
