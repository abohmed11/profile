/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LandingPageConfig } from '../types';

interface SubscriptionProps {
  onStart: (plan: '5months' | '1year') => void;
  landingConfig?: LandingPageConfig;
}

// Custom Premium Checked Icon matching the design
const CheckIcon = () => (
  <span className="w-5 h-5 bg-[#0051A8] rounded-full flex items-center justify-center shrink-0 shadow-sm">
    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-none stroke-current stroke-[3.5]">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

const CrossIcon = () => (
  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 shadow-sm">
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-red-600 fill-none stroke-current stroke-[3.5]">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </span>
);

export default function Subscription({ onStart, landingConfig }: SubscriptionProps) {
  const sectionTitle = landingConfig?.pricing?.title || "باقات الاشتراك";
  const sectionSubtitle = landingConfig?.pricing?.subtitle || "اختر الباقة المناسبة لتفعيل بروفايلك الطبي";
  const ctaBtnText = landingConfig?.pricing?.ctaText || "اشترك الآن";

  const p1 = landingConfig?.pricing?.plan5Months || {
    title: "اشتراك لمدة 6 أشهر",
    price: "1500",
    period: "ج.م / 6 أشهر",
    discountText: "عرض خاص",
    features: [
      "جميع المميزات والخصائص",
      "تفعيل سريع خلال 24 ساعة",
      "دعم فني طوال فترة الاشتراك",
      "تحديثات مستقبلية مجانية"
    ]
  };

  const p2 = landingConfig?.pricing?.plan1Year || {
    title: "اشتراك لمدة سنة (العرض الأوفر)",
    price: "2500",
    period: "ج.م / سنة",
    discountText: "وفر 500 جنيه",
    features: [
      "جميع المميزات والخصائص",
      "تفعيل سريع خلال 24 ساعة",
      "دعم فني طوال فترة الاشتراك",
      "تحديثات مستقبلية مجانية"
    ]
  };

  return (
    <section className="w-full py-20 bg-[#FAF9F9] border-t border-neutral-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#10244A] tracking-wide leading-tight">
            {sectionTitle}
          </h2>
          <div className="h-1 w-20 bg-[#009bb9] rounded-full mt-3" />
          <p className="text-neutral-500 font-bold text-sm md:text-base mt-3 max-w-2xl leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* 2-Column Pricing Cards Grid */}
        <div id="subscription" className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto items-stretch scroll-mt-32">
          
          {/* Card 1: 6-Months Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full max-w-[290px] md:max-w-[310px] mx-auto bg-white border-2 border-[#10244A] rounded-[24px] shadow-[0_12px_40px_rgba(16,36,74,0.06)] flex flex-col justify-between p-5 lg:p-6 group overflow-hidden"
          >
            {/* Header Content */}
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative w-14 h-14 bg-[#F2F7FD] rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                  <div className="w-9 h-9 bg-white rounded-md border border-blue-500/15 shadow-sm relative overflow-hidden flex flex-col">
                    <div className="h-2 bg-blue-500 w-full flex justify-around items-center px-1">
                      <div className="w-0.5 h-0.5 rounded-full bg-white/70" />
                      <div className="w-0.5 h-0.5 rounded-full bg-white/70" />
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-0.5 p-1">
                      <div className="w-0.5 h-0.5 rounded-full bg-neutral-200" />
                      <div className="w-0.5 h-0.5 rounded-full bg-neutral-200" />
                      <div className="w-0.5 h-0.5 rounded-full bg-neutral-200" />
                      <div className="w-0.5 h-0.5 rounded-full bg-neutral-200" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10244A] rounded-full border border-white flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-none stroke-current stroke-[2.5]">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                </div>

                {/* Subscription Titles */}
                <div>
                  <h3 className="text-base lg:text-lg font-black text-[#10244A] leading-tight">
                    {p1.title}
                  </h3>
                  <div className="inline-flex bg-[#F0FDF4] text-[#15803D] font-black text-[9px] px-2 py-0.5 mt-0.5 rounded-full items-center gap-1">
                    <span>🎁</span>
                    <span>{p1.discountText}</span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] w-full bg-neutral-100 my-3" />

              <div className="h-[80px] flex flex-col justify-center items-center text-center my-3">
                <span className="text-[10px] text-neutral-400 font-black tracking-wide mb-0.5">السعر</span>
                <span className="text-3xl lg:text-4xl font-black text-[#10244A] tracking-tight mb-0.5">
                  {p1.price}
                </span>
                <span className="text-xs text-neutral-500 font-bold">{p1.period}</span>
              </div>

              {/* Checklist Items */}
              <ul className="space-y-2.5 my-4">
                {p1.features.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-neutral-600 text-xs lg:text-sm font-bold">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-2">
              <button
                onClick={() => onStart('5months')}
                className="w-full py-2.5 border-2 border-[#10244A] bg-transparent text-[#10244A] hover:bg-[#10244A] hover:text-white active:scale-95 font-black text-xs lg:text-sm rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
              >
                {ctaBtnText}
              </button>
            </div>
          </motion.div>

          {/* Card 2: 1-Year Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full max-w-[290px] md:max-w-[310px] mx-auto bg-white border-2 border-[#10244A] rounded-[24px] shadow-[0_12px_40px_rgba(16,36,74,0.06)] flex flex-col justify-between p-5 lg:p-6 group overflow-hidden"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative w-14 h-14 bg-[#F2F7FD] rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                  <div className="w-9 h-9 bg-white rounded-md border border-blue-500/15 shadow-sm relative overflow-hidden flex flex-col">
                    <div className="h-2 bg-blue-500 w-full flex justify-around items-center px-1">
                      <div className="w-0.5 h-0.5 rounded-full bg-white/70" />
                      <div className="w-0.5 h-0.5 rounded-full bg-white/70" />
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-0.5 p-1">
                      <div className="w-0.5 h-0.5 rounded-full bg-neutral-200" />
                      <div className="w-0.5 h-0.5 rounded-full bg-[#009bb9]" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0051A8] rounded-full border border-white flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-none stroke-current stroke-[3]">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3 className="text-base lg:text-lg font-black text-[#10244A] leading-tight">
                    {p2.title}
                  </h3>
                  <div className="inline-flex bg-[#EAFDF3] text-[#15803D] font-black text-[9px] px-2.5 py-0.5 mt-0.5 rounded-full items-center gap-1">
                    <span>🎁</span>
                    <span>{p2.discountText}</span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] w-full bg-neutral-100 my-3" />

              <div className="h-[80px] flex flex-col justify-center items-center text-center my-3">
                <span className="text-[10px] text-neutral-400 font-black tracking-wide mb-0.5">السعر</span>
                <span className="text-3xl lg:text-4xl font-black text-[#10244A] tracking-tight mb-0.5">
                  {p2.price}
                </span>
                <span className="text-xs text-neutral-500 font-bold">{p2.period}</span>
              </div>

              {/* Checklist Items */}
              <ul className="space-y-2.5 my-4">
                {p2.features.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-neutral-600 text-xs lg:text-sm font-bold">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-2">
              <button
                onClick={() => onStart('1year')}
                className="w-full py-2.5 bg-[#10244A] hover:bg-[#091A3A] text-white active:scale-95 font-black text-xs lg:text-sm rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                {ctaBtnText}
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
