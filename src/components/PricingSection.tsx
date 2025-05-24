"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, X } from "lucide-react"

export function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: "Free",
      description: "For individuals and small projects",
      price: {
        monthly: "$0",
        annually: "$0",
      },
      features: [
        { name: "Up to 5 projects", included: true },
        { name: "Up to 10 tasks per project", included: true },
        { name: "Basic task management", included: true },
        { name: "2 team members", included: true },
        { name: "1GB storage", included: true },
        { name: "Email support", included: false },
        { name: "Advanced reporting", included: false },
        { name: "Custom fields", included: false },
        { name: "API access", included: false },
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "For growing teams and businesses",
      price: {
        monthly: "$12",
        annually: "$9",
      },
      features: [
        { name: "Unlimited projects", included: true },
        { name: "Unlimited tasks", included: true },
        { name: "Advanced task management", included: true },
        { name: "Up to 15 team members", included: true },
        { name: "10GB storage", included: true },
        { name: "Priority email support", included: true },
        { name: "Advanced reporting", included: true },
        { name: "Custom fields", included: true },
        { name: "API access", included: false },
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex needs",
      price: {
        monthly: "$29",
        annually: "$24",
      },
      features: [
        { name: "Unlimited projects", included: true },
        { name: "Unlimited tasks", included: true },
        { name: "Advanced task management", included: true },
        { name: "Unlimited team members", included: true },
        { name: "100GB storage", included: true },
        { name: "24/7 phone & email support", included: true },
        { name: "Advanced reporting", included: true },
        { name: "Custom fields", included: true },
        { name: "API access", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section ref={ref} className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900 flex justify-center">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-800/30 dark:bg-indigo-900/20 dark:text-indigo-300">
              <span className="mr-1">💰</span> Simple Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose the perfect plan for your team</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              No hidden fees or complicated pricing structures. Just simple, transparent pricing.
            </p>
          </div>

          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Label htmlFor="billing-toggle" className={!isAnnual ? "font-bold" : ""}>
              Monthly
            </Label>
            <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
            <Label htmlFor="billing-toggle" className={isAnnual ? "font-bold" : ""}>
              Annual
              <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Save 20%
              </span>
            </Label>
          </motion.div>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative flex flex-col rounded-xl border ${
                plan.popular
                  ? "border-purple-200 bg-purple-50 dark:border-purple-800/30 dark:bg-purple-900/10"
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
              } p-6 shadow-sm`}
              variants={cardVariants}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{isAnnual ? plan.price.annually : plan.price.monthly}</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">/user/month</span>
                </div>
                {isAnnual && <p className="text-sm text-gray-500 dark:text-gray-400">Billed annually</p>}
              </div>
              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <X className="mr-2 h-4 w-4 text-gray-300 dark:text-gray-600" />
                    )}
                    <span className={feature.included ? "" : "text-gray-400 dark:text-gray-600"}>{feature.name}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={plan.popular ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : ""}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-950">
            <h3 className="mb-2 text-2xl font-bold">Need a custom plan?</h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              Contact our sales team for a tailored solution that meets your specific requirements.
            </p>
            <Button variant="outline">Contact Sales</Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
