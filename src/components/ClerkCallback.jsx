import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setClerkTokenGetter } from "../utils/clerkAxios";
import clerkAxios from "../utils/clerkAxios";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

/**
 * ClerkCallback — runs immediately after Clerk auth completes.
 * 1. Gets the Clerk JWT token.
 * 2. Injects it into clerkAxios for all future requests.
 * 3. POSTs to /clerk/create-profile to create/fetch the MongoDB profile.
 * 4. Dispatches user to Redux store.
 * 5. Redirects to /feed.
 */
const ClerkCallback = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate("/clerk-login");
      return;
    }

    const syncProfile = async () => {
      try {
        // 1. Inject the token getter so clerkAxios can auto-attach it
        setClerkTokenGetter(getToken);

        // 2. Build user info from Clerk
        const firstName = clerkUser?.firstName || clerkUser?.username || "Dev";
        const lastName = clerkUser?.lastName || "";
        const emailId =
          clerkUser?.primaryEmailAddress?.emailAddress || "";
        const photoUrl = clerkUser?.imageUrl || "";

        // 3. Create/fetch the MongoDB profile
        const res = await clerkAxios.post("/clerk/create-profile", {
          firstName,
          lastName,
          emailId,
          photoUrl,
        });

        const profile = res.data;

        // 4. Store in Redux — wrap in the same shape existing components expect
        dispatch(addUser({ loginUser: profile.loginUser }));

        toast.success(profile.message || `Welcome, ${firstName}!`);

        // 5. Redirect to feed
        navigate("/feed");
      } catch (err) {
        console.error("ClerkCallback error:", err);
        setError("Something went wrong setting up your profile. Please try again.");
        toast.error("Failed to create your DevFind profile.");
      }
    };

    syncProfile();
  }, [isLoaded, isSignedIn]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-zinc-950">
        <div className="text-center max-w-sm">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate("/clerk-login")}
            className="text-pink-600 hover:underline text-sm"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fafafa] dark:bg-zinc-950">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 rounded-full bg-romantic-gradient flex items-center justify-center text-white shadow-lg shadow-pink-500/30"
      >
        <Flame size={26} />
      </motion.div>
      <p className="text-muted-foreground text-sm font-medium">
        Setting up your DevFind profile…
      </p>
    </div>
  );
};

export default ClerkCallback;
