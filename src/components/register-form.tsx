"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

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
      <Card className="bg-green-50">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <Input
                type="text"
                placeholder="Full name"
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

              <Input
                type="email"
                placeholder="Email"
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
              <Input
                type="password"
                placeholder="Password"
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

              {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
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

            <div className="text-center text-muted-foreground text-sm">or</div>

            <Button
              variant="outline"
              className="w-full bg-green-50"
              onClick={() => handleSocialRegister("google")}
            >
              Sign up with Google
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs">
        By continuing, you agree to our{" "}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
