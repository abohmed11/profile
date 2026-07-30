/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Doctor, INITIAL_SPECIALTIES, LandingPageConfig } from '../types';
import { Users, ChevronLeft, ArrowLeftRight, User } from 'lucide-react';
import { motion } from 'motion/react';

interface ClientWorksProps {
  doctors: Doctor[];
  onVisitDoctor: (username: string) => void;
  landingConfig?: LandingPageConfig;
}

const getSpecialtyName = (specialtyId: string) => {
  const found = INITIAL_SPECIALTIES.find(s => s.id === specialtyId);
  if (found) return found.name;

  const legacy: Record<string, string> = {
    'dentist': 'أسنان',
    'derma': 'جلدية',
    'pediatric': 'أطفال',
    'cardio': 'قلب',
    'ortho': 'عظام',
    'ophthalmology': 'طب وجراحة العيون'
  };
  return legacy[specialtyId] || specialtyId;
};

export default function ClientWorks({ doctors, onVisitDoctor, landingConfig }: ClientWorksProps) {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const scrollDirectionRef = React.useRef<'forward' | 'backward'>('forward');

  const featuredIds = landingConfig?.clientWorks?.featuredDoctorIds;
  const displayedDoctors = (featuredIds && featuredIds.length > 0)
    ? doctors.filter(doc => featuredIds.includes(doc.id) || featuredIds.includes(doc.nameEn))
    : doctors;

  // Auto-scrolling effect every 3 seconds
  React.useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (!isDown && !isHovered) {
        const firstCard = el.firstElementChild as HTMLElement;
        const cardWidth = firstCard ? firstCard.offsetWidth + 32 : 282; // Dynamic card width + gap (32px)
        const isRtl = getComputedStyle(el).direction === 'rtl';
        const maxScroll = el.scrollWidth - el.clientWidth;
        
        if (isRtl) {
          // RTL scroll values are 0 or negative
          const currentScroll = Math.abs(el.scrollLeft);
          
          if (scrollDirectionRef.current === 'forward') {
            if (currentScroll >= maxScroll - 30) {
              scrollDirectionRef.current = 'backward';
              el.scrollTo({ left: el.scrollLeft + cardWidth, behavior: 'smooth' });
            } else {
              el.scrollTo({ left: el.scrollLeft - cardWidth, behavior: 'smooth' });
            }
          } else { // backward
            if (currentScroll <= 30) {
              scrollDirectionRef.current = 'forward';
              el.scrollTo({ left: el.scrollLeft - cardWidth, behavior: 'smooth' });
            } else {
              el.scrollTo({ left: el.scrollLeft + cardWidth, behavior: 'smooth' });
            }
          }
        } else {
          // LTR scroll values are 0 or positive
          const currentScroll = el.scrollLeft;
          
          if (scrollDirectionRef.current === 'forward') {
            if (currentScroll >= maxScroll - 30) {
              scrollDirectionRef.current = 'backward';
              el.scrollTo({ left: el.scrollLeft - cardWidth, behavior: 'smooth' });
            } else {
              el.scrollTo({ left: el.scrollLeft + cardWidth, behavior: 'smooth' });
            }
          } else { // backward
            if (currentScroll <= 30) {
              scrollDirectionRef.current = 'forward';
              el.scrollTo({ left: el.scrollLeft + cardWidth, behavior: 'smooth' });
            } else {
              el.scrollTo({ left: el.scrollLeft - cardWidth, behavior: 'smooth' });
            }
          }
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isDown, isHovered]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="w-full py-24 bg-[#FAF9F9] border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#10244A] tracking-wide flex items-center gap-2 font-almarai">
            {landingConfig?.clientWorks?.title || 'سابقة الأعمال'}
          </h2>
          <p className="text-neutral-500 font-semibold text-sm mt-2 font-almarai">
            {landingConfig?.clientWorks?.subtitle || 'استعرض نماذج مواقع بروفايلات الأطباء التي تم إنشاؤها عبر منصتنا'}
          </p>
        </div>

        {/* Horizontal Slider Layout */}
        <div id="client-works" className="relative scroll-mt-32 md:scroll-mt-36">
          <div 
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            className={`flex gap-8 overflow-x-auto px-8 md:px-0 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory scroll-smooth ${isDown ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
            id="doctor-carousel"
          >
            {displayedDoctors.map((doc, idx) => (
              <motion.div 
                key={doc.id} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.08, 0.4) }}
                whileHover={{ y: -6 }}
                className="flex-shrink-0 w-[230px] sm:w-[250px] bg-neutral-50 border border-neutral-200/60 rounded-[24px] overflow-hidden group snap-center shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.04)] transition-all duration-300 text-right"
              >
                {/* Header (Name & Specialty / Type Badge) */}
                <div className="p-4 bg-white border-b border-neutral-100 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-[#10244A] font-almarai leading-tight flex items-center justify-start gap-1.5">
                      <span>{doc.name}</span>
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#1877F2] fill-current shrink-0" title="موثوق">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.407-.17-.867-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.407.17 .867.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.62 3.71l-3.27-3.27 1.1-1.1 2.17 2.17 5.85-5.85 1.11 1.11-6.96 6.94z" />
                      </svg>
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 font-almarai flex items-center gap-1">
                    {getSpecialtyName(doc.specialty)}
                  </span>
                </div>
 
                 {/* Card Preview Area */}
                <div className="h-[230px] overflow-hidden relative">
                  <img 
                    src={doc.avatar} 
                    alt={doc.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    draggable="false"
                  />
                  {/* Subtle dark gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-90" />
                  
                  {/* Action Button Overlaid */}
                  <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center">
                    <button 
                      onClick={() => onVisitDoctor(doc.nameEn)}
                      className="px-4 py-1.5 bg-white/95 backdrop-blur-sm text-black border border-white/20 rounded-lg text-[11px] font-extrabold transition-all duration-300 flex items-center justify-center gap-1 hover:bg-[#10244A] hover:text-white hover:border-[#10244A] shadow-md font-almarai active:scale-95"
                    >
                      <span>زيارة البروفايل</span>
                      <ChevronLeft className="w-3 h-3 font-bold" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {doctors.length === 0 && (
              <div className="w-full py-12 text-center text-neutral-400 font-bold text-xs">
                لا توجد عناصر حالياً.
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}

