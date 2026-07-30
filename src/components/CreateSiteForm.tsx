/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlusCircle, Info, Stethoscope, Check, AlertCircle, ChevronDown, Camera, User, Globe } from 'lucide-react';
import { SystemSpecialty, Doctor, LandingPageConfig } from '../types';

interface CreateSiteFormProps {
  specialties: SystemSpecialty[];
  onRegisterSuccess: (newDoc: Doctor) => void;
  preselectedPlan?: '5months' | '1year';
  landingConfig?: LandingPageConfig;
}

export default function CreateSiteForm({ specialties, onRegisterSuccess, preselectedPlan, landingConfig }: CreateSiteFormProps) {
  // Form State
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'5months' | '1year'>('5months');
  const [isOpenSpecialty, setIsOpenSpecialty] = useState(false);

  // Sync preselectedPlan from props
  useEffect(() => {
    if (preselectedPlan) {
      setSelectedPlan(preselectedPlan);
    }
  }, [preselectedPlan]);
  
  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};

    if (!name.trim()) tempErrors.name = 'الاسم الكامل مطلوب';
    if (!nameEn.trim()) {
      tempErrors.nameEn = 'الاسم بالإنجليزية مطلوب لعنوان الموقع';
    } else if (!/^[a-z0-9-]+$/.test(nameEn.toLowerCase())) {
      tempErrors.nameEn = 'يجب كتابة الاسم بالإنجليزية فقط بحروف صغيرة وبدون مسافات (مثال: dr-ahmed)';
    }

    if (!jobTitle.trim()) tempErrors.jobTitle = 'المسمى الوظيفي مطلوب';
    
    if (!email.trim()) {
      tempErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'صيغة البريد الإلكتروني غير صالحة';
    }

    if (!password) {
      tempErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      tempErrors.password = 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل';
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    if (!phone.trim()) {
      tempErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[0-9]+$/.test(phone)) {
      tempErrors.phone = 'رقم الهاتف يجب أن يحتوي على أرقام فقط';
    }

    if (!whatsapp.trim()) {
      tempErrors.whatsapp = 'رقم واتساب مطلوب';
    } else if (!/^[0-9]+$/.test(whatsapp)) {
      tempErrors.whatsapp = 'رقم واتساب يجب أن يحتوي على أرقام فقط مع كود الدولة';
    }

    if (!specialty) tempErrors.specialty = 'يرجى اختيار التخصص الطبي';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNameChange = (val: string) => {
    setName(val);
  };

  const handleEnglishNameChange = (val: string) => {
    // Replace spaces with dash and make lowercase
    const formatted = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setNameEn(formatted);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate database creation lag
    setTimeout(() => {
      // Create a new Doctor record
      const finalAvatar = avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300';
      const newDoctor: Doctor = {
        id: `doc-${Date.now()}`,
        name,
        nameEn: nameEn.toLowerCase().trim(),
        specialty,
        jobTitle,
        email,
        phone,
        whatsapp,
        avatar: finalAvatar,
        bio: `دكتور متخصص في ${specialties.find(s => s.id === specialty)?.name || 'الطب البشري'}، نسعى دوماً لتقديم رعاية طبية متكاملة لمرضانا ومساعدتهم على استعادة العافية بأحدث الطرق والوسائل الاستشفائية المعتمدة.`,
        experience: 8,
        branches: [
          { 
            id: `br-new-1`, 
            name: 'الفرع الرئيسي للعيادة', 
            address: 'القاهرة - وسط البلد - برج الخدمات الطبية', 
            phone,
            mapUrl: 'https://maps.google.com' 
          }
        ],
        services: [
          { id: `srv-new-1`, name: 'استشارة فحص عام وتشخيص', price: 300, duration: '20 دقيقة', description: 'جلسة أولية لتشخيص الحالة وصرف العلاج المناسب.' }
        ],
        workingHours: [
          { day: 'السبت', isAvailable: true, start: '16:00', end: '21:00' },
          { day: 'الأحد', isAvailable: true, start: '16:00', end: '21:00' },
          { day: 'الاثنين', isAvailable: true, start: '16:00', end: '21:00' },
          { day: 'الثلاثاء', isAvailable: true, start: '16:00', end: '21:00' },
          { day: 'الأربعاء', isAvailable: true, start: '16:00', end: '21:00' },
          { day: 'الخميس', isAvailable: false, start: '16:00', end: '21:00' },
          { day: 'الجمعة', isAvailable: false, start: '16:00', end: '21:00' },
        ],
        gallery: [],
        videos: [],
        reviews: [],
        socials: {},
        isActiveSubscription: true,
        registeredAt: new Date().toISOString().split('T')[0],
        approvalStatus: 'pending',
        siteType: 'profile'
      };

      setIsSubmitting(false);
      onRegisterSuccess(newDoctor);
      setShowSuccessModal(true);

      // Reset form fields
      setName('');
      setNameEn('');
      setJobTitle('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPhone('');
      setWhatsapp('');
      setSpecialty('');
      setAvatarUrl('');
      setSelectedPlan('5months');
    }, 2000);
  };

  return (
    <section id="register-section" className="w-full py-24 bg-[#FAF9F9] border-b border-neutral-100">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#10244A] tracking-wide font-almarai">
            {landingConfig?.createSite?.title || 'أنشئ الآن'}
          </h2>
          <p className="text-neutral-500 font-semibold text-sm mt-2 max-w-md font-almarai">
            {landingConfig?.createSite?.subtitle || 'املأ البيانات التالية وسيتم إنشاء بروفايلك و مراجعته'}
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-white rounded-[32px] p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8 text-right">
            
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Name */}

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-400 text-right font-almarai">الاسم الكامل</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full px-6 py-4 bg-white border ${errors.name ? 'border-red-500 bg-red-50/10' : 'border-neutral-200/80'} rounded-xl text-sm md:text-base font-semibold text-neutral-800 text-right focus:outline-none focus:border-[#10244A] transition-all`}
                />
                {errors.name && <span className="text-[11px] font-bold text-red-500 flex items-center justify-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</span>}
              </div>

              {/* English Name (slug) */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-400 text-right font-almarai">الاسم بالإنجليزية</label>
                <input 
                  type="text" 
                  value={nameEn}
                  onChange={(e) => handleEnglishNameChange(e.target.value)}
                  dir="ltr"
                  className={`w-full px-6 py-4 bg-white border ${errors.nameEn ? 'border-red-500 bg-red-50/10' : 'border-neutral-200/80'} rounded-xl text-sm md:text-base font-semibold text-neutral-800 text-left focus:outline-none focus:border-[#10244A] transition-all`}
                />
                <div className="flex justify-center items-center text-[11px] text-neutral-400 mt-1" dir="ltr">
                  <span className="font-bold text-blue-600">dr-profile.com/dr/{nameEn || 'your-name'}</span>
                </div>
                {errors.nameEn && <span className="text-[11px] font-bold text-red-500 flex items-center justify-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" />{errors.nameEn}</span>}
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-400 text-right font-almarai">المسمى الوظيفي</label>
                <input 
                  type="text" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className={`w-full px-6 py-4 bg-white border ${errors.jobTitle ? 'border-red-500 bg-red-50/10' : 'border-neutral-200/80'} rounded-xl text-sm md:text-base font-semibold text-neutral-800 text-right focus:outline-none focus:border-[#10244A] transition-all`}
                />
                {errors.jobTitle && <span className="text-[11px] font-bold text-red-500 flex items-center justify-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" />{errors.jobTitle}</span>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-400 text-right font-almarai">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                  className={`w-full px-6 py-4 bg-white border ${errors.email ? 'border-red-500 bg-red-50/10' : 'border-neutral-200/80'} rounded-xl text-sm md:text-base font-semibold text-neutral-800 text-left focus:outline-none focus:border-[#10244A] transition-all`}
                />
                {errors.email && <span className="text-[11px] font-bold text-red-500 flex items-center justify-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</span>}
              </div>

              {/* Specialty Selection */}
              <div className="space-y-2 relative">
                <label className="block text-sm font-bold text-neutral-400 text-right font-almarai">التخصص الطبي</label>
                <div className="relative z-30">
                  <button
                    type="button"
                    onClick={() => setIsOpenSpecialty(!isOpenSpecialty)}
                    className={`w-full px-6 py-4 bg-white border ${errors.specialty ? 'border-red-500 bg-red-50/10' : 'border-neutral-200/80'} rounded-xl text-sm md:text-base font-semibold text-neutral-800 focus:outline-none focus:border-[#10244A] flex items-center justify-between transition-all`}
                  >
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isOpenSpecialty ? 'rotate-180' : ''}`} />
                    <span className="font-semibold text-neutral-800 mx-auto">
                      {specialties.find(s => s.id === specialty)?.name || 'اختر التخصص...'}
                    </span>
                    <Stethoscope className="w-4 h-4 text-neutral-400" />
                  </button>

                  {isOpenSpecialty && (
                    <>
                      {/* Transparent overlay to close dropdown on click-away */}
                      <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpenSpecialty(false);
                        }} 
                      />
                      
                      {/* Dropdown list showing 7 items at a time with scrollbar */}
                      <div className="absolute left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-y-auto max-h-[308px] divide-y divide-neutral-100 scrollbar-thin">
                        {specialties.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSpecialty(s.id);
                              setIsOpenSpecialty(false);
                            }}
                            className={`w-full text-right px-6 py-3.5 text-sm font-semibold hover:bg-neutral-50 transition-all flex items-center justify-between ${specialty === s.id ? 'bg-blue-50/50 text-blue-700' : 'text-neutral-800'}`}
                          >
                            {specialty === s.id && <Check className="w-4 h-4 text-blue-600" />}
                            <span className="mx-auto">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {errors.specialty && <span className="text-[11px] font-bold text-red-500 flex items-center justify-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" />{errors.specialty}</span>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-400 text-right font-almarai">رقم الهاتف</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  className={`w-full px-6 py-4 bg-white border ${errors.phone ? 'border-red-500 bg-red-50/10' : 'border-neutral-200/80'} rounded-xl text-sm md:text-base font-semibold text-neutral-800 text-left focus:outline-none focus:border-[#10244A] transition-all`}
                />
                {errors.phone && <span className="text-[11px] font-bold text-red-500 flex items-center justify-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</span>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-400 text-right font-almarai">كلمة المرور</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-6 py-4 bg-white border ${errors.password ? 'border-red-500 bg-red-50/10' : 'border-neutral-200/80'} rounded-xl text-sm md:text-base font-semibold text-neutral-800 text-right focus:outline-none focus:border-[#10244A] transition-all`}
                />
                {errors.password && <span className="text-[11px] font-bold text-red-500 flex items-center justify-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" />{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-400 text-right font-almarai">تأكيد كلمة المرور</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-6 py-4 bg-white border ${errors.confirmPassword ? 'border-red-500 bg-red-50/10' : 'border-neutral-200/80'} rounded-xl text-sm md:text-base font-semibold text-neutral-800 text-right focus:outline-none focus:border-[#10244A] transition-all`}
                />
                {errors.confirmPassword && <span className="text-[11px] font-bold text-red-500 flex items-center justify-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" />{errors.confirmPassword}</span>}
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-400 text-right font-almarai">رقم واتساب</label>
                <input 
                  type="text" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  dir="ltr"
                  className={`w-full px-6 py-4 bg-white border ${errors.whatsapp ? 'border-red-500 bg-red-50/10' : 'border-neutral-200/80'} rounded-xl text-sm md:text-base font-semibold text-neutral-800 text-left focus:outline-none focus:border-[#10244A] transition-all`}
                />
                {errors.whatsapp && <span className="text-[11px] font-bold text-red-500 flex items-center justify-center gap-1 mt-1"><AlertCircle className="w-3.5 h-3.5" />{errors.whatsapp}</span>}
              </div>

              {/* Avatar Upload (next to WhatsApp) */}
              <div className="space-y-2">
                <div className="h-5 hidden md:block"></div>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="avatar-file-upload"
                  />
                  <label 
                    htmlFor="avatar-file-upload"
                    className="flex items-center justify-center gap-2 border border-neutral-200/80 hover:border-[#10244A] rounded-xl py-4 px-4 cursor-pointer bg-white hover:bg-neutral-50 transition-all duration-300 h-[58px]"
                  >
                    <Camera className="w-5 h-5 text-neutral-400" />
                    <span className="text-xs md:text-sm font-bold text-neutral-500 font-almarai">اضغط لرفع الصورة</span>
                  </label>
                </div>
                {avatarUrl && (
                  <div className="flex items-center gap-2 justify-between mt-2 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                    <span className="text-xs text-emerald-800 font-bold font-almarai">تم الرفع بنجاح ✓</span>
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-200 flex-shrink-0">
                      <img src={avatarUrl} alt="Uploaded" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              {/* Package Selection Option */}
              <div className="space-y-3 md:col-span-2 text-right">
                <label className="block text-sm font-bold text-neutral-400 text-right font-almarai">اختر باقة الاشتراك</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 5-Month Plan */}
                  <label 
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedPlan === '5months' 
                        ? 'border-[#10244A] bg-[#10244A]/5 shadow-[0_4px_20px_rgba(16,36,74,0.04)]' 
                        : 'border-neutral-200/80 bg-white hover:bg-neutral-50/50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="selectedPlan" 
                      value="5months" 
                      checked={selectedPlan === '5months'}
                      onChange={() => setSelectedPlan('5months')}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === '5months' ? 'border-[#10244A] bg-white' : 'border-neutral-300'}`}>
                        {selectedPlan === '5months' && <div className="w-2.5 h-2.5 rounded-full bg-[#10244A]" />}
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-extrabold text-[#10244A] font-almarai">باقة الـ 6 أشهر</span>
                        <span className="block text-[11px] text-neutral-400 font-bold font-almarai mt-0.5">سعر مميز وتفعيل سريع خلال 24 ساعة</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-[#10244A] font-almarai shrink-0">1500 ج.م</span>
                  </label>

                  {/* 1-Year Plan */}
                  <label 
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedPlan === '1year' 
                        ? 'border-[#10244A] bg-[#10244A]/5 shadow-[0_4px_20px_rgba(16,36,74,0.04)]' 
                        : 'border-neutral-200/80 bg-white hover:bg-neutral-50/50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="selectedPlan" 
                      value="1year" 
                      checked={selectedPlan === '1year'}
                      onChange={() => setSelectedPlan('1year')}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === '1year' ? 'border-[#10244A] bg-white' : 'border-neutral-300'}`}>
                        {selectedPlan === '1year' && <div className="w-2.5 h-2.5 rounded-full bg-[#10244A]" />}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5">
                          <span className="block text-sm font-extrabold text-[#10244A] font-almarai">باقة السنة</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded-full font-almarai">الأكثر توفيراً</span>
                        </div>
                        <span className="block text-[11px] text-neutral-400 font-bold font-almarai mt-0.5">توفير 500 جنيه كاملة</span>
                      </div>
                    </div>
                    <div className="text-left shrink-0">
                      <span className="block text-sm font-black text-[#10244A] font-almarai">2500 ج.م</span>
                      <span className="block text-[10px] text-neutral-400 line-through font-bold font-almarai">3000 ج.م</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-8 flex justify-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`px-12 py-4 rounded-xl bg-[#10244A] hover:bg-[#091A3A] active:bg-[#06142F] text-white font-extrabold text-base md:text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(16,36,74,0.25)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-w-[240px] font-almarai`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري...</span>
                  </>
                ) : (
                  <span>{landingConfig?.createSite?.submitButtonText || 'أنشئ الآن'}</span>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] border border-neutral-200 p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <Check className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-neutral-900 font-almarai">تم إنشاء حسابك بنجاح، سيتم مراجعته</h3>
            </div>

            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3.5 bg-[#10244A] hover:bg-[#091A3A] text-white font-extrabold text-xs rounded-full transition-all font-almarai"
            >
              موافق
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
