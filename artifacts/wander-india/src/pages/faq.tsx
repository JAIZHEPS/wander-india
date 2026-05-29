import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Search, ChevronDown, ChevronUp, MessageSquare, Phone,
  HelpCircle, CreditCard, User, Brain, Plane, Shield, Globe
} from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  // Account
  { id: 1, category: "Account", question: "How do I create a WanderIndia account?", answer: "Click 'Get Started' in the top navigation or visit /register. Enter your full name, email, and a password (minimum 6 characters). You'll be logged in instantly — no email verification needed for a smooth start." },
  { id: 2, category: "Account", question: "I forgot my password. How do I reset it?", answer: "On the login page, click 'Forgot Password'. Enter your registered email and we'll send a reset link within 2 minutes. Check your spam folder if you don't receive it. The link expires in 30 minutes for security." },
  { id: 3, category: "Account", question: "Can I change my profile name and bio?", answer: "Yes! Go to your Profile page from the dashboard. Click 'Edit Profile' to update your name, bio, and location. Changes save instantly and reflect across the platform." },
  { id: 4, category: "Account", question: "How do I delete my account?", answer: "We're sad to see you go! To delete your account, go to Profile → Settings → Delete Account. This permanently removes all your trips, bookings, and personal data. This action cannot be undone." },

  // AI Features
  { id: 5, category: "AI Features", question: "How does the AI Itinerary Generator work?", answer: "Our rule-based AI analyses your chosen destination, number of days, travel style, and budget. It generates a detailed day-by-day plan including recommended activities, meal spots, accommodation types, and insider tips — all curated specifically for Indian travel." },
  { id: 6, category: "AI Features", question: "What is the Mood Travel Engine?", answer: "The Mood Travel Engine maps your current emotional state (adventurous, romantic, spiritual, etc.) to the perfect Indian destination. Select your mood and we recommend destinations, activities, and travel styles that match your vibe. It's powered by a curated knowledge base of 15+ destinations." },
  { id: 7, category: "AI Features", question: "Is the AI chatbot available 24/7?", answer: "Yes, the AI Travel Assistant chatbot is always available. It answers questions about Indian destinations, gives travel tips, helps with packing, and provides safety advice. It's context-aware and understands follow-up questions within the same conversation." },
  { id: 8, category: "AI Features", question: "How accurate is the AI packing list?", answer: "The packing list generator factors in your destination, travel dates (season), planned activities, and trip duration. It covers clothing, toiletries, documents, electronics, and destination-specific items like UV protection for Rajasthan or rain gear for Kerala." },

  // Bookings
  { id: 9, category: "Bookings", question: "How do I book a hotel through WanderIndia?", answer: "Browse the Hotels & Stays page, use filters to find your ideal stay, and click 'Book Now'. Select your room type, check-in/check-out dates, and number of guests. Review the total (including 12% taxes) and confirm. You'll receive a booking reference immediately." },
  { id: 10, category: "Bookings", question: "Can I cancel a hotel booking?", answer: "Most bookings offer free cancellation up to 48 hours before check-in. The cancellation policy is shown clearly in the booking confirmation. After 48 hours, a one-night cancellation fee applies. Go to My Trips to manage your bookings." },
  { id: 11, category: "Bookings", question: "How does restaurant reservation work?", answer: "Visit the Restaurants page, find your restaurant, and click 'Reserve Table'. Choose your date, time slot, number of guests, and enter your name and phone number. The restaurant will confirm your reservation within 30 minutes via call or WhatsApp." },
  { id: 12, category: "Bookings", question: "Is advance payment required for bookings?", answer: "Restaurant reservations are completely free and require no payment upfront. Hotel bookings show a price breakdown for your reference — actual payment is collected at check-in or via the hotel's preferred method." },

  // Trips & Planning
  { id: 13, category: "Planning", question: "How do I save a trip to My Trips?", answer: "From any destination detail page, click 'Save as Trip'. You can also create trips manually in the My Trips section by entering a destination, dates, and budget. Track trip status (Planning, Confirmed, Completed) and add expenses." },
  { id: 14, category: "Planning", question: "What is the Group Planner?", answer: "The Group Planner lets you organise trips with friends and family. Add members, vote collectively on destinations, track shared expenses with automatic cost-splitting, and manage a group checklist. Share an invite link so everyone can join." },
  { id: 15, category: "Planning", question: "How does the Budget Tracker work?", answer: "The Budget Tracker shows you a breakdown of spending across all your trips — by category (accommodation, food, transport, activities) and by trip. Set a budget for each trip and track how you're spending in real time." },
  { id: 16, category: "Planning", question: "What's the difference between Hidden Gems and regular Destinations?", answer: "Our curated Destinations include India's most popular spots. Hidden Gems are off-beat, less-touristy alternatives — places like Spiti Valley, Majuli Island, Hampi, and Ziro Valley that offer incredible experiences away from the crowds." },

  // Safety & General
  { id: 17, category: "Safety", question: "What emergency resources does WanderIndia provide?", answer: "The Emergency Assistance page has all essential India emergency contacts: Police (100), Ambulance (102), Fire (101), Tourist Helpline (1800-111-363), Women's Helpline (1091), and Disaster Management (108). All numbers are tap-to-call." },
  { id: 18, category: "Safety", question: "Is my personal data secure?", answer: "We take privacy seriously. Passwords are hashed using bcrypt and never stored in plaintext. Auth tokens are stored in your browser's localStorage and expire after 7 days. We do not sell or share your data with third parties." },
  { id: 19, category: "Safety", question: "Is WanderIndia's AI safe for travel planning?", answer: "Our AI features are designed to be helpful and informative, but always verify critical details (permits, entry requirements, seasonal closures) from official sources before travel. We recommend checking official tourism board websites for your destination." },
  { id: 20, category: "General", question: "Is WanderIndia available as a mobile app?", answer: "The web app is fully responsive and works beautifully on mobile browsers. Tap 'Add to Home Screen' in your browser menu for an app-like experience. A dedicated mobile app is in development." },
];

