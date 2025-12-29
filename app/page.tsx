"use client";

import { motion } from "framer-motion";
import { MessageSquare, ShoppingBag, Store, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CAMPUSES, PRODUCT_CATEGORIES } from "@/lib/constants";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass safe-top">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold tracking-tight">
            Debelu.
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid bg-grid-fade" />

        <motion.div
          className="container mx-auto max-w-4xl text-center relative z-10"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              Now live on {CAMPUSES.length}+ campuses
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Shop your campus,
            <br />
            <span className="text-muted-foreground">chat-style.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty"
          >
            The marketplace for Nigerian students. Tell our AI what you need,
            and discover products from trusted vendors right on your campus.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/register">
              <Button variant="luxury" size="lg" className="w-full sm:w-auto">
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register?role=vendor">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Store className="w-4 h-4" />
                Become a Vendor
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Chat Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="container mx-auto max-w-lg mt-16 px-4"
        >
          <div className="glass-card rounded-3xl p-4 sm:p-6 space-y-4">
            {/* AI Message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="chat-bubble chat-bubble-ai">
                <p>Hey! 👋 What are you looking for today?</p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex justify-end">
              <div className="chat-bubble chat-bubble-user">
                <p>I need a laptop under 200k for design work</p>
              </div>
            </div>

            {/* AI Response with Products */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="space-y-3">
                <div className="chat-bubble chat-bubble-ai">
                  <p>Found 8 laptops perfect for design! Here are the top picks:</p>
                </div>
                {/* Product Cards Preview */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    { name: "HP Pavilion 15", price: "₦185,000", tag: "Popular" },
                    { name: "Dell Inspiron", price: "₦165,000", tag: "Best Value" },
                    { name: "Lenovo IdeaPad", price: "₦195,000", tag: "Fast" },
                  ].map((product, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-32 bg-background rounded-xl p-3 border shadow-sm"
                    >
                      <div className="w-full h-16 bg-muted rounded-lg mb-2" />
                      <p className="text-xs font-medium truncate">{product.name}</p>
                      <p className="text-sm font-bold">{product.price}</p>
                      <Badge variant="secondary" className="text-[10px] mt-1">
                        {product.tag}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Why Debelu?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for Nigerian students, by people who understand campus life.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Chat to Shop",
                description:
                  "Just tell our AI what you want. No endless scrolling — we find it for you.",
              },
              {
                icon: <Store className="w-6 h-6" />,
                title: "Campus Vendors Only",
                description:
                  "Buy from verified vendors on your campus. Know who you're buying from.",
              },
              {
                icon: <ShoppingBag className="w-6 h-6" />,
                title: "Same-Day Delivery",
                description:
                  "Most orders delivered within hours. No wahala.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground">
              From textbooks to thrift — we've got your campus covered.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {PRODUCT_CATEGORIES.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Button
                  variant="outline"
                  className="rounded-full text-sm gap-2"
                >
                  <span>{category.emoji}</span>
                  {category.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campuses Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Live on your campus
            </h2>
            <p className="text-muted-foreground">
              Join thousands of students already shopping smarter.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2">
            {CAMPUSES.slice(0, 10).map((campus, i) => (
              <motion.div
                key={campus.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Badge variant="secondary" className="text-sm py-1.5 px-3">
                  {campus.shortName}
                </Badge>
              </motion.div>
            ))}
            <Badge variant="outline" className="text-sm py-1.5 px-3">
              +{CAMPUSES.length - 10} more
            </Badge>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to shop smarter?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join Debelu today and discover what your campus has to offer.
            </p>
            <Link href="/register">
              <Button variant="luxury" size="xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-tight">
                Debelu.
              </span>
              <Badge variant="secondary" className="text-xs">
                Beta
              </Badge>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/vendors" className="hover:text-foreground transition-colors">
                For Vendors
              </Link>
              <Link href="/help" className="hover:text-foreground transition-colors">
                Help
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Debelu. Built with ❤️ in Nigeria.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
