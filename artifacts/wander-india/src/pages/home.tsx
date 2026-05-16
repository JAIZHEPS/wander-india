import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Brain, Map, Sun, Plane, DollarSign, Package,
  MessageSquare, Gem, ArrowRight, Zap,
  Wind, Mountain, Waves, Heart, Music, Users, Smile
} from "lucide-react";

const MOODS = [
  { id: "relaxed", label: "Relaxed", icon: Sun, color: "from-blue-400 to-cyan-400" },
  { id: "adventurous", label: "Adventure", icon: Mountain, color: "from-orange-400 to-red-400" },
  { id: "romantic", label: "Romantic", icon: Heart, color: "from-pink-400 to-rose-400" },
  { id: "energetic", label: "Energetic", icon: Zap, color: "from-yellow-400 to-orange-400" },
  { id: "stressed", label: "Stressed", icon: Wind, color: "from-indigo-400 to-purple-400" },
  { id: "party", label: "Party", icon: Music, color: "from-purple-400 to-pink-400" },
  { id: "family", label: "Family", icon: Users, color: "from-green-400 to-teal-400" },
  { id: "lonely", label: "Solo", icon: Smile, color: "from-cyan-400 to-blue-400" },
];

const QUICK_LINKS = [
  { href: "/destinations", icon: Map, label: "Explore Destinations", color: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400" },
  { href: "/ai-planner", icon: Brain, label: "AI Itinerary", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20", text: "text-amber-400" },
  { href: "/hidden-gems", icon: Gem, label: "Hidden Gems", color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20", text: "text-purple-400" },
  { href: "/chat", icon: MessageSquare, label: "AI Travel Chat", color: "from-pink-500/20 to-pink-500/5", border: "border-pink-500/20", text: "text-pink-400" },
  { href: "/packing", icon: Package, label: "Packing List", color: "from-green-500/20 to-green-500/5", border: "border-green-500/20", text: "text-green-400" },
  { href: "/budget", icon: DollarSign, label: "Budget Tracker", color: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/20", text: "text-orange-400" },
];

function Particle({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-amber-400/30"
      style={{ left: x, top: y }}
      animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay }}
    />
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/destinations?search=${encodeURIComponent(search)}`);
    } else {
      setLocation("/destinations");
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setLocation(`/mood-planner?mood=${moodId}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Background */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

        {[...Array(16)].map((_, i) => (
          <Particle key={i} x={`${5 + i * 6}%`} y={`${10 + (i % 7) * 12}%`} delay={i * 0.3} />
        ))}

        <div className="relative z-10 w-full max-w-5xl mx-auto pt-28 pb-16 flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8"
          >
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Travel Planning for India
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-6"
          >
            <span className="text-white">Discover</span>
            <br />
            <span className="text-gradient-amber">Incredible India</span>
            <br />
            <span className="text-white">with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Your emotionally intelligent travel companion. Plan your perfect Indian journey — from Ladakh peaks to Kerala backwaters.
          </motion.p>

          {/* Search */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex gap-3 w-full max-w-xl mx-auto mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search — Goa, Ladakh, Kerala..."
                className="pl-11 h-14 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-2xl text-base"
                data-testid="input-search"
              />
            </div>
            <Button
              type="submit"
              className="h-14 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-2xl border-0 hover:opacity-90 glow-amber"
              data-testid="btn-search"
            >
              Search
            </Button>
          </motion.form>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-14"
          >
            <Link href="/ai-planner">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold h-14 px-8 rounded-2xl border-0 hover:opacity-90 glow-amber text-base"
                data-testid="btn-plan-journey"
              >
                <Brain className="w-5 h-5 mr-2" />
                Plan My AI Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/destinations">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-2xl border-white/20 text-white hover:bg-white/5 text-base"
                data-testid="btn-explore"
              >
                <Map className="w-5 h-5 mr-2" />
                Explore Destinations
              </Button>
            </Link>
          </motion.div>

          {/* Quick Feature Links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full mb-14"
          >
            <p className="text-muted-foreground text-sm mb-5 uppercase tracking-wider font-semibold">Quick Access</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {QUICK_LINKS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      className={`glass-card rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer border ${item.border} bg-gradient-to-b ${item.color} hover:brightness-110 transition-all`}
                    >
                      <Icon className={`w-6 h-6 ${item.text}`} />
                      <span className="text-white text-xs font-semibold text-center leading-tight">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Mood Selector */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="w-full mb-14"
          >
            <p className="text-muted-foreground text-sm mb-5 uppercase tracking-wider font-semibold">How are you feeling today?</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {MOODS.map((mood, i) => {
                const Icon = mood.icon;
                return (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodSelect(mood.id)}
                    data-testid={`mood-${mood.id}`}
                    className="glass-card rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mood.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium text-xs">{mood.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center gap-10"
          >
            {[["500+", "Destinations"], ["50K+", "Happy Travelers"], ["98%", "Satisfaction Rate"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-gradient-amber">{num}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer strip */}
        <div className="relative z-10 w-full border-t border-white/5 py-6 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Plane className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="font-bold">
                <span className="text-gradient-amber">Wander</span>
                <span className="text-white">India</span>
              </span>
            </div>
            <div className="flex gap-6">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/emergency", label: "Emergency" },
              ].map(link => (
                <Link key={link.href} href={link.href}>
                  <span className="text-muted-foreground hover:text-white text-sm transition-colors">{link.label}</span>
                </Link>
              ))}
            </div>
            <p className="text-muted-foreground text-xs">© 2025 WanderIndia. Explore Incredible India.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
