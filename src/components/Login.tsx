/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Stethoscope, Lock, Mail, Eye, EyeOff, LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import { Doctor, LandingPageConfig } from '../types';

interface LoginProps {
  doctors: Doctor[];
  onLoginSuccess: (role: 'admin' | 'doctor' | 'secretary', doctorId?: string, secretaryId?: string) => void;
  onCancel: () => void;
  landingConfig?: LandingPageConfig;
}

export default function Login({ doctors, onLoginSuccess, onCancel, landingConfig }: LoginProps) {
  const [email, setEmail] = useState('mohamed.jaber@shefaaportal.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fillDoctorCredentials = () => {
    setEmail('mohamed.jaber@shefaaportal.com');
    setPassword('123456');
    setError('');
  };

  const fillSecretaryCredentials = () => {
    setEmail('sara@clinic.com');
    setPassword('123456');
    setError('');
  };

  const fillAdminCredentials = () => {
    setEmail('admin@shefaaportal.com');
    setPassword('admin123');
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password) {
      setError('يرجى كتابة البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoading(true);

    // Simulate authentication lag
    setTimeout(() => {
      setIsLoading(false);

      const cleanEmail = email.toLowerCase().trim();

      // 1. Check for Admin Login
      if (cleanEmail === 'admin@shefaaportal.com' && password === 'admin123') {
        onLoginSuccess('admin');
        return;
      }

      // 2. Check for Doctor Login (from system state doctors)
      const matchedDoctor = doctors.find(
        (doc) => doc.email.toLowerCase().trim() === cleanEmail
      );

      if (matchedDoctor) {
        if (matchedDoctor.approvalStatus === 'pending') {
          setError('عذراً، حسابك قيد المراجعة حالياً من قبل الإدارة وسيتم تفعيله قريباً.');
        } else if (matchedDoctor.approvalStatus === 'rejected') {
          setError('عذراً، تم رفض طلب انضمامك للمنصة.');
        } else {
          onLoginSuccess('doctor', matchedDoctor.id);
        }
        return;
      }

      // 3. Check for Secretary Login across all doctors
      let foundSecretaryMatch: { doctor: Doctor; secretary: any } | null = null;
      for (const doc of doctors) {
        if (doc.secretaries && doc.secretaries.length > 0) {
          const sec = doc.secretaries.find(
            (s) => (s.email && s.email.toLowerCase().trim() === cleanEmail) || (s.phone && s.phone.trim() === cleanEmail)
          );
          if (sec) {
            foundSecretaryMatch = { doctor: doc, secretary: sec };
            break;
          }
        }
      }

      if (foundSecretaryMatch) {
        const { doctor, secretary } = foundSecretaryMatch;

        // Check password if set or default 123456
        const isPasswordValid = secretary.password ? (secretary.password === password) : (password === '123456' || password === 'password');
        
        if (!isPasswordValid) {
          setError('كلمة المرور غير صحيحة لحساب السكرتيرة.');
          return;
        }

        if (secretary.status === 'inactive') {
          setError('عذراً، هذا الحساب موقوف مؤقتاً من قبل الطبيب المسؤول عن العيادة.');
          return;
        }

        if (doctor.approvalStatus === 'pending' || doctor.approvalStatus === 'rejected') {
          setError('عذراً، حساب الطبيب المسؤول عن هذه العيادة غير مفعّل حالياً.');
          return;
        }

        onLoginSuccess('secretary', doctor.id, secretary.id);
        return;
      }

      setError('بيانات الدخول غير صحيحة. يرجى التحقق من البريد أو كلمة المرور.');
    }, 1000);
  };

  return (
    <section className="w-full min-h-screen bg-[#FAF9F9] flex items-center justify-center py-20 px-4">
      
      {/* Login Card */}
      <div className="w-full max-w-[340px] md:max-w-md bg-white border border-neutral-200/60 rounded-[24px] p-6 md:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.02)] relative">
        
        {/* Cancel/Back button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-white bg-[#10244A] hover:bg-[#091A3A] transition-all rounded-lg shadow-sm flex items-center justify-center cursor-pointer"
          title="رجوع"
          aria-label="رجوع"
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </button>

        {/* Logo and Greeting */}
        <div className="flex flex-col items-center text-center mt-6 md:mt-6 mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-3 md:mb-4">
            <img 
              src={landingConfig?.login?.logoUrl || "https://i.top4top.io/p_3857n94r80.png"} 
              alt="بروفايلي - البوابة الطبية الشاملة" 
              className="h-16 sm:h-20 md:h-24 w-auto object-contain"
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-medium text-[#10244A] tracking-wide leading-none font-almarai">
            {landingConfig?.login?.title || 'تسجيل الدخول'}
          </h2>
          {landingConfig?.login?.subtitle && (
            <p className="text-neutral-500 text-xs font-semibold mt-2 font-almarai">
              {landingConfig.login.subtitle}
            </p>
          )}
        </div>

        {/* Error Callout */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-right text-xs text-red-600 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 text-right">
          
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block text-right text-xs md:text-sm font-bold text-neutral-500 font-almarai">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                className="w-full px-4 py-3.5 bg-neutral-50/60 border border-neutral-200 rounded-lg text-sm font-semibold text-neutral-800 focus:outline-none focus:bg-white focus:border-[#10244A] focus:ring-1 focus:ring-[#10244A] transition-all text-right"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="block text-right text-xs md:text-sm font-bold text-neutral-500 font-almarai">
              كلمة المرور
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-neutral-50/60 border border-neutral-200 rounded-lg text-sm font-semibold text-neutral-800 focus:outline-none focus:bg-white focus:border-[#10244A] focus:ring-1 focus:ring-[#10244A] transition-all text-right"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-end pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-bold text-neutral-500 font-almarai">تذكرني</span>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded border-neutral-300 text-neutral-800 focus:ring-neutral-400 cursor-pointer"
              />
            </label>
          </div>

          {/* Login Button */}
          <div className="flex justify-center pt-2">
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full max-w-[260px] py-3 bg-[#10244A] hover:bg-[#091A3A] text-white font-extrabold text-sm rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                 <LogIn className="w-4 h-4" />
              )}
              <span className="font-almarai">تسجيل الدخول</span>
            </button>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-neutral-400 text-center">
              تعبئة سريعة للبيانات التجريبية:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={fillDoctorCredentials}
                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200/80 transition-all cursor-pointer"
              >
                دخول طبيب
              </button>
              <button
                type="button"
                onClick={fillSecretaryCredentials}
                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200/80 transition-all cursor-pointer"
              >
                دخول سكرتيرة
              </button>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300/80 transition-all cursor-pointer"
              >
                دخول الأدمن
              </button>
            </div>
          </div>

        </form>

      </div>
    </section>
  );
}
