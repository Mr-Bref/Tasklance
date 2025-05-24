"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Play } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)

  const testimonials = [
    {
      quote:
        "Tasklance has completely transformed how our team manages projects. The visual boards make it easy to see where everything stands at a glance.",
      author: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      quote:
        "We've tried many task management tools, but Tasklance is by far the most intuitive and powerful. The automation features save us hours every week.",
      author: "Michael Chen",
      role: "CTO at StartupX",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      quote:
        "The collaboration features in Tasklance have improved our team communication dramatically. We're more aligned and productive than ever.",
      author: "Emily Rodriguez",
      role: "Team Lead at DesignStudio",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section ref={ref} className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-800 dark:border-yellow-800/30 dark:bg-yellow-900/20 dark:text-yellow-300">
              <span className="mr-1">⭐</span> Customer Stories
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Loved by teams worldwide</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Hear from the teams and businesses that rely on Tasklance to manage their projects and boost productivity.
            </p>
          </div>
        </motion.div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl bg-gray-50 p-8 dark:bg-gray-900"
              >
                <div className="mb-4 flex justify-center">
                  {Array(testimonials[activeIndex].rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <blockquote className="mb-6 text-center text-xl font-medium italic text-gray-700 dark:text-gray-300">
                  "{testimonials[activeIndex].quote}"
                </blockquote>
                <div className="flex flex-col items-center justify-center">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-md dark:border-gray-800">
                    <AvatarImage
                      src={testimonials[activeIndex].avatar || "/placeholder.svg"}
                      alt={testimonials[activeIndex].author}
                    />
                    <AvatarFallback>{testimonials[activeIndex].author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="mt-4 text-center">
                    <div className="font-semibold">{testimonials[activeIndex].author}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonials[activeIndex].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute -left-4 top-1/2 -translate-y-1/2 md:-left-8">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full bg-white shadow-md dark:bg-gray-950"
                onClick={prevTestimonial}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous</span>
              </Button>
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 md:-right-8">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full bg-white shadow-md dark:bg-gray-950"
                onClick={nextTestimonial}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-xl">
              <div className="relative aspect-video w-full bg-gray-200 dark:bg-gray-800">
                <Image
                  src="/placeholder.svg?height=720&width=1280"
                  alt="Video testimonial thumbnail"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                />
                {!showVideo && (
                  <motion.button
                    className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-purple-600 shadow-lg transition-all hover:bg-white hover:text-purple-700 dark:bg-gray-900/90 dark:text-purple-400 dark:hover:bg-gray-900 dark:hover:text-purple-300"
                    onClick={() => setShowVideo(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="h-6 w-6 fill-current" />
                  </motion.button>
                )}
                {showVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <p className="text-white">Video player would appear here</p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-2 dark:bg-gray-900/90">
                <p className="font-medium">Watch how teams use Tasklance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
