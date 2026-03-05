import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../store/feedSlice";
import { toast } from "react-toastify";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { X, Heart, Code2, Info, MapPin, Flame } from "lucide-react";

const DraggableCard = ({ profile, handlePendingRequest }) => {
  const [exitX, setExitX] = useState(0);

  const x = useMotionValue(0);
  const scale = useTransform(x, [-150, 0, 150], [0.9, 1, 0.9]);
  const rotate = useTransform(x, [-150, 0, 150], [-10, 0, 10]);

  const nopeOpacity = useTransform(x, [-150, -50, 0], [1, 0, 0]);
  const likeOpacity = useTransform(x, [0, 50, 150], [0, 0, 1]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      setExitX(300);
      handlePendingRequest("interested", profile._id);
    } else if (info.offset.x < -100) {
      setExitX(-300);
      handlePendingRequest("ignored", profile._id);
    }
  };

  const manualSwipe = (dir) => {
    if (dir === "right") {
      setExitX(300);
      handlePendingRequest("interested", profile._id);
    } else {
      setExitX(-300);
      handlePendingRequest("ignored", profile._id);
    }
  };

  const { photoUrl, firstName, lastName, age, gender, skills, about } = profile;

  return (
    <>
      <motion.div
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        style={{ x, scale, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        animate={{ x: exitX, opacity: exitX !== 0 ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      >
        <div className="w-full h-full rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900 shadow-2xl border border-border/50 relative group">
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-12 left-8 z-20 border-[6px] border-emerald-500 text-emerald-500 font-black text-4xl px-4 py-1 rounded-xl rotate-[-15deg] uppercase tracking-widest shadow-2xl backdrop-blur-sm bg-white/10 pointer-events-none"
          >
            Interested
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-12 right-8 z-20 border-[6px] border-red-500 text-red-500 font-black text-4xl px-4 py-1 rounded-xl rotate-[15deg] uppercase tracking-widest shadow-2xl backdrop-blur-sm bg-white/10 pointer-events-none"
          >
            Nope
          </motion.div>

          <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 pointer-events-none">
            <img
              src={photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=devtinder"}
              alt={`${firstName} ${lastName}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end text-white pointer-events-none">
            <div className="flex items-end gap-3 mb-2">
              <h2 className="text-3xl font-black drop-shadow-md">
                {firstName} {lastName}
              </h2>
              {age && <span className="text-2xl font-light mb-0.5 opacity-90">{age}</span>}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {gender && (
                <span className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-full font-medium">
                  <Info size={14} /> {gender}
                </span>
              )}
              {skills && skills.length > 0 && (
                (Array.isArray(skills) ? skills : skills.split(',')).map((skill, index) => (
                  <span key={index} className="flex items-center gap-1 text-sm bg-pink-500/80 backdrop-blur-md px-3 py-1 rounded-full font-medium shadow-sm">
                    <Code2 size={14} /> {skill.trim()}
                  </span>
                ))
              )}
            </div>

            {about && (
              <p className="text-sm text-white/80 line-clamp-3 leading-relaxed mb-4">
                {about}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {profile._id !== "preview" && (
        <div className="absolute -bottom-24 left-0 right-0 flex justify-center items-center gap-6 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => manualSwipe("left")}
            disabled={exitX !== 0}
            className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 text-red-500 flex items-center justify-center shadow-xl border border-red-100 dark:border-red-900/30 disabled:opacity-50"
          >
            <X size={32} strokeWidth={3} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => manualSwipe("right")}
            disabled={exitX !== 0}
            className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 text-emerald-500 flex items-center justify-center shadow-xl border border-emerald-100 dark:border-emerald-900/30 disabled:opacity-50"
          >
            <Heart size={32} strokeWidth={3} className="fill-emerald-500" />
          </motion.button>
        </div>
      )}
    </>
  );
};

const UserCard = ({ feed }) => {
  const dispatch = useDispatch();

  const handlePendingRequest = async (status, id) => {
    try {
      await axios.post(
        `/api/request/send/${status}/${id}`,
        {},
        { withCredentials: true }
      );

      setTimeout(() => {
        dispatch(removeUserFromFeed(id));
      }, 300);

    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
      console.error(error);
    }
  };

  if (!feed || (Array.isArray(feed) && feed.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-24 h-24 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center mb-6 shadow-xl">
          <Flame size={40} className="text-pink-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You've caught 'em all!</h2>
        <p className="text-muted-foreground max-w-sm">
          There are no new developers in your area. Come back later for more matches.
        </p>
      </div>
    );
  }

  const profile = Array.isArray(feed) ? feed[0] : feed;
  if (!profile) return null;

  return (
    <div className="relative w-full max-w-[400px] h-[600px] mx-auto perspective-1000">
      <AnimatePresence>
        <DraggableCard
          key={profile._id}
          profile={profile}
          handlePendingRequest={handlePendingRequest}
        />
      </AnimatePresence>
    </div>
  );
};;


export default UserCard;
