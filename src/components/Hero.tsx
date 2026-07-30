/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Sparkles, ChevronDown, X, Pause } from 'lucide-react';
import { LandingPageConfig } from '../types';

interface HeroProps {
  onNavigate: (view: 'landing' | 'login' | 'dashboard' | 'admin' | 'dr', docUsername?: string) => void;
  landingConfig?: LandingPageConfig;
}

export default function Hero({ onNavigate, landingConfig }: HeroProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const getEmbedVideoConfig = (rawUrl?: string) => {
    if (!rawUrl || !rawUrl.trim()) {
      return {
        type: 'youtube',
        embedUrl: 'https://www.youtube.com/embed/5xMVNCTwwPo?autoplay=1&rel=0&modestbranding=1',
      };
    }

    const url = rawUrl.trim();

    // Check if user pasted full <iframe> code
    const iframeSrcMatch = url.match(/src=["']([^"']+)["']/);
    if (iframeSrcMatch) {
      let src = iframeSrcMatch[1];
      if (!src.includes('autoplay=')) {
        src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
      }
      return { type: 'iframe', embedUrl: src };
    }

    // Direct MP4/video file
    if (url.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) {
      return { type: 'video', embedUrl: url };
    }

    // Extract YouTube Video ID
    let ytId = '';
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      ytId = url;
    } else {
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (ytMatch) {
        ytId = ytMatch[1];
      }
    }

    if (ytId) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
      };
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return { type: 'iframe', embedUrl: url };
    }

    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/5xMVNCTwwPo?autoplay=1&rel=0&modestbranding=1`
    };
  };

  const rawVideoUrl = landingConfig?.hero?.videoUrl || '5xMVNCTwwPo';
  const videoConfig = getEmbedVideoConfig(rawVideoUrl);
  const mobileBg = landingConfig?.hero?.mobileBgUrl || 'https://l.top4top.io/p_3849qe5681.jpg';
  const desktopBg = landingConfig?.hero?.desktopBgUrl || 'https://j.top4top.io/p_3849ast0z1.jpg';

  const handleCreateNow = () => {
    document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-neutral-950 text-white">
      {/* Background Image requested by the user */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Mobile background */}
        <img 
          src={mobileBg} 
          alt="Background Mobile" 
          className="w-full h-full object-cover object-[50%_50%] md:hidden"
        />
        {/* Desktop background */}
        <img 
          src={desktopBg} 
          alt="Background Desktop" 
          className="hidden md:block w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative max-w-7xl mx-auto w-full h-full px-6 flex flex-col md:flex-row items-center justify-between gap-12 pt-24 z-20">
        
        {/* Right side: Texts */}
        <div className="flex-1 text-center md:text-right flex flex-col items-center md:items-start order-2 md:order-1 mt-8 md:mt-0">

          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-medium font-almarai tracking-wide text-white mb-6 leading-[1.15]">
            {landingConfig?.hero?.title || 'بروفايل احترافي يعكس خبرتك الطبية'}
          </h1>

          <p className="text-neutral-200 text-sm sm:text-base md:text-lg max-w-xl mb-10 leading-relaxed font-medium px-2 sm:px-0 opacity-95">
            {landingConfig?.hero?.subtitle || 'من خلال موقعنا يمكنك إنشاء بروفايل طبي احترافي يعرض خبراتك وخدماتك مع نظام حجز ذكي ولوحة تحكم متكاملة دون أي عمولات على الحجوزات'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
            <button 
              onClick={handleCreateNow}
              className="px-8 py-4 bg-black/40 border border-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black active:bg-neutral-100 font-extrabold text-base rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg"
            >
              {landingConfig?.hero?.primaryCtaText || 'أنشئ الآن'}
            </button>
          </div>
        </div>

        {/* Left side: Video trigger (Play button with ripple) */}
        <div className="flex-1 flex items-center justify-center order-1 md:order-2">
          <div className="relative group cursor-pointer" onClick={() => setIsVideoOpen(true)}>
            {/* Outer animated ripples (Very subtle glow) */}
            <div className="absolute inset-0 rounded-full bg-white/5 scale-125 animate-pulse opacity-20" />
            
            {/* Play Button Glass Circle */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-500 hover:scale-105 group-hover:bg-white/20 group-hover:border-white/40 shadow-2xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-black flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-black text-black mr-1" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Video Modal overlay */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
          <button 
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-6 left-6 px-4 py-2 bg-neutral-900/90 hover:bg-neutral-800 text-white rounded-2xl border border-neutral-700 transition-all z-50 flex items-center gap-2 cursor-pointer shadow-2xl active:scale-95"
          >
            <X className="w-5 h-5 text-red-400" />
            <span className="text-xs font-bold pl-1">إغلاق الفيديو</span>
          </button>
          
          <div className="w-full max-w-[850px] aspect-video rounded-3xl overflow-hidden border border-neutral-800 bg-black shadow-2xl relative flex items-center justify-center">
            {videoConfig.type === 'video' ? (
              <video 
                src={videoConfig.embedUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain rounded-3xl"
              />
            ) : (
              <iframe
                src={videoConfig.embedUrl}
                title="فيديو التعريف"
                className="w-full h-full rounded-3xl border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
