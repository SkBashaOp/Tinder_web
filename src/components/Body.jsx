import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "../store/userSlice";

const Body = () => {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchUser = async () => {
    // If we have user data, we are authenticated.
    if (userData) {
      // If we are authenticated but sit on login or root, redirect to feed.
      if (location.pathname === "/login" || location.pathname === "/") {
        navigate("/feed");
      }
      return;
    }

    // If we don't have user data and we are natively on / or /login,
    // don't try to fetch user, as we will just get a 401 anyway.
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
        // Unauthenticated. Clear any residual local data if exists and force to login.
        if (location.pathname !== "/login" && location.pathname !== "/") {
          navigate("/login");
        }
      } else {
        console.error("Failed to fetch user", error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location.pathname]); // Only re-run on route changes, not on every Redux dispatch

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
