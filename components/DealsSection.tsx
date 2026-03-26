import React from 'react';
import { ArrowRight, Tag, ShoppingBag, Percent, Zap } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const DEALS = [
  {
    title: "Amazon Mega Sale",
    description: "Up to 80% off on electronics and fashion. Limited time offer.",
    icon: ShoppingBag,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  },
  {
    title: "Flipkart Big Billion",
    description: "Exclusive discounts on smartphones and home appliances.",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    title: "Myntra Insider",
    description: "Extra 20% off for members on premium clothing brands.",
    icon: Tag,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10"
  },
  {
    title: "Coupon Codes",
    description: "Verified promo codes for 50+ online shopping platforms.",
    icon: Percent,
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  }
];

const DealsSection: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-[#05070A] border-t border-gray-100 dark:border-white/5">
      <div className="max-w-[1500px] mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              BrandiQue <span className="text-neon-purple">Deals.</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg font-light">
              Latest offers, discounts & coupon codes updated daily from Amazon, Flipkart, Myntra and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEALS.map((deal, i) => (
              <div 
                key={i} 
                className="group p-8 rounded-[32px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-neon-purple/30 transition-all duration-500 hover:shadow-2xl hover:shadow-neon-purple/5"
              >
                <div className={`w-14 h-14 rounded-2xl ${deal.bgColor} flex items-center justify-center ${deal.color} mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <deal.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{deal.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-light mb-6">
                  {deal.description}
                </p>
                <a 
                  href="https://deals.brandique.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neon-purple group-hover:gap-3 transition-all"
                >
                  View Deals <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default DealsSection;
