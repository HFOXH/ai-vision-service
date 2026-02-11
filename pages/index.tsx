import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-950 font-sans`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                AI Vision Analyzer
              </span>
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/analyze">
                  <button className="cursor-pointer px-4 py-2 text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                    Go to Analyzer
                  </button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Analyze Images
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">with AI Power</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Transform your images into detailed insights using cutting-edge AI vision technology. Upload, analyze, and discover in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="cursor-pointer px-8 py-4 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all">
                  Get Started Free
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/analyze">
                <button className="cursor-pointer px-8 py-4 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all">
                  Start Analyzing
                </button>
              </Link>
            </SignedIn>
            <a href="#features">
              <button className="cursor-pointer px-8 py-4 text-lg font-semibold border-2 border-violet-600 text-violet-600 dark:text-violet-400 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all">
                Learn More
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-black/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Powerful Features
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Everything you need to unlock the secrets hidden in your images
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-2xl border border-violet-100 dark:border-violet-900 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Lightning Fast Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get detailed AI-powered descriptions of your images in seconds using state-of-the-art GPT-4o-mini vision model.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/30 rounded-2xl border border-fuchsia-100 dark:border-fuchsia-900 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enterprise-grade authentication with Clerk ensures your images and data remain completely private and secure.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Detailed Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive comprehensive descriptions including objects, colors, mood, composition, and notable features in every image.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Simple Pricing
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Choose the plan that fits your needs
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Free</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">$0</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">1 image analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Basic AI analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">Secure upload</span>
                </li>
              </ul>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="cursor-pointer w-full px-6 py-3 text-lg font-semibold border-2 border-violet-600 text-violet-600 dark:text-violet-400 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all">
                    Start Free
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/analyze">
                  <button className="cursor-pointer w-full px-6 py-3 text-lg font-semibold border-2 border-violet-600 text-violet-600 dark:text-violet-400 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all">
                    Go to Analyzer
                  </button>
                </Link>
              </SignedIn>
            </div>

            {/* Premium Tier */}
            <div className="p-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl shadow-2xl transform hover:scale-105 transition-all relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-fuchsia-500 text-white text-sm font-bold rounded-full">
                POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">Premium</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$5</span>
                  <span className="text-violet-100">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-white text-xl">✓</span>
                  <span className="text-white font-medium">Unlimited analyses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white text-xl">✓</span>
                  <span className="text-white font-medium">Advanced descriptions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white text-xl">✓</span>
                  <span className="text-white font-medium">Priority processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white text-xl">✓</span>
                  <span className="text-white font-medium">Premium support</span>
                </li>
              </ul>
              <button className="cursor-pointer w-full px-6 py-3 text-lg font-semibold bg-white text-violet-600 rounded-xl hover:bg-gray-100 transition-all shadow-lg">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              AI Vision Analyzer
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Powered by OpenAI GPT-4o-mini Vision API
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © 2026 AI Vision Analyzer. Built for AIE1018 - Cambrian College
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Made by Santiago Cardenas
          </p>
        </div>
      </footer>
    </div>
  );
}