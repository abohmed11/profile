/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LandingPageConfig } from '../types';

interface ContactWhatsAppProps {
  landingConfig?: LandingPageConfig;
}

export default function ContactWhatsApp({ landingConfig }: ContactWhatsAppProps) {
  const [message, setMessage] = useState('');

  const title = landingConfig?.contact?.title || 'تواصل معنا';
  const whatsappNum = landingConfig?.contact?.whatsappNumber || '201099112233';
  const placeholder = landingConfig?.contact?.placeholder || 'اكتب رسالتك هنا...';
  const buttonText = landingConfig?.contact?.buttonText || 'واتساب';

  const handleWhatsAppClick = () => {
    const encodedText = encodeURIComponent(message.trim() || 'مرحباً، أود الاستفسار عن خدماتكم.');
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="w-full py-16 bg-[#FAF9F9] border-b border-neutral-100 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-6">
        {/* Title / Heading */}
        <div className="space-y-1">
          <h3 className="text-3xl md:text-5xl font-medium text-[#10244A] tracking-wide font-almarai">
            {title}
          </h3>
        </div>

        {/* Input & WhatsApp Action Bar */}
        <div className="w-full max-w-2xl bg-white border border-neutral-200/85 rounded-2xl p-1.5 md:p-2 flex items-center shadow-[0_12px_40px_rgba(0,0,0,0.02)] gap-2 md:gap-3 mt-2 focus-within:border-[#10244A] transition-all duration-300">
          
          {/* Text Input */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            dir="rtl"
            className="w-full bg-transparent border-none text-right text-xs md:text-sm lg:text-base font-semibold px-2 md:px-4 py-2 focus:outline-none focus:ring-0 text-neutral-800 placeholder-neutral-400 font-almarai"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleWhatsAppClick();
            }}
          />

          {/* Green WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="flex-shrink-0 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs md:text-sm px-4 md:px-6 py-2.5 md:py-3 rounded-xl transition-all duration-300 flex items-center gap-1.5 md:gap-2 shadow-md active:scale-95 font-almarai cursor-pointer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 448 512" 
              className="w-4 h-4 md:w-5 md:h-5 text-white fill-current"
            >
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.3 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-117zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            <span>{buttonText}</span>
          </button>

        </div>
      </div>
    </section>
  );
}
