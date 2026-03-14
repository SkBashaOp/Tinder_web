import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

/**
 * ClerkLayout — A simple shell for the Clerk auth pages.
 * Unlike Body.jsx, this does NOT try to fetch the cookie-based user profile
 * on mount, which prevents the 401 redirect infinite loop.
 */
const ClerkLayout = () => {
  return (
    <div className="w-screen min-h-screen bg-c">
      <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={false} />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default ClerkLayout;
