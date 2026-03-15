import axiosInstance from "../utils/axiosInstance";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../store/userSlice";
import { removeFeed } from "../store/feedSlice";
import { removeConnection } from "../store/connectionSlice";
import { removeRequest } from "../store/requestSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, UserCircle, LogOut, Settings, Users, Bell, Sun, Moon, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../lib/theme-provider";
import { useAuth, useClerk } from "@clerk/clerk-react";

const ThemeToggle = ({ compact = false }) => {
  const { theme, setTheme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`${compact ? 'w-8 h-8' : 'w-9 h-9'} rounded-full flex items-center justify-center bg-muted hover:bg-accent transition-colors`}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={compact ? 14 : 16} className="text-yellow-400" /> : <Moon size={compact ? 14 : 16} className="text-slate-600" />}
    </motion.button>
  );
};

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (isSignedIn) {
        await signOut();
      } else {
        await axiosInstance.post("/logout", {});
      }

      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnection());
      dispatch(removeRequest());

      toast.success("Logged out successfully!");
      setDropdownOpen(false);
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out.");
      console.error(error);
    }
  };

  const navItems = [
    { to: "/feed", icon: <Flame size={20} />, label: "Feed" },
    { to: "/connections", icon: <Users size={20} />, label: "Matches" },
    { to: "/requests", icon: <Bell size={20} />, label: "Requests" },
    { to: "/premium", icon: <Crown size={20} />, label: "Premium", color: "text-amber-500" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 backdrop-blur-md bg-white/60 dark:bg-black/60 border-b border-border/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Go to homepage">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-1 md:p-2 rounded-full bg-romantic-gradient text-white shadow-lg shadow-pink-500/30"
            >
              <Flame className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </motion.div>
            <span className="text-lg md:text-2xl font-bold tracking-tight text-romantic">
              devFind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {user && user.loginUser && (
              <>
                {navItems.map((item) => (
                  <Link key={item.to} to={item.to} className={`text-sm font-medium transition-all hover:scale-105 ${location.pathname === item.to ? "text-pink-600" : "hover:text-pink-500"}`}>
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />

            {user && user.loginUser ? (
              <div className="relative flex items-center gap-3">
                <span className="hidden md:block text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Hello, {user.loginUser.firstName}
                </span>

                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative rounded-full border-2 border-transparent dark:border-white/20 hover:border-pink-500 dark:hover:border-pink-50 transition-all focus:outline-none ring-2 ring-transparent dark:ring-white/10"
                >
                  <img
                    alt="Avatar"
                    src={user.loginUser.photoUrl}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm"
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-56 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
                    >
                      <div className="p-2 flex flex-col gap-1">
                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/30 transition-colors">
                          <UserCircle size={18} /> My Profile
                        </Link>
                        <div className="h-px bg-border my-1 md:hidden" />
                        <div className="md:hidden">
                            {navItems.map(item => (
                                <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/30 transition-colors">
                                    {React.cloneElement(item.icon, { size: 18 })} {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="h-px bg-border my-1" />
                        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full text-left">
                          <LogOut size={18} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 md:gap-3">
                {/* Google Sign-in - Restored and optimized */}
                <Link to="/clerk-login" className="flex-shrink-0">
                  <Button variant="ghost" size="sm" className="font-semibold text-violet-600 hover:text-violet-700 hover:bg-violet-50 px-2 md:px-4 flex items-center gap-1.5 h-8 md:h-10 text-[10px] md:text-sm border border-violet-100 md:border-transparent">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="hidden xs:inline">Google</span>
                    <span className="inline xs:hidden">G-Sign</span>
                  </Button>
                </Link>
                
                <Link to="/login" className="flex-shrink-0">
                  <Button variant="ghost" size="sm" className="font-semibold text-pink-600 hover:text-pink-700 hover:bg-pink-50 px-2 md:px-4 h-8 md:h-10 text-[10px] md:text-sm">Log In</Button>
                </Link>
                
                <Link to="/login" state={{ isSignUp: true }} className="flex-shrink-0">
                  <Button variant="romantic" size="sm" className="font-bold px-3 md:px-6 shadow-pink-500/20 shadow-lg text-[10px] md:text-sm h-8 md:h-10">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation (Logged In Only) */}
      <AnimatePresence>
        {user && user.loginUser && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4"
          >
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border border-border/50 rounded-2xl shadow-2xl flex items-center justify-around py-3 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative flex flex-col items-center gap-1 px-4 py-1 group"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`transition-colors duration-200 ${location.pathname === item.to ? "text-pink-500" : "text-muted-foreground group-hover:text-pink-400"}`}
                  >
                    {item.icon}
                  </motion.div>
                  <span className={`text-[10px] font-bold uppercase tracking-tighter transition-colors ${location.pathname === item.to ? "text-pink-500" : "text-muted-foreground group-hover:text-pink-400"}`}>
                    {item.label}
                  </span>
                  {location.pathname === item.to && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 w-1 h-1 bg-pink-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
