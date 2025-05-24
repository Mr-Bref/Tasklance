"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PricingSection } from "./PricingSection";
import { Footer } from "./Footer";
import { CtaSection } from "./CtaSection";
import { TestimonialsSection } from "./TestimonialSection";
import { FeaturesSection } from "./FeacturesSection";
import { HeroSection } from "./HeroSection";

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
