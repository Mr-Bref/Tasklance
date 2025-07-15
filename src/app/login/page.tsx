"use client";
import { CheckCircle, Users, Zap } from "lucide-react";
import React, { Suspense } from "react";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
        {/* Background Pattern */}
       
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 backdrop-blur-sm text-white flex size-12 items-center justify-center rounded-xl">
                <Zap className="size-7" />
              </div>
              <h1 className="text-3xl font-bold">Tasklance</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Manage your projects with ease
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Collaborate seamlessly, track progress efficiently, and deliver exceptional results.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <CheckCircle className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">Smart Task Management</h3>
                <p className="text-green-100 text-sm">Organize and prioritize your work efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Users className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">Team Collaboration</h3>
                <p className="text-green-100 text-sm">Work together in real-time with your team</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Zap className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="text-green-100 text-sm">Built for speed and performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="bg-green-600 text-white flex size-10 items-center justify-center rounded-xl">
              <Zap className="size-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Tasklance</h1>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            }>
              <LoginForm />
            </Suspense>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                  Sign up for free
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 Tasklance. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
