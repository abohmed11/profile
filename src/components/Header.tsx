/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, Plus, Stethoscope } from 'lucide-react';
import { LandingPageConfig } from '../types';

interface HeaderProps {
  onNavigate: (view: 'landing' | 'login' | 'dashboard' | 'admin' | 'dr', docUsername?: string) => void;
  currentView?: string;
  userRole?: 'admin' | 'doctor' | 'secretary' | null;
  doctorId?: string | null;
  doctors?: any[];
  landingConfig?: LandingPageConfig;
}

export default function Header({ onNavigate, currentView = 'landing', userRole, doctorId, doctors, landingConfig }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentView !== 'landing') return;

    // Initialize from URL hash if available
    if (window.location.hash) {
      const hashId = window.location.hash.substring(1);
      const sections = ['hero', 'features', 'subscription', 'client-works', 'faq', 'contact'];
      if (sections.includes(hashId)) {
        setActiveSection(hashId);
      }
    }

    const sections = ['hero', 'features', 'subscription', 'client-works', 'faq', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [currentView]);

  const isTransparent = !isScrolled && currentView === 'landing';

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Update hash smoothly
    window.history.pushState(null, '', `#${targetId}`);
    setActiveSection(targetId);
    
    // If not in landing page, navigate to landing first
    if (currentView !== 'landing') {
      onNavigate('landing');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="fixed top-0 md:top-0 lg:top-4 left-0 right-0 z-50 px-0 lg:px-4 transition-all duration-300">
      <div 
        className={`w-full lg:max-w-7xl mx-auto rounded-none lg:rounded-2xl transition-all duration-300 border-b lg:border px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 flex items-center justify-between ${
          isTransparent 
            ? 'border-white/15 bg-black/25 backdrop-blur-md shadow-none text-white' 
            : 'border-neutral-200/50 bg-white/95 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.08)] text-[#10244A]'
        }`}
        id="navbar-capsule"
      >
        <div className="w-full flex items-center justify-between">
          {/* Right side: Logo Image */}
          <div 
            onClick={() => onNavigate('landing')} 
            className="flex items-center cursor-pointer group shrink-0 transition-all duration-300"
            title="الرئيسية"
          >
            <img 
              src={isTransparent ? "https://k.top4top.io/p_38573eitn0.png" : "https://i.top4top.io/p_3857n94r80.png"} 
              alt="بروفايلي - البوابة الطبية الشاملة" 
              className={`${
                isTransparent 
                  ? 'h-9 sm:h-11 md:h-12 lg:h-13' 
                  : 'h-11 sm:h-14 md:h-16 lg:h-18 max-h-[64px]'
              } w-auto object-contain transition-all duration-300 group-hover:scale-105`}
            />
          </div>

          {/* Center: Navigation links */}
          <nav className={`hidden md:flex items-center gap-2 md:gap-1.5 lg:gap-8 xl:gap-10 font-black text-xs md:text-[11px] lg:text-sm xl:text-base ${
            isTransparent ? 'text-white' : 'text-[#10244A]'
          }`}>
            <a 
              href="#hero" 
              onClick={(e) => handleLinkClick(e, 'hero')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'hero'
                  ? (isTransparent ? 'text-blue-400 font-black scale-105' : 'text-blue-600 font-black scale-105')
                  : (isTransparent ? 'text-white hover:text-blue-400' : 'text-[#10244A] hover:text-blue-600')
              }`}
            >
              الرئيسية
            </a>
            <a 
              href="#features" 
              onClick={(e) => handleLinkClick(e, 'features')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'features'
                  ? (isTransparent ? 'text-blue-400 font-black scale-105' : 'text-blue-600 font-black scale-105')
                  : (isTransparent ? 'text-white hover:text-blue-400' : 'text-[#10244A] hover:text-blue-600')
              }`}
            >
              المميزات
            </a>
            <a 
              href="#subscription" 
              onClick={(e) => handleLinkClick(e, 'subscription')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'subscription'
                  ? (isTransparent ? 'text-blue-400 font-black scale-105' : 'text-blue-600 font-black scale-105')
                  : (isTransparent ? 'text-white hover:text-blue-400' : 'text-[#10244A] hover:text-blue-600')
              }`}
            >
              الأسعار
            </a>
            <a 
              href="#client-works" 
              onClick={(e) => handleLinkClick(e, 'client-works')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'client-works'
                  ? (isTransparent ? 'text-blue-400 font-black scale-105' : 'text-blue-600 font-black scale-105')
                  : (isTransparent ? 'text-white hover:text-blue-400' : 'text-[#10244A] hover:text-blue-600')
              }`}
            >
              سابقة الأعمال
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleLinkClick(e, 'faq')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'faq'
                  ? (isTransparent ? 'text-blue-400 font-black scale-105' : 'text-blue-600 font-black scale-105')
                  : (isTransparent ? 'text-white hover:text-blue-400' : 'text-[#10244A] hover:text-blue-600')
              }`}
            >
              الأسئلة الشائعة
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleLinkClick(e, 'contact')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'contact'
                  ? (isTransparent ? 'text-blue-400 font-black scale-105' : 'text-blue-600 font-black scale-105')
                  : (isTransparent ? 'text-white hover:text-blue-400' : 'text-[#10244A] hover:text-blue-600')
              }`}
            >
              تواصل معنا
            </a>
          </nav>

          {/* Left side: Buttons */}
          <div className="hidden md:flex items-center gap-1 md:gap-1 lg:gap-3 xl:gap-4">
            <button 
              onClick={() => onNavigate('login')}
              className={`flex items-center gap-1 md:gap-1 lg:gap-1.5 px-2 md:px-1.5 lg:px-4 py-1.5 md:py-2 lg:py-2.5 text-[10px] md:text-[10px] lg:text-xs xl:text-base font-black rounded-xl transition-all whitespace-nowrap ${
                isTransparent 
                  ? 'bg-white text-black hover:bg-neutral-200' 
                  : 'bg-[#10244A] hover:bg-[#091A3A] text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 lg:w-4 h-4" />
              {landingConfig?.login?.headerLoginButtonText || 'تسجيل الدخول'}
            </button>
            
            <button 
              onClick={() => {
                if (currentView !== 'landing') {
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`flex items-center gap-1 md:gap-1 lg:gap-1.5 px-2.5 md:px-2 lg:px-5 py-1.5 md:py-2 lg:py-2.5 text-[10px] md:text-[10px] lg:text-xs xl:text-base font-black rounded-xl transition-all whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${
                isTransparent 
                  ? 'bg-white text-black hover:bg-neutral-200' 
                  : 'bg-[#10244A] hover:bg-[#091A3A] text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5 lg:w-4 h-4" />
              {landingConfig?.createSite?.headerCtaButtonText || 'أنشئ الآن'}
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-1.5 rounded-lg transition-colors ${
              isTransparent ? 'hover:bg-white/10 text-white' : 'hover:bg-neutral-100 text-[#10244A]'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-[74px] left-4 right-4 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xl flex flex-col gap-5 z-40 transition-all duration-300">
          <div className="flex flex-col gap-4 text-right">
            <a 
              href="#hero" 
              onClick={(e) => handleLinkClick(e, 'hero')}
              className={`font-semibold text-base py-1 border-b border-neutral-50 transition-all ${
                activeSection === 'hero' ? 'text-blue-600 font-extrabold' : 'text-neutral-700 hover:text-black'
              }`}
            >
              الرئيسية
            </a>
            <a 
              href="#features" 
              onClick={(e) => handleLinkClick(e, 'features')}
              className={`font-semibold text-base py-1 border-b border-neutral-50 transition-all ${
                activeSection === 'features' ? 'text-blue-600 font-extrabold' : 'text-neutral-700 hover:text-black'
              }`}
            >
              المميزات
            </a>
            <a 
              href="#subscription" 
              onClick={(e) => handleLinkClick(e, 'subscription')}
              className={`font-semibold text-base py-1 border-b border-neutral-50 transition-all ${
                activeSection === 'subscription' ? 'text-blue-600 font-extrabold' : 'text-neutral-700 hover:text-black'
              }`}
            >
              الأسعار
            </a>
            <a 
              href="#client-works" 
              onClick={(e) => handleLinkClick(e, 'client-works')}
              className={`font-semibold text-base py-1 border-b border-neutral-50 transition-all ${
                activeSection === 'client-works' ? 'text-blue-600 font-extrabold' : 'text-neutral-700 hover:text-black'
              }`}
            >
              سابقة الأعمال
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleLinkClick(e, 'faq')}
              className={`font-semibold text-base py-1 border-b border-neutral-50 transition-all ${
                activeSection === 'faq' ? 'text-blue-600 font-extrabold' : 'text-neutral-700 hover:text-black'
              }`}
            >
              الأسئلة الشائعة
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleLinkClick(e, 'contact')}
              className={`font-semibold text-base py-1 border-b border-neutral-50 transition-all ${
                activeSection === 'contact' ? 'text-blue-600 font-extrabold' : 'text-neutral-700 hover:text-black'
              }`}
            >
              تواصل معنا
            </a>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button 
              onClick={() => {
                setIsOpen(false);
                onNavigate('login');
              }}
              className="w-full py-3 text-center text-sm font-bold bg-[#10244A] text-white hover:bg-[#091A3A] rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </button>
            <button 
              onClick={() => {
                setIsOpen(false);
                if (currentView !== 'landing') {
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full py-3 text-center text-sm font-bold bg-[#10244A] text-white hover:bg-[#091A3A] rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              أنشئ الآن
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
