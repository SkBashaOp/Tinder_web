import React from "react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Feed from "./components/Feed";
import ErrorPage from "./components/ErrorPage";
import Profile from "./components/Profile";
import LandingPage from "./components/LandingPage";
import Requests from "./components/Requests";
import Connections from "./components/Connections";
import Premium from "./components/Premium";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import RefundPolicy from "./components/RefundPolicy";
import Chat from "./components/chat";
import ClerkSignIn from "./components/ClerkSignIn";
import ClerkSignUp from "./components/ClerkSignUp";
import ClerkCallback from "./components/ClerkCallback";
import ClerkLayout from "./components/ClerkLayout";
import { useAuth } from "@clerk/clerk-react";
import { setClerkTokenGetter } from "./utils/clerkAxios";
import { useEffect } from "react";

const ClerkTokenInit = () => {
  const { getToken } = useAuth();
  
  // Set synchronously during render so it's immediately available to child components
  setClerkTokenGetter(getToken);
  
  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);
  
  return null;
};

const App = () => {
  return (
    <>
      <ClerkTokenInit />
      <BrowserRouter basename="/">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/feed" element={<Feed />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/connections" element={<Connections />}></Route>
              <Route path="/requests" element={<Requests />}></Route>
              <Route path="/premium" element={<Premium />}></Route>
              <Route path="/privacy-policy" element={<PrivacyPolicy />}></Route>
              <Route path="/terms" element={<TermsAndConditions />}></Route>
              <Route path="/refund-policy" element={<RefundPolicy />}></Route>
              <Route path="/chat/:targetUserId" element={<Chat />} />
            </Route>
            
            {/* Clerk auth routes — separate from Body.jsx to prevent cookie auth loops */}
            <Route element={<ClerkLayout />}>
              <Route path="/clerk-login" element={<ClerkSignIn />} />
              <Route path="/clerk-signup" element={<ClerkSignUp />} />
              <Route path="/clerk-callback" element={<ClerkCallback />} />
            </Route>
            
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
