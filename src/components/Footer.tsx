"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Github, CheckCircle } from "lucide-react"

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Integrations", href: "#" },
        { name: "Changelog", href: "#" },
        { name: "Roadmap", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Tutorials", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Support Center", href: "#" },
        { name: "API Reference", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Partners", href: "#" },
      ],
    },
  ]

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
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
    <footer ref={ref} className="w-full bg-gray-50 py-12 dark:bg-gray-900 flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            className="flex flex-col space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Tasklance</h3>
              <p className="text-gray-500 dark:text-gray-400">
                The complete task management solution for teams of all sizes.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Subscribe to our newsletter</h4>
              <div className="flex max-w-sm flex-col gap-2 sm:flex-row">
                <Input type="email" placeholder="Enter your email" />
                <Button>Subscribe</Button>
              </div>
              <p className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50"
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {footerLinks.map((group, groupIndex) => (
              <motion.div key={groupIndex} className="space-y-3" variants={itemVariants}>
                <h4 className="font-medium">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 md:flex-row"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Tasklance. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
