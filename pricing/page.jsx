"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ScrollArea } from "../../components/ui/scroll-area"
import {
  ArrowLeft,
  Check,
  Star,
  Zap,
  Target,
  BarChart3,
  Users,
  Shield,
  Headphones,
  Menu,
  X,
  Home,
  MessageSquare,
  Settings2,
  TrendingUp,
  History,
  Bookmark,
  HelpCircle,
  Plus,
  Facebook,
  Crown,
  Sparkles,
  Rocket,
  Brain,
  AlertCircle,
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { createClient } from '@supabase/supabase-js'
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const Sidebar = ({ isOpen, onClose,  currentPage }) => {
  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "dashboard" },
    { icon: MessageSquare, label: "Chat", path: "googleandyoutubeads" },
    { icon: Settings2, label: "Settings", path: "settings" },
  ]

  const quickActions = [
    { icon: TrendingUp, label: "Keywords Finder", path: "keywordfinder", color: "text-gray-400 bg-gray-800/30" },
    { icon: Target, label: "Expired Domains", path: "expireddomain", color: "text-gray-400 bg-gray-800/20" },
    { icon: Zap, label: "Pricing", path: "pricing", color: "text-gray-400 bg-gray-800/40" },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-gray-950/98 border-r border-gray-800/30 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-600/20">
                  <div className="w-10 h-10 relative">
                    <Image 
                      src="/goblin.png"
                      alt="Goblin Pro Logo"
                      width={50}
                      height={50}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-200">Goblin Pro</h2>
                  <div className="text-xs text-gray-500">AI-Ads Assistant</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-900/50 rounded-lg transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>

          </div>

          {/* Navigation with ScrollArea */}
          <ScrollArea className="flex-1 px-4">
            <div className="py-4">
              <nav className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <Link
                    href={`/${item.path}`}
                    key={index}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      currentPage === item.path
                        ? "bg-gray-800/60 text-gray-200 border border-gray-700/40 shadow-lg shadow-gray-800/10"
                        : "text-gray-400 hover:text-gray-300 hover:bg-gray-900/40 hover:border-gray-800/30 border border-transparent"
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <Link
                      href={`/${action.path}`}
                      key={index}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                        currentPage === action.path
                          ? "bg-gray-800/60 text-gray-200 border border-gray-700/40 shadow-lg shadow-gray-800/10"
                          : "text-gray-400 hover:bg-gray-900/40 hover:border-gray-800/30 border border-transparent"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl ${action.color} transition-all duration-200 group-hover:scale-110 ${
                          currentPage === action.path ? "bg-gray-700/60" : ""
                        }`}
                      >
                        <action.icon size={14} />
                      </div>
                      <span>{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800/30">
            <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 border border-gray-700/30 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star size={16} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-300">Pro Features</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Unlock advanced AI capabilities and unlimited campaigns</p>
              <Link href='/pricing'>
              <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 py-2 px-4 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-gray-600/10 transition-all duration-200">
                Upgrade Now
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const PricingCard = ({ plan, isPopular = false, onSelectPlan }) => {
  return (
    <div
      className={`relative group hover:scale-[1.02] transition-all duration-300 ease-out ${
        isPopular ? "order-first lg:order-none" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4  left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 px-6 py-2 rounded-2xl text-sm font-semibold shadow-lg shadow-gray-600/20 flex items-center space-x-2">
            <Crown size={16}  />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div
        className={`h-full p-8 rounded-3xl border backdrop-blur-xl shadow-lg transition-all duration-300 ${
          isPopular
            ? "bg-gray-900/80 border-gray-700/60 shadow-gray-800/20 ring-2 ring-gray-700/30"
            : "bg-gray-950/80 border-gray-800/40 shadow-black/10 hover:border-gray-700/50"
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div
            className={`p-3 rounded-2xl ${
              isPopular
                ? "bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg shadow-gray-600/20"
                : "bg-gray-900/90 border border-gray-800/30"
            }`}
          >
            <plan.icon size={24} className={isPopular ? "text-gray-200" : "text-gray-400"} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-200">{plan.name}</h3>
            <p className="text-sm text-gray-500">{plan.description}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-gray-100">${plan.price}</span>
            <span className="text-gray-500">/{plan.period}</span>
          </div>
          {plan.originalPrice && (
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-lg text-gray-500 line-through">${plan.originalPrice}</span>
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                Save {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
              </span>
            </div>
          )}
        </div>

        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <Check size={12} className="text-green-400" />
              </div>
              <span className="text-sm text-gray-300 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onSelectPlan(plan)}
          className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
            isPopular
              ? "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600 shadow-lg shadow-gray-600/20 hover:shadow-gray-600/30 hover:scale-105"
              : "bg-gray-900/60 border border-gray-800/40 text-gray-300 hover:bg-gray-800/60 hover:border-gray-700/60 hover:text-gray-200"
          }`}
        >
          {plan.buttonText}
        </button>
      </div>
    </div>
  )
}

