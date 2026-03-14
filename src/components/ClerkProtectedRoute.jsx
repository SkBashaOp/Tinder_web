import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

/**
 * ClerkProtectedRoute — wraps any route that requires a Clerk session.
 * If Clerk is still loading → show spinner.
 * If not signed in → redirect to /clerk-login.
 * If signed in → render children.
 *
 * Usage in App.jsx:
 *   <Route path="/some-page" element={
 *     <ClerkProtectedRoute><SomePage /></ClerkProtectedRoute>
 *   } />
 */
const ClerkProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fafafa] dark:bg-zinc-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full bg-romantic-gradient flex items-center justify-center text-white shadow-md"
        >
          <Flame size={22} />
        </motion.div>
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/clerk-login" replace />;
  }

  return children;
};

export default ClerkProtectedRoute;
