import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Phone, Video, Info, MoreVertical } from "lucide-react";
import { requestFirebaseNotificationPermission } from "../utils/firebaseClient";

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [targetName, setTargetName] = useState("Your Match");
    const [targetPhoto, setTargetPhoto] = useState(null);
    const [typingUser, setTypingUser] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const user = useSelector((store) => store.user);
    const loginUser = user?.loginUser;
    const userId = loginUser?._id;
    const scrollRef = useRef(null);
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // ── Load historical messages from DB ────────────────────────────────────
    useEffect(() => {
        if (!targetUserId) return;

        axiosInstance
            .get("/chat/" + targetUserId)
            .then((res) => {
                const msgs = (res?.data?.messages || []).map((msg) => {
                    const { senderId, text, seen } = msg;
                    return {
                        firstName: senderId?.firstName,
                        lastName: senderId?.lastName,
                        photoUrl: senderId?.photoUrl,
                        senderId: senderId?._id?.toString() || senderId?.toString(),
                        text,
                        seen,
                    };
                });
                setMessages(msgs);
            })
            .catch((err) => console.error("fetchChat error:", err));

        axiosInstance
            .get("/user/" + targetUserId)
            .then((res) => {
                if (res.data?.firstName) {
                    setTargetName(res.data.firstName + " " + (res.data.lastName || ""));
                    if (res.data.photoUrl) {
                        setTargetPhoto(res.data.photoUrl);
                    }
                }
            })
            .catch(() => {/* non-critical */ });
    }, [targetUserId]);

    // ── Socket connection ────────────────────────────────────────────────────
    useEffect(() => {
        if (!userId || !targetUserId) return;

        // Ensure user device is mapped to DB for offline Push Notifications
        requestFirebaseNotificationPermission();

        const socket = createSocketConnection();
        socketRef.current = socket;

        // Wait for socket to connect before joining room
        socket.on("connect", () => {
            console.log("[socket] connected:", socket.id);
            socket.emit("joinChat", {
                firstName: loginUser?.firstName || "",
                userId,
                targetUserId,
            });
            // Mark existing messages from target as seen
            socket.emit("messagesSeen", { userId, targetUserId });
        });

        socket.on("onlineUsers", (users) => {
            setOnlineUsers(users);
        });

        socket.on("userTyping", ({ firstName }) => {
            setTypingUser(firstName);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                setTypingUser("");
            }, 2000);
        });

        socket.on("messagesMarkedAsSeen", ({ seenByUserId }) => {
            if (seenByUserId === targetUserId) {
                setMessages((prev) => prev.map((msg) =>
                    msg.senderId === userId ? { ...msg, seen: true } : msg
                ));
            }
        });

        socket.on("messageReceived", ({ firstName, lastName, photoUrl, text, senderId }) => {
            console.log("[socket] messageReceived:", text);
            setMessages((prev) => [
                ...prev,
                { firstName, lastName, photoUrl, text, senderId: senderId?.toString() },
            ]);

            // Auto mark as seen since we are in the chat room
            if (senderId === targetUserId) {
                socket.emit("messagesSeen", { userId, targetUserId });
            }
        });

        socket.on("connect_error", (err) => {
            console.error("[socket] connection error:", err.message);
        });

        return () => {
            if (socket) {
                console.log("[socket] disconnecting");
                socket.off("connect");
                socket.off("onlineUsers");
                socket.off("userTyping");
                socket.off("messagesMarkedAsSeen");
                socket.off("messageReceived");
                socket.off("connect_error");
                socket.disconnect();
            }
            socketRef.current = null;
        };
    }, [userId, targetUserId]);

    // ── Auto-scroll ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // ── Send message ─────────────────────────────────────────────────────────
    const handleTyping = () => {
        if (!socketRef.current?.connected) return;
        socketRef.current.emit("typing", {
            userId,
            targetUserId,
            firstName: loginUser?.firstName || ""
        });
    };

    const sendMessage = () => {
        const text = newMessage.trim();
        if (!text || !socketRef.current?.connected) {
            console.warn("[chat] Cannot send: socket not connected or empty message");
            return;
        }
        socketRef.current.emit("sendMessage", {
            firstName: loginUser?.firstName || "",
            lastName: loginUser?.lastName || "",
            photoUrl: loginUser?.photoUrl || "",
            userId,
            targetUserId,
            text,
        });
        setNewMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    // ── Helpers ──────────────────────────────────────────────────────────────
    const isMyMessage = (msg) => {
        const senderIdStr = msg.senderId?.toString();
        const myIdStr = userId?.toString();
        return senderIdStr === myIdStr;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-[#fafafa] dark:bg-zinc-950 relative overflow-hidden">
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 blur-[120px] opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 blur-[120px] opacity-10 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl h-[75vh] md:h-[80vh] flex flex-col bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
                {/* Chat Header */}
                <div className="p-4 md:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-4">
                        <Link to="/connections" className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="relative">
                            <img
                                src={targetPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUserId}`}
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover bg-zinc-100 dark:bg-zinc-800"
                            />
                            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white dark:border-zinc-900 rounded-full ${onlineUsers.includes(targetUserId) ? "bg-green-500" : "bg-red-500"}`}></div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{targetName}</h2>
                            {onlineUsers.includes(targetUserId) ? (
                                <p className="text-xs text-green-500 font-medium">Online</p>
                            ) : (
                                <p className="text-xs text-zinc-400 font-medium">Offline</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 text-zinc-500 dark:text-zinc-400">
                        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-not-allowed opacity-50"><Phone size={20} /></button>
                        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-not-allowed opacity-50 hidden md:block"><Video size={20} /></button>
                        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><Info size={20} /></button>
                        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors md:hidden"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 opacity-60">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUserId}`} className="w-24 h-24 mb-4 grayscale opacity-20" alt="empty" />
                            <p>Say hello to your match!</p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((msg, index) => {
                                const isMine = isMyMessage(msg);
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex max-w-[85%] md:max-w-[70%] gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                                            <img
                                                src={msg.photoUrl || (isMine ? loginUser?.photoUrl : `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`)}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover mt-auto flex-shrink-0"
                                            />
                                            <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                                                {!isMine && msg.firstName && (
                                                    <span className="text-xs text-zinc-500 font-medium ml-1 mb-1">
                                                        {msg.firstName}
                                                    </span>
                                                )}
                                                <div
                                                    className={`px-5 py-3 rounded-2xl shadow-sm text-sm ${isMine
                                                        ? "bg-gradient-to-br from-pink-500 to-amber-500 text-white rounded-br-sm"
                                                        : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-700/50 rounded-bl-sm"
                                                        }`}
                                                    style={{ wordBreak: "break-word" }}
                                                >
                                                    {msg.text}
                                                </div>
                                                {isMine && msg.seen && (
                                                    <span className="text-[10px] text-blue-500/80 font-medium ml-2 mt-1 self-end flex items-center gap-0.5">
                                                        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7M5 18l4 4L19 12" /></svg>
                                                        Seen
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {typingUser && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex w-full justify-start"
                                >
                                    <div className="flex gap-2 min-w-0 max-w-[85%] md:max-w-[70%]">
                                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0 animate-pulse border border-zinc-200 dark:border-zinc-800"></div>
                                        <div className="bg-white dark:bg-zinc-800 text-zinc-500 px-5 py-3 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl rounded-bl-sm text-sm flex items-center gap-1.5 w-fit shadow-sm h-10 mt-auto">
                                            <span className="italic text-xs">{typingUser} is typing</span>
                                            <span className="flex gap-0.5 ml-1">
                                                <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-white/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-1 bg-zinc-100 dark:bg-zinc-800/80 border-none rounded-full px-6 py-3.5 text-sm md:text-base text-zinc-800 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-zinc-400"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3.5 md:p-4 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all"
                    >
                        <Send size={18} className="ml-0.5" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Chat;