import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Users, Plus, X, MapPin, DollarSign, Check, Vote,
  Plane, Calendar, UserPlus, Trash2, ThumbsUp, ThumbsDown,
  Share2, Copy, Crown, Globe, ChevronRight
} from "lucide-react";

interface Member {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: "Admin" | "Member";
}

interface DestinationVote {
  destination: string;
  image: string;
  state: string;
  votes: { memberId: number; vote: "yes" | "no" | null }[];
}

interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: number;
  splitAmong: number[];
}

const PALETTE = ["from-amber-400 to-orange-500", "from-cyan-400 to-blue-500", "from-purple-400 to-indigo-500", "from-green-400 to-teal-500", "from-pink-400 to-rose-500", "from-yellow-400 to-amber-500"];

const SUGGESTED_DESTINATIONS = [
  { destination: "Goa", state: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=200&fit=crop" },
  { destination: "Manali", state: "Himachal Pradesh", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" },
  { destination: "Ladakh", state: "Ladakh", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
  { destination: "Kerala", state: "Kerala", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&h=200&fit=crop" },
  { destination: "Rajasthan", state: "Rajasthan", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&h=200&fit=crop" },
  { destination: "Rishikesh", state: "Uttarakhand", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&h=200&fit=crop" },
];

export default function GroupPlannerPage() {
  const [step, setStep] = useState<"setup" | "plan">("setup");
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "You (Admin)", email: "you@email.com", avatar: "Y", role: "Admin" },
  ]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [totalBudget, setTotalBudget] = useState(50000);
  const [travelDates, setTravelDates] = useState({ from: "", to: "" });
  const [votes, setVotes] = useState<DestinationVote[]>(
    SUGGESTED_DESTINATIONS.map(d => ({
      ...d,
      votes: [],
    }))
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expPaidBy, setExpPaidBy] = useState(1);
  const [activeTab, setActiveTab] = useState<"vote" | "budget" | "checklist">("vote");
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Book flights / train tickets", done: false },
    { id: 2, text: "Book accommodation", done: false },
    { id: 3, text: "Apply for permits (if needed)", done: false },
    { id: 4, text: "Travel insurance", done: false },
    { id: 5, text: "Pack essentials", done: false },
    { id: 6, text: "Inform emergency contacts", done: false },
    { id: 7, text: "Currency / UPI setup", done: false },
    { id: 8, text: "Offline maps downloaded", done: false },
  ]);
  const [newCheckItem, setNewCheckItem] = useState("");
  const [copied, setCopied] = useState(false);

  const addMember = () => {
    if (!newName.trim()) return;
    const id = Date.now();
    setMembers(prev => [...prev, {
      id,
      name: newName.trim(),
      email: newEmail.trim(),
      avatar: newName.trim()[0].toUpperCase(),
      role: "Member",
    }]);
    setNewName(""); setNewEmail("");
  };

  const removeMember = (id: number) => setMembers(prev => prev.filter(m => m.id !== id));

  const castVote = (destIdx: number, memberId: number, vote: "yes" | "no") => {
    setVotes(prev => prev.map((v, i) => {
      if (i !== destIdx) return v;
      const existing = v.votes.find(x => x.memberId === memberId);
      if (existing) {
        return { ...v, votes: v.votes.map(x => x.memberId === memberId ? { ...x, vote: x.vote === vote ? null : vote } : x) };
      }
      return { ...v, votes: [...v.votes, { memberId, vote }] };
    }));
  };

  const getVoteCount = (dest: DestinationVote, type: "yes" | "no") =>
    dest.votes.filter(v => v.vote === type).length;

  const addExpense = () => {
    if (!expDesc.trim() || !expAmount) return;
    setExpenses(prev => [...prev, {
      id: Date.now(),
      description: expDesc.trim(),
      amount: Number(expAmount),
      paidBy: expPaidBy,
      splitAmong: members.map(m => m.id),
    }]);
    setExpDesc(""); setExpAmount("");
  };

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = members.length ? Math.round(totalExpenses / members.length) : 0;

  const memberBalance = (memberId: number) => {
    let paid = 0, owes = 0;
    expenses.forEach(e => {
      if (e.paidBy === memberId) paid += e.amount;
      if (e.splitAmong.includes(memberId)) owes += e.amount / e.splitAmong.length;
    });
    return Math.round(paid - owes);
  };

  const sortedVotes = [...votes].sort((a, b) => getVoteCount(b, "yes") - getVoteCount(a, "yes"));
  const winner = sortedVotes[0] && getVoteCount(sortedVotes[0], "yes") > 0 ? sortedVotes[0] : null;

  const nights = travelDates.from && travelDates.to
    ? Math.max(0, Math.round((new Date(travelDates.to).getTime() - new Date(travelDates.from).getTime()) / 86400000))
    : 0;

  if (step === "setup") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-28 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white">Group Planner</h1>
            </div>
            <p className="text-muted-foreground mb-8">Plan your trip together — vote on destinations, split costs, manage the group checklist.</p>

            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div>
                <label className="text-white/60 text-sm font-medium block mb-1.5">Group Name</label>
                <input
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="e.g. Goa Squad 2026 🏖"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm font-medium block mb-1.5"><Calendar className="w-3 h-3 inline mr-1" />From</label>
                  <input type="date" value={travelDates.from} onChange={e => setTravelDates(d => ({ ...d, from: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="text-white/60 text-sm font-medium block mb-1.5"><Calendar className="w-3 h-3 inline mr-1" />To</label>
                  <input type="date" value={travelDates.to} onChange={e => setTravelDates(d => ({ ...d, to: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>

              <div>
                <label className="text-white/60 text-sm font-medium block mb-1.5"><DollarSign className="w-3 h-3 inline mr-1" />Total Group Budget: ₹{totalBudget.toLocaleString("en-IN")}</label>
                <input type="range" min={5000} max={500000} step={5000} value={totalBudget} onChange={e => setTotalBudget(Number(e.target.value))} className="w-full accent-cyan-500" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹5,000</span><span>₹5,00,000</span></div>
              </div>

              <div>
                <label className="text-white/60 text-sm font-medium block mb-3"><UserPlus className="w-3 h-3 inline mr-1" />Add Members</label>
                <div className="flex gap-2 mb-3">
                  <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" onKeyDown={e => e.key === "Enter" && addMember()}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50" />
                  <input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email (optional)" onKeyDown={e => e.key === "Enter" && addMember()}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50" />
                  <button onClick={addMember} className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/30">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {members.map((m, i) => (
                    <div key={m.id} className="flex items-center gap-3 px-3 py-2 bg-white/3 rounded-xl">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${PALETTE[i % PALETTE.length]} flex items-center justify-center text-sm font-black text-white shrink-0`}>
                        {m.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium flex items-center gap-1.5">
                          {m.name}
                          {m.role === "Admin" && <Crown className="w-3 h-3 text-amber-400" />}
                        </div>
                        {m.email && <div className="text-muted-foreground text-xs">{m.email}</div>}
                      </div>
                      {m.role !== "Admin" && (
                        <button onClick={() => removeMember(m.id)} className="text-white/30 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep("plan")}
                disabled={!groupName.trim() || members.length < 1}
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold border-0 rounded-xl disabled:opacity-40"
              >
                Start Planning <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
        {/* Group Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                {groupName} <span className="text-lg">✈️</span>
              </h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{members.length} members</span>
                {nights > 0 && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{nights} nights</span>}
                <span className="flex items-center gap-1 text-amber-400"><DollarSign className="w-3.5 h-3.5" />₹{totalBudget.toLocaleString("en-IN")} budget</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {members.slice(0, 5).map((m, i) => (
                  <div key={m.id} className={`w-8 h-8 rounded-full bg-gradient-to-br ${PALETTE[i % PALETTE.length]} flex items-center justify-center text-xs font-black text-white border-2 border-background`}>
                    {m.avatar}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText("https://wanderindia.app/group/abc123"); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${copied ? "border-green-500/40 bg-green-500/10 text-green-400" : "border-white/10 bg-white/5 text-white/60 hover:text-white"}`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Invite Link"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([["vote", "🗳 Vote on Destination"], ["budget", "💰 Expenses"], ["checklist", "✅ Checklist"]] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Vote Tab */}
        {activeTab === "vote" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {winner && (
              <div className="glass-card rounded-2xl p-4 mb-6 border border-amber-500/30 flex items-center gap-4">
                <img src={winner.image} alt={winner.destination} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <div className="text-amber-400 text-xs font-bold mb-0.5 flex items-center gap-1"><Crown className="w-3 h-3" /> LEADING DESTINATION</div>
                  <div className="text-white font-black text-xl">{winner.destination}</div>
                  <div className="text-muted-foreground text-sm">{getVoteCount(winner, "yes")} of {members.length} voted yes</div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedVotes.map((dest, destIdx) => {
                const realIdx = votes.findIndex(v => v.destination === dest.destination);
                const yesCount = getVoteCount(dest, "yes");
                const noCount = getVoteCount(dest, "no");
                const myVote = dest.votes.find(v => v.memberId === 1)?.vote ?? null;
                return (
                  <div key={dest.destination} className="glass-card rounded-2xl overflow-hidden">
                    <div className="relative h-36">
                      <img src={dest.image} alt={dest.destination} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <div className="text-white font-black text-lg">{dest.destination}</div>
                        <div className="text-white/60 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{dest.state}</div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span className="text-green-400 font-semibold">{yesCount} yes</span>
                        <span className="text-red-400 font-semibold">{noCount} no</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
                          style={{ width: members.length ? `${(yesCount / members.length) * 100}%` : "0%" }} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => castVote(realIdx, 1, "yes")}
                          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-sm font-semibold transition-all ${myVote === "yes" ? "bg-green-500/20 border border-green-500/40 text-green-400" : "bg-white/5 text-white/60 hover:bg-green-500/10 hover:text-green-400"}`}>
                          <ThumbsUp className="w-4 h-4" /> Yes
                        </button>
                        <button onClick={() => castVote(realIdx, 1, "no")}
                          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-sm font-semibold transition-all ${myVote === "no" ? "bg-red-500/20 border border-red-500/40 text-red-400" : "bg-white/5 text-white/60 hover:bg-red-500/10 hover:text-red-400"}`}>
                          <ThumbsDown className="w-4 h-4" /> No
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Budget / Expenses Tab */}
        {activeTab === "budget" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Budget", value: `₹${totalBudget.toLocaleString("en-IN")}`, color: "text-cyan-400" },
                { label: "Total Spent", value: `₹${totalExpenses.toLocaleString("en-IN")}`, color: totalExpenses > totalBudget ? "text-red-400" : "text-amber-400" },
                { label: "Per Person", value: `₹${perPerson.toLocaleString("en-IN")}`, color: "text-green-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass-card rounded-2xl p-4 text-center">
                  <div className={`font-black text-xl ${color}`}>{value}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Budget bar */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Budget used</span>
                <span className="text-white font-medium">{Math.min(100, Math.round((totalExpenses / totalBudget) * 100))}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${totalExpenses > totalBudget ? "bg-red-500" : "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (totalExpenses / totalBudget) * 100)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {/* Add Expense */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">Add Expense</h3>
              <div className="flex gap-3 flex-wrap">
                <input value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="Description (e.g. Hotel booking)"
                  className="flex-1 min-w-40 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50" />
                <input value={expAmount} onChange={e => setExpAmount(e.target.value)} type="number" placeholder="Amount ₹"
                  className="w-36 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50" />
                <select value={expPaidBy} onChange={e => setExpPaidBy(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50">
                  {members.map(m => <option key={m.id} value={m.id} className="bg-gray-900">{m.name}</option>)}
                </select>
                <Button onClick={addExpense} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 rounded-xl px-5">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>

            {/* Expenses list */}
            {expenses.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-white font-bold mb-4">Expenses</h3>
                <div className="space-y-2">
                  {expenses.map(e => {
                    const payer = members.find(m => m.id === e.paidBy);
                    return (
                      <div key={e.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div>
                          <div className="text-white text-sm font-medium">{e.description}</div>
                          <div className="text-muted-foreground text-xs">Paid by {payer?.name} · split {e.splitAmong.length} ways</div>
                        </div>
                        <div className="text-amber-400 font-bold">₹{e.amount.toLocaleString("en-IN")}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Balances */}
            {expenses.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-white font-bold mb-4">Who Owes What</h3>
                <div className="space-y-2">
                  {members.map((m, i) => {
                    const bal = memberBalance(m.id);
                    return (
                      <div key={m.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${PALETTE[i % PALETTE.length]} flex items-center justify-center text-xs font-black text-white shrink-0`}>{m.avatar}</div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{m.name}</div>
                        </div>
                        <div className={`font-bold text-sm ${bal >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {bal >= 0 ? `+₹${bal.toLocaleString("en-IN")}` : `-₹${Math.abs(bal).toLocaleString("en-IN")}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Checklist Tab */}
        {activeTab === "checklist" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Trip Checklist</h3>
              <span className="text-muted-foreground text-sm">{checklist.filter(c => c.done).length}/{checklist.length} done</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full mb-5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                animate={{ width: `${(checklist.filter(c => c.done).length / checklist.length) * 100}%` }}
              />
            </div>
            <div className="space-y-2 mb-5">
              {checklist.map(item => (
                <button key={item.id} onClick={() => setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, done: !c.done } : c))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${item.done ? "bg-cyan-500/10 border border-cyan-500/20" : "hover:bg-white/5"}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${item.done ? "border-cyan-500 bg-cyan-500" : "border-white/30"}`}>
                    {item.done && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${item.done ? "text-white/50 line-through" : "text-white"}`}>{item.text}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newCheckItem} onChange={e => setNewCheckItem(e.target.value)} placeholder="Add custom checklist item..."
                onKeyDown={e => { if (e.key === "Enter" && newCheckItem.trim()) { setChecklist(prev => [...prev, { id: Date.now(), text: newCheckItem.trim(), done: false }]); setNewCheckItem(""); } }}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50" />
              <Button onClick={() => { if (newCheckItem.trim()) { setChecklist(prev => [...prev, { id: Date.now(), text: newCheckItem.trim(), done: false }]); setNewCheckItem(""); } }}
                className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 border-0 rounded-xl">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
