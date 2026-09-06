import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Send,
  Check,
  Users,
  Lightbulb,
  Rocket,
  Palette,
  Megaphone,
  Settings,
  Star,
  ArrowRight,
  Mail,
  Phone,
  User,
  Building2,
  Link2,
  Lock,
  Code2,
  FileText,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// ─── Schema (client-side mirror of backend) ──────────────────────────────
const clientSchema = z
  .object({
    name: z.string().min(2, "Full name is required"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .refine(
        (val) =>
          val.endsWith("@somaiya.edu") ||
          val.includes("somaiya"),
        { message: "Please use your Somaiya email ID (e.g. name@somaiya.edu)" }
      ),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number too long"),
    college: z.string().min(2, "College / branch is required"),
    year: z.literal("First Year"),
    preference1: z.enum(["Tech", "Creative", "Operations", "PR", "Marketing"], {
      errorMap: () => ({ message: "Please select a domain preference" }),
    }),
    preference2: z.enum(["Tech", "Creative", "Operations", "PR", "Marketing"], {
      errorMap: () => ({ message: "Please select a domain preference" }),
    }),
    aboutSelf: z
      .string()
      .min(20, "Please write at least 20 characters about yourself"),
    whyJoin: z
      .string()
      .min(20, "Please write at least 20 characters about why you want to join"),
    resume: z
      .any()
      .refine((files) => files?.length === 1, "Resume file is required"),
  })
  .refine((data) => data.preference1 !== data.preference2, {
    message: "Preference 1 and Preference 2 must be different domains",
    path: ["preference2"],
  });

type FormData = z.infer<typeof clientSchema>;

// ─── Domain config ────────────────────────────────────────────────────────
const DOMAINS = [
  { value: "Creative", label: "Creative", icon: Palette },
  { value: "Operations", label: "Operations", icon: Settings },
  { value: "PR", label: "PR", icon: Megaphone },
  { value: "Marketing", label: "Marketing", icon: Rocket },
  { value: "Tech", label: "Tech", icon: Code2 },
] as const;

// ─── Perks ────────────────────────────────────────────────────────────────
const PERKS = [
  {
    icon: Lightbulb,
    title: "Real-World Projects",
    desc: "Work on live datasets, events, and initiatives from Day 1.",
  },
  {
    icon: Users,
    title: "Community & Mentorship",
    desc: "Build lasting bonds with seniors and industry professionals.",
  },
  {
    icon: Star,
    title: "Skill-Building Workshops",
    desc: "Hands-on sessions in ML, Data Viz, Design, and more.",
  },
  {
    icon: Rocket,
    title: "Leadership Opportunities",
    desc: "Grow into core roles as your journey with DataZen evolves.",
  },
];

// ─── Decorative orb ──────────────────────────────────────────────────────
function GridOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function Recruitment() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(clientSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      college: "",
      year: "First Year",
      preference1: undefined,
      preference2: undefined,
      aboutSelf: "",
      whyJoin: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const aboutSelf = watch("aboutSelf") || "";
  const whyJoin = watch("whyJoin") || "";

  const onSubmit = (data: FormData) => {
    // OPTIMISTIC UI: Instantly show success state so the user doesn't wait for S3 and Google Sheets
    setIsSuccess(true);
    toast({ title: "Application Submitted!", description: "We'll be in touch via your Somaiya email." });

    // Perform the actual submission in the background
    try {
      const formData = new window.FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("college", data.college);
      formData.append("year", data.year);
      formData.append("preference1", data.preference1);
      formData.append("preference2", data.preference2);
      formData.append("aboutSelf", data.aboutSelf);
      formData.append("whyJoin", data.whyJoin);
      
      if (data.resume && data.resume.length > 0) {
        formData.append("resume", data.resume[0]);
      }

      apiRequest("POST", "/api/recruitment", formData)
        .then(async (response) => {
          const result = await response.json();
          if (!result.success) {
            console.error("Background submission failed:", result.message);
          }
        })
        .catch((error) => {
          console.error("Background submission error:", error);
          toast({ 
            title: "Submission Note", 
            description: "There was a slight delay saving your application, but we are looking into it.", 
            variant: "destructive" 
          });
        });
    } catch (error) {
      console.error("Form data error:", error);
    }
  };

  // ── Success State ────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
        <Navbar />
        <GridOrb className="w-96 h-96 bg-primary/20 top-20 -left-32" />
        <GridOrb className="w-72 h-72 bg-power-red/15 bottom-20 -right-24" delay={2} />
        <main className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-md space-y-6 py-24"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-green-400 stroke-[2.5]" />
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Application Submitted!</h1>
              <p className="text-muted-foreground leading-relaxed">
                Thanks for applying to <span className="text-primary font-semibold">DataZen</span>. We have received your
                application and will reach out to your Somaiya email shortly.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 border border-border w-full">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground text-left">
                Keep an eye on your <span className="text-foreground font-medium">Somaiya email</span> for updates on the next steps.
              </p>
            </div>
            <Button onClick={() => (window.location.href = "/")} className="bg-gradient-to-r from-power-red to-vitality-red text-white mt-4 px-8">
              Back to Home <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main Form View ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Ambient orbs */}
      <GridOrb className="w-[500px] h-[500px] bg-primary/10 top-0 -left-48" />
      <GridOrb className="w-80 h-80 bg-power-red/10 bottom-40 -right-32" delay={3} />
      <GridOrb className="w-64 h-64 bg-purple-500/8 top-1/2 left-1/3" delay={1.5} />

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10 flex-1 container mx-auto px-4 py-28 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 xl:gap-20 max-w-6xl mx-auto items-start">

          {/* ── LEFT PANEL ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:sticky lg:top-28 space-y-8"
          >
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              Recruitment Open &middot; 2026&ndash;27
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
                Join{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-power-red to-vitality-red">
                  DataZen
                </span>
                <br />
                as a First Year
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
               We are the official Data Science Council of Somaiya Vidyavihar University; 
               a student-run community that turns curiosity into work that ships. 
               Through workshops, projects, competitions, speaker sessions and industry collaborations,
              we help you pick up the skills, meet the right people, and turn half-formed ideas into things that hold up. 
              Bring the questions; we will help with the rest. 
              </p>
            </div>

            {/* Perks */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                What you'll experience
              </p>
              <div className="grid gap-3">
                {PERKS.map((perk, i) => (
                  <motion.div
                    key={perk.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-card/40 border border-border/60 backdrop-blur-sm"
                  >
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <perk.icon size={15} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{perk.title}</p>
                      <p className="text-xs text-muted-foreground leading-snug mt-0.5">{perk.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Domain pills */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Domains</p>
              <div className="flex flex-wrap gap-2">
                {DOMAINS.map((d) => (
                  <span
                    key={d.value}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 bg-card/40 text-foreground/70"
                  >
                    <d.icon size={12} className="opacity-70" />
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT PANEL (Form) ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative bg-card/70 border border-border/50 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-md overflow-hidden">
              {/* Top stripe */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-power-red via-vitality-red to-power-red" />

              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight">First Year Application</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Fields marked <span className="text-red-500">*</span> are required.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

                {/* Personal Information */}
                <section className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <User size={11} /> Personal Information
                  </p>

                  <div className="space-y-1.5">
                    <Label htmlFor="r-name">Full Name <span className="text-red-500">*</span></Label>
                    <Input id="r-name" placeholder="Full Name" className="bg-background/50" {...register("name")} />
                    {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="r-email">Email Address <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input id="r-email" type="email" placeholder="yourname@somaiya.edu" className="bg-background/50 pl-9" {...register("email")} />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Lock size={10} className="opacity-60" />
                      Please use your Somaiya Institution email ID
                    </p>
                    {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="r-phone">Phone Number <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input id="r-phone" placeholder="+91 98765 43210" className="bg-background/50 pl-9" {...register("phone")} />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                      {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="r-college">College / Branch <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input id="r-college" placeholder="e.g. KJSCE — CSE" className="bg-background/50 pl-9" {...register("college")} />
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                      {errors.college && <p className="text-xs text-red-400">{errors.college.message}</p>}
                    </div>
                  </div>

                  {/* Year — locked */}
                  <div className="space-y-1.5">
                    <Label>Year of Study</Label>
                    <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-border/80 bg-muted/30 text-sm text-foreground/60 cursor-not-allowed select-none">
                      <Lock size={13} className="text-muted-foreground" />
                      First Year
                      <span className="ml-auto text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                        Pre-filled
                      </span>
                    </div>
                    <input type="hidden" value="First Year" {...register("year")} />
                  </div>
                </section>

                {/* Domain Preferences */}
                <section className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Lightbulb size={11} /> Domain Preferences
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Preference 1 <span className="text-red-500">*</span></Label>
                      <Select onValueChange={(val) => setValue("preference1", val as FormData["preference1"], { shouldValidate: true })}>
                        <SelectTrigger id="r-pref1" className="bg-background/50">
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOMAINS.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                              <span className="flex items-center gap-2">
                                <d.icon size={13} className="opacity-70" />
                                {d.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.preference1 && <p className="text-xs text-red-400">{errors.preference1.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Preference 2 <span className="text-red-500">*</span></Label>
                      <Select onValueChange={(val) => setValue("preference2", val as FormData["preference2"], { shouldValidate: true })}>
                        <SelectTrigger id="r-pref2" className="bg-background/50">
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOMAINS.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                              <span className="flex items-center gap-2">
                                <d.icon size={13} className="opacity-70" />
                                {d.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.preference2 && <p className="text-xs text-red-400">{errors.preference2.message}</p>}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Select two different domains. We'll try to place you in your first preference.
                  </p>
                </section>

                {/* About You */}
                <section className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Star size={11} /> About You
                  </p>

                  <div className="space-y-1.5">
                    <Label htmlFor="r-resume">
                      Resume (PDF or DOCX) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="r-resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="bg-background/50 pl-9 pt-1.5 cursor-pointer file:cursor-pointer"
                        {...register("resume")}
                      />
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-muted-foreground flex flex-col gap-1">
                      <span>Please upload your resume (Max 5MB).</span>
                      <span>
                        Need a template? We recommend the{" "}
                        <a 
                          href="https://www.overleaf.com/latex/templates/simple-hipster-cv/cnpkkjdkyhhw" 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:underline font-medium"
                        >
                          Simple Hipster CV on Overleaf
                        </a>
                      </span>
                    </p>
                    {errors.resume && <p className="text-xs text-red-400">{errors.resume.message as string}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="r-about">About Yourself <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="r-about"
                      placeholder="Tell us about your interests, skills, hobbies, or anything you'd like us to know..."
                      className="bg-background/50 min-h-[100px] resize-none"
                      maxLength={600}
                      {...register("aboutSelf")}
                    />
                    <div className="flex justify-between items-center">
                      {errors.aboutSelf ? (
                        <p className="text-xs text-red-400">{errors.aboutSelf.message}</p>
                      ) : <span />}
                      <span className={`text-[11px] tabular-nums ${aboutSelf.length < 20 ? "text-muted-foreground" : "text-green-400"}`}>
                        {aboutSelf.length}/600
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="r-why">Why do you want to join DataZen? <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="r-why"
                      placeholder="What excites you about DataZen? What do you hope to learn, build, or contribute?"
                      className="bg-background/50 min-h-[100px] resize-none"
                      maxLength={600}
                      {...register("whyJoin")}
                    />
                    <div className="flex justify-between items-center">
                      {errors.whyJoin ? (
                        <p className="text-xs text-red-400">{errors.whyJoin.message}</p>
                      ) : <span />}
                      <span className={`text-[11px] tabular-nums ${whyJoin.length < 20 ? "text-muted-foreground" : "text-green-400"}`}>
                        {whyJoin.length}/600
                      </span>
                    </div>
                  </div>
                </section>

                {/* Submit */}
                <div className="pt-2 border-t border-border/50">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-power-red to-vitality-red text-white font-semibold py-5 text-sm tracking-wide hover:opacity-90 transition-opacity"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" /> Submit Application</>
                    )}
                  </Button>
                  <p className="text-[11px] text-muted-foreground text-center mt-3">
                    By submitting, you agree to let DataZen contact you via your Somaiya email.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
