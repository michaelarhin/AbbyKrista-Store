import { motion } from 'framer-motion';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Fast Delivery', desc: 'Nationwide delivery available' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '14-day return policy' },
  { icon: Headphones, title: 'Customer Support', desc: 'We\'re here to help' },
];

export default function Features() {
  return (
    <section className="py-16 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white/3 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20">
                <f.icon size={22} className="text-primary-400" />
              </div>
              <h4 className="text-white text-sm font-semibold mb-1">{f.title}</h4>
              <p className="text-neutral-500 text-xs">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
