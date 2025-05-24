"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-950 flex justify-center">
      <div className="absolute inset-0 bg-[url(/grid.png)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="container relative px-4 py-24 md:px-6 md:py-32 lg:py-40">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-800 dark:border-purple-800/30 dark:bg-purple-900/20 dark:text-purple-300"
              >
                <span className="mr-1">✨</span> Organize tasks like never before
              </motion.div>
              <motion.h1
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Manage tasks with{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  visual clarity
                </span>
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Tasklance helps teams organize projects, streamline processes, and hit deadlines with our intuitive
                drag-and-drop interface.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <a href="/register">Get Started Free</a>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
            </motion.div>
            <motion.div
              className="flex items-center space-x-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="relative flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative h-[400px] w-full max-w-[500px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
              <motion.div
                className="absolute inset-0"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Image
                  src="/placeholder.svg?height=800&width=1200"
                  alt="Tasklance Dashboard"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                  priority
                />
              </motion.div>
              <motion.div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-500/20 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 1,
                }}
              />
            </div>
            <motion.div
              className="absolute -bottom-4 -left-4 h-20 w-20 rounded-lg bg-green-600 p-2 shadow-lg dark:bg-green-700"
              initial={{ y: 20, opacity: 0, rotate: -5 }}
              animate={{ y: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0, rotate: isVisible ? 0 : -5 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="flex h-full flex-col items-center justify-center rounded-md bg-white p-2 dark:bg-gray-950">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">28</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Tasks Done</div>
              </div>
            </motion.div>
            <motion.div
              className="absolute -right-4 -top-4 h-24 w-24 rounded-lg bg-green-600 p-2 shadow-lg dark:bg-green-700"
              initial={{ y: -20, opacity: 0, rotate: 5 }}
              animate={{ y: isVisible ? 0 : -20, opacity: isVisible ? 1 : 0, rotate: isVisible ? 0 : 5 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <div className="flex h-full flex-col items-center justify-center rounded-md bg-white p-2 dark:bg-gray-950">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">94%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Productivity</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
            <Image src="/placeholder.svg?height=40&width=120" alt="Company logo" width={120} height={40} />
          </div>
          <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
            <Image src="/placeholder.svg?height=40&width=120" alt="Company logo" width={120} height={40} />
          </div>
          <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
            <Image src="/placeholder.svg?height=40&width=120" alt="Company logo" width={120} height={40} />
          </div>
          <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
            <Image src="/placeholder.svg?height=40&width=120" alt="Company logo" width={120} height={40} />
          </div>
          <div className="flex items-center justify-center grayscale transition-all hover:grayscale-0">
            <Image src="/placeholder.svg?height=40&width=120" alt="Company logo" width={120} height={40} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
