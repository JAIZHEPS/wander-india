import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import {
  Heart, Bookmark, Share2, MapPin, Volume2, VolumeX,
  ChevronUp, ChevronDown, Hash, Eye, TrendingUp, X,
  Pause, Play
} from "lucide-react";

interface Reel {
  id: number;
  destination: string;
  state: string;
  image: string;
  video: string;
  description: string;
  hashtags: string[];
  views: string;
  likes: number;
  creator: string;
  duration: string;
  vibe: string;
  vibeColor: string;
  tip: string;
}

const REELS: Reel[] = [
  {
    id: 1,
    destination: "Goa",
    state: "Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=720&h=1280&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-aerial-shot-of-the-beach-and-sea-42095-large.mp4",
    description: "Golden hour at Palolem Beach — where the Arabian Sea meets paradise. Watch the sun dissolve into amber and violet hues over India's most iconic coastline.",
    hashtags: ["GoaBeach", "SunsetVibes", "BeachLife", "IncredibleIndia"],
    views: "2.4M",
    likes: 148200,
    creator: "wanderlust_india",
    duration: "0:45",
    vibe: "Energetic",
    vibeColor: "from-orange-500 to-amber-400",
    tip: "Best visited Oct–Feb. Avoid monsoon season.",
  },
  {
    id: 2,
    destination: "Ladakh",
    state: "Ladakh",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=720&h=1280&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-snowy-mountain-peak-under-blue-sky-42861-large.mp4",
    description: "Pangong Lake glimmering at 14,000 ft above sea level. The crystal blue water changes colours with the sky — a surreal experience unlike anywhere on Earth.",
    hashtags: ["Ladakh", "PangongLake", "HimalayanVibes", "RoofOfWorld"],
    views: "5.1M",
    likes: 312500,
    creator: "himalaya_diaries",
    duration: "1:02",
    vibe: "Serene",
    vibeColor: "from-cyan-500 to-blue-500",
    tip: "Altitude sickness is real — acclimatise in Leh for 2 days first.",
  },
  {
    id: 3,
    destination: "Rajasthan",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=720&h=1280&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-taj-mahal-in-india-under-a-clear-sky-41484-large.mp4",
    description: "The golden city of Jaisalmer rises from the Thar Desert like a sand castle for kings. Every narrow lane whispers stories of Rajput glory and desert romance.",
    hashtags: ["Rajasthan", "Jaisalmer", "DesertVibes", "GoldenCity"],
    views: "3.8M",
    likes: 224100,
    creator: "royal_rajasthan",
    duration: "0:58",
    vibe: "Royal",
    vibeColor: "from-amber-500 to-yellow-400",
    tip: "Camel safari at sunset is unmissable. Book in advance during winter.",
  },
  {
    id: 4,
    destination: "Kerala",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=720&h=1280&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-sun-shining-through-palm-trees-42211-large.mp4",
    description: "A lazy afternoon drifting through the Alleppey backwaters on a houseboat. Kerala's 900 km of serene waterways weave through coconut groves and emerald paddy fields.",
    hashtags: ["Kerala", "Backwaters", "GodsOwnCountry", "HouseboatLife"],
    views: "4.2M",
    likes: 267800,
    creator: "kerala_explorer",
    duration: "1:15",
    vibe: "Calm",
    vibeColor: "from-green-500 to-teal-400",
    tip: "Book an overnight houseboat for the full backwater experience.",
  },
  {
    id: 5,
    destination: "Varanasi",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=720&h=1280&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-ocean-41846-large.mp4",
    description: "The Ganga Aarti at Dashashwamedh Ghat — a thousand flames dancing in the sacred dark. Varanasi doesn't just show you India; it shows you eternity.",
    hashtags: ["Varanasi", "GangaAarti", "SpiritualIndia", "Banaras"],
    views: "6.7M",
    likes: 445000,
    creator: "spiritual_wanderer",
    duration: "0:52",
    vibe: "Spiritual",
    vibeColor: "from-purple-500 to-indigo-500",
    tip: "Arrive at Dashashwamedh Ghat 30 mins early for the Aarti. Morning boat rides are magical.",
  },
  {
    id: 6,
    destination: "Manali",
    state: "Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=720&h=1280&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-snowy-mountain-peak-under-blue-sky-42861-large.mp4",
    description: "Fresh snowfall blankets the Solang Valley — Manali transforms into a winter wonderland. Wake up to peaks so close you could almost reach out and touch them.",
    hashtags: ["Manali", "SnowVibes", "Himalaya", "WinterTravel"],
    views: "3.3M",
    likes: 198400,
    creator: "snowcap_adventures",
    duration: "0:38",
    vibe: "Adventure",
    vibeColor: "from-blue-400 to-cyan-300",
    tip: "Rohtang Pass requires a permit — book online at least a day ahead.",
  },
  {
    id: 7,
    destination: "Rishikesh",
    state: "Uttarakhand",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=720&h=1280&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
    description: "White water rafting on the Ganga through Rishikesh — the yoga capital of the world meets the adventure capital. Sacred vibes meet adrenaline rushes.",
    hashtags: ["Rishikesh", "Rafting", "YogaCapital", "AdventureIndia"],
    views: "2.9M",
    likes: 173600,
    creator: "thrill_seeker_india",
    duration: "1:08",
    vibe: "Adventure",
    vibeColor: "from-emerald-500 to-green-400",
    tip: "Grade 3–4 rapids near Shivpuri are perfect for beginners. Avoid during July–Aug floods.",
  },
  {
    id: 8,
    destination: "Andaman",
    state: "Andaman & Nicobar",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=720&h=1280&fit=crop",
    video: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-aerial-shot-of-the-beach-and-sea-42095-large.mp4",
    description: "Radhanagar Beach at sunset — rated Asia's best beach. The turquoise waters meet white sand in a spectacle so perfect it feels computer-generated.",
    hashtags: ["Andaman", "TropicalIndia", "IslandLife", "BeachParadise"],
    views: "4.8M",
    likes: 301200,
    creator: "island_chronicles",
    duration: "0:49",
    vibe: "Tropical",
    vibeColor: "from-teal-500 to-cyan-400",
    tip: "Scuba diving at Havelock Island — visibility can exceed 30 metres. Book certified operators only.",
  },
];

