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
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CAMPUSES, PRODUCT_CATEGORIES } from "@/lib/constants";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import {
  SvgProgramming,
  SvgMakeupArtist,
  SvgStreetFood,
  SvgStudying
} from 'iblis-react-undraw';




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

  // Drag to Scroll Logic
  const constraintsRef = useRef(null);

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-emerald-500/30 font-sans">
      {/* Premium Glass Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-black/5 dark:border-white/5"
          : "bg-transparent"
          } py-4`}
      >
        <div className="flex items-center justify-between px-8 lg:px-12 xl:px-20 max-w-screen-2xl mx-auto">
          <Link href="/" className="font-display text-2xl font-black tracking-tight transition-colors duration-300 text-foreground">
            DEBELU
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/explore" className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
              Explore
            </Link>
            <Link href="/register?role=vendor" className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
              Sell
            </Link>
          </nav>
          <Link href="/login">
            <Button
              className="rounded-full px-6 transition-all duration-300 bg-black text-white hover:bg-black/90"
              size="sm"
            >
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* --- MOBILE HERO (3-Line Asymmetric) --- */}
      <section className="lg:hidden min-h-[90dvh] relative flex flex-col justify-center px-8 overflow-hidden pt-4">
        {/* Background Effect */}
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-gradient-to-br from-emerald-400/20 via-cyan-400/20 to-purple-400/20 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/2 opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-emerald-400/10 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <h1 className="font-sans text-[15vw] leading-[0.75] font-black tracking-tighter text-foreground mb-6">
            SHOP<br />
            <span className="block ml-[15%] text-foreground/40 py-6">WITH</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
              AI
            </span>
          </h1>
          <p className="text-lg font-medium text-muted-foreground leading-snug mb-8 max-w-[90%]">
            Your personal campus shopper, negotiator, and delivery guy. All in one chat.
          </p>
          <Link href="/register" className="block w-full">
            <Button size="lg" className="w-full h-14 rounded-full text-lg font-bold bg-foreground text-background shadow-xl shadow-emerald-500/10 active:scale-[0.98] transition-all">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* --- DESKTOP HERO (Original) --- */}
      <section className="hidden lg:block min-h-screen relative">
        <div className="absolute inset-0 w-[60%]">
          <div className="h-full flex flex-col justify-center px-6 lg:px-12 xl:px-20 pt-28">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.h1
                className="font-display text-[9vw] font-black leading-[0.85] tracking-tighter"
                initial={{ y: 50, opacity: 0 }}
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

              <motion.p
                className="mt-12 text-xl text-muted-foreground max-w-md"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                The first AI shopping assistant built for Nigerian university students. Just tell us what you need.
              </motion.p>

              <motion.div
                className="mt-10 flex gap-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/register">
                  <Button size="xl" className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-10 h-14 text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
                <Link href="/register?role=vendor">
                  <Button size="xl" variant="outline" className="rounded-full px-10 h-14 text-lg border-foreground/20 hover:bg-foreground/5">
                    Become a Vendor
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Desktop Chat Card */}
        <motion.div
          className="absolute right-24 top-1/2 -translate-y-1/2 w-[450px]"
          initial={{ x: 100, opacity: 0, rotate: 5 }}
          animate={{ x: 0, opacity: 1, rotate: 3 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ y: y1 }}
        >
          {/* ... Existing Desktop Chat Card Code ... */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500" />
            <Card className="relative bg-[#0F1115] text-white border-white/5 shadow-2xl overflow-hidden rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-500 border">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0F1115]">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-[#00DDA3] flex items-center justify-center shadow-[0_0_20px_rgba(0,221,163,0.3)]">
                        <Bot className="w-6 h-6 text-[#0F1115]" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#0F1115] items-center justify-center">
                          <span className="w-2.5 h-2.5 bg-[#00DDA3] rounded-full"></span>
                        </span>
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-lg tracking-tight text-white">Debelu AI</p>
                      <p className="text-xs font-bold text-[#00DDA3] tracking-wider uppercase">Online</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 opacity-50">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                </div>

                {/* Chat Area */}
                <div className="p-6 space-y-6 min-h-[320px] flex flex-col justify-end bg-gradient-to-b from-[#0F1115] to-[#0A0C0F]">
                  {/* User Message (Right) */}
                  <div className="flex justify-end">
                    <div className="bg-[#1A1D21] rounded-2xl rounded-tr-sm px-5 py-4 max-w-[85%] text-[15px] leading-relaxed font-medium text-white/90 border border-white/5 shadow-sm">
                      {chatPreviewMessages[0].content}
                    </div>
                  </div>

                  {/* AI Message (Left) */}
                  <div className="flex justify-start">
                    <div className="bg-[#042F2E] rounded-2xl rounded-tl-sm px-5 py-4 max-w-[85%] text-[15px] leading-relaxed font-medium text-[#2DD4BF] border border-[#2DD4BF]/20 shadow-lg shadow-[#00DDA3]/5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00DDA3]/10 to-transparent pointer-events-none" />
                      <div className="relative z-10 flex gap-3">
                        <Sparkles className="w-5 h-5 text-[#00DDA3] shrink-0 mt-0.5" />
                        <span>{chatPreviewMessages[1].content}</span>
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="mt-4 pt-2">
                    <div className="h-14 w-full bg-[#1A1D21] rounded-2xl border border-white/5 flex items-center px-2 shadow-inner">
                      <input
                        className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-white/80 placeholder:text-white/20 h-full font-medium"
                        placeholder="Type a message..."
                        readOnly
                      />
                      <div className="w-10 h-10 rounded-xl bg-[#00DDA3] flex items-center justify-center hover:scale-105 transition-transform cursor-default shadow-[0_0_15px_rgba(0,221,163,0.3)]">
                        <ArrowRight className="w-5 h-5 text-[#0F1115]" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* --- MOBILE STATS (Clean Grid) --- */}
      <section className="lg:hidden px-8 py-12 border-b border-border/50">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {[
            { label: "Students", val: "50K+" },
            { label: "Products", val: "2K+" },
            { label: "Vendors", val: "500+" },
            { label: "Rating", val: "4.9★" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-3xl font-black tracking-tighter">{stat.val}</span>
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- DESKTOP STATS (Marquee) --- */}
      <section className="hidden lg:block py-6 border-y border-foreground/10 overflow-hidden bg-muted/5">
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: [0, -500] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              <span className="text-5xl font-black">50K+ STUDENTS</span>
              <span className="text-5xl font-black text-foreground/20">•</span>
              <span className="text-5xl font-black">2K+ PRODUCTS</span>
              <span className="text-5xl font-black text-foreground/20">•</span>
              <span className="text-5xl font-black">500+ VENDORS</span>
              <span className="text-5xl font-black text-foreground/20">•</span>
              <span className="text-5xl font-black">4.9★ RATING</span>
              <span className="text-5xl font-black text-foreground/20">•</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* --- WHAT'S YOUR VIBE (Mobile: App Store Cards, Desktop: Grid) --- */}
      <section className="py-24 lg:py-48 bg-background relative z-10">
        <div className="px-8 lg:px-12 xl:px-20 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              {/* Mobile Headline */}
              <h2 className="lg:hidden text-5xl font-black tracking-tighter leading-none mb-4">
                What's your<br /><span className="text-emerald-500">vibe?</span>
              </h2>
              {/* Desktop Headline */}
              <h2 className="hidden lg:block text-6xl font-black tracking-tight">
                WHAT'S YOUR<br />
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">VIBE?</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm lg:text-base font-medium">
              Forget categories. Shop by lifestyle. Curated essentials for every student persona.
            </p>
          </div>
        </div>

        {/* --- MOBILE: App Store "Today" Style Scroll --- */}
        {/* --- MOBILE: App Store "Today" Style Scroll (Framer Motion) --- */}
        <motion.div
          ref={constraintsRef}
          className="lg:hidden w-full overflow-hidden pb-12 px-8 cursor-grab active:cursor-grabbing"
        >
          <motion.div
            drag="x"
            dragConstraints={constraintsRef}
            className="flex gap-4 w-max"
          >
            {[
              {
                title: "The Tech Bro",
                subtitle: "Setups & Gadgets",
                Component: SvgProgramming,
                colors: "bg-blue-50 text-blue-900",
                accent: "bg-blue-100"
              },
              {
                title: "The Fashionista",
                subtitle: "Fashion & Glam",
                Component: SvgMakeupArtist,
                colors: "bg-pink-50 text-pink-900",
                accent: "bg-pink-100"
              },
              {
                title: "The Foodie",
                subtitle: "Midnight Snacks",
                Component: SvgStreetFood,
                colors: "bg-orange-50 text-orange-900",
                accent: "bg-orange-100"
              },
              {
                title: "The Scholar",
                subtitle: "Start Reading",
                Component: SvgStudying,
                colors: "bg-emerald-50 text-emerald-900",
                accent: "bg-emerald-100"
              },
            ].map((vibe, i) => (
              <div
                key={i}
                className={`relative w-[85vw] h-[500px] shrink-0 rounded-2xl overflow-hidden snap-center shadow-xl ${vibe.colors} flex flex-col`}
              >
                {/* Card Content Top */}
                <div className="p-8 pb-0 z-10">
                  <h3 className="text-4xl font-black leading-none mb-3">{vibe.title}</h3>
                  <p className="text-lg font-medium opacity-80">{vibe.subtitle}</p>
                </div>

                {/* Visual */}
                <div className="flex-1 relative flex items-center justify-center p-8 translate-y-4">
                  <div className={`absolute inset-0 ${vibe.accent} rounded-t-2xl mx-4 mt-12`}></div>
                  <div className="relative z-10 w-full h-full max-h-[250px] scale-110">
                    <vibe.Component style={{ width: '100%', height: '100%' }} />
                  </div>

                </div>

                {/* Bottom Action Area */}
                <div className="h-16 bg-white/20 backdrop-blur-md flex items-center justify-between px-8">
                  <span className="text-sm font-bold">Explore</span>
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>


        </motion.div>

        {/* --- DESKTOP: Grid (Original) --- */}
        <div className="hidden lg:grid grid-cols-4 gap-4 px-20">
          {[
            {
              title: "The Tech Bro",
              subtitle: "Setups, Gadgets & Coffee",
              Component: SvgProgramming,
              hex: "#06b6d4", // Cyan-500
              color: "from-blue-500/20 to-cyan-500/20",
              border: "border-blue-500/20"
            },
            {
              title: "The Fashionista",
              subtitle: "Fashion, Skincare & Glam",
              Component: SvgMakeupArtist,
              hex: "#ec4899", // Pink-500
              color: "from-pink-500/20 to-rose-500/20",
              border: "border-pink-500/20"
            },
            {
              title: "The Foodie",
              subtitle: "Midnight Snacks & Meals",
              Component: SvgStreetFood,
              hex: "#f97316", // Orange-500
              color: "from-orange-500/20 to-yellow-500/20",
              border: "border-orange-500/20"
            },
            {
              title: "The Scholar",
              subtitle: "Books, Lamps & Essentials",
              Component: SvgStudying,
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
              className={`group relative h-[450px] rounded-2xl overflow-hidden border ${vibe.border} bg-background cursor-pointer`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${vibe.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full h-[250px] transform group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-700 ease-out flex items-center justify-center">
                  <vibe.Component style={{ width: '100%', height: '220px' }} />
                </div>

              </div>
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


      </section>

      {/* --- ANTI-MARKETPLACE (Refined Desktop) --- */}
      <section className="py-24 lg:py-32 px-8 lg:px-12 xl:px-20 bg-foreground text-background overflow-hidden rounded-t-3xl lg:rounded-none -mt-12 lg:mt-0 relative z-20 shadow-2xl lg:shadow-none">
        <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
              NOT<br />A STORE.
            </h2>
            <p className="text-xl lg:text-2xl font-medium text-background/80 leading-relaxed max-w-md">
              Marketplaces are boring. Debelu is your personal shopper. You ask, AI finds, you get. Simple.
            </p>
          </motion.div>

          {/* Steps List */}
          <div className="w-full space-y-8 lg:pl-12 border-l border-white/10">
            {[
              { icon: Search, title: "You Ask", desc: "Type what you need." },
              { icon: Sparkles, title: "AI Finds", desc: "We scan 500+ vendors." },
              { icon: ShoppingBag, title: "You Get", desc: "Campus delivery." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 group pl-6"
              >
                <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg inset-shadow-sm group-hover:bg-white/10 transition-colors">
                  <step.icon className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold tracking-tight">{step.title}</h3>
                  <p className="text-white/60 font-medium text-base lg:text-lg">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPUSES - Minimal List (Shared) */}
      <section className="py-24 lg:py-48 px-8 lg:px-12 xl:px-20">
        <div className="w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-32 items-start">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">Available On</p>
              <h2 className="text-5xl lg:text-6xl font-black tracking-tight mb-6">
                YOUR<br /><span className="text-emerald-500">CAMPUS</span>
              </h2>
            </motion.div>

            <div className="border-t border-foreground/10">
              {CAMPUSES.slice(0, 6).map((campus, i) => (
                <div key={campus.id} className="flex items-center justify-between py-6 border-b border-foreground/10">
                  <div>
                    <p className="font-bold text-lg">{campus.shortName}</p>
                    <p className="text-sm text-muted-foreground">{campus.state}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-foreground/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Full Width Impact */}
      <section className="py-24 px-8 text-center">
        <h2 className="text-6xl font-black tracking-tight mb-8">
          READY?
        </h2>
        <Button asChild size="xl" className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-12 h-16 text-xl w-full lg:w-auto shadow-xl">
          <Link href="/register">
            Get Started
            <ArrowRight className="w-6 h-6 ml-3" />
          </Link>
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-foreground/10 py-12 px-8 lg:px-12 xl:px-20">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <Link href="/" className="font-display text-xl font-black tracking-tighter">DEBELU</Link>
            <p className="text-sm text-muted-foreground mt-1">AI-powered campus commerce</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-muted-foreground font-medium">
            <Link href="/about">About</Link>
            <Link href="/vendors">Vendors</Link>
            <Link href="/help">Help</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
