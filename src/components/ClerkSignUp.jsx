import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

/**
 * ClerkSignUp — Clerk-powered sign-up page.
 * Lives at /clerk-signup. After sign-up, Clerk redirects to /clerk-callback.
 * Existing /login signup flow is completely untouched.
 */
const ClerkSignUp = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 w-full flex flex-col items-center justify-center bg-[#fafafa] dark:bg-zinc-950 relative overflow-hidden px-4">
      {/* Background blobs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-400/20 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-pink-400/20 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Brand header */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="w-14 h-14 rounded-full bg-romantic-gradient flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
            <Flame size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Join <span className="text-romantic">devFind</span>
          </h1>
          <p className="text-muted-foreground text-sm">Sign up with Google or email — takes seconds</p>
        </div>

        {/* Clerk's hosted SignUp UI */}
        <SignUp
          routing="hash"
          fallbackRedirectUrl="/clerk-callback"
          forceRedirectUrl="/clerk-callback"
          appearance={{
            variables: {
              colorPrimary: "#ec4899",
              borderRadius: "1rem",
            },
          }}
        />
      </motion.div>
    </div>
  );
};

export default ClerkSignUp;
