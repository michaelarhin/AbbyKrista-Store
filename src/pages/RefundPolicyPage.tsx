import { motion } from 'framer-motion';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-semibold text-white mb-2">Refund Policy</h1>
          <p className="text-neutral-500 text-sm mb-10">Last updated: June 2026</p>

          <div className="prose-policy space-y-8 text-neutral-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-lg font-semibold mb-3">1. Overview</h2>
              <p>
                At ABBYKRISTA OUTLET, we want you to be completely satisfied with your purchase. If you are not happy with an item you received, you may request a return or refund subject to the conditions outlined below.
              </p>
              <div className="mt-4 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <p className="text-primary-400 font-semibold text-sm">15-Day Return Window</p>
                <p className="text-neutral-300 text-xs mt-1">
                  You have 15 days from the date you receive your item to initiate a return or refund request.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">2. Eligibility for Returns</h2>
              <p>To be eligible for a return, the following conditions must be met:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>The return request is made within <strong className="text-white">15 days of receiving the item</strong>.</li>
                <li>The item must be unused, unworn, unwashed, and in its original condition.</li>
                <li>The item must be in its original packaging with all tags, labels, and accessories intact.</li>
                <li>You must provide proof of purchase (order confirmation email, receipt, or order number).</li>
                <li>The item must not be damaged through misuse, negligence, or normal wear and tear after delivery.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">3. Items Not Eligible for Return</h2>
              <p>The following items cannot be returned or refunded:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Items that have been used, worn, washed, or altered</li>
                <li>Intimate items (underwear, earrings that have been worn)</li>
                <li>Personalised or custom-made items</li>
                <li>Items marked as "Final Sale" or "Non-Returnable" at the time of purchase</li>
                <li>Gift cards or vouchers</li>
                <li>Items damaged due to improper use after delivery</li>
                <li>Items returned after the 15-day window</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">4. Preorder Items</h2>
              <p>For items purchased under the Preorder category:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>If a preorder item becomes unavailable or cannot be fulfilled, you will receive a full refund.</li>
                <li>You may cancel a preorder before the item ships for a full refund.</li>
                <li>Once a preorder item has shipped, standard return conditions apply (15 days from receipt).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">5. How to Request a Return</h2>
              <p>To initiate a return:</p>
              <ol className="list-decimal pl-5 mt-3 space-y-2">
                <li>Contact us at <strong className="text-white">support@abbykristaoutlet.com</strong> or via our WhatsApp within 15 days of receiving your item.</li>
                <li>Include your order number, the item(s) you wish to return, and the reason for the return.</li>
                <li>Attach clear photos of the item in its current condition.</li>
                <li>We will review your request and respond within 1–2 business days with return instructions.</li>
                <li>Once approved, ship the item back to the address we provide or arrange a pickup (where available in Accra).</li>
              </ol>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">6. Return Shipping</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Defective or Wrong Items:</strong> If you received a damaged, defective, or incorrect item, we will cover the return shipping cost and arrange a replacement or full refund.</li>
                <li><strong className="text-white">Change of Mind:</strong> If you are returning an item because you changed your mind, return shipping costs are your responsibility.</li>
                <li>We recommend using a trackable shipping method. We are not responsible for items lost in return transit.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">7. Refund Process</h2>
              <p>Once we receive and inspect the returned item:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>We will notify you of the approval or rejection of your refund within 2–3 business days.</li>
                <li>If approved, your refund will be processed to your original payment method:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong className="text-white">Mobile Money:</strong> Refund credited within 1–3 business days.</li>
                    <li><strong className="text-white">Card Payment:</strong> Refund may take 5–10 business days to appear on your statement.</li>
                    <li><strong className="text-white">Cash on Delivery:</strong> Refund via mobile money transfer to your registered number.</li>
                  </ul>
                </li>
                <li>Original shipping fees are non-refundable unless the return is due to our error.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">8. Exchanges</h2>
              <p>
                We currently do not offer direct exchanges. If you would like a different item, size, or colour, please return the original item for a refund and place a new order.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">9. Damaged or Defective Items</h2>
              <p>
                If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement or full refund at no additional cost to you. Do not discard the damaged item or packaging until the matter is resolved.
              </p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">10. Late or Missing Refunds</h2>
              <p>If you have not received your refund within the expected timeframe:</p>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Check your mobile money transaction history or bank/card statement.</li>
                <li>Contact your bank or mobile money provider, as processing times may vary.</li>
                <li>If you still have not received your refund, contact us at support@abbykristaoutlet.com.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">11. Contact Us</h2>
              <p>For any questions about our refund policy, reach out to us:</p>
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