export default function PricingPageAd() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const adAccountId = "act_123456789" // Mock account ID

  const pricingPlans = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for small businesses",
      price: 29,
      period: "month",
      icon: Rocket,
      buttonText: "Start Free Trial",
      features: [
        "Up to 5 active campaigns",
        "Basic AI optimization",
        "Standard audience targeting",
        "Email support",
        "Campaign performance analytics",
        "Ad creative suggestions",
        "Monthly strategy reports",
      ],
    },
    {
      id: "professional",
      name: "Professional",
      description: "For growing marketing teams",
      price: 79,
      originalPrice: 99,
      period: "month",
      icon: Brain,
      buttonText: "Upgrade to Pro",
      features: [
        "Unlimited campaigns",
        "Advanced AI optimization",
        "Custom audience builder",
        "Priority support + live chat",
        "Real-time performance tracking",
        "A/B testing automation",
        "Custom reporting dashboard",
        "Multi-account management",
        "Advanced targeting options",
        "Campaign automation rules",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations",
      price: 199,
      period: "month",
      icon: Crown,
      buttonText: "Upgrade to Enterprise",
      features: [
        "Everything in Professional",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced API access",
        "Team collaboration tools",
        "Custom training sessions",
        "SLA guarantee",
        "Advanced security features",
        "Custom reporting & analytics",
      ],
    },
  ]

  // Initialize PayPal when component mounts
  useEffect(() => {
    if (!selectedPlan) return
    
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`
    script.async = true
    script.onload = () => {
      if (window.paypal && selectedPlan) {
        initializePayPalButton()
      }
    }
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [selectedPlan])

  const initializePayPalButton = () => {
    if (window.paypal && document.getElementById('paypal-button-container')) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: selectedPlan.price,
                currency_code: 'USD'
              },
              description: `AdMaster Pro ${selectedPlan.name} Plan`
            }]
          })
        },
        onApprove: async (data, actions) => {
          try {
            await actions.order.capture()
            
            // Here you would typically update the user's subscription status in your database
            // For demonstration, we'll just show a success message
            setShowSuccessAlert(true)
            setTimeout(() => setShowSuccessAlert(false), 5000)
            
            // Close payment dialog
            setSelectedPlan(null)
          } catch (error) {
            console.error('Payment error:', error)
            setErrorMessage('Error processing payment. Please contact support.')
            setShowErrorAlert(true)
          }
        },
        onError: (err) => {
          console.error('PayPal Error:', err)
          setErrorMessage('There was an error processing your payment. Please try again.')
          setShowErrorAlert(true)
        }
      }).render('#paypal-button-container')
    }
  }

  const handlePlanSelection = (plan) => {
   
    setSelectedPlan(plan)
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Alerts */}
      {showSuccessAlert && (
        <Alert className="fixed top-4 right-4 z-50 bg-green-500/10 border-green-500 w-auto">
          <Check className="h-4 w-4" />
          <AlertTitle>Payment Successful!</AlertTitle>
          <AlertDescription>
            Your {selectedPlan?.name} plan is now active. Thank you for your purchase!
          </AlertDescription>
        </Alert>
      )}

      {showErrorAlert && (
        <Alert className="fixed top-4 right-4 z-50 bg-red-500/10 border-red-500 w-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Sidebar */}
        <Sidebar 
  isOpen={sidebarOpen} 
  onClose={() => setSidebarOpen(false)} 
  
  currentPage="pricing" 
/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-80 transition-all duration-300">
        {/* Header */}
        <header className="border-b border-gray-800/30 bg-gray-950/98 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-900/50 rounded-xl transition-all duration-200"
              >
                <Menu size={20} />
              </button>

              <Link
                href="/"
                className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-900/50 rounded-xl transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </Link>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-200">Pricing Plans</h1>
                  <div className="text-sm text-gray-500">Choose the perfect plan for your business</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {adAccountId && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-sm text-gray-400">Active Account</div>
                  <div className="bg-gray-900/60 border border-gray-700/30 rounded-xl px-4 py-2 text-sm font-mono text-gray-300">
                    {adAccountId}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Pricing Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gray-700/20">
                <Sparkles size={32} className="text-gray-300" />
              </div>
              <h2 className="text-4xl font-bold text-gray-200 mb-4">Supercharge Your Facebook Advertising</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
                Choose the perfect plan to unlock AI-powered campaign optimization, advanced targeting, and unlimited
                growth potential.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Shield size={16} className="text-green-400" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Headphones size={16} className="text-green-400" />
                  <span>24/7 expert support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-green-400" />
                  <span>Trusted by 100+ marketers</span>
                </div>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {pricingPlans.map((plan, index) => (
                <PricingCard 
                  key={index} 
                  plan={plan} 
                  isPopular={index === 1} 
                  onSelectPlan={handlePlanSelection}
                />
              ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-950/95 border border-gray-800/40 rounded-3xl p-8 backdrop-blur-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-200 mb-8 text-center">Frequently Asked Questions</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Can I change plans anytime?</h4>
                    <p className="text-sm text-gray-500">
                      Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">What payment methods do you accept?</h4>
                    <p className="text-sm text-gray-500">
                      We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Is there a free trial?</h4>
                    <p className="text-sm text-gray-500">
                      Yes, all plans come with a 14-day free trial. No credit card required to start.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Do you offer custom solutions?</h4>
                    <p className="text-sm text-gray-500">
                      Contact our sales team for custom Enterprise solutions tailored to your needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* PayPal Dialog */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Upgrade to {selectedPlan.name}</h3>
            <p className="text-[#9ca3af] mb-6">
              You're about to purchase the {selectedPlan.name} plan for ${selectedPlan.price}/{selectedPlan.period}.
            </p>
            
            <div id="paypal-button-container" className="mb-4"></div>
            
            <button
              onClick={() => setSelectedPlan(null)}
              className="w-full py-2 px-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}