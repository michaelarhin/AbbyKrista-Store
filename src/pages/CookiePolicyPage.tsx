import { motion } from 'framer-motion';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-semibold text-white mb-2">Cookie Policy</h1>
          <p className="text-neutral-500 text-sm mb-10">Last updated: June 2026</p>

          <div className="prose-policy space-y-8 text-neutral-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-lg font-semibold mb-3">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They help the website remember your preferences, understand how you use the site, and improve your browsing experience.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">2. How We Use Cookies</h2>
              <p>ABBYKRISTA OUTLET uses cookies for the following purposes:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li><strong className="text-white">Essential Cookies:</strong> These are necessary for the website to function properly. They enable core features like shopping cart functionality, secure checkout, and user authentication. Without these cookies, our services cannot be provided.</li>
                <li><strong className="text-white">Functional Cookies:</strong> These remember your preferences such as your selected currency, language, and region to provide a personalized experience.</li>
                <li><strong className="text-white">Analytics Cookies:</strong> These help us understand how visitors interact with our website — which pages are most popular, how users navigate the site, and where they encounter errors. This data helps us improve our website.</li>
                <li><strong className="text-white">Marketing Cookies:</strong> These may be used to show you relevant advertisements based on your browsing activity. We only use these with your explicit consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">3. Types of Cookies We Use</h2>
              <div className="mt-3 space-y-4">
                <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <p className="text-white font-medium mb-1">Session Cookies</p>
                  <p className="text-neutral-400 text-xs">Temporary cookies that are deleted when you close your browser. Used to maintain your session while shopping.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <p className="text-white font-medium mb-1">Persistent Cookies</p>
                  <p className="text-neutral-400 text-xs">Remain on your device for a set period or until manually deleted. Used to remember your login, preferences, and cart items between visits.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <p className="text-white font-medium mb-1">Third-Party Cookies</p>
                  <p className="text-neutral-400 text-xs">Set by services we use such as analytics providers and payment processors. These are governed by their respective privacy policies.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">4. Third-Party Services</h2>
              <p>We use the following third-party services that may set cookies:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li><strong className="text-white">Supabase:</strong> For authentication and user session management.</li>
                <li><strong className="text-white">Payment Providers:</strong> Mobile money and card processors for secure transaction handling.</li>
                <li><strong className="text-white">Analytics:</strong> To understand site usage and improve performance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">5. Managing Your Cookie Preferences</h2>
              <p>
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li><strong className="text-white">Browser Settings:</strong> Most browsers allow you to view, manage, and delete cookies through their settings. Note that disabling essential cookies may affect the functionality of our website.</li>
                <li><strong className="text-white">Opt-Out:</strong> For marketing and analytics cookies, you can opt out by adjusting your browser settings or using opt-out tools provided by analytics services.</li>
              </ul>
              <p className="mt-3">
                Popular browser cookie management links:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-neutral-400">
                <li>Chrome: Settings → Privacy and Security → Cookies</li>
                <li>Firefox: Settings → Privacy & Security → Cookies</li>
                <li>Safari: Preferences → Privacy → Cookies</li>
                <li>Edge: Settings → Cookies and Site Permissions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">6. Consent</h2>
              <p>
                By continuing to use our website, you consent to the use of essential and functional cookies. For analytics and marketing cookies, we will seek your explicit consent before enabling them.
              </p>
              <p className="mt-3">
                You may withdraw your consent at any time by clearing cookies from your browser or adjusting your preferences.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">7. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices. Any changes will be posted on this page with a revised date.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">8. Contact Us</h2>
              <p>If you have questions about our use of cookies, please contact us:</p>
              <ul className="list-none mt-3 space-y-1">
                <li><strong className="text-white">Business:</strong> ABBYKRISTA OUTLET</li>
                <li><strong className="text-white">Location:</strong> Accra, Ghana</li>
                <li><strong className="text-white">Email:</strong> support@abbykristaoutlet.com</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
