import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ScrollArea } from "../../components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export default function LegalPage() {
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
                      alt="Goblin Pro Logo"
                      width={50}
                      height={50}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-200">Goblin</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-400 hover:text-gray-300 transition-colors">
                  Home
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-900/60 border-gray-700/40 text-gray-300 hover:bg-gray-800/60"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600 shadow-lg shadow-gray-600/20"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-100">
                Legal & <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">Contact</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Complete information about our policies and how to reach us
              </p>
            </div>

            {/* Privacy Policy - Full Content */}
            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 mb-12">
              <CardHeader>
                <CardTitle className="text-3xl text-gray-200 mb-2">Privacy Policy</CardTitle>
                <CardDescription className="text-gray-400">
                  Last updated: June 15, 2025
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">1. Information We Collect</h3>
                  <p className="mb-4">
                    We collect several different types of information for various purposes to provide and improve our service to you.
                  </p>
                  <h4 className="font-medium text-gray-200 mb-2">Personal Data</h4>
                  <p className="mb-4">
                    While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Address, State, Province, ZIP/Postal code, City</li>
                    <li>Cookies and Usage Data</li>
                  </ul>
                  <h4 className="font-medium text-gray-200 mb-2">Usage Data</h4>
                  <p>
                    We may also collect information how the service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">2. Use of Data</h3>
                  <p className="mb-4">
                    Goblin uses the collected data for various purposes:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>To provide and maintain our service</li>
                    <li>To notify you about changes to our service</li>
                    <li>To allow you to participate in interactive features of our service when you choose to do so</li>
                    <li>To provide customer support</li>
                    <li>To gather analysis or valuable information so that we can improve our service</li>
                    <li>To monitor the usage of our service</li>
                    <li>To detect, prevent and address technical issues</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">3. Data Security</h3>
                  <p className="mb-4">
                    The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                  </p>
                  <p>
                    We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including encryption of data in transit and at rest, regular security audits, and strict access controls.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">4. Your Data Protection Rights</h3>
                  <p className="mb-4">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Access:</strong> You have the right to request copies of your personal data.</li>
                    <li><strong>Rectification:</strong> You have the right to request correction of any information you believe is inaccurate.</li>
                    <li><strong>Erasure:</strong> You have the right to request deletion of your personal data, under certain conditions.</li>
                    <li><strong>Restriction:</strong> You have the right to request restriction of processing your personal data.</li>
                    <li><strong>Objection:</strong> You have the right to object to our processing of your personal data.</li>
                    <li><strong>Portability:</strong> You have the right to request transfer of your data to another organization.</li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us using the information in the Contact section below.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Conditions - Full Content */}
            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 mb-12">
              <CardHeader>
                <CardTitle className="text-3xl text-gray-200 mb-2">Terms & Conditions</CardTitle>
                <CardDescription className="text-gray-400">
                  Effective from: June 15, 2025
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">1. Account Terms</h3>
                  <p className="mb-4">
                    By creating an account with us, you agree to the following:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>You must be at least 18 years of age or the age of majority in your jurisdiction to use our service.</li>
                    <li>You must provide accurate and complete information when creating your account.</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                    <li>You are responsible for all activities that occur under your account.</li>
                    <li>You must notify us immediately of any unauthorized use of your account.</li>
                    <li>We reserve the right to refuse service, terminate accounts, or remove/edit content at our sole discretion.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">2. Payment & Billing</h3>
                  <p className="mb-4">
                    Our service is offered as both free and paid subscription plans:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>All fees are quoted in U.S. Dollars and are exclusive of applicable taxes.</li>
                    <li>Payment obligations are non-cancelable and fees paid are non-refundable except as required by law.</li>
                    <li>We may change our prices by giving you at least 30 days notice before the change takes effect.</li>
                    <li>Your continued use of the service after the price change constitutes your agreement to pay the new amount.</li>
                    <li>If you don't agree to the price changes, you must cancel your subscription before the changes take effect.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">3. Content Ownership</h3>
                  <p className="mb-4">
                    Regarding content created or uploaded through our service:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>You retain ownership of all content you create or upload to our service.</li>
                    <li>By using our service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content solely for the purpose of providing the service to you.</li>
                    <li>You represent and warrant that you have all necessary rights to any content you upload and that such content does not violate any laws or third-party rights.</li>
                    <li>We reserve the right to remove any content that we determine in our sole discretion violates these terms or is otherwise harmful to our service.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">4. Prohibited Conduct</h3>
                  <p className="mb-4">
                    You agree not to engage in any of the following prohibited activities:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Using the service for any illegal purpose or in violation of any laws</li>
                    <li>Violating or encouraging others to violate any third-party rights</li>
                    <li>Interfering with the operation of the service or any user's enjoyment of the service</li>
                    <li>Performing any fraudulent activity including impersonating any person or entity</li>
                    <li>Attempting to circumvent any content-filtering techniques we employ</li>
                    <li>Attempting to access any other user's account</li>
                    <li>Using the service to distribute spam or unsolicited commercial communications</li>
                    <li>Harvesting or collecting information about users without their consent</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">5. Termination</h3>
                  <p className="mb-4">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
                  </p>
                  <p className="mb-4">
                    Upon termination, your right to use the service will immediately cease. If you wish to terminate your account, you may simply discontinue using the service or delete your account through your account settings.
                  </p>
                  <p>
                    All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-gray-950/95 border border-gray-800/40 backdrop-blur-xl shadow-lg shadow-black/10 mb-12">
              <CardHeader>
                <CardTitle className="text-3xl text-gray-200 mb-2">Contact Us</CardTitle>
                <CardDescription className="text-gray-400">
                  We're here to help with any questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-900/60 border border-gray-700/40 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-200">Email Support</h3>
                    <p className="text-lg text-gray-400">support@goblin.ai</p>
                    <p className="text-sm text-gray-500 mt-2">For general inquiries, technical support, and account assistance</p>
                    <p className="text-sm text-gray-500">Typically responds within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-900/60 border border-gray-700/40 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-200">Phone Support</h3>
                    <p className="text-lg text-gray-400">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500 mt-2">For urgent matters and premium support</p>
                    <p className="text-sm text-gray-500">Monday-Friday, 9:00 AM - 5:00 PM PST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-900/60 border border-gray-700/40 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-200">Our Office</h3>
                    <p className="text-lg text-gray-400">123 Tech Street</p>
                    <p className="text-lg text-gray-400">San Francisco, CA 94107</p>
                    <p className="text-sm text-gray-500 mt-2">United States</p>
                  </div>
                </div>

                <div className="pt-4">
                 
                </div>
              </CardContent>
            </Card>

            {/* Additional Legal Section */}
           
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
                      alt="Goblin Pro Logo"
                      width={50}
                      height={50}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-200">Goblin</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <Link href="#" className="hover:text-gray-300 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-gray-300 transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-gray-300 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800/30 text-center text-sm text-gray-500">
              © 2025 Goblin. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </ScrollArea>
  )
}