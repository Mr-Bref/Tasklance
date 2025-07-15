"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: any) => {
    setErrorMsg("");
    try {
      const { error } = await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
        },
        {
          onRequest: () => {},
          onSuccess: () => {
            window.location.href = callbackUrl;
          },
          onError: (ctx) => {
            setErrorMsg(ctx.error?.message || "Registration failed.");
          },
        }
      );
      if (error) {
        setErrorMsg(error.message || "Registration failed.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Unexpected error.");
    }
  };

  const handleSocialRegister = async (provider: "google") => {
    try {
      const { error } = await authClient.signIn.social(
        { provider, callbackURL: callbackUrl },
        {
          onRequest: () => {
            console.log(`Trying to sign in with ${provider}...`);
          },
          onSuccess: (ctx) => {
            console.log(`Success with ${provider}.`, ctx.data);
            window.location.href = callbackUrl;
          },
          onError: (ctx) => {
            console.error(`Error with ${provider}:`, ctx.error);
          },
        }
      );
      if (error) {
        console.error(`Auth error with ${provider}:`, error);
      }
    } catch (err) {
      console.error(`Exception with ${provider}:`, err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="space-y-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your full name"
              className="h-12 bg-white/70 border-green-200 focus:border-green-500 focus:ring-green-500"
              {...register("name", {
                required: "Name is required",
                maxLength: 80,
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {typeof errors.name?.message === "string" ? errors.name.message : null}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 bg-white/70 border-green-200 focus:border-green-500 focus:ring-green-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {typeof errors.email?.message === "string" ? errors.email.message : null}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Create a password"
              className="h-12 bg-white/70 border-green-200 focus:border-green-500 focus:ring-green-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "At least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {typeof errors.password?.message === "string" ? errors.password.message : null}
              </p>
            )}
          </div>

          <div className="flex items-start space-x-2 text-sm">
            <input 
              type="checkbox" 
              className="mt-1 rounded border-gray-300" 
              required
            />
            <span className="text-gray-600">
              I agree to the{" "}
              <Link href="/terms" className="text-green-600 hover:text-green-500 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-green-600 hover:text-green-500 transition-colors">
                Privacy Policy
              </Link>
            </span>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-12 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium transition-colors"
          onClick={() => handleSocialRegister("google")}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>
      </div>

      <div className="text-center text-xs text-gray-500">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-green-600 hover:text-green-500 transition-colors">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-green-600 hover:text-green-500 transition-colors">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
