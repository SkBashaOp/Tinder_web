import axiosInstance from "../utils/axiosInstance";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removRequestOnAccept } from "../store/requestSlice";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, Code2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);
  const location = useLocation();

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/user/request/received");
      dispatch(addRequest(res?.data?.allReceivedRequest));
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  const handleAction = async (status, id) => {
    try {
      await axiosInstance.post(`/request/review/${status}/${id}`, {});
      // Remove from UI
      dispatch(removRequestOnAccept(id));
    } catch (error) {
      console.error("Failed to update request", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [location.key]);

  if (!requests) {
    return (
      <div className="min-h-screen pt-32 px-6 flex justify-center items-start bg-[#fafafa] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
          <div className="w-12 h-12 rounded-full bg-border" />
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#fafafa] dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-2xl">
                <Bell size={28} />
              </div>
              {requests.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 border border-white dark:border-zinc-950"></span>
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pending Requests</h1>
              <p className="text-muted-foreground">Developers who matched with you.</p>
            </div>
          </div>
          {requests.length > 0 && (
            <div className="text-sm font-medium bg-white dark:bg-zinc-900 border border-border px-4 py-2 rounded-full">
              {requests.length} new {requests.length === 1 ? 'request' : 'requests'}
            </div>
          )}
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-24 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-border/50 border-dashed">
            <Bell size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-muted-foreground">It's quiet in here</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You don't have any pending requests at the moment.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            <AnimatePresence>
              {requests.map((request) => {
                if (!request.fromUserId) return null;
                return (
                  <motion.div
                    key={request._id}
                    variants={itemVariants}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    layout
                  >
                    <Card className="overflow-hidden hover:border-pink-200 transition-all shadow-sm hover:shadow-md">
                      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">

                        <div className="relative flex-shrink-0">
                          <img
                            src={request.fromUserId.photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=devtinder"}
                            alt="User"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-sm bg-white dark:bg-zinc-800"
                          />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <h2 className="text-xl font-bold line-clamp-1 mb-1">
                            {request.fromUserId.firstName} {request.fromUserId.lastName}
                          </h2>

                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground mb-2">
                            {request.fromUserId.age && <span>{request.fromUserId.age} yrs</span>}
                            {request.fromUserId.age && request.fromUserId.gender && <span>•</span>}
                            {request.fromUserId.gender && <span className="capitalize">{request.fromUserId.gender}</span>}

                            {request.fromUserId.skills && request.fromUserId.skills.length > 0 && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-medium">
                                  <Code2 size={14} />
                                  {Array.isArray(request.fromUserId.skills) ? request.fromUserId.skills[0] : request.fromUserId.skills.split(',')[0]}
                                </span>
                              </>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 max-w-xl">
                            {request.fromUserId.about}
                          </p>
                        </div>

                        <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                          <Button
                            onClick={() => handleAction("accepted", request._id)}
                            className="flex-1 sm:w-32 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 shadow-md font-semibold"
                          >
                            <Check size={18} className="mr-2" /> Accept
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleAction("rejected", request._id)}
                            className="flex-1 sm:w-32 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                          >
                            <X size={18} className="mr-2" /> Reject
                          </Button>
                        </div>

                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Requests;
