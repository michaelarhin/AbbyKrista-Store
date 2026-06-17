import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-semibold text-white mb-2">Privacy Policy</h1>
          <p className="text-neutral-500 text-sm mb-10">Last updated: June 2026</p>

          <div className="prose-policy space-y-8 text-neutral-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-lg font-semibold mb-3">1. Introduction</h2>
              <p>
                ABBYKRISTA OUTLET ("we", "us", or "our") operates the ABBYKRISTA OUTLET website. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or make a purchase. By using our services, you consent to the practices described in this policy.
              </p>
              <p className="mt-3">
                We are committed to complying with the Ghana Data Protection Act, 2012 (Act 843) and all applicable data protection regulations.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li><strong className="text-white">Personal Information:</strong> Full name, email address, phone number, delivery address, and payment details when you place an order.</li>
                <li><strong className="text-white">Account Information:</strong> Login credentials if you create an account with us.</li>
                <li><strong className="text-white">Transaction Information:</strong> Details about purchases, order history, payment method used (mobile money, card, or cash on delivery).</li>
                <li><strong className="text-white">Device & Usage Information:</strong> IP address, browser type, operating system, pages visited, time spent on site, and referring URLs collected automatically through cookies and similar technologies.</li>
                <li><strong className="text-white">Communication Data:</strong> Any messages or inquiries you send to us via email, WhatsApp, or social media.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">3. How We Use Your Information</h2>
              <p>We use the information collected to:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Process and fulfil your orders, including delivery coordination</li>
                <li>Send order confirmations, shipping updates, and delivery notifications</li>
                <li>Process payments through our payment partners (mobile money providers, card processors)</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our website, products, and services</li>
                <li>Send promotional offers and newsletters (only with your consent)</li>
                <li>Prevent fraud and ensure the security of transactions</li>
                <li>Comply with legal obligations under Ghanaian law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">4. How We Share Your Information</h2>
              <p>We do not sell your personal information. We may share your data with:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li><strong className="text-white">Delivery Partners:</strong> To fulfil and ship your orders within Ghana and beyond.</li>
                <li><strong className="text-white">Payment Processors:</strong> Mobile money providers (MTN MoMo, Vodafone Cash, AirtelTigo Money) and card payment gateways to process transactions securely.</li>
                <li><strong className="text-white">Service Providers:</strong> Third-party services that help us operate our website (hosting, analytics, email services).</li>
                <li><strong className="text-white">Legal Requirements:</strong> When required by law, court order, or governmental authority in Ghana.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">5. Data Security</h2>
              <p>
                We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include encrypted connections (SSL/TLS), secure payment processing, and restricted access to personal data.
              </p>
              <p className="mt-3">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order records are retained for a minimum of 6 years in accordance with Ghanaian tax and commercial law requirements.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">7. Your Rights</h2>
              <p>Under the Ghana Data Protection Act, 2012, you have the right to:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Request deletion of your personal data (subject to legal retention requirements)</li>
                <li>Withdraw consent for marketing communications at any time</li>
                <li>Object to processing of your data for certain purposes</li>
                <li>Lodge a complaint with the Data Protection Commission of Ghana</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us using the details below.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party services you interact with.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">9. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete that information.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">11. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us:</p>
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
