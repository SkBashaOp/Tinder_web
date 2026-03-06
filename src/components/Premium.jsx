import axios from "axios";
import { useState } from "react";
import { Check, Star, Crown, Zap } from "lucide-react";

const Premium = () => {
    const handleBuyClick = async (type) => {
        console.log("Hello Premium user", type);
    };

    return (
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