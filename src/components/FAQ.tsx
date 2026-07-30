/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, Laptop, Calendar, Settings, Headphones, Share2, PlusCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingPageConfig } from '../types';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

interface FAQCardProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  key?: React.Key;
}

function FAQCard({ item, isOpen, onToggle }: FAQCardProps) {
  return (
    <div 
      onClick={onToggle}
      className="bg-white border border-neutral-200/60 rounded-[24px] p-5 md:p-6 hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-all duration-300 flex gap-4 md:gap-5 items-start text-right cursor-pointer select-none w-full"
    >
      {/* Question Icon */}
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#F2F7FD] border border-blue-500/15 flex items-center justify-center flex-shrink-0 shadow-sm">
        {item.icon}
      </div>

      {/* Question & Answer Content */}
      <div className="flex-1 min-w-0 pt-1 md:pt-2">
        <h3 className="font-extrabold text-sm md:text-lg text-[#10244A] tracking-tight leading-snug">
          {item.question}
        </h3>
        
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="text-neutral-500 text-[11px] sm:text-xs md:text-sm leading-relaxed font-semibold mt-2 max-w-[260px] md:max-w-none">
                {item.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <div className="pt-1 md:pt-2 shrink-0">
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={`w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-[#0051A8] border-[#0051A8] shadow-md shadow-[#0051A8]/20' 
              : 'bg-[#F2F7FD] hover:bg-blue-100/60 border-blue-500/10'
          }`}
        >
          <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 stroke-[3] transition-colors duration-300 ${
            isOpen ? 'text-white' : 'text-[#0051A8]'
          }`} />
        </motion.div>
      </div>
    </div>
  );
}

interface FAQProps {
  landingConfig?: LandingPageConfig;
}

export default function FAQ({ landingConfig }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const icons = [
    <Laptop className="w-6 h-6 text-[#0051A8]" />,
    <Calendar className="w-6 h-6 text-[#0051A8]" />,
    <Settings className="w-6 h-6 text-[#0051A8]" />,
    <Headphones className="w-6 h-6 text-[#0051A8]" />,
    <Share2 className="w-6 h-6 text-[#0051A8]" />,
    <PlusCircle className="w-6 h-6 text-[#0051A8]" />
  ];

  const title = landingConfig?.faq?.title || "الأسئلة الشائعة";
  const subtitle = landingConfig?.faq?.subtitle || "إجابات على أكثر الأسئلة شيوعًا حول منصتنا";

  const rawItems = landingConfig?.faq?.items || [
    { id: 'f1', question: 'هل يعمل على جميع الأجهزة؟', answer: 'نعم الموقع وجميع البروفايلات الطبية متوافقة مع الهواتف والأجهزة اللوحية وأجهزة الكمبيوتر' },
    { id: 'f2', question: 'هل يوجد حجز مواعيد؟', answer: 'نعم، يوفر موقعنا نظام حجز مواعيد إلكتروني يتيح للمرضى حجز المواعيد بسهولة' },
    { id: 'f3', question: 'هل يمكن تعديل بياناتي؟', answer: 'نعم يمكنك تعديل بيانات البروفايل الطبي وتحديثها في أي وقت من خلال لوحة التحكم' },
    { id: 'f4', question: 'هل يوجد دعم فني؟', answer: 'نعم فريق الدعم الفني متاح لمساعدتك والرد على جميع استفساراتك' }
  ];

  const faqItems: FAQItem[] = rawItems.map((item, idx) => ({
    question: item.question,
    answer: item.answer,
    icon: icons[idx % icons.length]
  }));

  return (
    <section className="w-full py-24 bg-[#FAF9F9] border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#10244A] tracking-wide flex items-center gap-2 font-almarai">
            {title}
          </h2>
          <p className="text-neutral-500 font-semibold text-sm mt-1 font-almarai">{subtitle}</p>
        </div>

        {/* FAQ Grid */}
        <div id="faq" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-32">
          {faqItems.map((item, index) => (
            <FAQCard 
              key={index} 
              item={item} 
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
