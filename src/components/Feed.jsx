import axiosInstance from "../utils/axiosInstance";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../store/feedSlice";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import UserCard from "./UserCard";

// Shimmer Loader for Profile Cards
const CardSkeleton = () => (
  <div className="w-full max-w-[400px] h-[600px] mx-auto rounded-[2rem] bg-zinc-200 dark:bg-zinc-800 animate-pulse relative overflow-hidden">
    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent p-6 flex flex-col justify-end">
      <div className="w-2/3 h-8 bg-white/30 rounded-lg mb-4" />
      <div className="w-1/2 h-4 bg-white/20 rounded-full mb-2" />
      <div className="w-full h-16 bg-white/10 rounded-lg" />
    </div>
  </div>
);

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isFetching, setIsFetching] = React.useState(false);
  const location = useLocation();

  const getFeed = async (pageNumber) => {
    if (!hasMore) return;
    try {
      const res = await axiosInstance.get(`/user/feed?page=${pageNumber}&limit=10`);

      const newUsers = res?.data?.data || [];
      if (newUsers.length === 0) {
        setHasMore(false);
      }

      dispatch(addFeed(newUsers));
    } catch (error) {
      console.error("Failed to load feed", error);
    }
  };

  // Re-fetch feed on every navigation to this page
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    // Do not set feed to null immediately, instead use isFetching flag
    // so we don't flash the empty message
    getFeedFresh(1);
  }, [location.key]);

  const getFeedFresh = async (pageNumber) => {
    setIsFetching(true);
    try {
      const res = await axiosInstance.get(`/user/feed?page=${pageNumber}&limit=10`);
      const newUsers = res?.data?.data || [];
      if (newUsers.length === 0) {
        setHasMore(false);
      }
      dispatch(addFeed(newUsers));
    } catch (error) {
      console.error("Failed to load feed", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    // Refetch next page when feed runs out (all cards swiped)
    if (feed && feed.length === 0 && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      getFeed(nextPage);
    }
  }, [feed]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-[#fafafa] dark:bg-zinc-950 flex flex-col items-center overflow-hidden">

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none flex justify-center">
        <div className="absolute top-[20%] w-[600px] h-[600px] bg-pink-500/5 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative z-10 flex flex-col items-center"
      >
        <div className="mb-8 flex items-center justify-center gap-2">
          <Flame className="text-pink-500 h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Your Matches</h1>
        </div>

        {isFetching || !feed ? (
          <CardSkeleton />
        ) : feed.length === 0 ? (
          <div className="relative w-full pb-32">
            <UserCard feed={feed} />
          </div>
        ) : (
          <div className="relative w-full pb-32">
            <UserCard feed={feed} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Feed;
