/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  User, 
  Calendar, 
  Star, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { LandingPageConfig } from '../types';

interface FeaturesProps {
  landingConfig?: LandingPageConfig;
}

export default function Features({ landingConfig }: FeaturesProps) {
  const iconList = [
    <User className="w-6 h-6 text-[#0051A8]" />,
    <Calendar className="w-6 h-6 text-[#0051A8]" />,
    <Star className="w-6 h-6 text-[#0051A8]" />,
    <ShieldCheck className="w-6 h-6 text-[#0051A8]" />
  ];

  const title = landingConfig?.features?.title || "المميزات";
  const subtitle = landingConfig?.features?.subtitle || "أنشئ بروفايل طبي احترافي لعيادتك، واعرض خدماتك ومواعيدك ووسائل التواصل لتسهيل وصول المرضى إليك";

  const categories = landingConfig?.features?.categories || [
    {
      id: "cat-1",
      title: "البروفايل الطبي",
      iconName: "user",
      items: [
        "نبذة عنك ومؤهلاتك العلمية",
        "الخدمات والعروض والأسعار",
        "معرض صور العيادة",
        "رابط شخصي باسمك",
        "إضافة أكثر من فرع للعيادة",
        "تصميم احترافي"
      ]
    },
    {
      id: "cat-2",
      title: "إدارة المواعيد",
      iconName: "calendar",
      items: [
        "حجز المواعيد بسهولة",
        "مواعيد العمل وجدول العيادة",
        "إدارة وتنظيم المواعيد",
        "تأكيد أو إلغاء الحجز",
        "إجازات الطبيب والاستثناءات",
        "تأكيد الحجز عبر واتساب"
      ]
    },
    {
      id: "cat-3",
      title: "التسويق والثقة",
      iconName: "star",
      items: [
        "تقييمات وآراء المرضى",
        "QR Code لمشاركة بروفايلك",
        "خرائط Google لموقع العيادة",
        "روابط السوشيال ميديا",
        "توثيق البروفايل",
        "إضافة الشهادات"
      ]
    },
    {
      id: "cat-4",
      title: "الإدارة والدعم",
      iconName: "shield",
      items: [
        "لوحة تحكم سهلة الاستخدام",
        "يعمل على جميع الأجهزة",
        "دعم فني متواصل",
        "تحديثات وتطوير مستمر",
        "إدارة طلبات حجوزات المرضى",
        "تعديل بيانات البروفايل"
      ]
    }
  ];

  return (
    <section className="w-full py-24 bg-[#FAF9F9]" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-medium text-[#10244A] tracking-wide leading-tight">
            {title}
          </h2>
          
          <p className="text-neutral-500 font-medium text-base md:text-lg mt-4 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Features Grid Layout */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 scroll-mt-32">
          {categories.map((cat, idx) => {
            const iconToUse = iconList[idx % iconList.length];
            return (
              <div 
                key={cat.id || idx}
                className="relative w-full max-w-[290px] sm:max-w-none mx-auto bg-white border border-neutral-150/70 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(16,36,74,0.1)] transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Thin Premium Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#10244A] group-hover:bg-[#009bb9] transition-colors duration-300" />

                {/* Card Header Content */}
                <div className="p-6 pt-8 text-center flex flex-col items-center">
                  {/* Circle Icon Badge */}
                  <div className="w-14 h-14 rounded-full bg-[#F2F7FD] border border-blue-500/15 flex items-center justify-center mb-4 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                    {React.cloneElement(iconToUse, { className: "w-6 h-6 text-[#0051A8]" })}
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl font-black text-[#10244A] tracking-tight">
                    {cat.title}
                  </h3>
                </div>

                {/* Card Checklist Items */}
                <div className="px-6 pb-8 pt-2">
                  <div className="flex flex-col space-y-3.5">
                    {cat.items.map((item, itemIdx) => (
                      <div 
                        key={itemIdx} 
                        className="flex items-center justify-start gap-2.5"
                      >
                        <div className="w-4.5 h-4.5 rounded-full bg-[#0051A8] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                        </div>
                        
                        <span className="text-[11px] sm:text-xs font-extrabold text-neutral-600 tracking-wide leading-none">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
