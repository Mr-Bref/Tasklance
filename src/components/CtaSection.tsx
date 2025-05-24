"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="w-ful flex justify-center l py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-600 to-emerald-700
">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
              Ready to transform how your team works?
            </h2>
            <p className="mx-auto max-w-[700px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of teams that use Tasklance to stay organized, collaborate effectively, and deliver
              projects on time.
            </p>
          </div>

          <motion.div
            className="mx-auto mt-6 w-full max-w-md space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form className="flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/30"
              />
              <Button className="bg-white text-purple-600 hover:bg-white/90 hover:text-purple-700">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-white/60">Free 14-day trial. No credit card required.</p>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span>⭐</span>
              <span className="ml-1">4.9/5 from 2,000+ reviews</span>
            </div>
            <div className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              <span>🔒</span>
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center space-x-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              <span>🚀</span>
              <span>Used by 10,000+ teams</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
