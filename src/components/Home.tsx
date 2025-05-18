'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6 bg-gradient-to-b from-indigo-50 to-white">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Boost Your Team Productivity
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-8 max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Tasklance helps your team manage tasks, collaborate in real-time, and stay focused on what matters. Whether you’re a solo founder or a team of 50, our platform scales with you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Button size="lg" className="flex gap-2 items-center">
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {["Real-Time Collaboration", "Role-Based Permissions", "Multi-Project Management", "Markdown Support", "Keyboard Shortcuts", "Team Invitations"].map((title, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">What our users say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {["Alice from DevHub", "Lucas, Product Manager", "Mira, Freelance Designer"].map((name, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl p-6 shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.3 }}
            >
              <p className="text-gray-700 italic mb-4">"Lorem ipsum dolor sit amet, consectetur adipiscing elit."</p>
              <p className="text-gray-900 font-semibold">- {name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
        <p className="text-gray-600 mb-10">No hidden fees. Pay only for what you need.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {["Free Plan", "Pro Plan"].map((title, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl shadow p-8 text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.3 }}
            >
              <h3 className="text-2xl font-semibold mb-2">{title}</h3>
              <p className="text-indigo-600 text-xl font-bold mb-4">{i === 0 ? '$0/mo' : '$9/mo'}</p>
              <ul className="text-gray-700 space-y-2">
                {["Lorem ipsum", "Dolor sit amet", "Consectetur adipiscing elit"].map((f, idx) => (
                  <li key={idx}>• {f}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-indigo-600 text-white text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to get started with Tasklance?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Button size="lg" className="flex gap-2 items-center bg-white text-indigo-600 hover:bg-indigo-100">
            Try it Free <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
