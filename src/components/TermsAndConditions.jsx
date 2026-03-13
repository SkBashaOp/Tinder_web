import React from "react";

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen py-24 px-4 bg-transparent text-zinc-800 dark:text-zinc-200">
            <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-xl border border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl md:text-5xl font-black mb-8 bg-gradient-to-r from-pink-500 to-orange-400 text-transparent bg-clip-text">
                    Terms and Conditions
                </h1>

                <div className="space-y-8 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    <section>
                        <p className="text-sm text-zinc-500 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                        <p>
                            By accessing and using devFind (the "Platform"), you agree to the following terms and conditions. If you do not agree with any of these terms, please do not use our Platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">1. Eligibility</h2>
                        <p>
                            You must be at least 18 years of age to create an account on devFind. By creating an account, you represent and warrant that you meet this requirement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">2. Acceptable Use</h2>
                        <p className="mb-2">You agree not to use the Platform for any prohibited activities, including but not limited to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Harassing, bullying, or intimidating other users.</li>
                            <li>Uploading explicit, offensive, or inappropriate content.</li>
                            <li>Spamming or sending unsolicited promotional messages.</li>
                            <li>Creating fake profiles or impersonating someone else.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">3. User Content</h2>
                        <p>
                            You retain all ownership rights to the content you post on devFind. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, display, and distribute that content in connection with providing the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">4. Account Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your account at any time, for any reason, including if we believe you have violated these Terms and Conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">5. Disclaimer of Liability</h2>
                        <p>
                            devFind is not responsible for the conduct of any user on or off the Platform. We do not conduct criminal background checks on our users. Use your best judgment and prioritize your safety when interacting with others.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
