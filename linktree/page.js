import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Sparkles,
  Play,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Brain,
} from "lucide-react"
import { ScrollArea } from "../components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
      <ScrollArea className="h-screen w-screen">
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-gray-950/98 border-b border-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-600/20">
                <div className="w-10 h-10 relative">
                        <Image 
                          src="/goblin.png"
                          alt="Gobler Pro Logo"
                          width={50}
                          height={50}
                          className="rounded-2xl"
                        />
                      </div>
              </div>
              <span className="text-xl font-bold text-gray-200">Gobler</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-gray-300 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-400 hover:text-gray-300 transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-400 hover:text-gray-300 transition-colors">
                Pricing
              </a>
              <Link href='/connection'>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-900/60 border-gray-700/40 text-gray-300 hover:bg-gray-800/60"
              >
                Sign In
              </Button>
              </Link>
                <Link href='/connection'>
              <Button
                size="sm"
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600 shadow-lg shadow-gray-600/20"
              >
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-gray-900/60 border border-gray-700/40 text-gray-300">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Ad Creation
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-100">
            Create High-Converting
            <br />
            <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
              Ads in Seconds
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto font-manrope">
            Transform your advertising with AI that understands your brand, analyzes your audience, and generates
            compelling ads that drive results across all platforms.
          </p>

          <div className="mb-12 relative">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-700/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gray-900/60 border border-gray-800/40 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/20">
                <img
                  src="/gobler.PNG"
                  alt="AI Brain creating ads"
                  className="w-full h-88 object-cover rounded-2xl border border-gray-700/30"
                />
                <div className="absolute top-4 right-4 bg-gray-950/90 border border-gray-700/40 rounded-xl px-3 py-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">AI Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href='/connection'>
            <Button
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600 shadow-lg shadow-gray-600/20"
            >
              Start Creating Ads <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            </Link>
            <Link href='#demo'>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg bg-gray-900/60 border-gray-700/40 text-gray-300 hover:bg-gray-800/60"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-200 mb-2">10M+</div>
              <div className="text-gray-400 font-manrope">Ads Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-200 mb-2">300%</div>
              <div className="text-gray-400 font-manrope">Average CTR Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-200 mb-2">50K+</div>
              <div className="text-gray-400 font-manrope">Happy Businesses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-100">
              Everything You Need to
              <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                {" "}
                Dominate Advertising
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-manrope">
              Our AI platform combines cutting-edge technology with proven marketing strategies to deliver ads that
              convert.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="relative mb-4">
                 
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent rounded-xl"></div>
                  <div className="absolute bottom-2 left-2 w-10 h-10 bg-gray-900/90 border border-gray-800/30 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
                <CardTitle className="text-gray-200">Smart Targeting</CardTitle>
                <CardDescription className="font-manrope text-gray-400">
                  AI analyzes your audience data to identify the perfect targeting parameters for maximum reach and
                  engagement.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="relative mb-4">
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent rounded-xl"></div>
                  <div className="absolute bottom-2 left-2 w-10 h-10 bg-gray-900/90 border border-gray-800/30 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
                <CardTitle className="text-gray-200">Creative Generation</CardTitle>
                <CardDescription className="font-manrope text-gray-400">
                  Generate unlimited ad variations with compelling copy, stunning visuals, and optimized layouts in
                  seconds.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="relative mb-4">
              {/*    <img
                    src="/modern-analytics-dashboard.png"
                    alt="Performance Analytics"
                    className="w-full h-32 object-cover rounded-xl border border-gray-700/30"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent rounded-xl"></div>
                  <div className="absolute bottom-2 left-2 w-10 h-10 bg-gray-900/90 border border-gray-800/30 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
                <CardTitle className="text-gray-200">Performance Analytics</CardTitle>
                <CardDescription className="font-manrope text-gray-400">
                  Real-time insights and optimization suggestions to continuously improve your ad performance and ROI.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-900/90 border border-gray-800/30 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-gray-300" />
                </div>
                <CardTitle className="text-gray-200">Multi-Platform</CardTitle>
                <CardDescription className="font-manrope text-gray-400">
                  Create ads optimized for Facebook, Google, Instagram, LinkedIn, and more from a single dashboard.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-900/90 border border-gray-800/30 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-gray-300" />
                </div>
                <CardTitle className="text-gray-200">A/B Testing</CardTitle>
                <CardDescription className="font-manrope text-gray-400">
                  Automatically test multiple ad variations and optimize for the highest performing creative
                  combinations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-900/90 border border-gray-800/30 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-gray-300" />
                </div>
                <CardTitle className="text-gray-200">Brand Consistency</CardTitle>
                <CardDescription className="font-manrope text-gray-400">
                  Maintain your brand voice and visual identity across all campaigns with intelligent brand guidelines.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
     {/* Video Demo Section */}
