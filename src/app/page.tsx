import LandingPage from "@/components/Home";
import { auth } from "@/lib/auth";
import { ChevronRight } from "lucide-react";
import { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata: Metadata= {
  title: "TaskLance - Home",
  description: "A task management app"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <LandingPage />;
}
