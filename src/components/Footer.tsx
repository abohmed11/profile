/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { LandingPageConfig } from '../types';

interface FooterProps {
  landingConfig?: LandingPageConfig;
}

export default function Footer({ landingConfig }: FooterProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const logoUrl = landingConfig?.footer?.logoUrl || "https://k.top4top.io/p_38573eitn0.png";
  const description = landingConfig?.footer?.description || "منصة متكاملة لإنشاء بروفايلات احترافية للأطباء وإدارة حضورهم الرقمي بسهولة.";
  const facebookUrl = landingConfig?.footer?.facebookUrl || "https://facebook.com";
  const instagramUrl = landingConfig?.footer?.instagramUrl || "https://instagram.com";
  const linkedinUrl = landingConfig?.footer?.linkedinUrl || "https://linkedin.com";
  const youtubeUrl = landingConfig?.footer?.youtubeUrl || "https://youtube.com";
  const copyrightText = landingConfig?.footer?.copyrightText || "© 2026 Dr Profile. All rights reserved.";

  return (
    <footer 
      id="footer"
      className="w-full bg-[#040D21] text-white py-4 sm:py-6 md:py-8 scroll-mt-24 border-t border-white/5"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col gap-3 sm:gap-5">
        
        {/* Main Row: Right side (Logo + Description), Left side (Quick Links) */}
        <div className="flex flex-row items-start justify-between gap-3 text-right">
          
          {/* Right Side: Logo & Description */}
          <div className="flex flex-col items-start text-right max-w-[58%] sm:max-w-md">
            <a 
              href="#hero" 
              onClick={(e) => handleScroll(e, 'hero')}
              className="inline-block transition-transform duration-300 hover:scale-105 mb-1"
              title="Dr Profile"
            >
              <img 
                src={logoUrl} 
                alt="Dr Profile Logo" 
                className="w-[125px] sm:w-[185px] h-auto object-contain"
              />
            </a>
            <p className="font-cairo text-[12px] sm:text-[16px] font-medium text-[rgba(255,255,255,0.85)] leading-tight sm:leading-relaxed">
              {description}
            </p>
          </div>

          {/* Left Side: Quick Links in a single vertical column */}
          <nav className="flex flex-col items-end text-right gap-1 sm:gap-2.5 text-[12px] sm:text-[15px] font-semibold text-white shrink-0 pt-0.5">
            <a 
              href="#hero" 
              onClick={(e) => handleScroll(e, 'hero')}
              className="transition-colors duration-200 hover:text-blue-400"
            >
              الرئيسية
            </a>
            <a 
              href="#features" 
              onClick={(e) => handleScroll(e, 'features')}
              className="transition-colors duration-200 hover:text-blue-400"
            >
              المميزات
            </a>
            <a 
              href="#subscription" 
              onClick={(e) => handleScroll(e, 'subscription')}
              className="transition-colors duration-200 hover:text-blue-400"
            >
              الأسعار
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleScroll(e, 'faq')}
              className="transition-colors duration-200 hover:text-blue-400"
            >
              الأسئلة الشائعة
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleScroll(e, 'contact')}
              className="transition-colors duration-200 hover:text-blue-400"
            >
              تواصل معنا
            </a>
          </nav>

        </div>

        {/* Divider line */}
        <div className="w-full border-t border-white/10 my-0.5" />

        {/* Center: Social Icons & Copyright */}
        <div className="flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2">
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5">
            {facebookUrl && (
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] rounded-full border border-white/50 text-white flex items-center justify-center transition-all duration-300 hover:border-blue-400 hover:text-blue-400 hover:bg-white/10 hover:scale-110"
              >
                <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {instagramUrl && (
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] rounded-full border border-white/50 text-white flex items-center justify-center transition-all duration-300 hover:border-blue-400 hover:text-blue-400 hover:bg-white/10 hover:scale-110"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {linkedinUrl && (
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] rounded-full border border-white/50 text-white flex items-center justify-center transition-all duration-300 hover:border-blue-400 hover:text-blue-400 hover:bg-white/10 hover:scale-110"
              >
                <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
            {youtubeUrl && (
              <a 
                href={youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] rounded-full border border-white/50 text-white flex items-center justify-center transition-all duration-300 hover:border-blue-400 hover:text-blue-400 hover:bg-white/10 hover:scale-110"
              >
                <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
          </div>

          {/* Copyright */}
          <p className="text-[11px] sm:text-[14px] font-normal text-[rgba(255,255,255,0.65)]">
            {copyrightText}
          </p>
        </div>

      </div>
    </footer>
  );
}

