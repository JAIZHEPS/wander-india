import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  MapPin, Calendar, Star, Camera, TrendingUp, Globe,
  Clock, DollarSign, Heart, Plane, Award, ChevronRight
} from "lucide-react";

interface TripMemory {
  id: number;
  destination: string;
  state: string;
  image: string;
  dateFrom: string;
  dateTo: string;
  duration: number;
  rating: number;
  spend: number;
  highlights: string[];
  mood: string;
  moodColor: string;
  companions: string;
  status: "completed" | "upcoming";
}

const MEMORIES: TripMemory[] = [
  {
    id: 1,
    destination: "Goa",
    state: "Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop",
    dateFrom: "2025-12-20",
    dateTo: "2025-12-27",
    duration: 7,
    rating: 5,
    spend: 32000,
    highlights: ["Palolem Beach sunset", "Seafood at Thalassa", "Old Goa churches", "Saturday Night Market"],
    mood: "Energetic",
    moodColor: "from-orange-500 to-amber-400",
    companions: "4 friends",
    status: "completed",
  },
  {
    id: 2,
    destination: "Rishikesh",
    state: "Uttarakhand",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop",
    dateFrom: "2025-09-10",
    dateTo: "2025-09-14",
    duration: 4,
    rating: 5,
    spend: 18500,
    highlights: ["Grade 4 rafting on Ganga", "Camping at Shivpuri", "Laxman Jhula at dawn", "Yoga at sunrise"],
    mood: "Adventure",
    moodColor: "from-emerald-500 to-green-400",
    companions: "Solo",
    status: "completed",
  },
  {
    id: 3,
    destination: "Udaipur",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop",
    dateFrom: "2025-02-14",
    dateTo: "2025-02-18",
    duration: 4,
    rating: 5,
    spend: 28000,
    highlights: ["Lake Pichola boat ride", "City Palace tour", "Rooftop dinner with lake view", "Vintage car museum"],
    mood: "Romantic",
    moodColor: "from-pink-500 to-rose-400",
    companions: "Partner",
    status: "completed",
  },
  {
    id: 4,
    destination: "Kerala Backwaters",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop",
    dateFrom: "2024-11-01",
    dateTo: "2024-11-06",
    duration: 5,
    rating: 4,
    spend: 22000,
    highlights: ["Overnight houseboat in Alleppey", "Kathakali performance", "Spice plantation tour", "Ayurvedic massage"],
    mood: "Calm",
    moodColor: "from-teal-500 to-cyan-400",
    companions: "Family",
    status: "completed",
  },
  {
    id: 5,
    destination: "Manali",
    state: "Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    dateFrom: "2026-06-15",
    dateTo: "2026-06-22",
    duration: 7,
    rating: 0,
    spend: 0,
    highlights: [],
    mood: "Adventure",
    moodColor: "from-blue-400 to-cyan-300",
    companions: "2 friends",
    status: "upcoming",
  },
];

