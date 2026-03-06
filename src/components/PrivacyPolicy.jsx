import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen py-24 px-4 bg-transparent text-zinc-800 dark:text-zinc-200">
            <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-3xl p-8 md:p-12 shadow-xl border border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl md:text-5xl font-black mb-8 bg-gradient-to-r from-pink-500 to-orange-400 text-transparent bg-clip-text">
                    Privacy Policy
                </h1>

                <div className="space-y-8 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    <section>
                        <p className="text-sm text-zinc-500 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                        <p>
                            Welcome to devTinder. We are committed to protecting and respecting your privacy. This Privacy Policy covers the experience we provide for users of our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">1. What information do we collect?</h2>
                        <h3 className="text-xl font-semibold mb-2">Information you choose to provide</h3>
                        <p className="mb-4">
                            When you register for an account, we collect your name, email address, gender, age, skills, and the photos you upload. We also process the messages you send to your connections securely.
                        </p>
                        <h3 className="text-xl font-semibold mb-2">Information we collect automatically</h3>
                        <p>
                            We automatically collect certain information when you visit, use, or navigate the platform, including network and device information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">2. How we use your information</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To create and manage your account.</li>
                            <li>To provide you with tailored matches based on your skills and preferences.</li>
                            <li>To enable user-to-user communications.</li>
                            <li>To keep our platform safe and secure.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">3. How we share your information</h2>
                        <p>
                            We only share your public profile data (name, skills, gender, age, about, and photo) with other users of devTinder to facilitate connections. We do not sell your personal data to third parties. We may disclose your information where we are legally required to do so.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">4. Your Rights</h2>
                        <p>
                            You have the right to access, update, or delete your personal information at any time. You can request account deletion by contacting our support team or through your account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">5. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about this policy, please contact us at support@devtinder.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