const REEL_DURATION = 7; // seconds per reel

function formatLikes(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

export default function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wander_liked_reels") || "[]")); } catch { return new Set(); }
  });
  const [saved, setSaved] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wander_saved_reels") || "[]")); } catch { return new Set(); }
  });
  const [muted, setMuted] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [likeBurst, setLikeBurst] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reel = REELS[currentIndex];

  useEffect(() => {
    if (videoRef.current) {
      if (paused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log("Play interrupted:", err));
      }
    }
  }, [paused, currentIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  // Auto-advance when not paused
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => {
      setCurrentIndex(i => (i + 1) % REELS.length);
    }, REEL_DURATION * 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentIndex, paused]);

  const goTo = (idx: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentIndex(idx);
  };

  const handleLike = () => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(reel.id)) next.delete(reel.id); else { next.add(reel.id); setLikeBurst(true); setTimeout(() => setLikeBurst(false), 700); }
      localStorage.setItem("wander_liked_reels", JSON.stringify([...next]));
      return next;
    });
  };

  const handleSave = () => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(reel.id)) next.delete(reel.id); else next.add(reel.id);
      localStorage.setItem("wander_saved_reels", JSON.stringify([...next]));
      return next;
    });
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://wanderindia.app/reels/${reel.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Touch / swipe support
  const touchStartY = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 60) goTo(Math.min(currentIndex + 1, REELS.length - 1));
    else if (delta < -60) goTo(Math.max(currentIndex - 1, 0));
  };

  return (
    <div className="bg-black min-h-screen overflow-hidden">
      <Navbar />

      <div className="flex h-screen pt-[72px]">
        {/* Main Reel Feed */}
        <div
          className="flex-1 flex items-center justify-center relative"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-[360px] mx-auto rounded-2xl overflow-hidden shadow-2xl"
              style={{ height: "calc(100vh - 80px)" }}
              onDoubleClick={handleLike}
            >
              {/* Background Video */}
              <video
                ref={videoRef}
                src={reel.video}
                poster={reel.image}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                autoPlay
                muted={muted}
                loop
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/40" />

              {/* Progress bars */}
              <div className="absolute top-3 left-3 right-14 z-10 flex gap-1">
                {REELS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="flex-1 h-[3px] bg-white/25 rounded-full overflow-hidden"
                  >
                    {i < currentIndex && (
                      <div className="h-full w-full bg-white" />
                    )}
                    {i === currentIndex && !paused && (
                      <motion.div
                        key={`prog-${currentIndex}`}
                        className="h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: REEL_DURATION, ease: "linear" }}
                      />
                    )}
                    {i === currentIndex && paused && (
                      <div className="h-full bg-white/60" style={{ width: "50%" }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Top right controls */}
              <div className="absolute top-2 right-3 z-10 flex flex-col gap-2">
                <button
                  onClick={() => setPaused(p => !p)}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white"
                >
                  {paused ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setMuted(m => !m)}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Like burst */}
              <AnimatePresence>
                {likeBurst && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{}}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                  >
                    <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-lg" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom content */}
              <div className="absolute bottom-4 left-4 right-14 z-10">
                {/* Creator row */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-black text-black shrink-0">
                    {reel.creator[0].toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-semibold">@{reel.creator}</span>
                  <span className="text-white/40 text-xs ml-1">{reel.duration}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-amber-400 font-bold text-sm">{reel.destination}</span>
                  <span className="text-white/50 text-xs">{reel.state}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${reel.vibeColor} text-black`}>{reel.vibe}</span>
                </div>

                {/* Description */}
                <p className="text-white/85 text-sm leading-relaxed mb-2">{reel.description}</p>

                {/* Travel tip */}
                <div className="flex items-start gap-1.5 mb-3 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                  <span className="text-amber-400 text-xs font-bold shrink-0 mt-0.5">✈ Tip:</span>
                  <span className="text-white/80 text-xs leading-relaxed">{reel.tip}</span>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1">
                  {reel.hashtags.map(tag => (
                    <span key={tag} className="text-cyan-400 text-xs font-medium flex items-center gap-0.5">
                      <Hash className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right action buttons */}
              <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-5">
                <button onClick={handleLike} className="flex flex-col items-center gap-1">
                  <motion.div whileTap={{ scale: 1.3 }} className={`w-11 h-11 rounded-full flex items-center justify-center ${liked.has(reel.id) ? "bg-red-500/20" : "bg-black/40 backdrop-blur-sm"}`}>
                    <Heart className={`w-5 h-5 ${liked.has(reel.id) ? "text-red-500 fill-red-500" : "text-white"}`} />
                  </motion.div>
                  <span className="text-white text-xs font-medium">{formatLikes(reel.likes + (liked.has(reel.id) ? 1 : 0))}</span>
                </button>

                <button onClick={handleSave} className="flex flex-col items-center gap-1">
                  <motion.div whileTap={{ scale: 1.3 }} className={`w-11 h-11 rounded-full flex items-center justify-center ${saved.has(reel.id) ? "bg-amber-500/20" : "bg-black/40 backdrop-blur-sm"}`}>
                    <Bookmark className={`w-5 h-5 ${saved.has(reel.id) ? "text-amber-400 fill-amber-400" : "text-white"}`} />
                  </motion.div>
                  <span className="text-white text-xs">Save</span>
                </button>

                <button onClick={() => setShowShare(true)} className="flex flex-col items-center gap-1">
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white/10">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-xs">Share</span>
                </button>

                <Link href="/destinations">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-white text-xs">Explore</span>
                  </div>
                </Link>
              </div>

              {/* Up / Down arrows */}
              <button
                onClick={() => goTo(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="absolute left-1/2 -translate-x-1/2 top-14 z-10 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => goTo(Math.min(REELS.length - 1, currentIndex + 1))}
                disabled={currentIndex === REELS.length - 1}
                className="absolute left-1/2 -translate-x-1/2 bottom-2 z-10 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:flex flex-col w-72 p-5 gap-4 overflow-y-auto">
          {/* Saved count */}
          {saved.size > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-4 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-400 font-semibold text-sm">Saved Reels</span>
              </div>
              <p className="text-white text-2xl font-black">{saved.size}</p>
              <p className="text-white/50 text-xs">destination{saved.size > 1 ? "s" : ""} in your wishlist</p>
            </motion.div>
          )}

          {/* Trending */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-semibold text-sm">Trending Now</span>
            </div>
            <div className="space-y-1">
              {REELS.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => goTo(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${i === currentIndex ? "bg-amber-500/15 border border-amber-500/30" : "hover:bg-white/5"}`}
                >
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                    <img src={r.image} alt={r.destination} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{r.destination}</div>
                    <div className="text-white/50 text-xs flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />{r.views} views
                    </div>
                  </div>
                  {i === currentIndex && <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          {/* Trending hashtags */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-purple-400" />
              <span className="text-white font-semibold text-sm">Trending Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["IncredibleIndia", "GoaBeach", "Ladakh", "Himalaya", "KeralaBackwaters", "RajasthanDiaries", "GangaAarti", "IslandLife", "AdventureIndia", "SpiritualTravel"].map(tag => (
                <span key={tag} className="px-2 py-1 rounded-full bg-white/5 text-cyan-400 text-xs font-medium hover:bg-white/10 cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* How to use */}
          <div className="glass-card rounded-2xl p-4">
            <p className="text-white/60 text-xs font-semibold mb-2">HOW TO USE</p>
            <div className="space-y-2 text-xs text-white/50">
              <div>⬆⬇ Scroll or tap arrows to navigate</div>
              <div>❤️ Double-tap to like a reel</div>
              <div>🔖 Save reels to your wishlist</div>
              <div>⏸ Pause to read tips & details</div>
            </div>
          </div>
        </div>
      </div>

      {/* Share modal */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setShowShare(false)}
          >
            <motion.div
              initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }}
              className="glass-card rounded-t-3xl p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-lg">Share Reel</span>
                <button onClick={() => setShowShare(false)}><X className="w-5 h-5 text-white/60" /></button>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "WhatsApp", color: "bg-green-500/20 text-green-400" },
                  { label: "Instagram", color: "bg-pink-500/20 text-pink-400" },
                  { label: "Twitter/X", color: "bg-blue-500/20 text-blue-400" },
                  { label: "Copy Link", color: "bg-white/10 text-white/70" },
                ].map(({ label, color }) => (
                  <button key={label} onClick={() => { handleCopy(); setShowShare(false); }} className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl ${color} hover:scale-105 transition-all`}>
                    <Share2 className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white/5 rounded-xl">
                <span className="text-white/50 text-sm flex-1 truncate">wanderindia.app/reels/{reel.id}</span>
                <button onClick={handleCopy} className={`text-sm font-semibold shrink-0 transition-colors ${copied ? "text-green-400" : "text-amber-400"}`}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
