import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#fafafa] dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-2xl">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your developer profile and preferences.</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <EditProfile user={user?.loginUser} />
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;
