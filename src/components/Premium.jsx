import axios from "axios";
import { useState, useEffect } from "react";
import { Check, Star, Crown, Zap } from "lucide-react";

const Premium = () => {
    const [isUserPremium, setIsUserPremium] = useState(false);

    useEffect(() => {
        checkPremiumStatus();
    }, []);

    const checkPremiumStatus = async () => {
        try {
            const res = await axios.get("/api/premium/verify", {
                withCredentials: true,
            });
            if (res.data.isPremium) {
                setIsUserPremium(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const verifyPremiumPayment = async (response) => {
        try {
            const res = await axios.post(
                "/api/payment/verify",
                {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                },
                { withCredentials: true }
            );

            if (res.data?.msg === "Payment verified successfully") {
                setIsUserPremium(true);
                // Trigger fallback status check
                checkPremiumStatus();
            }
        } catch (err) {
            console.error("Payment verification failed", err);
        }
    };

    const handleBuyClick = async (type) => {
        try {
            const order = await axios.post(
                "/api/payment/create",
                {
                    membershipType: type,
                },
                { withCredentials: true }
            );

            const { amount, keyId, currency, notes, orderId } = order.data;

            const options = {
                key: keyId,
                amount,
                currency,
                name: "Dev Tinder",
                description: "Connect to other developers",
                order_id: orderId,
                prefill: {
                    name: notes.firstName + " " + notes.lastName,
                    email: notes.emailId,
                    contact: "9999999999",
                },
                theme: {
                    color: "#F37254",
                },
                handler: verifyPremiumPayment,
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
        }
    };

    return isUserPremium ? (
        <div className="min-h-[80vh] py-24 px-4 flex items-center justify-center bg-transparent">
            {/* Animated Premium Celebration Card */}
            <div className="relative p-10 md:p-14 w-full max-w-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-amber-500/50 rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.3)] overflow-hidden group transition-transform hover:scale-[1.02] duration-500">
                {/* Glowing Orbs */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-amber-400 to-yellow-300 rounded-full mix-blend-multiply filter blur-[64px] opacity-40 animate-pulse"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-pink-500 to-rose-400 rounded-full mix-blend-multiply filter blur-[64px] opacity-40 animate-pulse" style={{ animationDelay: "1.5s" }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-amber-500/10 to-pink-500/10 opacity-50"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Bouncing Crown with Glow */}
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-60 animate-pulse"></div>
                        <Crown size={88} className="text-amber-500 relative z-10 animate-bounce drop-shadow-[0_10px_15px_rgba(245,158,11,0.5)]" strokeWidth={1.5} />
                    </div>

                    {/* Birthday-like bold text */}
                    <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-pink-500 text-transparent bg-clip-text pb-2">
                        Woohoo!
                    </h2>

                    <p className="text-2xl md:text-3xl text-zinc-800 dark:text-zinc-100 font-bold mb-4">
                        You're a Premium Member!
                    </p>

                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                        No need to upgrade again. Enjoy your exclusive perks, endless connections, and priority features everyday. ✨
                    </p>
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] py-24 mb-10 px-4 flex flex-col items-center justify-center bg-transparent">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black mb-4 pb-2 leading-tight bg-gradient-to-r from-pink-500 to-orange-400 text-transparent bg-clip-text inline-block">
                    Upgrade to Premium
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
                    Supercharge your developer matchmaking experience with exclusive features and unlimited potential.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-stretch perspective-1000">
                {/* Silver Card */}
                <div className="relative group w-full md:w-[400px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative h-full flex flex-col p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl transition-transform duration-300 hover:-translate-y-2">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-zinc-700 dark:text-zinc-200">
                                <Star className="text-zinc-400 fill-zinc-400" size={28} />
                                Silver
                            </h2>
                            <div className="mt-4">
                                <span className="text-4xl font-black">₹499</span>
                                <span className="text-zinc-500 dark:text-zinc-500 font-medium ml-1">/ 3 months</span>
                            </div>
                        </div>

                        <ul className="flex-grow space-y-4 mb-8">
                            {[
                                "Chat with your matches",
                                "100 connection requests per day",
                                "Silver Blue Tick on profile",
                                "See who liked your profile"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                    <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full text-zinc-500 dark:text-zinc-400 shrink-0">
                                        <Check size={16} strokeWidth={3} />
                                    </div>
                                    <span className="font-medium text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleBuyClick("silver")}
                            className="w-full py-4 rounded-xl font-bold text-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700 shadow-sm"
                        >
                            Get Silver
                        </button>
                    </div>
                </div>

                {/* Gold Card */}
                <div className="relative group w-full md:w-[400px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-pink-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative h-full flex flex-col p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-amber-500/30 shadow-2xl transition-transform duration-300 hover:-translate-y-2">

                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg whitespace-nowrap">
                            <Zap size={14} className="fill-white" />
                            MOST POPULAR
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-500">
                                <Crown className="text-amber-500 fill-amber-500" size={28} />
                                Gold
                            </h2>
                            <div className="mt-4">
                                <span className="text-4xl font-black">₹999</span>
                                <span className="text-zinc-500 dark:text-zinc-500 font-medium ml-1">/ 6 months</span>
                            </div>
                        </div>

                        <ul className="flex-grow space-y-4 mb-8">
                            {[
                                "Priority Chat features",
                                "Infinite connection requests",
                                "Premium Blue Tick on profile",
                                "See who liked your profile",
                                "Stand out in the feed"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                    <div className="bg-amber-100 dark:bg-amber-500/20 p-1 rounded-full text-amber-600 dark:text-amber-500 shrink-0">
                                        <Check size={16} strokeWidth={3} />
                                    </div>
                                    <span className="font-medium text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleBuyClick("gold")}
                            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/25"
                        >
                            Get Gold
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Premium;