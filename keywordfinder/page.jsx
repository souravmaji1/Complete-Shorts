"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ScrollArea } from "../../components/ui/scroll-area"
import {
  ArrowLeft,
  Search,
  Plus,
  Copy,
  Check,
  Sparkles,
  Target,
  BarChart3,
  Menu,
  Settings2,
  X,
  Home,
  MessageSquare,
  TrendingUp,
  History,
  Bookmark,
  HelpCircle,
  AlertCircle,
  ChevronDown,
  Zap,
  Star,
  ChevronUp,
  Settings,
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { useRouter } from "next/navigation"
import Image from "next/image"

const Sidebar = ({ isOpen, onClose, adAccountId, currentPage }) => {
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
              <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 py-2 px-4 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-gray-600/10 transition-all duration-200">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function KeywordFinderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [expandedCategory, setExpandedCategory] = useState(null)
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const adAccountId = "act_123456789" // Mock account ID

  const [keywords, setKeywords] = useState([
    {
      category: "Broad Match",
      terms: []
    },
    {
      category: "Phrase Match",
      terms: []
    },
    {
      category: "Exact Match",
      terms: []
    },
    {
      category: "Negative Keywords",
      terms: []
    }
  ]);

  const cleanJsonResponse = (response) => {
    return response.replace(/```json/g, '').replace(/```/g, '').trim();
  };

  const handleFindKeywords = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter a product/service description');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);
    setShowError(false);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Generate Facebook ad keywords for: "${inputText}". 
              Return a valid JSON object with categories and terms arrays. Format:
              {
                "categories": [
                  {
                    "name": "Broad Match",
                    "terms": ["keyword1", "keyword2"]
                  },
                  {
                    "name": "Phrase Match",
                    "terms": ["keyword1", "keyword2"]
                  },
                  {
                    "name": "Exact Match",
                    "terms": ["keyword1", "keyword2"]
                  },
                  {
                    "name": "Negative Keywords",
                    "terms": ["keyword1", "keyword2"]
                  }
                ]
              }`
            }
          ],
          model: "openai/gpt-oss-20b",
          temperature: 0.7,
          max_completion_tokens: 2000,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Invalid response format from API");
      }

      const cleanedContent = cleanJsonResponse(data.choices[0].message.content);
      const parsedResponse = JSON.parse(cleanedContent);
      
      if (!parsedResponse.categories || !Array.isArray(parsedResponse.categories)) {
        throw new Error("Invalid response format - missing categories array");
      }

      const formattedKeywords = parsedResponse.categories.map(category => ({
        category: category.name || "Unnamed Category",
        terms: Array.isArray(category.terms) ? category.terms : []
      }));
      
      setKeywords(formattedKeywords);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      setErrorMessage(error.message || 'Failed to fetch keywords. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(category)
    }
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Alerts */}
      {showSuccess && (
        <Alert className="fixed top-4 right-4 z-50 bg-green-500/10 border-green-500 w-auto">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Keywords generated successfully!
          </AlertDescription>
        </Alert>
      )}

      {showError && (
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
        adAccountId={adAccountId}
        currentPage="keywordfinder" 
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
                  <h1 className="text-xl font-bold text-gray-200">Keyword Finder</h1>
                  <div className="text-sm text-gray-500">Discover high-performing keywords for your campaigns</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Keyword Finder Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gray-700/20">
                <Search size={32} className="text-gray-300" />
              </div>
              <h2 className="text-3xl font-bold text-gray-200 mb-4">AI-Powered Keyword Discovery</h2>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                Generate high-converting keywords for your Facebook ad campaigns based on your product or service.
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-gray-900/60 border border-gray-800/40 rounded-2xl p-6 mb-8 backdrop-blur-sm">
              <div className="mb-6">
                <label htmlFor="product-description" className="block text-sm font-medium text-gray-400 mb-2">
                  Describe your product or service
                </label>
                <textarea
                  id="product-description"
                  rows={4}
                  className="w-full bg-gray-950/80 border border-gray-800/50 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                  placeholder="Example: Premium running shoes for marathon training with extra cushioning and arch support..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              <button
                onClick={handleFindKeywords}
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isLoading
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-gray-700/20"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                    <span>Finding Keywords...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Keywords</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            {keywords.map((group, groupIndex) => (
              <div key={groupIndex} className="bg-gray-900/60 border border-gray-800/40 rounded-xl overflow-hidden mb-4">
                <button
                  onClick={() => toggleCategory(group.category)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-gray-800/30 hover:bg-gray-800/40 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <Target size={18} className="text-gray-400" />
                    <span className="font-medium text-gray-300">{group.category}</span>
                  </div>
                  {expandedCategory === group.category ? (
                    <ChevronUp size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                </button>
                
                {expandedCategory === group.category && (
                  <div className="p-5">
                    {group.terms.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {group.terms.map((term, termIndex) => (
                          <div
                            key={termIndex}
                            className="relative group bg-gray-800/40 border border-gray-700/50 rounded-lg px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors duration-200"
                          >
                            {term}
                            <button
                              onClick={() => copyToClipboard(term, `${groupIndex}-${termIndex}`)}
                              className="absolute -top-2 -right-2 p-1.5 bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              title="Copy to clipboard"
                            >
                              {copiedIndex === `${groupIndex}-${termIndex}` ? (
                                <Check size={14} className="text-green-400" />
                              ) : (
                                <Copy size={14} className="text-gray-400 hover:text-gray-300" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No keywords generated for this category yet</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Tips Section */}
            <div className="bg-gray-900/60 border border-gray-800/40 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-200 mb-4">Keyword Research Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Plus size={14} className="text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300">Be Specific</h4>
                      <p className="text-sm text-gray-500">
                        Include details like product features, benefits, and use cases to get more targeted keywords.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Target size={14} className="text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300">Match Types</h4>
                      <p className="text-sm text-gray-500">
                        Use broad match for discovery, phrase match for relevance, and exact match for precision.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <BarChart3 size={14} className="text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300">Negative Keywords</h4>
                      <p className="text-sm text-gray-500">
                        Exclude irrelevant terms to improve ad relevance and reduce wasted spend.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <TrendingUp size={14} className="text-yellow-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-300">Test & Refine</h4>
                      <p className="text-sm text-gray-500">
                        Continuously test new keywords and refine based on performance data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}