const CATEGORIES = [
  { name: "All", icon: Globe },
  { name: "Account", icon: User },
  { name: "AI Features", icon: Brain },
  { name: "Bookings", icon: CreditCard },
  { name: "Planning", icon: Plane },
  { name: "Safety", icon: Shield },
  { name: "General", icon: HelpCircle },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<number | null>(null);

  const filtered = FAQS.filter(f => {
    const matchesSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || f.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    const items = filtered.filter(f => f.category === cat.name);
    if (items.length) acc[cat.name] = items;
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to know about planning your perfect Indian adventure with WanderIndia.</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50 text-lg"
          />
        </motion.div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveCategory(name)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === name ? "bg-blue-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
            >
              <Icon className="w-3.5 h-3.5" />{name}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">Try different keywords or browse all categories</p>
            <Button onClick={() => { setSearch(""); setActiveCategory("All"); }} variant="outline" className="border-white/20 text-white rounded-xl">Clear filters</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {activeCategory === "All" ? (
              Object.entries(grouped).map(([catName, items]) => {
                const CatIcon = CATEGORIES.find(c => c.name === catName)?.icon || HelpCircle;
                return (
                  <div key={catName}>
                    <div className="flex items-center gap-2 mb-3">
                      <CatIcon className="w-4 h-4 text-blue-400" />
                      <h2 className="text-white font-bold text-sm uppercase tracking-wider">{catName}</h2>
                      <span className="text-muted-foreground text-xs">({items.length})</span>
                    </div>
                    <div className="space-y-2">
                      {items.map(faq => <FAQCard key={faq.id} faq={faq} open={openId === faq.id} onToggle={() => setOpenId(openId === faq.id ? null : faq.id)} />)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="space-y-2">
                {filtered.map(faq => <FAQCard key={faq.id} faq={faq} open={openId === faq.id} onToggle={() => setOpenId(openId === faq.id ? null : faq.id)} />)}
              </div>
            )}
          </div>
        )}

        {/* Still need help */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12 glass-card rounded-2xl p-8 text-center border border-blue-500/20">
          <h2 className="text-white font-black text-2xl mb-2">Still need help?</h2>
          <p className="text-muted-foreground mb-6">Our support team is always here to assist you on your Indian adventure.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold border-0 rounded-xl h-11 px-6">
                <MessageSquare className="w-4 h-4 mr-2" /> AI Chat Support
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white/20 text-white rounded-xl h-11 px-6">
                <Phone className="w-4 h-4 mr-2" /> Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FAQCard({ faq, open, onToggle }: { faq: FAQItem; open: boolean; onToggle: () => void }) {
  return (
    <motion.div layout className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-all"
      >
        <span className={`font-medium text-sm pr-4 leading-relaxed ${open ? "text-white" : "text-white/85"}`}>{faq.question}</span>
        {open ? <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 text-muted-foreground text-sm leading-relaxed border-t border-white/5">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
