"use client"

import { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AnalyzePage() {
  const { isSignedIn, getToken } = useAuth();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Redirect if not signed in
  useEffect(() => {
    if (isSignedIn === false) {
      router.push("/");
    }
  }, [isSignedIn]);

  // Load usage info
  useEffect(() => {
    async function loadUsage() {
      try {
        const token = await getToken();
        const res = await fetch("/api/usage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsage(await res.json());
      } catch (err) {
        console.log("Usage error:", err);
      }
    }

    if (isSignedIn) loadUsage();
  }, [isSignedIn]);

  // File selection
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  }

  // Analyze image
  async function handleAnalyze() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json();
        setError(errJson.detail || "Analysis failed.");
        setLoading(false);
        return;
      }

      const json = await res.json();
      setResult(json.description);

      // Refresh usage
      const usageRes = await fetch("/api/usage", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsage(await usageRes.json());
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                AI Vision Analyzer
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Image Analysis
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Upload your image and let AI reveal its secrets
          </p>
        </div>

        {/* Usage Stats Card */}
        {usage && (
          <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">
                    {usage.tier === "premium" ? "🚀" : "🆓"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Subscription Tier</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {usage.tier === "premium" ? "Premium" : "Free"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Usage</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {usage.limit === "unlimited"
                      ? "Unlimited ✨"
                      : `${usage.analyses_used}/${usage.limit}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 mb-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">📤</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Upload Your Image
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Supported formats: JPG, JPEG, PNG, WEBP • Max size: 5MB
              </p>
            </div>
          </div>

          {/* File Input */}
          <div className="mb-6">
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-violet-500 dark:hover:border-violet-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🖼️</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {file ? file.name : "No file selected"}
                    </p>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="mb-6">
              <p className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>🔍</span> Preview:
              </p>
              <div className="relative">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-w-2xl mx-auto rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="cursor-pointer w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <span>✨</span>
                Analyze Image
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-200 mb-1">
                Analysis Failed
              </h3>
              <p className="text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="mb-8 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-2xl shadow-xl border-2 border-violet-200 dark:border-violet-800 p-8">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  AI Analysis Result
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Here's what our AI discovered in your image
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-violet-200 dark:border-violet-800">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line text-lg">
                {result}
              </p>
            </div>
          </div>
        )}

        {/* Limit Reached Warning */}
        {usage && usage.limit !== "unlimited" && usage.analyses_used >= 1 && !result && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🚫</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
                Free Tier Limit Reached
              </h3>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                You've used your free analysis. Upgrade to Premium for unlimited access and advanced features!
              </p>
              <button className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                Upgrade to Premium 🚀
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}