import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { addUser } from "../store/userSlice";
import { onForegroundMessage, requestFirebaseNotificationPermission } from "../utils/firebaseClient";
import { useAuth } from "@clerk/clerk-react";
import clerkAxios from "../utils/clerkAxios";

const Body = () => {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoaded, isSignedIn } = useAuth();

  const fetchUser = async () => {
    const publicRoutes = [
      "/", 
      "/login", 
      "/privacy-policy", 
      "/terms", 
      "/refund-policy",
      "/clerk-login",
      "/clerk-signup",
      "/clerk-callback"
    ];

    // If we have user data, we are authenticated.
    if (userData) {
      // If we are authenticated but sit on login or root, redirect to feed.
      if (location.pathname === "/login" || location.pathname === "/") {
        navigate("/feed");
      }
      return;
    }

    if (!userData && (location.pathname === "/" || location.pathname === "/login")) {
      return;
    }

    let success = false;

    // 1. Try Clerk Auth if signed in with Clerk
    if (isSignedIn) {
      try {
        const res = await clerkAxios.get("/clerk/profile");
        dispatch(addUser(res.data));
        success = true;
      } catch (error) {
        console.warn("Clerk profile fetch failed, falling back to standard auth...", error.message);
      }
    }

    // 2. Try Standard Auth if Clerk failed or wasn't attempted
    if (!success) {
      try {
        const res = await axiosInstance.get("/profile/view");
        dispatch(addUser(res.data));
        success = true;
      } catch (error) {
        // Both failed. If not a public route, redirect.
        if (!publicRoutes.includes(location.pathname)) {
          navigate("/login");
        }
      }
    }

    // 3. Handle successful login redirects
    if (success && (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/clerk-login" || location.pathname === "/clerk-signup")) {
      navigate("/feed");
    }
  };

  useEffect(() => {
    // Only fetch user profile if Clerk has finished loading its state
    if (isLoaded) {
      fetchUser();
    }
  }, [location.pathname, isLoaded, isSignedIn]);

  // Set up the foreground push notification listener ONCE on mount
  // This must stay stable across all page navigations
  useEffect(() => {
    const unsubscribe = onForegroundMessage();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userData) {
      const isClerk = !!userData?.loginUser?.clerkId;
      requestFirebaseNotificationPermission(isClerk);
    }
  }, [userData]);

  return (
    <div className="w-screen min-h-screen bg-c">
      <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={false} />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
