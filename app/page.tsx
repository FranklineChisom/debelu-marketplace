"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
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
  Monitor,
  Gem,
  Utensils,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CAMPUSES, PRODUCT_CATEGORIES } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import * as Undraw from 'react-undraw-illustrations';

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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Minimal Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md border-b border-foreground/5 shadow-sm" : "bg-transparent py-4 mix-blend-difference"
          }`}
      >
        <div className={`flex items-center justify-between px-6 lg:px-12 xl:px-20 transition-all duration-300 ${isScrolled ? "h-16" : "h-20"}`}>
          <Link href="/" className={`font-display text-2xl font-black tracking-tighter transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}>
            DEBELU
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/explore" className={`text-sm font-medium transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>
              Explore
            </Link>
            <Link href="/register?role=vendor" className={`text-sm font-medium transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>
              Sell
            </Link>
          </nav>
          <Link href="/register">
            <Button variant={isScrolled ? "default" : "ghost"} className={`rounded-full px-6 ${isScrolled ? "" : "text-white border-white/20 border hover:bg-white hover:text-black"}`}>
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
          <div className="h-full flex flex-col justify-center px-6 lg:px-12 xl:px-20 pt-48 lg:pt-28">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >


              {/* Giant Title - Asymmetric alignment */}
              <motion.h1
                className="font-display text-[11vw] lg:text-[10vw] xl:text-[9vw] font-black leading-[0.8] tracking-tighter"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                SHOP
                <br />
                <span className="text-foreground/20 ml-[10%]">WITH</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent ml-[5%]">
                  AI
                </span>
              </motion.h1>

              {/* Description - Aligned with Title */}
              <motion.p
                className="mt-8 lg:mt-12 text-lg lg:text-xl text-muted-foreground max-w-md"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                The first AI shopping assistant built for Nigerian university students. Just tell us what you need.
              </motion.p>

              {/* CTA - Aligned with Title */}
              <motion.div
                className="mt-10 flex flex-col sm:flex-row gap-4"
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

        {/* Right Side - Floating Chat Card (Desktop) - REDESIGNED */}
        <motion.div
          className="hidden lg:block absolute right-12 xl:right-24 top-1/2 -translate-y-1/2 w-[450px]"
          initial={{ x: 100, opacity: 0, rotate: 5 }}
          animate={{ x: 0, opacity: 1, rotate: 3 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ y: y1 }}
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500" />

            <Card className="relative bg-black/90 text-white border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500 border-2">
              <CardContent className="p-0">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-400/20">
                      <Bot className="w-7 h-7 text-black" />
                    </div>
                    <div>
                      <p className="font-display font-black text-xl tracking-tight">Debelu AI</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                </div>

                {/* Messages */}
                <div className="p-6 space-y-6 min-h-[300px] flex flex-col justify-end">
                  <div className="flex justify-end">
                    <div className="bg-white/10 rounded-2xl rounded-tr-sm px-6 py-4 max-w-[85%] text-base font-medium backdrop-blur-sm border border-white/5">
                      {chatPreviewMessages[0].content}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl rounded-tl-sm px-6 py-4 max-w-[85%] text-base font-medium border border-emerald-500/30 text-emerald-50 shadow-lg shadow-emerald-900/10">
                      <Sparkles className="w-4 h-4 text-emerald-400 mb-2" />
                      {chatPreviewMessages[1].content}
                    </div>
                  </div>

                  {/* Input Simulation */}
                  <div className="mt-4 relative">
                    <div className="h-14 w-full bg-white/5 rounded-xl border border-white/10 flex items-center px-4 text-white/30 text-sm">
                      Type a message...
                      <div className="ml-auto w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute bottom-20 left-[10%] hidden lg:block"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <div className="w-20 h-20 rounded-full border border-foreground/10" />
        </motion.div>
      </section>

      {/* STATS - Horizontal Marquee Style */}
      <section className="mt-10 py-6 border-y border-foreground/10 overflow-hidden">
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

      {/* THE ANTI-MARKETPLACE STATEMENT */}
      <section className="mt-10 py-32 lg:py-48 px-6 lg:px-12 xl:px-20 bg-foreground text-background relative overflow-hidden">
        <div className="w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <h2 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-12">
              THIS IS NOT<br />
              <span className="text-foreground/20">A STORE.</span>
            </h2>
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
              <p className="text-xl lg:text-2xl font-medium max-w-lg leading-relaxed text-background/80">
                Marketplaces are boring. Scrolling is outdated. Debelu is your personal shopper, negotiator, and delivery guy. All in one chat.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-background/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <p className="text-lg font-bold">You ask.</p>
                </div>
                <div className="w-px h-8 bg-background/20 ml-6" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-background/20 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <p className="text-lg font-bold">AI Finds.</p>
                </div>
                <div className="w-px h-8 bg-background/20 ml-6" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-background text-foreground flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-lg font-bold">You get.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* The Main Thing - AI Visual */}
        <div className="absolute top-1/2 -translate-y-1/2 -right-40 lg:right-20 w-[600px] h-[600px] opacity-20 lg:opacity-100 pointer-events-none lg:pointer-events-auto">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Glowing Orbs */}
            <div className="absolute w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px] translate-x-10 translate-y-10" />

            {/* Central Visual - Undraw Chat */}
            <motion.div
              className="relative z-10 w-full h-full flex items-center justify-center p-12"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <Undraw.UndrawChat
                primaryColor="#10b981" // Emerald-500
                height="400px"
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>

            {/* Orbiting Elements */}
            <motion.div
              className="absolute z-0 w-[500px] h-[500px] border border-white/10 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-6 h-6 bg-white/20 rounded-full backdrop-blur-md" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHOP YOUR VIBE - Lifestyle Collections */}
      <section className="py-32 lg:py-48 px-6 lg:px-12 xl:px-20 overflow-hidden">
        <div className="w-full">
          <motion.div
            className="mb-20 flex flex-col lg:flex-row items-end justify-between gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Curated Collections
              </p>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tight">
                WHAT'S YOUR<br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">VIBE?</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xs text-right hidden lg:block">
              Forget categories. Shop by lifestyle. Curated essentials for every student persona.
            </p>
          </motion.div>

          {/* Vibe Cards - Horizontal Scroll / Grid Hybrid */}


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "The Tech Bro",
                subtitle: "Setups, Gadgets & Coffee",
                Component: Undraw.UndrawProgramming,
                hex: "#06b6d4", // Cyan-500
                color: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-500/20"
              },
              {
                title: "The Slay Queen",
                subtitle: "Fashion, Skincare & Glam",
                Component: Undraw.UndrawMakeupArtist,
                hex: "#ec4899", // Pink-500
                color: "from-pink-500/20 to-rose-500/20",
                border: "border-pink-500/20"
              },
              {
                title: "The Foodie",
                subtitle: "Midnight Snacks & Meals",
                Component: Undraw.UndrawStreetFood,
                hex: "#f97316", // Orange-500
                color: "from-orange-500/20 to-yellow-500/20",
                border: "border-orange-500/20"
              },
              {
                title: "The Scholar",
                subtitle: "Books, Lamps & Essentials",
                Component: Undraw.UndrawStudying,
                hex: "#10b981", // Emerald-500
                color: "from-emerald-500/20 to-green-500/20",
                border: "border-emerald-500/20"
              },
            ].map((vibe, i) => (
              <motion.div
                key={vibe.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative h-[450px] rounded-3xl overflow-hidden border ${vibe.border} bg-background cursor-pointer`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${vibe.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Illustration - Centered & Floating */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative w-full h-[250px] transform group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-700 ease-out flex items-center justify-center">
                    <vibe.Component
                      primaryColor={vibe.hex}
                      height="220px"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>

                {/* Text Content - Bottom Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-background via-background/90 to-transparent">
                  <h3 className="text-3xl font-black mb-2 leading-none group-hover:translate-x-2 transition-transform duration-300">
                    {vibe.title}
                  </h3>
                  <p className="text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                    {vibe.subtitle}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPUSES - Minimal List */}
      <section className="py-32 lg:py-48 px-6 lg:px-12 xl:px-20">
        <div className="w-full">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">
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
              {CAMPUSES.slice(0, 6).map((campus, i) => (
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
              <div className="pt-6">
                <Link href="/register?role=campus">
                  <Button variant="link" className="text-muted-foreground hover:text-foreground p-0 h-auto">
                    View all campuses <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Full Width Impact */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-cyan-400/5 to-violet-400/10" />
        <div className="absolute inset-0 bg-grid opacity-30" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 xl:px-20 text-center">
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
      <footer className="border-t border-foreground/10 py-12 px-6 lg:px-12 xl:px-20">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
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
        <div className="w-full mt-12 pt-8 border-t border-foreground/10 text-center text-sm text-muted-foreground">
          <p>© 2024 Debelu. Made in Nigeria 🇳🇬</p>
        </div>
      </footer>
    </div>
  );
}
