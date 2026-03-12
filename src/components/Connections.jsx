import axiosInstance from "../utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection, removeConnection } from "../store/connectionSlice";
import { motion } from "framer-motion";
import { Users, Code2, MapPin, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  const [removing, setRemoving] = useState({});

  const fetchConnections = async () => {
    try {
      const res = await axiosInstance.get("/user/request/accepted");
      dispatch(addConnection(res?.data?.data));
    } catch (error) {
      console.error("Failed to fetch connections", error);
    }
  };

  const handleRemove = async (userId) => {
    setRemoving((prev) => ({ ...prev, [userId]: true }));
    try {
      await axiosInstance.delete(`/request/remove/${userId}`);
      dispatch(removeConnection(userId));
    } catch (error) {
      console.error("Failed to remove connection", error);
    } finally {
      setRemoving((prev) => ({ ...prev, [userId]: false }));
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return (
      <div className="min-h-screen pt-32 px-6 flex justify-center items-start bg-[#fafafa] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
          <div className="w-12 h-12 rounded-full bg-border" />
          <p>Loading connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#fafafa] dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-2xl">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Connections</h1>
            <p className="text-muted-foreground">The developers who matched with you.</p>
          </div>
        </div>

        {connections.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-border">
            <Users size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">No connections yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Swipe right on developers in your feed to start building your network.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {connections.map((connection) => {
              if (!connection) return null;
              return (
                <motion.div key={connection._id} variants={itemVariants}>
                  <Card className="overflow-hidden group hover:border-pink-200 transition-colors h-full flex flex-col">
                    <div className="h-24 bg-romantic-gradient relative">
                      <div className="absolute -bottom-10 left-6">
                        <img
                          src={connection.photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=devtinder"}
                          alt="User"
                          className="w-20 h-20 rounded-2xl border-4 border-white dark:border-zinc-900 object-cover shadow-md bg-white dark:bg-zinc-800"
                        />
                      </div>
                    </div>
                    <CardContent className="pt-14 pb-6 px-6 flex-1 flex flex-col">
                      <h2 className="text-[1.1rem] font-bold line-clamp-1 mb-1">
                        {connection.firstName} {connection.lastName}
                      </h2>

                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                        {connection.age && <span>{connection.age} yrs</span>}
                        {connection.age && connection.gender && <span>•</span>}
                        {connection.gender && <span className="capitalize">{connection.gender}</span>}
                      </div>

                      {connection.skills && connection.skills.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 px-2.5 py-1 rounded-md w-fit mb-4">
                          <Code2 size={12} />
                          <span className="truncate max-w-[150px]">
                            {Array.isArray(connection.skills) ? connection.skills[0] : (typeof connection.skills === 'string' ? connection.skills.split(',')[0] : connection.skills)}
                          </span>
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                        {connection.about}
                      </p>
                      <Link to={"/chat/" + connection._id} className="w-full mb-2">
                        <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white transition-colors tracking-wide font-semibold">Message</Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 group-hover:border-red-200 transition-colors"
                        onClick={() => handleRemove(connection._id)}
                        disabled={removing[connection._id]}
                      >
                        <X size={14} className="mr-1.5" />
                        {removing[connection._id] ? "Removing..." : "Remove Connection"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )
        }
      </div >
    </div >
  );
};

export default Connections;
