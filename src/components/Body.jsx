import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "../store/userSlice";
import { onForegroundMessage, requestFirebaseNotificationPermission } from "../utils/firebaseClient";

const Body = () => {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchUser = async () => {
    const publicRoutes = ["/", "/login", "/privacy-policy", "/terms", "/refund-policy"];

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

    try {
      const res = await axios.get(
        "/api/profile/view",
        { withCredentials: true }
      );

      dispatch(addUser(res.data));

      if (location.pathname === "/" || location.pathname === "/login") {
        navigate("/feed");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        if (!publicRoutes.includes(location.pathname)) {
          navigate("/login");
        }
      } else {
        console.error("Failed to fetch user", error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location.pathname]);

  useEffect(() => {
    // Start listening globally for push notifications when the app is active
    const unsubscribe = onForegroundMessage();

    // Ensure the Firebase messaging token is active in this session
    if (userData) {
      requestFirebaseNotificationPermission();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
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