<section id='demo' className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/20">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-100">
        See Gobler AI in{" "}
        <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Action</span>
      </h2>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto font-manrope">
        Watch how our AI creates high-converting ads in under 60 seconds
      </p>
    </div>

    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-gray-700/10 rounded-3xl blur-2xl"></div>
      <div className="relative bg-gray-950/95 border border-gray-800/40 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/20">
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-700/30">
          {/* Replace the image with a video element */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            poster="/fast-digital-setup.png" // Fallback poster image
          >
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Keep the play button overlay for UX */}
          <div className="absolute inset-0 bg-black/0 flex items-center justify-center group cursor-pointer hover:bg-black/30 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-2xl shadow-gray-600/30 group-hover:scale-110 transition-transform duration-300 opacity-0 group-hover:opacity-100">
              <Play className="w-8 h-8 text-gray-100 ml-1" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">Live Demo</span>
            </div>
            <div className="text-sm text-gray-400">2:34 duration</div>
          </div>
          <Button className="bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600">
            <Play className="w-4 h-4 mr-2" />
            Watch Full Demo
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-100">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-manrope">
              See how businesses are transforming their advertising with AdCraft AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gray-300 text-gray-300" />
                  ))}
                </div>
                <CardDescription className="text-lg font-manrope text-gray-300">
                  "AdCraft AI increased our conversion rates by 400% in just 30 days. The AI understands our brand
                  better than we do!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <img
                    src="/prof.jpg"
                    alt="Sarah Johnson"
                    className="w-12 h-12 rounded-full border-2 border-gray-700/40"
                  />
                  <div>
                    <div className="font-semibold text-gray-200">Sarah Johnson</div>
                    <div className="text-sm text-gray-400">CMO, TechStart Inc.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gray-300 text-gray-300" />
                  ))}
                </div>
                <CardDescription className="text-lg font-manrope text-gray-300">
                  "We've cut our ad creation time by 90% while improving performance. This is the future of
                  advertising."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <img
                    src="/vin.jpg"
                    alt="Michael Rodriguez"
                    className="w-12 h-12 rounded-full border-2 border-gray-700/40"
                  />
                  <div>
                    <div className="font-semibold text-gray-200">Michael Rodriguez</div>
                    <div className="text-sm text-gray-400">Founder, GrowthCo</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gray-300 text-gray-300" />
                  ))}
                </div>
                <CardDescription className="text-lg font-manrope text-gray-300">
                  "The ROI we're seeing is incredible. AdCraft AI pays for itself within the first week of use."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <img
                    src="/cor.jpg"
                    alt="Emily Liu"
                    className="w-12 h-12 rounded-full border-2 border-gray-700/40"
                  />
                  <div>
                    <div className="font-semibold text-gray-200">Emily Liu</div>
                    <div className="text-sm text-gray-400">Marketing Director, RetailPlus</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-100">
              Simple{" "}
              <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-manrope">
              Choose the perfect plan for your business. All plans include unlimited ad variations and 24/7 support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105 group relative">
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-gray-900/90 border border-gray-800/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-gray-300" />
                </div>
                <CardTitle className="text-2xl text-gray-200 mb-2">Starter</CardTitle>
                <CardDescription className="font-manrope text-gray-400 mb-6">
                  Perfect for small businesses getting started
                </CardDescription>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-100 mb-2">$19</div>
                  <div className="text-gray-400 font-manrope">per month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">Up to 100 ads per month</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">2 social media platforms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">Basic analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">Email support</span>
                </div>
                <div className="pt-6">
                  <Link href='/pricing'>
                  <Button className="w-full bg-gray-900/60 border border-gray-700/40 text-gray-300 hover:bg-gray-800/60 transition-all duration-300">
                    Start Free Trial
                  </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Professional Plan - Most Popular */}
            <Card className="bg-gray-950/95 border-2 border-gray-600/40 backdrop-blur-xl shadow-2xl shadow-gray-600/20 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105 group relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 px-4 py-1 shadow-lg shadow-gray-600/20">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-600/20">
                  <Target className="w-6 h-6 text-gray-100" />
                </div>
                <CardTitle className="text-2xl text-gray-200 mb-2">Professional</CardTitle>
                <CardDescription className="font-manrope text-gray-400 mb-6">
                  Ideal for growing businesses and agencies
                </CardDescription>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-100 mb-2">$29</div>
                  <div className="text-gray-400 font-manrope">per month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">Up to 300 ads per month</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">4 Social Media Platforms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">Advanced analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">Early access to new Features</span>
                </div>
                <div className="pt-6">
                  <Link href='/pricing'>
                  <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600 shadow-lg shadow-gray-600/20">
                    Start Free Trial
                  </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 hover:bg-gray-900/60 transition-all duration-300 hover:scale-105 group relative">
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-gray-900/90 border border-gray-800/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-gray-300" />
                </div>
                <CardTitle className="text-2xl text-gray-200 mb-2">Enterprise</CardTitle>
                <CardDescription className="font-manrope text-gray-400 mb-6">
                  For large organizations with custom needs
                </CardDescription>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-100 mb-2">$49</div>
                  <div className="text-gray-400 font-manrope">per month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">upto 700 ads per month</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">4 platforms + API access</span>
                </div>
               
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">Dedicated account manager</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-manrope">White-label solutions</span>
                </div>
                <div className="pt-6">
                <Link href='/pricing'>  
                  <Button className="w-full bg-gray-900/60 border border-gray-700/40 text-gray-300 hover:bg-gray-800/60 transition-all duration-300">
                    Start Free Trial
                  </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing FAQ */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 font-manrope mb-6">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 font-manrope">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-100">
            Ready to{" "}
            <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Transform</span>{" "}
            Your Advertising?
          </h2>
          <p className="text-xl text-gray-400 mb-8 font-manrope">
            Join thousands of businesses already using AdCraft AI to create high-converting ads that drive real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
           <Link href='/connection'>
            <Button
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600 shadow-lg shadow-gray-600/20"
            >
              Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            </Link>
           
          </div>
          <p className="text-sm text-gray-500 mt-4 font-manrope">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/20 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-600/20">
              <div className="w-10 h-10 relative">
                      <Image 
                        src="/goblin.png"
                        alt="Gobler Pro Logo"
                        width={50}
                        height={50}
                        className="rounded-2xl"
                      />
                    </div>
              </div>
              <span className="text-xl font-bold text-gray-200">Gobler</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400 font-manrope">
              <a href="/legal" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="/legal" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </a>
              <a href="/legal" className="hover:text-gray-300 transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800/30 text-center text-sm text-gray-500 font-manrope">
            © 2025 Gobler. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
    </ScrollArea>
  )
}
