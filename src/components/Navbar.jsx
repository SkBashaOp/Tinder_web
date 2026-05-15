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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout", {});

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
