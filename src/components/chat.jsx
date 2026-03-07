import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Phone, Video, Info, MoreVertical } from "lucide-react";

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [targetName, setTargetName] = useState("Your Match");
    const user = useSelector((store) => store.user);
    const loginUser = user?.loginUser;
    const userId = loginUser?._id;
    const scrollRef = useRef(null);
    const socketRef = useRef(null);

    // ── Load historical messages from DB ────────────────────────────────────
    useEffect(() => {
        if (!targetUserId) return;

        axios
            .get("/api/chat/" + targetUserId, { withCredentials: true })
            .then((res) => {
                const msgs = (res?.data?.messages || []).map((msg) => {
                    const { senderId, text } = msg;
                    return {
                        firstName: senderId?.firstName,
                        lastName: senderId?.lastName,
                        senderId: senderId?._id?.toString() || senderId?.toString(),
                        text,
                    };
                });
                setMessages(msgs);
            })
            .catch((err) => console.error("fetchChat error:", err));

        axios
            .get("/api/user/" + targetUserId, { withCredentials: true })
            .then((res) => {
                if (res.data?.firstName) {
                    setTargetName(res.data.firstName + " " + (res.data.lastName || ""));
                }
            })
            .catch(() => {/* non-critical */ });
    }, [targetUserId]);

    // ── Socket connection ────────────────────────────────────────────────────
    useEffect(() => {
        if (!userId || !targetUserId) return;

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
        });

        socket.on("messageReceived", ({ firstName, lastName, text, senderId }) => {
            console.log("[socket] messageReceived:", text);
            setMessages((prev) => [
                ...prev,
                { firstName, lastName, text, senderId: senderId?.toString() },
            ]);
        });

        socket.on("connect_error", (err) => {
            console.error("[socket] connection error:", err.message);
        });

        return () => {
            console.log("[socket] disconnecting");
            socket.disconnect();
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
    const sendMessage = () => {
        const text = newMessage.trim();
        if (!text || !socketRef.current?.connected) {
            console.warn("[chat] Cannot send: socket not connected or empty message");
            return;
        }
        socketRef.current.emit("sendMessage", {
            firstName: loginUser?.firstName || "",
            lastName: loginUser?.lastName || "",
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
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUserId}`}
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover bg-zinc-100 dark:bg-zinc-800"
                            />
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{targetName}</h2>
                            <p className="text-xs text-green-500 font-medium">Online</p>
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
                                        <div className={`flex flex-col max-w-[75%] md:max-w-[60%] ${isMine ? "items-end" : "items-start"}`}>
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
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-white/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
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