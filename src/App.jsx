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

const App = () => {
  return (
    <>
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
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
