import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "./ui/card";
import { Flame, Mail, Lock, User as UserIcon } from "lucide-react";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.isSignUp) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post("/api/login", { emailId, password }, { withCredentials: true });
        dispatch(addUser(res.data));
        toast.success(res.data?.message || "Welcome back!");
        navigate("/feed");
      } else {
        const res = await axios.post("/api/signup", { firstName, lastName, emailId, password }, { withCredentials: true });
        dispatch(addUser(res.data));
        toast.success(res.data?.message || "Account created successfully!");
        navigate("/profile");
      }
    } catch (error) {
      const status = error?.response?.status;
      const responseData = error?.response?.data;

      let errorMessage;
      if (!error.response || error.code === "ERR_NETWORK") {
        errorMessage = "Unable to connect to the server. Please try again later.";
      } else if (status === 502 || status === 503 || status === 504) {
        errorMessage = "Server is currently unavailable. Please try again later.";
      } else if (typeof responseData === "string" && responseData.trim().startsWith("<")) {
        // Raw HTML response — don't show it to the user
        errorMessage = "Something went wrong on the server. Please try again.";
      } else {
        errorMessage = responseData?.message || "Authentication failed";
      }

      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 w-full flex items-center justify-center bg-[#fafafa] dark:bg-zinc-950 relative overflow-hidden px-4">
      {/* Background Blobs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-rose-400/20 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-pink-400/20 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-white/20 shadow-2xl bg-white/70 dark:bg-black/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-romantic-gradient" />

          <CardHeader className="text-center pb-2 pt-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-romantic-gradient mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-500/30"
            >
              <Flame size={32} />
            </motion.div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {isLogin ? "Welcome back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {isLogin ? "Log in to meet your next coding partner." : "Join the exclusive dev pipeline today."}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-4 overflow-hidden"
                  >
                    <div className="relative w-full">
                      <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        required={!isLogin}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="pl-10 h-12"
                        id="firstName"
                        name="firstName"
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="relative w-full">
                      <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        required={!isLogin}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="pl-10 h-12"
                        id="lastName"
                        name="lastName"
                        autoComplete="family-name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  required
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  placeholder="Email address"
                  className="pl-10 h-12"
                  id="emailId"
                  name="emailId"
                  autoComplete="email"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="pl-10 h-12"
                  id="password"
                  name="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </div>

              <Button
                type="submit"
                variant="romantic"
                size="lg"
                className="w-full h-12 text-lg font-bold mt-2"
                disabled={loading}
              >
                {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-pink-600 hover:text-pink-500 transition-colors"
              >
                {isLogin ? "Create one now" : "Sign in instead"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