const STATS = [
  { label: "Trips Completed", value: "4", icon: Plane, color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/20" },
  { label: "States Explored", value: "6", icon: Globe, color: "text-cyan-400", bg: "from-cyan-500/20 to-blue-500/20" },
  { label: "Days Travelled", value: "20", icon: Calendar, color: "text-purple-400", bg: "from-purple-500/20 to-indigo-500/20" },
  { label: "Total Spent", value: "₹1L+", icon: DollarSign, color: "text-green-400", bg: "from-green-500/20 to-teal-500/20" },
];

const ACHIEVEMENTS = [
  { title: "First Trip", desc: "Completed your first journey", icon: "🌱", earned: true },
  { title: "Solo Explorer", desc: "Travelled alone and loved it", icon: "🎒", earned: true },
  { title: "Beach Bum", desc: "Visited 2+ coastal destinations", icon: "🏖", earned: true },
  { title: "Mountain Goat", desc: "Visited a hill station above 2000m", icon: "🏔", earned: true },
  { title: "5-Star Rater", desc: "Gave 5 stars to 3+ trips", icon: "⭐", earned: true },
  { title: "India Collector", desc: "Visit 10+ states", icon: "🗺", earned: false },
  { title: "Budget Master", desc: "Complete a trip under ₹10,000", icon: "💰", earned: false },
  { title: "Group Leader", desc: "Plan a group trip of 5+", icon: "👑", earned: false },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function TravelHistoryPage() {
  const [filter, setFilter] = useState<"all" | "completed" | "upcoming">("all");
  const [selected, setSelected] = useState<TripMemory | null>(null);

  const filtered = MEMORIES.filter(m => filter === "all" ? true : m.status === filter);
  const completed = MEMORIES.filter(m => m.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-28 pb-20">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">Travel History</h1>
          </div>
          <p className="text-muted-foreground">Your journey through Incredible India — every trip, every memory, every rupee well spent.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${bg}`}>
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <div className={`font-black text-2xl ${color}`}>{value}</div>
              <div className="text-muted-foreground text-xs mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Timeline */}
          <div className="lg:col-span-2">
            {/* Filter */}
            <div className="flex gap-2 mb-5">
              {(["all", "completed", "upcoming"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${filter === f ? "bg-purple-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
                  {f}
                </button>
              ))}
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />
              <div className="space-y-6">
                {filtered.map((trip, i) => (
                  <motion.div key={trip.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="relative pl-16">
                    {/* Timeline dot */}
                    <div className={`absolute left-4 top-5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${trip.status === "completed" ? "bg-purple-500 border-purple-400" : "bg-amber-500 border-amber-400"}`}>
                      {trip.status === "completed" ? <Check className="w-3 h-3 text-white" /> : <Plane className="w-3 h-3 text-white" />}
                    </div>

                    <button onClick={() => setSelected(trip === selected ? null : trip)} className="w-full text-left">
                      <div className={`glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all ${selected?.id === trip.id ? "border-purple-500/40" : ""}`}>
                        <div className="flex">
                          <div className="relative w-40 shrink-0">
                            <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                            {trip.status === "upcoming" && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 rounded-full text-xs font-bold text-black">Upcoming</div>
                            )}
                          </div>
                          <div className="p-4 flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-white font-bold text-lg">{trip.destination}</h3>
                                <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                                  <MapPin className="w-3 h-3 text-purple-400" />{trip.state}
                                </div>
                              </div>
                              {trip.status === "completed" && (
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, si) => (
                                    <Star key={si} className={`w-3.5 h-3.5 ${si < trip.rating ? "text-amber-400 fill-amber-400" : "text-white/20"}`} />
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(trip.dateFrom)}</span>
                              <span>{trip.duration} nights</span>
                              {trip.spend > 0 && <span className="text-green-400">₹{trip.spend.toLocaleString("en-IN")}</span>}
                              <span className="flex items-center gap-1 text-purple-300"><Heart className="w-3 h-3" />{trip.companions}</span>
                            </div>
                            {trip.highlights.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {trip.highlights.slice(0, 2).map(h => (
                                  <span key={h} className="px-2 py-0.5 bg-white/5 rounded-full text-white/60 text-xs">{h}</span>
                                ))}
                                {trip.highlights.length > 2 && <span className="text-muted-foreground text-xs">+{trip.highlights.length - 2} more</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded */}
                    {selected?.id === trip.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 glass-card rounded-2xl p-4 border border-purple-500/20">
                        <p className="text-white/60 text-xs font-semibold mb-2">ALL HIGHLIGHTS</p>
                        <div className="flex flex-wrap gap-2">
                          {trip.highlights.map(h => (
                            <span key={h} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm rounded-full">{h}</span>
                          ))}
                        </div>
                        <div className="flex gap-3 mt-4">
                          <Link href="/ai-planner">
                            <Button size="sm" className="bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 rounded-xl">
                              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Plan Again
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Achievements */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-bold">Travel Badges</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ACHIEVEMENTS.map(a => (
                  <div key={a.title} className={`rounded-xl p-3 text-center transition-all ${a.earned ? "bg-amber-500/10 border border-amber-500/20" : "bg-white/3 border border-white/5 opacity-50"}`}>
                    <div className="text-2xl mb-1">{a.icon}</div>
                    <div className={`text-xs font-bold mb-0.5 ${a.earned ? "text-amber-400" : "text-white/40"}`}>{a.title}</div>
                    <div className="text-white/40 text-xs leading-tight">{a.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favourite state */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-white/60 text-xs font-semibold mb-3">YOUR TRAVEL MAP</p>
              <div className="space-y-2">
                {["Goa", "Uttarakhand", "Rajasthan", "Kerala", "Himachal Pradesh"].map((state, i) => (
                  <div key={state} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                    <span className="text-white text-sm flex-1">{state}</span>
                    <div className="flex">
                      {Array.from({ length: 5 - i }).map((_, si) => (
                        <div key={si} className="w-1.5 h-3 rounded-sm bg-purple-500/60 ml-0.5" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/ai-planner">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold border-0 rounded-xl h-11">
                Plan Your Next Trip <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
