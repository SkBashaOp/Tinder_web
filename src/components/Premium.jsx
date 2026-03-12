import axiosInstance from "../utils/axiosInstance";
import { useState, useEffect } from "react";
import { Check, Star, Crown, Zap } from "lucide-react";
import { motion } from "framer-motion";


const loadRazorpay = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Premium = () => {
    const [isUserPremium, setIsUserPremium] = useState(false);
    const [membershipType, setMembershipType] = useState(null);
    const [loading, setLoading] = useState(false);

    // Boost specific state
    const [boostActive, setBoostActive] = useState(false);
    const [boostExpiresAt, setBoostExpiresAt] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState("");

    useEffect(() => {
        checkPremiumStatus();
    }, []);

    const checkPremiumStatus = async () => {
        try {
            const res = await axiosInstance.get("/premium/verify");
            if (res.data.isPremium && res.data.membershipType && res.data.membershipType !== "boost") {
                setIsUserPremium(true);
                setMembershipType(res.data.membershipType);
            } else {
                setIsUserPremium(false);
            }

            if (res.data.boostActive) {
                setBoostActive(true);
                setBoostExpiresAt(new Date(res.data.boostExpiresAt));
            } else {
                setBoostActive(false);
                setBoostExpiresAt(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Calculate boost time remaining
    useEffect(() => {
        let interval;
        if (boostActive && boostExpiresAt) {
            const calculateTime = () => {
                const now = new Date();
                const difference = boostExpiresAt - now;

                if (difference <= 0) {
                    setBoostActive(false);
                    setTimeRemaining("");
                    checkPremiumStatus(); // Re-verify with backend to be safe
                } else {
                    const minutes = Math.floor((difference / 1000 / 60) % 60);
                    const seconds = Math.floor((difference / 1000) % 60);
                    setTimeRemaining(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
                }
            };

            calculateTime(); // Initial call
            interval = setInterval(calculateTime, 1000);
        }

        return () => clearInterval(interval);
    }, [boostActive, boostExpiresAt]);

    const verifyPremiumPayment = async (response) => {
        try {
            const res = await axiosInstance.post(
                "/payment/verify",
                {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                },
            );

            if (res.data?.msg === "Payment verified successfully") {
                const updatedUser = res.data.user;
                if (updatedUser) {
                    if (updatedUser.isPremium && updatedUser.membershipType && updatedUser.membershipType !== "boost") {
                        setIsUserPremium(true);
                        setMembershipType(updatedUser.membershipType);
                    } else {
                        setIsUserPremium(false);
                    }
                    if (updatedUser.boostActive) {
                        setBoostActive(true);
                        setBoostExpiresAt(new Date(updatedUser.boostExpiresAt));
                    } else {
                        setBoostActive(false);
                        setBoostExpiresAt(null);
                    }
                } else {
                    checkPremiumStatus();
                }
            }
        } catch (err) {
            console.error("Payment verification failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyClick = async (type) => {
        if (loading) return;

        setLoading(true);
        const loaded = await loadRazorpay();

        if (!loaded) {
            alert("Razorpay SDK failed to load");
            setLoading(false);
            return;
        }

        try {
            const order = await axiosInstance.post(
                "/payment/create",
                {
                    membershipType: type,
                },
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
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        alert("Payment cancelled");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response) {
                console.log(response.error);
                setLoading(false);
            });
            rzp.open();
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const plans = [
        {
            name: "Silver",
            price: "₹199",
            duration: "/ month",
            type: "silver_monthly",
            icon: Star,
            features: [
                "Chat with matches",
                "100 connection requests",
                "Silver badge",
                "See who liked you"
            ]
        },
        {
            name: "Gold Pro",
            price: "₹999",
            duration: "/ 6 months",
            badge: "Best Value",
            save: "Save 52%",
            monthlyEquivalent: "₹166 / month",
            popular: true,
            type: "gold_halfyear",
            icon: Zap,
            features: [
                "Everything in Gold",
                "Profile spotlight",
                "Priority visibility",
                "Unlimited swipes"
            ]
        },
        {
            name: "Gold",
            price: "₹349",
            duration: "/ month",
            type: "gold_monthly",
            icon: Crown,
            features: [
                "Unlimited connections",
                "Priority chat",
                "Gold badge",
                "Profile boost",
                "See who liked you"
            ]
        }
    ];

    return isUserPremium ? (
        <div className="min-h-[80vh] pt-32 pb-24 px-4 flex flex-col items-center justify-center bg-transparent">
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
                        <Crown size={88} className="text-amber-500 relative z-10 animate-bounce drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]" strokeWidth={1.5} />
                    </div>

                    {membershipType && membershipType.includes("silver") ? (
                        <>
                            <h2 className="text-3xl md:text-5xl font-black mb-4 text-zinc-800 dark:text-zinc-100">
                                You are a Silver Member
                            </h2>

                            <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-2xl p-6 mb-8 text-left w-full max-w-sm">
                                <p className="font-bold flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-4 text-lg">
                                    <Star size={20} className="fill-amber-500" />
                                    ✨ Upgrade to Gold
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
                                        <Check size={16} className="text-amber-600 dark:text-amber-400" /> Unlock unlimited connections
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
                                        <Check size={16} className="text-amber-600 dark:text-amber-400" /> Priority chat
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
                                        <Check size={16} className="text-amber-600 dark:text-amber-400" /> Profile boost
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => handleBuyClick("gold_monthly")}
                                className="w-full sm:w-auto py-4 px-8 rounded-xl font-bold text-lg bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:scale-105 transition-transform shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
                            >
                                <Crown size={20} className="fill-white" />
                                Upgrade to Gold – ₹150/month
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Birthday-like bold text */}
                            <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-pink-500 text-transparent bg-clip-text pb-2">
                                Woohoo!
                            </h2>

                            <p className="text-2xl md:text-3xl text-zinc-800 dark:text-zinc-100 font-bold mb-4">
                                You're a Gold Member!
                            </p>

                            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
                                Enjoy your exclusive perks and endless connections.
                            </p>

                            <ul className="text-left space-y-3 bg-white/50 dark:bg-black/20 p-6 rounded-2xl w-full max-w-sm mb-6">
                                <li className="flex items-center gap-3 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    <div className="bg-amber-100 dark:bg-amber-500/20 p-1.5 rounded-full text-amber-600 dark:text-amber-500 shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    Unlimited connections
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    <div className="bg-amber-100 dark:bg-amber-500/20 p-1.5 rounded-full text-amber-600 dark:text-amber-500 shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    Priority profile
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    <div className="bg-amber-100 dark:bg-amber-500/20 p-1.5 rounded-full text-amber-600 dark:text-amber-500 shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    Boosted visibility
                                </li>
                            </ul>
                        </>
                    )}
                </div>
            </div>

            {/* Profile Boost Upsell Section */}
            <div className="mt-16 w-full max-w-2xl mx-auto z-10">
                <div className={`p-8 rounded-3xl relative overflow-hidden group transition-all duration-300 ${boostActive ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_0_40px_rgba(245,158,11,0.4)]' : 'bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl'}`}>

                    {!boostActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 blur-xl group-hover:opacity-100 transition duration-500 opacity-50"></div>
                    )}

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-left">
                            <h3 className="text-2xl font-black text-white flex items-center gap-2 mb-2">
                                <Zap className={boostActive ? "fill-white text-white animate-pulse" : "fill-orange-500 text-orange-500"} size={24} />
                                {boostActive ? "Profile Boost Active!" : "Boost Your Profile"}
                            </h3>
                            <p className={boostActive ? "text-amber-100 font-medium" : "text-zinc-400 text-sm md:text-base"}>
                                {boostActive
                                    ? "Your profile is currently being shown at the top of the feed."
                                    : "Get 10x more visibility for 30 minutes. Be seen by top developers in your area."}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            {boostActive ? (
                                <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-3 border border-white/30 text-white font-black text-xl flex items-center shadow-inner">
                                    <span className="animate-pulse mr-2">⏳</span> {timeRemaining}
                                </div>
                            ) : (
                                <button
                                    disabled={loading}
                                    onClick={() => handleBuyClick("boost")}
                                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform whitespace-nowrap disabled:opacity-50 disabled:scale-100"
                                >
                                    {loading ? "Processing..." : "Boost Now — ₹99"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] pt-28 pb-12 mb-10 px-4 flex flex-col items-center justify-center bg-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 blur-[120px] opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 blur-[120px] opacity-20"></div>

            <div className="text-center mb-10 relative z-10">
                <h1 className="text-4xl md:text-5xl font-black mb-3 pb-2 leading-tight bg-gradient-to-r from-pink-500 to-orange-400 text-transparent bg-clip-text inline-block">
                    Upgrade to Premium
                </h1>
                <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
                    Supercharge your developer matchmaking experience with exclusive features and unlimited potential.
                </p>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 w-full max-w-6xl justify-center items-stretch perspective-1000">
                {plans.map((plan, index) => {
                    const PlanIcon = plan.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative group w-full xl:w-[360px]"
                        >
                            {plan.popular && (
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-pink-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
                            )}
                            <div className={`relative h-full flex flex-col p-6 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 ${plan.popular ? "border border-amber-500/30 z-10 scale-105 md:scale-110 hover:-translate-y-2 shadow-2xl" : "border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 lg:mt-4"} `}>

                                {plan.badge && (
                                    <div className="absolute -top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md z-20">
                                        {plan.badge}
                                    </div>
                                )}

                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg whitespace-nowrap uppercase tracking-wider">
                                        <Zap size={14} className="fill-white" />
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-5">
                                    <h2 className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${plan.popular ? "text-amber-500" : "text-zinc-700 dark:text-zinc-200"}`}>
                                        <PlanIcon className={`${plan.popular ? "text-amber-500 fill-amber-500" : "text-zinc-400 fill-zinc-400"}`} size={24} />
                                        {plan.name}
                                    </h2>
                                    <div className="mt-3 flex items-end gap-1 flex-wrap">
                                        <span className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white">{plan.price}</span>
                                        <span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs md:text-sm mb-1">{plan.duration}</span>
                                    </div>

                                    {(plan.monthlyEquivalent || plan.save) && (
                                        <div className="flex items-center gap-2 mt-2">
                                            {plan.monthlyEquivalent && (
                                                <div className="text-xs text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                                                    {plan.monthlyEquivalent}
                                                </div>
                                            )}
                                            {plan.save && (
                                                <div className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-md">
                                                    {plan.save}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <ul className="flex-grow space-y-3 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                                            <div className={`${plan.popular ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"} p-1 rounded-full shrink-0`}>
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                            <span className="font-medium text-xs md:text-sm leading-tight">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    disabled={loading}
                                    onClick={() => handleBuyClick(plan.type)}
                                    className={`w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-sm transition-all ${plan.popular
                                        ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        }`}
                                >
                                    {loading ? "Processing..." : "Choose Plan"}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Profile Boost Upsell Section */}
            <div className="mt-16 w-full max-w-2xl mx-auto z-10">
                <div className={`p-8 rounded-3xl relative overflow-hidden group transition-all duration-300 ${boostActive ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-[0_0_40px_rgba(245,158,11,0.4)]' : 'bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl'}`}>

                    {!boostActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 blur-xl group-hover:opacity-100 transition duration-500 opacity-50"></div>
                    )}

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-left">
                            <h3 className="text-2xl font-black text-white flex items-center gap-2 mb-2">
                                <Zap className={boostActive ? "fill-white text-white animate-pulse" : "fill-orange-500 text-orange-500"} size={24} />
                                {boostActive ? "Profile Boost Active!" : "Boost Your Profile"}
                            </h3>
                            <p className={boostActive ? "text-amber-100 font-medium" : "text-zinc-400 text-sm md:text-base"}>
                                {boostActive
                                    ? "Your profile is currently being shown at the top of the feed."
                                    : "Get 10x more visibility for 30 minutes. Be seen by top developers in your area."}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            {boostActive ? (
                                <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-3 border border-white/30 text-white font-black text-xl flex items-center shadow-inner">
                                    <span className="animate-pulse mr-2">⏳</span> {timeRemaining}
                                </div>
                            ) : (
                                <button
                                    disabled={loading}
                                    onClick={() => handleBuyClick("boost")}
                                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform whitespace-nowrap disabled:opacity-50 disabled:scale-100"
                                >
                                    {loading ? "Processing..." : "Boost Now — ₹99"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Premium;