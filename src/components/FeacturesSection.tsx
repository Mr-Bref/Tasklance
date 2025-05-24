"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ClipboardList, Users, BarChart, Calendar, Zap, Search } from "lucide-react"
import Image from "next/image"

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: <ClipboardList className="h-10 w-10 text-emerald-600" />,
      title: "Task Creation",
      description:
        "Create, assign, and prioritize tasks with ease. Add descriptions, due dates, attachments, and more.",
    },
    {
      icon: <Users className="h-10 w-10 text-emerald-600" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time updates, comments, and notifications.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-emerald-600" />,
      title: "Progress Tracking",
      description: "Monitor project progress with visual boards, charts, and customizable reports.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-emerald-600" />,
      title: "Project Organization",
      description:
        "Organize tasks into projects, boards, and lists. Create custom workflows that match your team's process.",
    },
    {
      icon: <Zap className="h-10 w-10 text-emerald-600" />,
      title: "Automation",
      description: "Automate repetitive tasks and workflows to save time and reduce manual work.",
    },
    {
      icon: <Search className="h-10 w-10 text-emerald-600" />,
      title: "Advanced Search",
      description: "Find anything instantly with powerful search capabilities across all your projects and tasks.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section ref={ref} className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-800/30 dark:bg-indigo-900/20 dark:text-indigo-300">
              <span className="mr-1">🚀</span> Powerful Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need to manage tasks</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Tasklance combines powerful features with an intuitive interface to help your team stay organized and
              productive.
            </p>
          </div>
        </motion.div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative h-[500px] w-full max-w-[500px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
              <Image
                src="/placeholder.svg?height=1000&width=1000"
                alt="Tasklance Features"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
              />
              <motion.div
                className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-purple-500/20 blur-xl"
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
                className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-xl"
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
              className="absolute -bottom-4 -right-4 h-20 w-20 rounded-lg bg-green-600 p-2 shadow-lg dark:bg-green-700"
              initial={{ y: 20, opacity: 0, rotate: 5 }}
              animate={isInView ? { y: 0, opacity: 1, rotate: 0 } : { y: 20, opacity: 0, rotate: 5 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex h-full flex-col items-center justify-center rounded-md bg-white p-2 dark:bg-gray-950">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">+64%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Efficiency</div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                variants={itemVariants}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gray-100 opacity-0 transition-all group-hover:opacity-100 dark:bg-gray-800"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
