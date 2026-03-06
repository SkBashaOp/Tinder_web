import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../store/userSlice";
import { removeFeed } from "../store/feedSlice";
import { removeConnection } from "../store/connectionSlice";
import { removeRequest } from "../store/requestSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, UserCircle, LogOut, Settings, Users, Bell, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../lib/theme-provider";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-full flex items-center justify-center bg-muted hover:bg-accent transition-colors"
      title="Toggle theme"
    >
      {isDark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-slate-600" />}
    </motion.button>
  );
};

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "/api/logout",
        {},
        { withCredentials: true }
      );

      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnection());
      dispatch(removeRequest());

      toast.success(res.data?.message || "Logged out successfully!");
      setDropdownOpen(false);
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out.");
      console.error(error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-white/60 dark:bg-black/60 border-b border-border/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-2 rounded-full bg-romantic-gradient text-white shadow-lg shadow-pink-500/30"
          >
            <Flame size={24} strokeWidth={2.5} />
          </motion.div>
          <span className="text-2xl font-bold tracking-tight text-romantic">
            devTinder
          </span>
        </Link>

        {user && user.loginUser ? (
          <div className="relative flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            <span className="hidden md:block text-sm font-medium text-muted-foreground">
              Hello, {user.loginUser.firstName}
            </span>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative rounded-full border-2 border-transparent dark:border-white/20 hover:border-pink-500 dark:hover:border-pink-500 transition-all focus:outline-none ring-2 ring-transparent dark:ring-white/10"
            >
              <img
                alt="Avatar"
                src={user?.loginUser?.photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=devtinder"}
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-14 w-56 bg-white dark:bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
                >
                  <div className="p-2 flex flex-col gap-1">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/30 transition-colors">
                      <UserCircle size={18} /> Profile
                    </Link>
                    <Link to="/feed" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/30 transition-colors">
                      <Flame size={18} /> Match Feed
                    </Link>
                    <Link to="/connections" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/30 transition-colors">
                      <Users size={18} /> Connections
                    </Link>
                    <Link to="/requests" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/30 transition-colors">
                      <Bell size={18} /> Pending Requests
                    </Link>
                    <Link to="/premium" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/30 transition-colors">
                      <Bell size={18} /> Premium
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full text-left">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="font-semibold text-pink-600 hover:text-pink-700 hover:bg-pink-50">Log In</Button>
            </Link>
            <Link to="/login" state={{ isSignUp: true }}>
              <Button variant="romantic" className="font-bold">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
