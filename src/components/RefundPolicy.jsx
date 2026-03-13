import React from "react";

const RefundPolicy = () => {
    return (
        <div className="min-h-screen py-24 px-4 bg-transparent text-zinc-800 dark:text-zinc-200">
            <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-xl border border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl md:text-5xl font-black mb-8 bg-gradient-to-r from-pink-500 to-orange-400 text-transparent bg-clip-text">
                    REFUND POLICY
                </h1>

                <div className="space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg">
                    <ul className="list-disc pl-5 space-y-4">
                        <li>We offer a 7 days "NO QUESTIONS ASKED" refund Policy.</li>
                        <li>Within the 7 days of your premium subscription purchase, you can ask for the refund anytime.</li>
                        <li>For refunds, please mail us at <a href="mailto:support@devfind.online" className="text-pink-500 hover:underline">support@devfind.online</a></li>
                        <li>Refunds are not available for iOS app purchases.</li>
                        <li>In case of a subscription bundle, a refund will be initiated for the whole bundle, and not for individual months.</li>
                        <li>After the refund is initiated, it takes around 5-7 business days for the amount to be reflected in your bank.</li>
                        <li>Please note that once a refund is processed, no further refunds will be provided for the same purchase/subscription.</li>
                        <li>Purchases made using the "Gift-a-subscription" feature are not eligible for a refund.</li>
                        <li>Refunds are only provided if you have access to the subscription account.</li>
                        <li>If your email ID is found to be suspicious or involved in malicious activity, a refund will not be initiated.</li>
                        <li>If any queries, feel free to contact us at <a href="mailto:support@devfind.online" className="text-pink-500 hover:underline">support@devfind.online</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
