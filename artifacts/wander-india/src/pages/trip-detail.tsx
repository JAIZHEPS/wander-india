import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetTrip, getGetTripQueryKey, useListExpenses, getListExpensesQueryKey, useCreateExpense, useDeleteExpense } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Calendar, DollarSign, Plus, Trash2, Loader2, ChevronDown, ChevronUp, Plane, Utensils, Home, Lightbulb, Brain } from "lucide-react";

const expenseSchema = z.object({
  category: z.string().min(1, "Select category"),
  amount: z.coerce.number().min(1, "Enter amount"),
  description: z.string().min(1, "Enter description"),
  date: z.string().min(1, "Enter date"),
});
type ExpenseForm = z.infer<typeof expenseSchema>;

const CATEGORIES = ["Food", "Transport", "Accommodation", "Activities", "Shopping", "Other"];

export default function TripDetailPage() {
  return <ProtectedRoute><TripContent /></ProtectedRoute>;
}

function TripContent() {
  const [, params] = useRoute("/trips/:id");
  const id = Number(params?.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"itinerary" | "expenses">("itinerary");
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  const { data: trip, isLoading } = useGetTrip(id, { query: { enabled: !!id, queryKey: getGetTripQueryKey(id) } });
  const { data: expenses = [], isLoading: expLoading } = useListExpenses(id, { query: { enabled: !!id, queryKey: getListExpensesQueryKey(id) } });
  const addExpense = useCreateExpense();
  const removeExpense = useDeleteExpense();

  const form = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { category: "", amount: 0, description: "", date: new Date().toISOString().split("T")[0] },
  });

  const onAddExpense = async (data: ExpenseForm) => {
    try {
      await addExpense.mutateAsync({ tripId: id, data });
      queryClient.invalidateQueries({ queryKey: getListExpensesQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(id) });
      form.reset({ category: "", amount: 0, description: "", date: new Date().toISOString().split("T")[0] });
      toast({ title: "Expense added!" });
    } catch {
      toast({ title: "Failed to add expense", variant: "destructive" });
    }
  };

  const handleRemove = async (expenseId: number) => {
    try {
      await removeExpense.mutateAsync({ tripId: id, expenseId });
      queryClient.invalidateQueries({ queryKey: getListExpensesQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(id) });
      toast({ title: "Expense removed" });
    } catch {
      toast({ title: "Failed to remove expense", variant: "destructive" });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background"><Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20"><Skeleton className="h-48 rounded-2xl" /></div>
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen bg-background flex items-center justify-center"><Navbar />
      <div className="text-center text-white">Trip not found. <Link href="/trips"><span className="text-amber-400 cursor-pointer">Back to trips</span></Link></div>
    </div>
  );

  const spent = trip.spentAmount || 0;
  const budget = trip.totalBudget || 0;
  const remaining = budget - spent;
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const byCategory: Record<string, number> = {};
  expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });

  let itineraryDays: any[] = [];
  if (trip?.itinerary) {
    try {
      itineraryDays = JSON.parse(trip.itinerary);
    } catch (e) {
      console.error("Failed to parse itinerary", e);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <Link href="/trips">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Trips
          </Button>
        </Link>

        {/* Trip Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            {trip.destinationImage ? (
              <img src={trip.destinationImage} alt={trip.destinationName} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-black text-white">{trip.destinationName}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{trip.startDate} → {trip.endDate}</span>
              </div>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${trip.status === "upcoming" ? "bg-cyan-500/20 text-cyan-400" : "bg-green-500/20 text-green-400"}`}>
                {trip.status}
              </span>
            </div>
          </div>

          {/* Budget overview */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Budget</div>
              <div className="text-xl font-black text-white">₹{budget.toLocaleString("en-IN")}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Spent</div>
              <div className="text-xl font-black text-amber-400">₹{spent.toLocaleString("en-IN")}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Remaining</div>
              <div className={`text-xl font-black ${remaining < 0 ? "text-red-400" : "text-green-400"}`}>₹{Math.abs(remaining).toLocaleString("en-IN")}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{pct.toFixed(0)}% spent</span>
              <span>{(100 - pct).toFixed(0)}% remaining</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-cyan-500"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 border-b border-white/5 pb-px">
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === "itinerary"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-white/55 hover:text-white"
            }`}
          >
            Itinerary
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === "expenses"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-white/55 hover:text-white"
            }`}
          >
            Expenses & Budget
          </button>
        </div>

        {activeTab === "itinerary" && (
          <div className="space-y-4">
            {itineraryDays.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-float" />
                <p className="text-muted-foreground mb-4">No itinerary generated for this trip yet.</p>
                <Link href={`/ai-planner?destination=${encodeURIComponent(trip.destinationName)}`}>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold border-0 rounded-xl">
                    Generate Itinerary
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {itineraryDays.map((day: any, idx: number) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card rounded-2xl overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between p-5 text-left"
                      onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                          D{day.day}
                        </div>
                        <div>
                          <div className="text-white font-bold">{day.title}</div>
                          <div className="text-muted-foreground text-xs mt-0.5">
                            {day.activities?.length || 0} activities · {day.meals?.length || 0} meals
                          </div>
                        </div>
                      </div>
                      {expandedDay === idx ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                    </button>

                    <AnimatePresence>
                      {expandedDay === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5 px-5 pb-5 space-y-5 overflow-hidden"
                        >
                          <div className="grid md:grid-cols-3 gap-5 pt-5">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Plane className="w-4 h-4 text-amber-400" />
                                <span className="text-white font-semibold text-sm">Activities</span>
                              </div>
                              <ul className="space-y-2">
                                {day.activities?.map((a: string, i: number) => (
                                  <li key={i} className="text-muted-foreground text-sm flex gap-2">
                                    <span className="text-amber-400 flex-shrink-0">·</span>{a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Utensils className="w-4 h-4 text-cyan-400" />
                                <span className="text-white font-semibold text-sm">Meals</span>
                              </div>
                              <ul className="space-y-2">
                                {day.meals?.map((m: string, i: number) => (
                                  <li key={i} className="text-muted-foreground text-sm flex gap-2">
                                    <span className="text-cyan-400 flex-shrink-0">·</span>{m}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Home className="w-4 h-4 text-purple-400" />
                                <span className="text-white font-semibold text-sm">Stay</span>
                              </div>
                              <p className="text-muted-foreground text-sm leading-relaxed">{day.accommodation}</p>
                            </div>
                          </div>
                          {day.tips && (
                            <div className="pt-3 border-t border-white/5 flex gap-2.5">
                              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-white font-bold text-xs uppercase tracking-wider">Day Tip: </span>
                                <span className="text-muted-foreground text-xs">{day.tips}</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Expense */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
              <h2 className="text-white font-bold mb-5 flex items-center gap-2"><Plus className="w-4 h-4 text-amber-400" /> Add Expense</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onAddExpense)} className="space-y-4">
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-sm">Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white rounded-xl">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-white/10">
                          {CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-white">{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="amount" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-sm">Amount (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="500" className="h-10 bg-white/5 border-white/10 text-white rounded-xl" data-testid="input-amount" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70 text-sm">Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="h-10 bg-white/5 border-white/10 text-white rounded-xl" data-testid="input-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-sm">Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Lunch at beach shack" className="h-10 bg-white/5 border-white/10 text-white rounded-xl" data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={addExpense.isPending} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold border-0 rounded-xl h-10" data-testid="btn-add-expense">
                    {addExpense.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Expense"}
                  </Button>
                </form>
              </Form>
            </motion.div>

            {/* Expenses list */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-white font-bold mb-4">Expenses ({expenses.length})</h2>
              {expLoading ? (
                <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
              ) : expenses.length === 0 ? (
                <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">No expenses yet. Add your first one!</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {expenses.map(e => (
                    <div key={e.id} className="glass-card rounded-xl p-4 flex items-center gap-3" data-testid={`expense-${e.id}`}>
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{e.description}</div>
                        <div className="text-muted-foreground text-xs">{e.category} · {e.date}</div>
                      </div>
                      <div className="text-amber-400 font-semibold text-sm flex-shrink-0">₹{e.amount.toLocaleString("en-IN")}</div>
                      <button onClick={() => handleRemove(e.id)} className="text-red-400/50 hover:text-red-400 transition-colors flex-shrink-0" data-testid={`btn-remove-expense-${e.id}`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* By category */}
              {Object.keys(byCategory).length > 0 && (
                <div className="glass-card rounded-xl p-4 mt-4">
                  <div className="text-white/70 text-sm mb-3 font-medium">By Category</div>
                  <div className="space-y-2">
                    {Object.entries(byCategory).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => (
                      <div key={cat} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{cat}</span>
                        <span className="text-white font-medium">₹{amt.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
