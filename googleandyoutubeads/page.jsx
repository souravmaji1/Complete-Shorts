"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"
import {
  ArrowLeft,
  Send,
  Loader2,
  Zap,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Settings,
  ChevronRight,
  User,
  Menu,
  X,
  Home,
  History,
  Bookmark,
  HelpCircle,
  MessageSquare,
  TrendingUp,
  Target,
  Settings2,
  BarChart3,
  Plus,
  Star,
  Brain,
  Sparkles,
} from "lucide-react"
import { ScrollArea } from "../../components/ui/scroll-area"
import { createGoogleAdsCreatorAgent } from "../../lib/agents"
import { useAdContext } from "../../lib/Allcontext" // Updated import
import Image from "next/image"

/* ---------------- reusable component ---------------- */
const ToolCallBox = ({ toolCall }) => {
  const [expanded, setExpanded] = useState(false)

  const statusConfig = {
    executing: {
      icon: <Loader2 className="animate-spin" size={14} />,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    success: {
      icon: <CheckCircle size={14} />,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    error: {
      icon: <AlertCircle size={14} />,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  }

  const cfg = statusConfig[toolCall.status] || statusConfig.executing

  return (
    <div className={`mt-4 group hover:scale-[1.01] transition-all duration-300 ease-out`}>
      <div
        className={`p-4 rounded-2xl border backdrop-blur-xl ${cfg.bg} ${cfg.border} shadow-lg shadow-black/10 bg-gray-950/80`}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-3 text-sm w-full hover:opacity-80 transition-all duration-200"
        >
          <div className="p-1.5 rounded-lg bg-gray-900/90 border border-gray-800/30">
            <Settings size={12} className="text-gray-400" />
          </div>
          <span className="font-semibold text-gray-200 flex-1 text-left">{toolCall.name}</span>
          <div
            className={`flex items-center space-x-2 text-xs px-3 py-1.5 rounded-xl ${cfg.bg} ${cfg.border} border shadow-inner`}
          >
            {cfg.icon}
            <span className={`font-medium ${cfg.color}`}>{toolCall.status}</span>
          </div>
          <div className="p-1">
            {expanded ? (
              <ChevronDown size={14} className="text-gray-400 transition-transform duration-200" />
            ) : (
              <ChevronRight size={14} className="text-gray-400 transition-transform duration-200" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="mt-4 space-y-3 text-xs animate-in slide-in-from-top-2 duration-300">
            <div className="bg-gray-950/95 rounded-xl p-4 border border-gray-800/40 backdrop-blur-sm">
              <div className="text-gray-400 mb-2 font-medium">Arguments:</div>
              <pre className="text-gray-300 overflow-x-auto leading-relaxed">
                {JSON.stringify(toolCall.args, null, 2)}
              </pre>
            </div>
            {toolCall.result && (
              <div className="bg-green-950/30 rounded-xl p-4 border border-green-500/20 backdrop-blur-sm">
                <div className="text-green-400 mb-2 font-medium">Result:</div>
                <pre className="text-green-300 overflow-x-auto leading-relaxed">
                  {JSON.stringify(toolCall.result, null, 2)}
                </pre>
              </div>
            )}
            {toolCall.error && (
              <div className="bg-red-950/30 rounded-xl p-4 border border-red-500/20 backdrop-blur-sm">
                <div className="text-red-400 mb-2 font-medium">Error:</div>
                <pre className="text-red-300 overflow-x-auto leading-relaxed">{toolCall.error}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`flex items-start space-x-4 group ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
          isUser
            ? "bg-gradient-to-br from-gray-600 to-gray-700 shadow-gray-600/20"
            : "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/30 shadow-gray-900/20"
        }`}
      >
         {isUser ? (
          <User size={18} className="text-gray-200" />
        ) : (
          <div className="w-10 h-10 relative">
            <Image 
              src="/goblin.png" 
              alt="Gobler Pro Logo"
              width={40}
              height={40}
              className="rounded-2xl"
            />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`max-w-2xl ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-3xl px-6 py-4 transition-all duration-300 group-hover:shadow-lg ${
            isUser
              ? "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 shadow-lg shadow-gray-700/10"
              : "bg-gray-950/95 border border-gray-800/40 text-gray-200 shadow-lg shadow-black/10 backdrop-blur-xl"
          }`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
          {message.tools?.map((tool, idx) => (
            <ToolCallBox key={`${message.id}-${idx}`} toolCall={tool} />
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

const Sidebar = ({ isOpen, onClose, customerId, currentPage = "googleandyoutubeads" }) => {
  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "" },
    { icon: MessageSquare, label: "Chat", path: "googleandyoutubeads" },
   { icon: Settings2, label: "Connection", path: "connection" },
  ];

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
                <div className="w-10 h-10 relative">
                  <Image 
                    src="/goblin.png"
                    alt="Gobler Pro Logo"
                    width={50}
                    height={50}
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-200">Gobler Pro</h2>
                  <div className="text-xs text-gray-500">AI-Powered Assistant</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-900/50 rounded-lg transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {customerId && (
              <div className="bg-gray-900/60 border border-gray-700/30 rounded-xl p-3">
                <div className="text-xs text-gray-400 mb-1">Connected Account</div>
                <div className="font-mono text-sm text-gray-300 truncate">{customerId}</div>
                <div className="flex items-center space-x-1 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Active</span>
                </div>
              </div>
            )}
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
  );
};

/* ---------------- page component ---------------- */
export default function GoogleAdsChatPage() {
  const { googleAds } = useAdContext() // Using the new AdContext
  const router = useRouter()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const agentRef = useRef(null)

  useEffect(() => {
    if (!agentRef.current) agentRef.current = createGoogleAdsCreatorAgent()
  }, [])

  useEffect(() => {
    // Check if we have the required connection data
    if (!googleAds.customerId || !googleAds.refreshToken || !googleAds.isConnected) {
      router.push("/connection")
    }
  }, [googleAds.customerId, googleAds.refreshToken, googleAds.isConnected, router])

  useEffect(() => {
    if (messages.length === 0 && googleAds.customerId) {
      setMessages([
        {
          id: uuidv4(),
          role: "assistant",
          content: `🚀 Welcome to Google Gobler Pro! I'm your AI-powered advertising assistant ready to transform your marketing campaigns.\n\n✨ Here's what I can help you achieve:\n\n📊 Create high-converting campaigns\n🎯 Build precision keyword targeting\n💰 Optimize your ad spend and budget\n📈 Analyze performance metrics\n🔧 Manage your ad creative assets\n\nLet's create something amazing together! What's your advertising goal today?`,
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }, [googleAds.customerId, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !agentRef.current) return;

    console.log('=== Starting request ===');
    console.log('Input:', input);
    console.log('Context:', { 
      customerId: googleAds.customerId, 
      managerId: googleAds.managerId 
    });

    setError(null);
    const userMsg = {
      id: uuidv4(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const stream = await agentRef.current.chat(input, {
        customerId: googleAds.customerId,
        managerId: googleAds.managerId,
        refreshToken: googleAds.refreshToken,
      });

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      console.log('=== Stream opened ===');

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('=== Stream complete ===');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log('Raw chunk:', chunk);

        for (const line of chunk.split("\n").filter(Boolean)) {
          const raw = line.replace(/^data:\s*/, "");
          if (!raw || raw === "end") continue;

          console.log('Processing line:', raw);

          try {
            const ev = JSON.parse(raw);
            console.log('Parsed event:', ev);

            if (ev.type === "content") {
              console.log('Content update:', ev.content);
              assistantMessage.content += ev.content;
              setMessages(prev => {
                const existing = prev.find(m => m.id === assistantMessage.id);
                if (existing) {
                  return prev.map(m => 
                    m.id === assistantMessage.id ? {...m, content: assistantMessage.content} : m
                  );
                }
                return [...prev, assistantMessage];
              });
            } 
            else if (ev.type === "error") {
              console.error('Error event:', ev.message);
              setError(ev.message);
            }
            else if (ev.type === "campaign") {
              console.log('Campaign data received:', ev.campaign);
              // Safely handle campaign data
              if (ev.campaign) {
                let campaignDetails = `\n\n🔍 Campaign Details\n\n`;
                campaignDetails += `ID: ${ev.campaign.id || 'N/A'}\n`;
                campaignDetails += `Name: ${ev.campaign.name || 'N/A'}\n`;
                campaignDetails += `Status: ${ev.campaign.status || 'N/A'}\n`;
                
                // Safely access nested properties
                if (ev.campaign.budget) {
                  campaignDetails += `Budget: $${ev.campaign.budget.amount || '0'} (${ev.campaign.budget.delivery || 'N/A'})\n`;
                }
                
                if (ev.campaign.metrics) {
                  campaignDetails += `\n📊 Performance:\n`;
                  campaignDetails += `Clicks: ${ev.campaign.metrics.clicks || '0'}\n`;
                  campaignDetails += `Impressions: ${ev.campaign.metrics.impressions || '0'}\n`;
                }

                assistantMessage.content += campaignDetails;
                setMessages(prev => prev.map(m => 
                  m.id === assistantMessage.id ? {...m, content: assistantMessage.content} : m
                ));
              }
            }
            else if (ev.type === "tool-result") {
              console.log('Tool result:', ev.result);
              // Handle tool results if needed
            }
            else {
              console.log('Unhandled event type:', ev.type);
            }
          } catch (err) {
            console.error("Error parsing event:", err, "\nRaw data:", raw);
            setError("Failed to parse server response");
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "An error occurred while processing your request");
    } finally {
      setIsLoading(false);
      console.log('=== Request completed ===');
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      
      <Sidebar 
  isOpen={sidebarOpen} 
  onClose={() => setSidebarOpen(false)} 
  customerId={googleAds.customerId}
  currentPage="googleandyoutubeads" 
/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-80 transition-all duration-300">
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
                href="/connect"
                className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-900/50 rounded-xl transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </Link>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-200">AI Campaign Assistant</h1>
                  <div className="text-sm text-gray-500">Intelligent Google Advertising</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {googleAds.customerId && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-sm text-gray-400">Active Account</div>
                  <div className="bg-gray-900/60 border border-gray-700/30 rounded-xl px-4 py-2 text-sm font-mono text-gray-300">
                    {googleAds.customerId}
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

        {/* Chat Messages */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto px-6 py-8">
              {/* Welcome Message for Empty State */}
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gray-700/20">
                    <Sparkles size={32} className="text-gray-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-200 mb-4">Ready to Create Amazing Ads?</h2>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Connect your Google Ads account to start building high-converting campaigns with AI assistance.
                  </p>
                </div>
              )}

              {/* Messages */}
              <div className="space-y-8">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} isUser={msg.role === "user"} />
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/30 flex items-center justify-center shadow-lg">
                      <div className="w-10 h-10 relative">
                        <Image 
                          src="/goblin.png"
                          alt="Gobler Pro Logo"
                          width={40}
                          height={40}
                          className="rounded-2xl"
                        />
                      </div>
                    </div>
                    <div className="bg-gray-950/95 border border-gray-800/40 rounded-3xl px-6 py-4 backdrop-blur-xl shadow-lg">
                      <div className="flex items-center space-x-3 text-gray-400">
                        <Loader2 size={18} className="animate-spin text-gray-300" />
                        <span className="text-sm font-medium">AI is thinking...</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>

          {/* Error Display */}
          {error && (
            <div className="mx-6 mb-4">
              <div className="max-w-4xl mx-auto bg-red-950/30 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2 text-red-400 text-sm font-medium mb-1">
                  <AlertCircle size={16} />
                  <span>Error</span>
                </div>
                <div className="text-sm text-red-300 whitespace-pre-wrap">{error}</div>
                {error.includes("Missing") && (
                  <div className="mt-2 text-xs text-red-400">
                    Please provide all required information and try again.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-gray-800/30 bg-gray-950/98 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto px-6 py-6">
              <div className="relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                    placeholder={
                      googleAds.customerId
                        ? "Ask me anything about your Google ads..."
                        : "Connect your Google Ads account to get started"
                    }
                    disabled={!googleAds.customerId || isLoading}
                    className="w-full bg-gray-900/60 border border-gray-800/40 focus:border-gray-700/60 rounded-3xl px-6 py-4 pr-16 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700/30 transition-all duration-200 backdrop-blur-sm shadow-lg"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading || !googleAds.customerId}
                    className={`absolute right-2 p-3 rounded-2xl transition-all duration-200 shadow-lg ${
                      !input.trim() || isLoading || !googleAds.customerId
                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600 shadow-gray-600/20 hover:shadow-gray-600/30 hover:scale-105"
                    }`}
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>AI Assistant Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap size={12} className="text-gray-400" />
                    <span>10 AI runs remaining</span>
                  </div>
                </div>
                <div className="hidden sm:block">Powered by advanced AI • Terms & Privacy Apply</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}