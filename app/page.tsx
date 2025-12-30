"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  MessageSquare,
  ShoppingBag,
  Shield,
  Zap,
  Sparkles,
  Star,
  Users,
  ArrowUpRight,
  Bot,
  Circle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CAMPUSES, PRODUCT_CATEGORIES } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Chat preview messages
const chatPreviewMessages = [
  { role: "user", content: "I need a laptop for coding, budget is around 200k" },
  { role: "ai", content: "I found 3 great options! Here's a Dell Inspiron 15 with i5, 8GB RAM..." },
];

const features = [
  {
    icon: MessageSquare,
    title: "AI Assistant",
    description: "Chat naturally to find products",
    number: "01",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Same-day campus delivery",
    number: "02",
  },
  {
    icon: Shield,
    title: "Verified Sellers",
    description: "Only trusted vendors",
    number: "03",
  },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Minimal Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-6 lg:px-12 h-20">
          <Link href="/" className="font-display text-2xl font-black tracking-tighter text-white">
            DEBELU
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/explore" className="text-sm text-white/70 hover:text-white transition-colors">
              Explore
            </Link>
            <Link href="/register?role=vendor" className="text-sm text-white/70 hover:text-white transition-colors">
              Sell
            </Link>
          </nav>
          <Link href="/register">
            <Button variant="ghost" className="text-white border-white/20 border hover:bg-white hover:text-black rounded-full px-6">
              Start
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO - Asymmetric Split Layout */}
      <section className="min-h-screen relative">
        {/* Left Side - Giant Typography */}
        <div className="absolute inset-0 lg:w-[60%]">
          <div className="h-full flex flex-col justify-center px-6 lg:px-12 pt-32 lg:pt-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Oversized Badge */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-full text-xs uppercase tracking-[0.2em]">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Now Live in Lagos
                </span>
              </motion.div>

              {/* Giant Title - Asymmetric alignment */}
              <motion.h1
                className="font-display text-[12vw] lg:text-[10vw] xl:text-[8vw] font-black leading-[0.85] tracking-tighter"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                SHOP
                <br />
                <span className="text-foreground/20">WITH</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  AI
                </span>
              </motion.h1>

              {/* Offset Description */}
              <motion.p
                className="mt-8 lg:mt-12 text-lg lg:text-xl text-muted-foreground max-w-md lg:ml-[20%]"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                The first AI shopping assistant built for Nigerian university students. Just tell us what you need.
              </motion.p>

              {/* CTA - Asymmetric placement */}
              <motion.div
                className="mt-10 flex flex-col sm:flex-row gap-4 lg:ml-[20%]"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/register">
                  <Button size="xl" className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-10">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
                <Link href="/register?role=vendor">
                  <Button size="xl" variant="outline" className="rounded-full px-10 border-foreground/20 hover:bg-foreground/5">
                    Become a Vendor
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Floating Chat Card (Desktop) */}
        <motion.div
          className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-[380px]"
          initial={{ x: 100, opacity: 0, rotate: 5 }}
          animate={{ x: 0, opacity: 1, rotate: 3 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ y: y1 }}
        >
          <Card className="bg-foreground text-background border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-5 border-b border-background/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="font-bold">Debelu AI</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-background/60">Online</span>
                  </div>
                </div>
              </div>
              {/* Messages */}
              <div className="p-5 space-y-4">
                <div className="flex justify-end">
                  <div className="bg-background/20 rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%] text-sm">
                    {chatPreviewMessages[0].content}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] text-sm border border-emerald-400/30">
                    {chatPreviewMessages[1].content}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute bottom-20 left-[10%] hidden lg:block"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <div className="w-20 h-20 rounded-full border border-foreground/10" />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-foreground/40 rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>
      </section>

      {/* STATS - Horizontal Marquee Style */}
      <section className="py-6 border-y border-foreground/10 overflow-hidden">
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: [0, -500] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16">
              <span className="text-4xl lg:text-5xl font-black">50K+ STUDENTS</span>
              <span className="text-4xl lg:text-5xl font-black text-foreground/20">•</span>
              <span className="text-4xl lg:text-5xl font-black">2K+ PRODUCTS</span>
              <span className="text-4xl lg:text-5xl font-black text-foreground/20">•</span>
              <span className="text-4xl lg:text-5xl font-black">500+ VENDORS</span>
              <span className="text-4xl lg:text-5xl font-black text-foreground/20">•</span>
              <span className="text-4xl lg:text-5xl font-black">4.9★ RATING</span>
              <span className="text-4xl lg:text-5xl font-black text-foreground/20">•</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES - Offset Grid */}
      <section className="py-24 lg:py-40 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Title - Off-center */}
          <motion.div
            className="mb-20 lg:ml-[25%]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Why Choose Us
            </p>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight">
              BUILT<br />
              <span className="text-foreground/20">DIFFERENT</span>
            </h2>
          </motion.div>

          {/* Asymmetric Feature Grid */}
          <div className="space-y-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className={`flex flex-col lg:flex-row items-start gap-6 lg:gap-12 ${i % 2 === 0 ? 'lg:ml-0' : 'lg:ml-[20%]'
                  }`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Number */}
                <span className="text-8xl lg:text-[12rem] font-black text-foreground/5 leading-none">
                  {feature.number}
                </span>

                {/* Content */}
                <div className="flex-1 max-w-md -mt-4 lg:-mt-16">
                  <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES - Scattered, Organic Layout */}
      <section className="py-24 lg:py-32 bg-foreground text-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.h2
            className="text-5xl lg:text-7xl font-black mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            FIND<br />ANYTHING
          </motion.h2>

          {/* Scattered Categories */}
          <div className="relative h-[500px] lg:h-[600px]">
            {PRODUCT_CATEGORIES.slice(0, 10).map((category, i) => {
              // Random-ish positioning for organic feel
              const positions = [
                { top: '5%', left: '10%' },
                { top: '15%', left: '60%' },
                { top: '30%', left: '5%' },
                { top: '25%', left: '75%' },
                { top: '45%', left: '30%' },
                { top: '50%', left: '70%' },
                { top: '65%', left: '10%' },
                { top: '70%', left: '50%' },
                { top: '80%', left: '25%' },
                { top: '85%', left: '75%' },
              ];
              const pos = positions[i];
              const sizes = ['text-2xl', 'text-3xl', 'text-4xl', 'text-xl', 'text-3xl'];
              const size = sizes[i % sizes.length];

              return (
                <motion.div
                  key={category.id}
                  className={`absolute cursor-pointer group`}
                  style={{ top: pos.top, left: pos.left }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className={`${size} font-bold text-background/40 group-hover:text-emerald-400 transition-colors`}>
                    {category.emoji} {category.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Decorative Circle */}
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-background/10" />
      </section>

      {/* CAMPUSES - Minimal List */}
      <section className="py-24 lg:py-40 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left - Title */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Available On
              </p>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">
                YOUR<br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  CAMPUS
                </span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-md">
                We're expanding rapidly across Nigerian universities. Check if we're on your campus.
              </p>
            </motion.div>

            {/* Right - Campus List */}
            <div className="space-y-0 border-t border-foreground/10">
              {CAMPUSES.map((campus, i) => (
                <motion.div
                  key={campus.id}
                  className="flex items-center justify-between py-6 border-b border-foreground/10 group cursor-pointer hover:pl-4 transition-all"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div>
                    <p className="font-bold text-lg group-hover:text-emerald-400 transition-colors">
                      {campus.shortName}
                    </p>
                    <p className="text-sm text-muted-foreground">{campus.state}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-foreground/20 group-hover:text-emerald-400 group-hover:rotate-45 transition-all" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Full Width Impact */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-cyan-400/5 to-violet-400/10" />
        <div className="absolute inset-0 bg-grid opacity-30" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-8xl font-black tracking-tight mb-8">
              READY TO
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                START?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto">
              Join thousands of students already shopping smarter on their campus.
            </p>
            <Link href="/register">
              <Button size="xl" className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-12 text-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER - Minimal */}
      <footer className="border-t border-foreground/10 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <Link href="/" className="font-display text-xl font-black tracking-tighter">
              DEBELU
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered campus commerce
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/vendors" className="hover:text-foreground transition-colors">Vendors</Link>
            <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-foreground/10 text-center text-sm text-muted-foreground">
          <p>© 2024 Debelu. Made in Nigeria 🇳🇬</p>
        </div>
      </footer>
    </div>
  );
}
