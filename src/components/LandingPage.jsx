import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Code2, Heart, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl hover:-translate-y-2 transition-transform duration-300"
  >
    <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-6 text-pink-500">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] dark:bg-zinc-950 font-sans overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-[800px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-rose-400/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[60%] bg-purple-400/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] left-[20%] w-[60%] h-[60%] bg-pink-400/20 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-8 mb-6 mt-4 md:mt-0 relative flex justify-center w-full"
          >
            <AnimatePresence mode="popLayout">
              {(() => {
                const phrases = [
                  "💬 Network with like-minded devs.",
                  "👨‍💻 Find your perfect dev match!",
                  "🤝 Collaborate on exciting projects.",
                  "🚀 Launch your next startup idea."
                ];
                const [index, setIndex] = React.useState(0);
                React.useEffect(() => {
                  const timer = setInterval(() => {
                    setIndex((prev) => (prev + 1) % phrases.length);
                  }, 3000);
                  return () => clearInterval(timer);
                }, []);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute text-lg text-black/60 dark:text-white/80 font-medium"
                  >
                    {phrases[index]}
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-pink-100 text-pink-600 mb-8 font-medium shadow-sm"
          >
            <Sparkles size={16} />
            <span>Find your perfect pair-programming partner</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 dark:text-white"
          >
            Swipe Right on
            <br />
            <span className="text-romantic">
              Great Code.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-12"
          >
            Join the most exclusive community of developers looking to collaborate, build, and spark a connection over shared tech stacks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="romantic" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full font-bold group">
                Create Account
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full overflow-hidden mt-16 mt-20 relative before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r before:from-[#fafafa] dark:before:from-zinc-950 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 after:bg-gradient-to-l after:from-[#fafafa] dark:after:from-zinc-950 after:to-transparent"
          >
            <motion.div
              className="inline-block whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            >
              {[
                "Frontend Developer", "Backend Engineer", "Full-Stack Dev", "Open Source Lover", "ReactJS", "Node.js", "MongoDB", "Machine Learning", "Python", "TypeScript",
                "Frontend Developer", "Backend Engineer", "Full-Stack Dev", "Open Source Lover", "ReactJS", "Node.js", "MongoDB", "Machine Learning", "Python", "TypeScript"
              ].map((tag, i) => (
                <span key={i} className="mx-3 text-sm text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 px-4 py-1.5 rounded-full inline-block font-medium border border-pink-200 dark:border-pink-800/50 shadow-sm">
                  #{tag}
                </span>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Social Proof / Trusted By */}
      <section className="py-10 border-y border-border/50 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">
            Developers building the future are connecting here
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Mock Company Vectors */}
            <div className="text-2xl font-black font-serif">Startup Engineers</div>
            <div className="text-2xl font-black font-sans tracking-tighter">Open-Source Contributors</div>
            <div className="text-2xl font-bold flex items-center gap-1"><CloudLightning /> Indie Hackers</div>
            <div className="text-2xl font-black italic">System Architects</div>
            <div className="text-2xl font-black tracking-tight">Tech Enthusiasts</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Developers.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              devTinder isn't just another dating app. It's a platform built specifically to match you based on what really matters: your tech stack.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              delay={0.1}
              icon={Code2}
              title="Stack Matching"
              description="Our proprietary algorithm matches you with developers who complement your skills. React devs meet Node experts."
            />
            <FeatureCard
              delay={0.2}
              icon={Heart}
              title="Meaningful Connections"
              description="Skip the small talk. Bond over debugging sessions, architecture debates, and shared side projects."
            />
            <FeatureCard
              delay={0.3}
              icon={MessageCircle}
              title="Real-time Chat"
              description="Found a match? Instantly connect through our integrated chat system with built-in code snippet sharing."
            />
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-romantic-gradient opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Flame size={48} className="mx-auto text-pink-500 mb-8" />
          <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to find your match?</h2>
          <Link to="/login">
            <Button variant="romantic" size="lg" className="h-16 px-10 text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-transform duration-300">
              Join devTinder Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

// Simple cloud lightning icon mock since lucide CloudLightning might not be imported above
const CloudLightning = () => (
  <svg xmlns="https://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" /><path d="m13 12-3 5h4l-3 5" /></svg>
);

export default LandingPage;
