import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-semibold text-white mb-2">Terms of Service</h1>
          <p className="text-neutral-500 text-sm mb-10">Last updated: June 2026</p>

          <div className="prose-policy space-y-8 text-neutral-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-lg font-semibold mb-3">1. Introduction</h2>
              <p>
                Welcome to ABBYKRISTA OUTLET. These Terms of Service ("Terms") govern your use of our website and the purchase of products from us. By accessing or using our website, you agree to be bound by these Terms. If you do not agree, please do not use our services.
              </p>
              <p className="mt-3">
                ABBYKRISTA OUTLET is a Ghana-based online retail business offering home decor (ABBYHAUS), fashion items, accessories, and preorder products.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">2. Eligibility</h2>
              <p>
                To use our services and make purchases, you must be at least 18 years of age or have the consent of a parent or legal guardian. By placing an order, you represent that you meet this requirement.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">3. Products & Pricing</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All prices are displayed in Ghana Cedis (GHS) unless otherwise indicated.</li>
                <li>We make every effort to display accurate product descriptions and images. However, slight variations in colour or appearance may occur due to screen settings.</li>
                <li>Prices are subject to change without prior notice. The price at the time of order placement is the price you pay.</li>
                <li>We reserve the right to refuse or cancel any order if a pricing error occurs, even after order confirmation.</li>
                <li>Products listed under "Preorder" are not yet in stock. Estimated delivery timelines will be communicated at the time of purchase.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">4. Orders & Payment</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>An order is confirmed once we send you an order confirmation via email or SMS.</li>
                <li>We accept payments via Mobile Money (MTN MoMo, Vodafone Cash, AirtelTigo Money), debit/credit cards, and cash on delivery (where available).</li>
                <li>Payment must be completed before dispatch unless cash on delivery is selected.</li>
                <li>We reserve the right to cancel orders that we suspect are fraudulent or unauthorized.</li>
                <li>For preorder items, payment is collected at the time of ordering. If the item becomes unavailable, a full refund will be issued.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">5. Shipping & Delivery</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>We deliver across Ghana. Delivery timelines vary based on your location (typically 1–5 business days within Accra, 3–7 business days to other regions).</li>
                <li>Shipping fees are calculated at checkout based on your delivery address and order weight/size.</li>
                <li>Risk of loss and title for items pass to you upon delivery to your specified address.</li>
                <li>We are not liable for delays caused by circumstances beyond our control (natural disasters, strikes, public holidays).</li>
                <li>You are responsible for providing accurate delivery details. We are not liable for failed deliveries due to incorrect information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">6. Returns & Refunds</h2>
              <p>
                Please refer to our <a href="/refund-policy" className="text-primary-400 hover:text-primary-300 underline">Refund Policy</a> for complete details. In summary:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>You may request a return within 15 days of receiving your item.</li>
                <li>Items must be unused, in original condition, and in original packaging.</li>
                <li>Certain items (intimate wear, personalised items, sale items) are not eligible for return.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">7. Intellectual Property</h2>
              <p>
                All content on this website — including text, graphics, logos, images, and software — is the property of ABBYKRISTA OUTLET or its content suppliers and is protected by Ghanaian and international intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">8. User Conduct</h2>
              <p>When using our website, you agree not to:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Use the site for any unlawful purpose or in violation of any applicable Ghanaian laws</li>
                <li>Attempt to gain unauthorized access to our systems or interfere with the website's functionality</li>
                <li>Provide false or misleading information when placing orders</li>
                <li>Use automated systems (bots, scrapers) to access or collect data from the website</li>
                <li>Impersonate another person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">9. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by Ghanaian law, ABBYKRISTA OUTLET shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or purchase of products, including but not limited to loss of profits, data, or goodwill.
              </p>
              <p className="mt-3">
                Our total liability for any claim arising from these Terms shall not exceed the amount you paid for the relevant product or service.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless ABBYKRISTA OUTLET, its owners, employees, and agents from any claims, losses, or damages (including legal fees) arising from your breach of these Terms or misuse of our services.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">11. Governing Law & Dispute Resolution</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the Republic of Ghana. Any disputes arising from these Terms or your use of our services shall be resolved through negotiation first. If unresolved, disputes shall be submitted to the courts of competent jurisdiction in Accra, Ghana.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">12. Changes to These Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of our website after changes constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">13. Contact Us</h2>
              <p>For questions about these Terms of Service, please reach out:</p>
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
