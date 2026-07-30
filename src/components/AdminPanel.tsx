/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Doctor, Appointment, SystemSpecialty, DoctorFeatures, DEFAULT_DOCTOR_FEATURES,
  LandingPageConfig, DEFAULT_LANDING_CONFIG, FAQConfigItem, FeatureCategoryConfig,
  DEFAULT_SEO_CONFIG, DoctorBanner, INITIAL_BANNERS, getDoctorExpiryDate, getDoctorDaysRemaining
} from '../types';
import SEOSettings from './SEOSettings';
import DatabaseStatus from './DatabaseStatus';
import { 
  Shield, Users, CreditCard, Calendar, Check, X, Eye, 
  Trash2, Plus, Sparkles, BarChart, LogOut, Search, Settings,
  LayoutTemplate, Globe, Save, HelpCircle, Phone, Lock, UserPlus,
  Sparkle, Layers, ChevronLeft, AlertCircle, Upload, Database, Clock,
  MoreVertical, ExternalLink, Megaphone, Pin, ArrowUp, ArrowDown, Crown, Bell, Tag, Edit3, Flag, Gift, Zap
} from 'lucide-react';

interface AdminPanelProps {
  doctors: Doctor[];
  appointments: Appointment[];
  specialties: SystemSpecialty[];
  banners?: DoctorBanner[];
  onUpdateBanners?: (updatedBanners: DoctorBanner[]) => void;
  onUpdateDoctors: (updatedDocs: Doctor[]) => void;
  onLogout: () => void;
  onVisitDoctor: (username: string) => void;
  onLoginAsDoctor?: (docId: string) => void;
  landingConfig?: LandingPageConfig;
  onUpdateLandingConfig?: (newConfig: LandingPageConfig) => void;
}

type LandingSubTab = 'hero' | 'features' | 'pricing' | 'clientWorks' | 'faq' | 'contact' | 'login' | 'createSite' | 'footer';

// Helper component for Image fields with file upload option
const ImageInputWithUpload = ({
  label,
  value,
  onChange,
  placeholder = "رابط الصورة أو ارفع ملف من جهازك..."
}: {
  label: string;
  value: string;
  onChange: (newVal: string) => void;
  placeholder?: string;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-extrabold text-neutral-700">{label}</label>
      <div className="space-y-2">
        <input 
          type="text" 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
        />
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 border border-neutral-300 shadow-sm cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-neutral-600" />
            <span>رفع صورة من الجهاز</span>
          </button>
          {value && (
            <div className="flex items-center gap-2 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-200">
              <img src={value} alt="Preview" className="w-6 h-6 object-contain rounded" />
              <span className="text-[10px] text-emerald-600 font-bold">معاينة الصورة</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminPanel({ 
  doctors, appointments, specialties, banners, onUpdateBanners, onUpdateDoctors, onLogout, onVisitDoctor,
  onLoginAsDoctor,
  landingConfig = DEFAULT_LANDING_CONFIG,
  onUpdateLandingConfig
}: AdminPanelProps) {
  
  // Set default active tab to 'landing-settings' as requested (First section)
  const [activeTab, setActiveTab] = useState<'landing-settings' | 'seo-settings' | 'db-status' | 'doctors' | 'banners' | 'settings'>('landing-settings');
  const [landingSubTab, setLandingSubTab] = useState<LandingSubTab>('hero');
  
  // Local editable landing page config state
  const [localLanding, setLocalLanding] = useState<LandingPageConfig>(landingConfig);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Banner management state
  const currentBanners = banners || INITIAL_BANNERS;

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerIcon, setBannerIcon] = useState('sparkles');
  const [bannerColor, setBannerColor] = useState<'blue' | 'emerald' | 'amber' | 'red' | 'indigo' | 'purple'>('blue');
  const [bannerButtonText, setBannerButtonText] = useState('');
  const [bannerButtonUrl, setBannerButtonUrl] = useState('');
  const [bannerStartDate, setBannerStartDate] = useState('');
  const [bannerEndDate, setBannerEndDate] = useState('');
  const [bannerIsActive, setBannerIsActive] = useState(true);
  const [bannerIsPinned, setBannerIsPinned] = useState(false);
  const [bannerPriority, setBannerPriority] = useState(1);
  const [bannerTargetAudience, setBannerTargetAudience] = useState<'all' | 'annual' | '6months' | 'specific_doctors' | 'whitelabel_enabled' | 'whitelabel_disabled' | 'expiring_15_days' | 'expiring_30_days'>('all');
  const [bannerTargetDoctorIds, setBannerTargetDoctorIds] = useState<string[]>([]);

  // Banner Actions
  const handleOpenAddBanner = () => {
    setEditingBannerId(null);
    setBannerTitle('');
    setBannerDesc('');
    setBannerImageUrl('');
    setBannerIcon('sparkles');
    setBannerColor('blue');
    setBannerButtonText('');
    setBannerButtonUrl('');
    setBannerStartDate('');
    setBannerEndDate('');
    setBannerIsActive(true);
    setBannerIsPinned(false);
    setBannerPriority(currentBanners.length + 1);
    setBannerTargetAudience('all');
    setBannerTargetDoctorIds([]);
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: DoctorBanner) => {
    setEditingBannerId(b.id);
    setBannerTitle(b.title || '');
    setBannerDesc(b.description || '');
    setBannerImageUrl(b.imageUrl || '');
    setBannerIcon(b.icon || 'sparkles');
    setBannerColor(b.color || 'blue');
    setBannerButtonText(b.buttonText || '');
    setBannerButtonUrl(b.buttonUrl || '');
    setBannerStartDate(b.startDate || '');
    setBannerEndDate(b.endDate || '');
    setBannerIsActive(b.isActive);
    setBannerIsPinned(!!b.isPinned);
    setBannerPriority(b.priority || 1);
    setBannerTargetAudience(b.targetAudience || 'all');
    setBannerTargetDoctorIds(b.targetDoctorIds || []);
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim()) return;

    let updated: DoctorBanner[];
    if (editingBannerId) {
      updated = currentBanners.map(b => b.id === editingBannerId ? {
        ...b,
        title: bannerTitle.trim(),
        description: bannerDesc.trim(),
        imageUrl: bannerImageUrl || undefined,
        icon: bannerIcon || 'sparkles',
        color: bannerColor,
        buttonText: bannerButtonText.trim() || undefined,
        buttonUrl: bannerButtonUrl.trim() || undefined,
        startDate: bannerStartDate || undefined,
        endDate: bannerEndDate || undefined,
        isActive: bannerIsActive,
        isPinned: bannerIsPinned,
        priority: Number(bannerPriority) || 1,
        targetAudience: bannerTargetAudience,
        targetDoctorIds: bannerTargetDoctorIds
      } : b);
    } else {
      const newBanner: DoctorBanner = {
        id: `banner-${Date.now()}`,
        title: bannerTitle.trim(),
        description: bannerDesc.trim(),
        imageUrl: bannerImageUrl || undefined,
        icon: bannerIcon || 'sparkles',
        color: bannerColor,
        buttonText: bannerButtonText.trim() || undefined,
        buttonUrl: bannerButtonUrl.trim() || undefined,
        startDate: bannerStartDate || undefined,
        endDate: bannerEndDate || undefined,
        isActive: bannerIsActive,
        isPinned: bannerIsPinned,
        priority: Number(bannerPriority) || 1,
        targetAudience: bannerTargetAudience,
        targetDoctorIds: bannerTargetDoctorIds,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      updated = [newBanner, ...currentBanners];
    }

    if (onUpdateBanners) {
      onUpdateBanners(updated);
    }
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذا البنر بشكل نهائي؟')) {
      const updated = currentBanners.filter(b => b.id !== id);
      if (onUpdateBanners) onUpdateBanners(updated);
    }
  };

  const handleToggleBannerActive = (id: string) => {
    const updated = currentBanners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    if (onUpdateBanners) onUpdateBanners(updated);
  };

  const handleToggleBannerPinned = (id: string) => {
    const updated = currentBanners.map(b => b.id === id ? { ...b, isPinned: !b.isPinned } : b);
    if (onUpdateBanners) onUpdateBanners(updated);
  };

  const handleMoveBannerPriority = (id: string, direction: 'up' | 'down') => {
    const sorted = [...currentBanners].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    const index = sorted.findIndex(b => b.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const tempP = sorted[index].priority;
      sorted[index].priority = sorted[index - 1].priority;
      sorted[index - 1].priority = tempP;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const tempP = sorted[index].priority;
      sorted[index].priority = sorted[index + 1].priority;
      sorted[index + 1].priority = tempP;
    }

    if (onUpdateBanners) onUpdateBanners(sorted);
  };

  // Doctors management sub-navigation & filter states
  const [doctorsSubTab, setDoctorsSubTab] = useState<'list' | 'expiring' | 'stats'>('list');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'expiring'>('all');
  const [expiringDaysFilter, setExpiringDaysFilter] = useState<15 | 30 | 60 | 'all'>(30);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Rejection modal state
  const [rejectionModalDocId, setRejectionModalDocId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Editing doctor state
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    whatsapp: string;
    specialty: string;
    subscriptionType: '6months' | 'annual';
    isVerified: boolean;
    whiteLabel: boolean;
    isActiveSubscription: boolean;
  } | null>(null);

  const [newSpecialtyName, setNewSpecialtyName] = useState('');
  const [localSpecialties, setLocalSpecialties] = useState<SystemSpecialty[]>(specialties);
  const [editingFeaturesDocId, setEditingFeaturesDocId] = useState<string | null>(null);
  const [openDropdownDocId, setOpenDropdownDocId] = useState<string | null>(null);
  const [cwSearchQuery, setCwSearchQuery] = useState('');
  const [cwLinkInput, setCwLinkInput] = useState('');

  // Open / View doctor public profile
  const handleViewProfile = (nameEn: string) => {
    if (onVisitDoctor) {
      onVisitDoctor(nameEn);
    } else {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const profileUrl = `${origin}${pathname}#/doctor/${nameEn}`;
      window.open(profileUrl, '_blank');
    }
  };

  // Generate WhatsApp contact link for confirming subscription with new doctor
  const getWhatsAppContactUrl = (doc: Doctor) => {
    const rawPhone = doc.whatsapp || doc.phone || '';
    let cleanPhone = rawPhone.replace(/[^\d]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '20' + cleanPhone.slice(1);
    }
    const doctorName = doc.name || 'الدكتور';
    const doctorSlug = doc.nameEn || '';
    const message = `مرحباً د. ${doctorName}، معك إدارة منصة بروفايلي 👋\nتم استلام طلبكم لإنشاء موقعكم الطبي (${doctorSlug}).\nيرجى تأكيد تفاصيل باقة الاشتراك لتفعيل الحساب فوراً.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Handle saving landing config
  const handleSaveLandingConfig = () => {
    if (onUpdateLandingConfig) {
      onUpdateLandingConfig(localLanding);
    }
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleToggleFeature = (docId: string, featureKey: keyof DoctorFeatures) => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        const currentFeatures = doc.features || { ...DEFAULT_DOCTOR_FEATURES };
        return {
          ...doc,
          features: {
            ...currentFeatures,
            [featureKey]: !currentFeatures[featureKey]
          }
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
  };

  // Toggle Subscription state in real-time
  const handleToggleSubscription = (docId: string) => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        const newActiveState = !doc.isActiveSubscription;
        return { 
          ...doc, 
          isActiveSubscription: newActiveState
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
  };

  // Approve Doctor Registration
  const handleApproveDoctor = (docId: string) => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        const subType = doc.subscriptionType || 'annual';
        return { 
          ...doc, 
          approvalStatus: 'approved' as const,
          isActiveSubscription: true,
          subscriptionType: subType,
          isVerified: true,
          rejectionReason: undefined
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
  };

  // Open rejection modal
  const handleOpenRejectModal = (docId: string) => {
    setRejectionModalDocId(docId);
    setRejectionReasonInput('');
  };

  // Confirm and Save Rejection
  const handleSaveRejection = () => {
    if (!rejectionModalDocId) return;
    const updated = doctors.map(doc => {
      if (doc.id === rejectionModalDocId) {
        return { 
          ...doc, 
          approvalStatus: 'rejected' as const,
          isActiveSubscription: false,
          rejectionReason: rejectionReasonInput.trim() || 'البيانات غير مكتملة أو غير دقيقة.'
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    setRejectionModalDocId(null);
    setRejectionReasonInput('');
  };

  // Toggle Verification status
  const handleToggleVerification = (docId: string) => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        const subType = doc.subscriptionType || 'annual';
        const currentVerified = doc.isVerified ?? (subType === 'annual');
        return { ...doc, isVerified: !currentVerified };
      }
      return doc;
    });
    onUpdateDoctors(updated);
  };

  // Toggle Brand Identity / White Label status
  const handleToggleWhiteLabel = (docId: string) => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        return { ...doc, whiteLabel: !doc.whiteLabel };
      }
      return doc;
    });
    onUpdateDoctors(updated);
  };

  // Toggle Subscription Package type
  const handleToggleSubscriptionPackage = (docId: string, type: '6months' | 'annual') => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          subscriptionType: type,
          isVerified: true
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
  };

  // Reset Password action
  const handleResetPassword = (docId: string) => {
    alert('تم إعادة تعيين كلمة مرور الطبيب بنجاح إلى القيمة الافتراضية: 123456');
  };

  // Extend subscription
  const handleExtendSubscription = (docId: string, months: number) => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        const currentExp = getDoctorExpiryDate(doc);
        const now = new Date();
        const baseDate = currentExp > now ? currentExp : now;
        const newExpiry = new Date(baseDate);
        newExpiry.setMonth(newExpiry.getMonth() + months);
        return {
          ...doc,
          isActiveSubscription: true,
          subscriptionEndDate: newExpiry.toISOString().slice(0, 10)
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    alert(`تم تمديد اشتراك الطبيب بنجاح لمدة ${months} شهر وتنشيط حسابه!`);
  };

  // Edit form logic
  const handleStartEditing = (doc: Doctor) => {
    setEditingDoctorId(doc.id);
    setEditFormData({
      name: doc.name,
      jobTitle: doc.jobTitle,
      email: doc.email,
      phone: doc.phone,
      whatsapp: doc.whatsapp,
      specialty: doc.specialty,
      subscriptionType: doc.subscriptionType || 'annual',
      isVerified: doc.isVerified ?? true,
      whiteLabel: doc.whiteLabel ?? false,
      isActiveSubscription: doc.isActiveSubscription
    });
  };

  const handleSaveEdit = () => {
    if (!editingDoctorId || !editFormData) return;
    const updated = doctors.map(doc => {
      if (doc.id === editingDoctorId) {
        return {
          ...doc,
          name: editFormData.name,
          jobTitle: editFormData.jobTitle,
          email: editFormData.email,
          phone: editFormData.phone,
          whatsapp: editFormData.whatsapp,
          specialty: editFormData.specialty,
          subscriptionType: editFormData.subscriptionType,
          isVerified: editFormData.isVerified,
          whiteLabel: editFormData.whiteLabel,
          isActiveSubscription: editFormData.isActiveSubscription
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    setEditingDoctorId(null);
    setEditFormData(null);
  };

  // Remove a doctor from the system
  const handleRemoveDoctor = (docId: string) => {
    const confirmDelete = window.confirm('هل أنت متأكد من رغبتك في حذف هذا الطبيب نهائياً من قاعدة البيانات؟');
    if (!confirmDelete) return;
    
    const updated = doctors.filter(doc => doc.id !== docId);
    onUpdateDoctors(updated);
  };

  // Add Specialty
  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecialtyName.trim()) return;
    
    const newSpec: SystemSpecialty = {
      id: `spec-${Date.now()}`,
      name: newSpecialtyName,
      count: 0
    };
    
    setLocalSpecialties([...localSpecialties, newSpec]);
    setNewSpecialtyName('');
  };

  // Statistics Metrics
  const totalDoctorsCount = doctors.length;
  const activeDoctorsCount = doctors.filter(d => (d.approvalStatus === 'approved' || !d.approvalStatus) && d.isActiveSubscription).length;
  const pendingDoctorsCount = doctors.filter(d => d.approvalStatus === 'pending').length;
  const rejectedDoctorsCount = doctors.filter(d => d.approvalStatus === 'rejected').length;
  
  const activeSubscriptionsCount = doctors.filter(d => d.isActiveSubscription).length;
  const expiredSubscriptionsCount = doctors.filter(d => !d.isActiveSubscription && (d.approvalStatus === 'approved' || !d.approvalStatus)).length;
  const expiringDoctorsCount = doctors.filter(d => getDoctorDaysRemaining(d) <= 30 && getDoctorDaysRemaining(d) > 0).length;
  
  const totalAppointmentsCount = appointments.length;
  const todayDateStr = '2026-07-15'; // Defined in initial appointments or current dynamic date
  const todayAppointmentsCount = appointments.filter(a => a.date === todayDateStr || a.date === new Date().toISOString().split('T')[0]).length;

  const totalRevenueVal = doctors.filter(d => d.isActiveSubscription).reduce((sum, d) => sum + (d.subscriptionType === '6months' ? 1500 : 2500), 0);
  const monthlyRevenueVal = Math.round(doctors.filter(d => d.isActiveSubscription).reduce((sum, d) => sum + (d.subscriptionType === '6months' ? 250 : 208.3), 0));

  // Latest registered doctors (last 5)
  const latestRegisteredDoctors = [...doctors]
    .sort((a, b) => (b.registeredAt || '').localeCompare(a.registeredAt || ''))
    .slice(0, 5);

  // Latest bookings (last 5)
  const latestAppointments = [...appointments]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 5);

  // Filtered lists for rendering management table
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') return matchesSearch && doc.approvalStatus === 'pending';
    if (statusFilter === 'approved') return matchesSearch && (doc.approvalStatus === 'approved' || !doc.approvalStatus) && doc.isActiveSubscription;
    if (statusFilter === 'rejected') return matchesSearch && doc.approvalStatus === 'rejected';
    if (statusFilter === 'suspended') return matchesSearch && ((doc.approvalStatus === 'approved' || !doc.approvalStatus) && !doc.isActiveSubscription);
    if (statusFilter === 'expiring') return matchesSearch && getDoctorDaysRemaining(doc) <= 30;
    
    return matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-neutral-100 flex flex-col md:flex-row text-right">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-72 bg-neutral-950 text-neutral-400 p-6 flex flex-col justify-between z-10">
        <div className="space-y-8">
          
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-neutral-800">
            <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-600/30 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-right">
              <h3 className="font-extrabold text-sm text-white">إدارة المنصة الطبية</h3>
              <span className="text-[9px] text-blue-400 font-extrabold uppercase mt-1">مسؤول النظام الرئيسي</span>
            </div>
          </div>

          {/* Nav Items - FIRST ITEM: Landing Page Settings */}
          <nav className="flex flex-col gap-1.5 text-xs font-bold">
            
            {/* FIRST TAB: Landing Page Settings */}
            <button 
              onClick={() => setActiveTab('landing-settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-right w-full ${activeTab === 'landing-settings' ? 'bg-[#009bb9] text-white font-extrabold shadow-md' : 'hover:bg-neutral-900 hover:text-white'}`}
            >
              <LayoutTemplate className="w-4 h-4 flex-shrink-0" />
              <span>إعدادات الصفحة الرئيسية</span>
            </button>

            {/* SEO SETTINGS TAB */}
            <button 
              onClick={() => setActiveTab('seo-settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-right w-full ${activeTab === 'seo-settings' ? 'bg-[#10244A] text-white font-extrabold shadow-md border border-emerald-500/30' : 'hover:bg-neutral-900 hover:text-white'}`}
            >
              <Search className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>إعدادات تحسين محركات البحث (SEO)</span>
            </button>

            {/* REAL-TIME DATABASE STATUS TAB */}
            <button 
              onClick={() => setActiveTab('db-status')}
              className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full ${activeTab === 'db-status' ? 'bg-emerald-950 text-white font-extrabold shadow-md border border-emerald-500/50' : 'hover:bg-neutral-900 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>حالة قاعدة البيانات المباشرة</span>
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            </button>

            <button 
              onClick={() => setActiveTab('doctors')}
              className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full ${activeTab === 'doctors' ? 'bg-white text-black font-extrabold shadow-md' : 'hover:bg-neutral-900 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>إدارة الأطباء المشتركين</span>
              </div>
              {doctors.filter(d => d.approvalStatus === 'pending').length > 0 && (
                <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold font-almarai animate-pulse">
                  {doctors.filter(d => d.approvalStatus === 'pending').length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('banners')}
              className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full ${activeTab === 'banners' ? 'bg-amber-500 text-neutral-950 font-black shadow-md' : 'hover:bg-neutral-900 hover:text-white'}`}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4 flex-shrink-0 text-amber-400" />
                <span>Banner لوحة الطبيب</span>
              </div>
              {currentBanners.filter(b => b.isActive).length > 0 && (
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-black">
                  {currentBanners.filter(b => b.isActive).length} نشط
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-right w-full ${activeTab === 'settings' ? 'bg-white text-black font-extrabold shadow-md' : 'hover:bg-neutral-900 hover:text-white'}`}
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span>إعدادات وتخصصات النظام</span>
            </button>
          </nav>

        </div>

        <button 
          onClick={onLogout}
          className="w-full py-2.5 bg-red-950/20 text-red-400 hover:bg-red-950/50 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 mt-8"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل خروج المشرف</span>
        </button>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-neutral-200">
          <div className="text-right">
            <h1 className="text-2xl font-black text-black tracking-tight">لوحة تحكم المشرف</h1>
            <p className="text-neutral-500 text-xs font-bold mt-1">مرحباً بك، أنت مسجل كمدير رئيسي للمنصة</p>
          </div>

          {activeTab === 'landing-settings' && (
            <button
              onClick={handleSaveLandingConfig}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>حفظ تعديلات الصفحة الرئيسية</span>
            </button>
          )}
        </div>

        {saveSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 shadow-sm animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ جميع إعدادات ونصوص الصفحة الرئيسية بنجاح! وستظهر فوراً في الواجهة العامة.</span>
          </div>
        )}



        {/* TAB REAL-TIME DATABASE STATUS (قسم حالة قاعدة البيانات) */}
        {activeTab === 'db-status' && (
          <DatabaseStatus 
            doctors={doctors}
            appointments={appointments}
            landingConfig={localLanding}
            banners={currentBanners}
          />
        )}

        {/* TAB SEO: SEO SETTINGS (قسم إعدادات SEO) */}
        {activeTab === 'seo-settings' && (
          <SEOSettings 
            config={localLanding.seo || DEFAULT_SEO_CONFIG}
            onChange={(updatedSeo) => {
              const updatedLanding = {
                ...localLanding,
                seo: updatedSeo
              };
              setLocalLanding(updatedLanding);
              if (onUpdateLandingConfig) {
                onUpdateLandingConfig(updatedLanding);
              }
            }}
            onSave={handleSaveLandingConfig}
          />
        )}

        {/* TAB 0: LANDING PAGE SETTINGS (القسم الأول) */}
        {activeTab === 'landing-settings' && (
          <div className="space-y-6">
            
            {/* Sub-tabs header for 8 requested landing page sub-sections in EXACT ORDER */}
            <div className="bg-white p-2 rounded-2xl border border-neutral-200/70 shadow-sm overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1.5 min-w-max text-xs font-extrabold">
                
                {[
                  { id: 'hero' as const, label: 'الرئيسية', icon: LayoutTemplate },
                  { id: 'features' as const, label: 'المميزات', icon: Sparkles },
                  { id: 'pricing' as const, label: 'الأسعار', icon: CreditCard },
                  { id: 'clientWorks' as const, label: 'سابقة الأعمال', icon: Globe },
                  { id: 'faq' as const, label: 'الأسئلة الشائعة', icon: HelpCircle },
                  { id: 'contact' as const, label: 'تواصل معنا', icon: Phone },
                  { id: 'login' as const, label: 'تسجيل الدخول', icon: Lock },
                  { id: 'createSite' as const, label: 'أنشئ الآن', icon: UserPlus },
                  { id: 'footer' as const, label: 'الفوتر', icon: Layers },
                ].map((st) => {
                  const Icon = st.icon;
                  const isActive = landingSubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setLandingSubTab(st.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                        isActive 
                          ? 'bg-[#10244A] text-white shadow-sm' 
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}

              </div>
            </div>

            {/* Sub-section 1: الرئيسية */}
            {landingSubTab === 'hero' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل محتوى قسم البطل الرئيسي في واجهة المنصة</span>
                  <h3 className="text-base font-black text-[#10244A]">1. قسم الرئيسية (Hero)</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">شارة القسم العلوي (Badge Text)</label>
                    <input 
                      type="text" 
                      value={localLanding.hero.badge}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        hero: { ...localLanding.hero, badge: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">العنوان الرئيسي (Title)</label>
                    <textarea 
                      rows={2}
                      value={localLanding.hero.title}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        hero: { ...localLanding.hero, title: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي (Subtitle)</label>
                    <textarea 
                      rows={3}
                      value={localLanding.hero.subtitle}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        hero: { ...localLanding.hero, subtitle: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص الزر الرئيسي (Primary CTA Text)</label>
                    <input 
                      type="text" 
                      value={localLanding.hero.primaryCtaText}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        hero: { ...localLanding.hero, primaryCtaText: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">فيديو الزر الرئيسي للرئيسية (رابط يوتيوب أو المعرّف)</label>
                    <input 
                      type="text" 
                      value={localLanding.hero.videoUrl}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        hero: { ...localLanding.hero, videoUrl: e.target.value }
                      })}
                      placeholder="ضع رابط فيديو يوتيوب أو المعرف (مثال: https://www.youtube.com/watch?v=5xMVNCTwwPo)"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                    <p className="text-[11px] text-neutral-500 font-medium mt-1">هذا الفيديو يعمل عند الضغط على زر التشغيل (Play) في القسم الرئيسي بالصفحة الرئيسية.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageInputWithUpload 
                      label="صورة الخلفية للهواتف (Mobile Background Image)"
                      value={localLanding.hero.mobileBgUrl}
                      onChange={(newVal) => setLocalLanding({
                        ...localLanding,
                        hero: { ...localLanding.hero, mobileBgUrl: newVal }
                      })}
                    />

                    <ImageInputWithUpload 
                      label="صورة الخلفية للشاشات (Desktop Background Image)"
                      value={localLanding.hero.desktopBgUrl}
                      onChange={(newVal) => setLocalLanding({
                        ...localLanding,
                        hero: { ...localLanding.hero, desktopBgUrl: newVal }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 2: المميزات */}
            {landingSubTab === 'features' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل عنوان وعناصر قسم المميزات بالصفحة الرئيسية</span>
                  <h3 className="text-base font-black text-[#10244A]">2. قسم المميزات</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم المميزات (Section Title)</label>
                    <input 
                      type="text" 
                      value={localLanding.features.title}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        features: { ...localLanding.features, title: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي للمميزات (Section Subtitle)</label>
                    <textarea 
                      rows={2}
                      value={localLanding.features.subtitle}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        features: { ...localLanding.features, subtitle: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="font-extrabold text-xs text-[#009bb9] mb-4">فئات المميزات والأعمدة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {localLanding.features.categories.map((cat, cIdx) => (
                        <div key={cat.id || cIdx} className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">عمود {cIdx + 1}</span>
                            <input 
                              type="text"
                              value={cat.title}
                              onChange={(e) => {
                                const newCats = [...localLanding.features.categories];
                                newCats[cIdx] = { ...newCats[cIdx], title: e.target.value };
                                setLocalLanding({
                                  ...localLanding,
                                  features: { ...localLanding.features, categories: newCats }
                                });
                              }}
                              className="font-extrabold text-xs text-[#10244A] bg-white px-3 py-1.5 border border-neutral-300 rounded-lg text-right flex-1 ml-2 focus:outline-none focus:border-black"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-extrabold text-neutral-500">عناصر الخصائص:</label>
                            {cat.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newCats = [...localLanding.features.categories];
                                    newCats[cIdx].items = newCats[cIdx].items.filter((_, i) => i !== itemIdx);
                                    setLocalLanding({
                                      ...localLanding,
                                      features: { ...localLanding.features, categories: newCats }
                                    });
                                  }}
                                  className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                  title="حذف الميزة"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <input 
                                  type="text"
                                  value={item}
                                  onChange={(e) => {
                                    const newCats = [...localLanding.features.categories];
                                    const newItems = [...newCats[cIdx].items];
                                    newItems[itemIdx] = e.target.value;
                                    newCats[cIdx].items = newItems;
                                    setLocalLanding({
                                      ...localLanding,
                                      features: { ...localLanding.features, categories: newCats }
                                    });
                                  }}
                                  className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-right focus:outline-none focus:border-black"
                                />
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const newCats = [...localLanding.features.categories];
                                newCats[cIdx].items.push('ميزة جديدة');
                                setLocalLanding({
                                  ...localLanding,
                                  features: { ...localLanding.features, categories: newCats }
                                });
                              }}
                              className="px-3 py-1 bg-[#10244A] text-white hover:bg-[#091A3A] text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1 mt-2"
                            >
                              <Plus className="w-3 h-3" />
                              <span>إضافة ميزة للعمود</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 3: الأسعار */}
            {landingSubTab === 'pricing' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل باقات الاشتراك والأسعار المعروضة بالصفحة الرئيسية</span>
                  <h3 className="text-base font-black text-[#10244A]">3. قسم الأسعار والاشتراكات</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم الأسعار (Section Title)</label>
                      <input 
                        type="text" 
                        value={localLanding.pricing.title}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          pricing: { ...localLanding.pricing, title: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي (Section Subtitle)</label>
                      <input 
                        type="text" 
                        value={localLanding.pricing.subtitle}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          pricing: { ...localLanding.pricing, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر التفعيل الرئيسي (CTA Button Text)</label>
                    <input 
                      type="text" 
                      value={localLanding.pricing.ctaText}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        pricing: { ...localLanding.pricing, ctaText: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Plan 1 & Plan 2 Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                    
                    {/* Plan 1: 6 Months */}
                    <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                      <h4 className="font-extrabold text-xs text-[#009bb9]">باقة 6 أشهر</h4>
                      <div>
                        <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">اسم الباقة</label>
                        <input 
                          type="text" 
                          value={localLanding.pricing.plan5Months.title}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            pricing: {
                              ...localLanding.pricing,
                              plan5Months: { ...localLanding.pricing.plan5Months, title: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">السعر الرقمي (EGP)</label>
                          <input 
                            type="text" 
                            value={localLanding.pricing.plan5Months.price}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              pricing: {
                                ...localLanding.pricing,
                                plan5Months: { ...localLanding.pricing.plan5Months, price: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">المدة والشراء</label>
                          <input 
                            type="text" 
                            value={localLanding.pricing.plan5Months.period}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              pricing: {
                                ...localLanding.pricing,
                                plan5Months: { ...localLanding.pricing.plan5Months, period: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">نص الشارة أو العرض</label>
                        <input 
                          type="text" 
                          value={localLanding.pricing.plan5Months.discountText}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            pricing: {
                              ...localLanding.pricing,
                              plan5Months: { ...localLanding.pricing.plan5Months, discountText: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Plan 2: 1 Year */}
                    <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                      <h4 className="font-extrabold text-xs text-amber-600">الباقة السنوية</h4>
                      <div>
                        <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">اسم الباقة</label>
                        <input 
                          type="text" 
                          value={localLanding.pricing.plan1Year.title}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            pricing: {
                              ...localLanding.pricing,
                              plan1Year: { ...localLanding.pricing.plan1Year, title: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">السعر الرقمي (EGP)</label>
                          <input 
                            type="text" 
                            value={localLanding.pricing.plan1Year.price}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              pricing: {
                                ...localLanding.pricing,
                                plan1Year: { ...localLanding.pricing.plan1Year, price: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">المدة والشراء</label>
                          <input 
                            type="text" 
                            value={localLanding.pricing.plan1Year.period}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              pricing: {
                                ...localLanding.pricing,
                                plan1Year: { ...localLanding.pricing.plan1Year, period: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">نص الخصم أو التوفير</label>
                        <input 
                          type="text" 
                          value={localLanding.pricing.plan1Year.discountText}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            pricing: {
                              ...localLanding.pricing,
                              plan1Year: { ...localLanding.pricing.plan1Year, discountText: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 4: سابقة الأعمال */}
            {landingSubTab === 'clientWorks' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل عناوين ومعلومات قسم سابقة الأعمال بالأطباء</span>
                  <h3 className="text-base font-black text-[#10244A]">4. قسم سابقة الأعمال</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم سابقة الأعمال (Section Title)</label>
                    <input 
                      type="text" 
                      value={localLanding.clientWorks.title}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        clientWorks: { ...localLanding.clientWorks, title: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي لسابقة الأعمال (Section Subtitle)</label>
                    <textarea 
                      rows={3}
                      value={localLanding.clientWorks.subtitle}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        clientWorks: { ...localLanding.clientWorks, subtitle: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl text-blue-950 text-xs font-medium leading-relaxed">
                    💡 <strong>ملاحظة هامة:</strong> يعرض هذا القسم بطاقات الأطباء الحقيقيين المشتركين والمعتمدين في المنصة من قائمة الأطباء (مع معاينات بروفايلاتهم الطبية المباشرة).
                  </div>

                  {/* Doctor Profile Selection for Client Works */}
                  <div className="pt-4 border-t border-neutral-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500 font-medium">يمكنك تحديد أطباء محددين لعرضهم في معرض سابقة الأعمال، أو ترك القائمة لعرض الجميع</span>
                      <h4 className="font-extrabold text-xs text-[#009bb9]">إدارة البروفايلات المعروضة في سابقة الأعمال</h4>
                    </div>

                    {/* Featured Doctors List */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold text-neutral-700">الأطباء المعروضون في سابقة الأعمال حالياً:</label>
                      {(!localLanding.clientWorks.featuredDoctorIds || localLanding.clientWorks.featuredDoctorIds.length === 0) ? (
                        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 font-semibold">
                          يتم عرض جميع الأطباء بالمنصة تلقائياً. قم بإضافة بروفايل محدد من القائمة أدناه لتخصيص العرض.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {doctors.filter(d => localLanding.clientWorks.featuredDoctorIds?.includes(d.id) || localLanding.clientWorks.featuredDoctorIds?.includes(d.nameEn)).map((doc) => (
                            <div key={doc.id} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <img src={doc.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"} alt={doc.name} className="w-9 h-9 rounded-full object-cover border border-neutral-300" />
                                <div>
                                  <p className="text-xs font-bold text-neutral-900">{doc.name}</p>
                                  <p className="text-[10px] text-neutral-500">@{doc.nameEn}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (localLanding.clientWorks.featuredDoctorIds || []).filter(id => id !== doc.id && id !== doc.nameEn);
                                  setLocalLanding({
                                    ...localLanding,
                                    clientWorks: {
                                      ...localLanding.clientWorks,
                                      featuredDoctorIds: updated
                                    }
                                  });
                                }}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-extrabold rounded-lg transition-colors border border-red-200 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>حذف من السابقة</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Search and Add Doctor for Client Works */}
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                      <div>
                        <h5 className="font-extrabold text-xs text-[#10244A]">إضافة طبيب لسابقة الأعمال بالاسم أو الرابط</h5>
                        <p className="text-[11px] text-neutral-500 font-medium">ابحث باسم الطبيب أو أدخل رابط البروفايل / اسم المستخدم (User Link)</p>
                      </div>

                      {/* Method 1: Search Input */}
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={cwSearchQuery}
                            onChange={(e) => setCwSearchQuery(e.target.value)}
                            placeholder="ابحث باسم الطبيب أو الرابط (مثال: د. أحمد أو dr-ahmed-soliman)..."
                            className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                          {cwSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setCwSearchQuery('')}
                              className="absolute left-3 top-2.5 text-xs text-neutral-400 hover:text-black font-bold"
                            >
                              مسح
                            </button>
                          )}
                        </div>

                        {/* Search Results List */}
                        <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                          {doctors
                            .filter(d => {
                              if (!cwSearchQuery.trim()) return true;
                              const q = cwSearchQuery.toLowerCase().trim();
                              return d.name.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
                            })
                            .map(doc => {
                              const isAdded = (localLanding.clientWorks.featuredDoctorIds || []).some(id => id === doc.id || id === doc.nameEn);
                              return (
                                <div key={doc.id} className="p-2.5 bg-white border border-neutral-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                                  <div className="flex items-center gap-3">
                                    <img src={doc.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"} alt={doc.name} className="w-8 h-8 rounded-full object-cover border border-neutral-200" />
                                    <div>
                                      <p className="text-xs font-bold text-neutral-900">{doc.name}</p>
                                      <p className="text-[10px] font-mono text-neutral-500" dir="ltr">/doctor/{doc.nameEn}</p>
                                    </div>
                                  </div>
                                  {isAdded ? (
                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200">
                                      مضاف للسابقة ✓
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentList = localLanding.clientWorks.featuredDoctorIds || [];
                                        setLocalLanding({
                                          ...localLanding,
                                          clientWorks: {
                                            ...localLanding.clientWorks,
                                            featuredDoctorIds: [...currentList, doc.id]
                                          }
                                        });
                                      }}
                                      className="px-3 py-1 bg-[#10244A] hover:bg-black text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                                    >
                                      + إضافة للسابقة
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Method 2: Direct Paste of Doctor Link or Username */}
                      <div className="pt-3 border-t border-neutral-200 space-y-2">
                        <label className="block text-[11px] font-extrabold text-neutral-700">إضافة بروفايل بلينك مباشر أو اسم المستخدم (Username):</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={cwLinkInput}
                            onChange={(e) => setCwLinkInput(e.target.value)}
                            placeholder="ضع رابط الطبيب أو اسم المستخدم (مثال: dr-ahmed-soliman أو https://.../doctor/dr-ahmed-soliman)"
                            className="flex-1 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                            dir="ltr"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!cwLinkInput.trim()) return;
                              let val = cwLinkInput.trim();
                              // Extract slug if full URL was pasted
                              const match = val.match(/\/doctor\/([^/]+)/i) || val.match(/#(?:\/)?doctor\/([^/]+)/i);
                              if (match) val = match[1];

                              // Check if doctor exists with this nameEn or id
                              const found = doctors.find(d => d.nameEn.toLowerCase() === val.toLowerCase() || d.id === val);
                              const targetId = found ? found.id : val;

                              const currentList = localLanding.clientWorks.featuredDoctorIds || [];
                              if (!currentList.includes(targetId)) {
                                setLocalLanding({
                                  ...localLanding,
                                  clientWorks: {
                                    ...localLanding.clientWorks,
                                    featuredDoctorIds: [...currentList, targetId]
                                  }
                                });
                              }
                              setCwLinkInput('');
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                          >
                            إضافة بالرابط
                          </button>
                        </div>
                      </div>

                      {localLanding.clientWorks.featuredDoctorIds && localLanding.clientWorks.featuredDoctorIds.length > 0 && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setLocalLanding({
                              ...localLanding,
                              clientWorks: { ...localLanding.clientWorks, featuredDoctorIds: [] }
                            })}
                            className="text-xs text-neutral-500 hover:text-black underline font-bold cursor-pointer"
                          >
                            إعادة تعيين (عرض جميع الأطباء تلقائياً)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 5: الأسئلة الشائعة */}
            {landingSubTab === 'faq' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">إضافة وتعديل الأسئلة الشائعة وإجاباتها</span>
                  <h3 className="text-base font-black text-[#10244A]">5. قسم الأسئلة الشائعة</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم الأسئلة الشائعة (Section Title)</label>
                    <input 
                      type="text" 
                      value={localLanding.faq.title}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        faq: { ...localLanding.faq, title: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي (Section Subtitle)</label>
                    <input 
                      type="text" 
                      value={localLanding.faq.subtitle}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        faq: { ...localLanding.faq, subtitle: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          const newFaqs: FAQConfigItem[] = [
                            ...localLanding.faq.items,
                            {
                              id: `faq-${Date.now()}`,
                              question: 'سؤال شائع جديد؟',
                              answer: 'إجابة توضيحية كاملة عن السؤال المضاف حديثاً.'
                            }
                          ];
                          setLocalLanding({
                            ...localLanding,
                            faq: { ...localLanding.faq, items: newFaqs }
                          });
                        }}
                        className="px-4 py-2 bg-[#10244A] hover:bg-[#091A3A] text-white text-xs font-extrabold rounded-full transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة سؤال شائع جديد</span>
                      </button>
                      <h4 className="font-extrabold text-xs text-neutral-800">قائمة الأسئلة الشائعة ({localLanding.faq.items.length})</h4>
                    </div>

                    <div className="space-y-3">
                      {localLanding.faq.items.map((item, fIdx) => (
                        <div key={item.id || fIdx} className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newFaqs = localLanding.faq.items.filter((_, i) => i !== fIdx);
                                setLocalLanding({
                                  ...localLanding,
                                  faq: { ...localLanding.faq, items: newFaqs }
                                });
                              }}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                              title="حذف السؤال"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <input 
                              type="text" 
                              value={item.question}
                              onChange={(e) => {
                                const newFaqs = [...localLanding.faq.items];
                                newFaqs[fIdx] = { ...newFaqs[fIdx], question: e.target.value };
                                setLocalLanding({
                                  ...localLanding,
                                  faq: { ...localLanding.faq, items: newFaqs }
                                });
                              }}
                              placeholder="السؤال الشائع..."
                              className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-right"
                            />
                          </div>

                          <textarea 
                            rows={2}
                            value={item.answer}
                            onChange={(e) => {
                              const newFaqs = [...localLanding.faq.items];
                              newFaqs[fIdx] = { ...newFaqs[fIdx], answer: e.target.value };
                              setLocalLanding({
                                ...localLanding,
                                faq: { ...localLanding.faq, items: newFaqs }
                              });
                            }}
                            placeholder="الإجابة التفصيلية..."
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-right"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 6: تواصل معنا */}
            {landingSubTab === 'contact' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل بيانات ورقم الواتساب الخاص بـ تواصل معنا</span>
                  <h3 className="text-base font-black text-[#10244A]">6. قسم تواصل معنا</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم التواصل (Section Title)</label>
                    <input 
                      type="text" 
                      value={localLanding.contact.title}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        contact: { ...localLanding.contact, title: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">رقم الواتساب مع كود الدولة (WhatsApp Number)</label>
                    <input 
                      type="text" 
                      value={localLanding.contact.whatsappNumber}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        contact: { ...localLanding.contact, whatsappNumber: e.target.value }
                      })}
                      placeholder="مثال: 201099112233"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر الواتساب (Button Text)</label>
                    <input 
                      type="text" 
                      value={localLanding.contact.buttonText}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        contact: { ...localLanding.contact, buttonText: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">النص التوضيحي داخل مربع الرسائل (Placeholder)</label>
                    <input 
                      type="text" 
                      value={localLanding.contact.placeholder}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        contact: { ...localLanding.contact, placeholder: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 7: تسجيل الدخول */}
            {landingSubTab === 'login' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل نصوص وأزرار ولوجو صفحة تسجيل الدخول</span>
                  <h3 className="text-base font-black text-[#10244A]">7. قسم تسجيل الدخول</h3>
                </div>

                <div className="space-y-4">
                  <ImageInputWithUpload 
                    label="لوجو صفحة تسجيل الدخول (Login Page Logo)"
                    value={localLanding.login.logoUrl || "https://i.top4top.io/p_3857n94r80.png"}
                    onChange={(newVal) => setLocalLanding({
                      ...localLanding,
                      login: { ...localLanding.login, logoUrl: newVal }
                    })}
                  />

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر تسجيل الدخول للشريط العلوي (Header Login Text)</label>
                    <input 
                      type="text" 
                      value={localLanding.login.headerLoginButtonText}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        login: { ...localLanding.login, headerLoginButtonText: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان صفحة تسجيل الدخول (Page Title)</label>
                    <input 
                      type="text" 
                      value={localLanding.login.title}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        login: { ...localLanding.login, title: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي لصفحة تسجيل الدخول (Subtitle)</label>
                    <textarea 
                      rows={2}
                      value={localLanding.login.subtitle}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        login: { ...localLanding.login, subtitle: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 8: أنشئ الآن */}
            {landingSubTab === 'createSite' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل نصوص وأزرار "أنشئ الآن" ونموذج التسجيل</span>
                  <h3 className="text-base font-black text-[#10244A]">8. قسم أنشئ الآن</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر "أنشئ الآن" في الشريط العلوي (Header CTA)</label>
                      <input 
                        type="text" 
                        value={localLanding.createSite.headerCtaButtonText}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          createSite: { ...localLanding.createSite, headerCtaButtonText: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر "أنشئ الآن" في البطل (Hero CTA)</label>
                      <input 
                        type="text" 
                        value={localLanding.createSite.heroCtaButtonText}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          createSite: { ...localLanding.createSite, heroCtaButtonText: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان نموذج إنشاء البروفايل (Form Title)</label>
                    <input 
                      type="text" 
                      value={localLanding.createSite.title}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        createSite: { ...localLanding.createSite, title: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي لنموذج التسجيل (Form Subtitle)</label>
                    <textarea 
                      rows={2}
                      value={localLanding.createSite.subtitle}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        createSite: { ...localLanding.createSite, subtitle: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر إرسال النموذج (Submit Button Text)</label>
                    <input 
                      type="text" 
                      value={localLanding.createSite.submitButtonText}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        createSite: { ...localLanding.createSite, submitButtonText: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">رسالة النجاح عند إرسال الطلب (Success Alert Text)</label>
                    <textarea 
                      rows={2}
                      value={localLanding.createSite.successAlertText}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        createSite: { ...localLanding.createSite, successAlertText: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 9: الفوتر */}
            {landingSubTab === 'footer' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل لوجو ووصف وروابط ومحتوى الفوتر السفلي</span>
                  <h3 className="text-base font-black text-[#10244A]">9. قسم الفوتر</h3>
                </div>

                <div className="space-y-4">
                  <ImageInputWithUpload 
                    label="لوجو الفوتر (Footer Logo)"
                    value={localLanding.footer?.logoUrl || "https://k.top4top.io/p_38573eitn0.png"}
                    onChange={(newVal) => setLocalLanding({
                      ...localLanding,
                      footer: {
                        ...(localLanding.footer || {}),
                        logoUrl: newVal
                      }
                    })}
                  />

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">وصف المنصة في الفوتر (Footer Description)</label>
                    <textarea 
                      rows={2}
                      value={localLanding.footer?.description || ''}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        footer: {
                          ...(localLanding.footer || {}),
                          description: e.target.value
                        }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="pt-4 border-t border-neutral-100 space-y-4">
                    <h4 className="font-extrabold text-xs text-[#009bb9]">روابط وسائل التواصل الاجتماعي (Social Media)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">رابط فيسبوك (Facebook URL)</label>
                        <input 
                          type="text" 
                          value={localLanding.footer?.facebookUrl || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            footer: {
                              ...(localLanding.footer || {}),
                              facebookUrl: e.target.value
                            }
                          })}
                          placeholder="https://facebook.com"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">رابط إنستغرام (Instagram URL)</label>
                        <input 
                          type="text" 
                          value={localLanding.footer?.instagramUrl || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            footer: {
                              ...(localLanding.footer || {}),
                              instagramUrl: e.target.value
                            }
                          })}
                          placeholder="https://instagram.com"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">رابط لينكد إن (LinkedIn URL)</label>
                        <input 
                          type="text" 
                          value={localLanding.footer?.linkedinUrl || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            footer: {
                              ...(localLanding.footer || {}),
                              linkedinUrl: e.target.value
                            }
                          })}
                          placeholder="https://linkedin.com"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">رابط يوتيوب (YouTube URL)</label>
                        <input 
                          type="text" 
                          value={localLanding.footer?.youtubeUrl || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            footer: {
                              ...(localLanding.footer || {}),
                              youtubeUrl: e.target.value
                            }
                          })}
                          placeholder="https://youtube.com"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص حقوق الملكية (Copyright Text)</label>
                    <input 
                      type="text" 
                      value={localLanding.footer?.copyrightText || ''}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        footer: {
                          ...(localLanding.footer || {}),
                          copyrightText: e.target.value
                        }
                      })}
                      placeholder="© 2026 Dr Profile. All rights reserved."
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Floating Save Bar */}
            <div className="p-4 bg-[#10244A] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-xl">
              <div className="text-right">
                <h4 className="font-extrabold text-sm">تطبيق الإعدادات والتعديلات الحالية</h4>
                <p className="text-neutral-300 text-xs">اضغط على زر الحفظ لحفظ التغييرات وتطبيقها مباشرة على الموقع الرئيسي للم المنصة.</p>
              </div>

              <button
                onClick={handleSaveLandingConfig}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ تعديلات الصفحة الرئيسية</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 1: Manage Doctors */}
        {activeTab === 'doctors' && (
          <div className="space-y-6 text-right">
            
            {/* Sub-navigation inside Doctors Tab */}
            <div className="flex border-b border-neutral-200 gap-2 overflow-x-auto">
              <button
                onClick={() => setDoctorsSubTab('list')}
                className={`px-5 py-3 text-xs font-black transition-all border-b-2 -mb-[2px] ${
                  doctorsSubTab === 'list'
                    ? 'border-[#009bb9] text-[#009bb9]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                👨‍⚕️ جميع الأطباء ({totalDoctorsCount})
              </button>

              <button
                onClick={() => setDoctorsSubTab('expiring')}
                className={`px-5 py-3 text-xs font-black transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
                  doctorsSubTab === 'expiring'
                    ? 'border-amber-500 text-amber-600 font-black'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <span>⏰ الاشتراكات الموشكة على الانتهاء</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                  {expiringDoctorsCount}
                </span>
              </button>

              <button
                onClick={() => setDoctorsSubTab('stats')}
                className={`px-5 py-3 text-xs font-black transition-all border-b-2 -mb-[2px] ${
                  doctorsSubTab === 'stats'
                    ? 'border-[#009bb9] text-[#009bb9]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                📊 الإحصائيات العامة
              </button>
            </div>

            {/* Sub-tab 1: Statistics Dashboard */}
            {doctorsSubTab === 'stats' && (
              <div className="space-y-6">
                
                {/* 9 Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {/* Card 1: Total Doctors */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-neutral-400 block">إجمالي الأطباء</span>
                      <span className="text-xl font-black text-neutral-900">{totalDoctorsCount}</span>
                    </div>
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card 2: Active Doctors */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-neutral-400 block">الأطباء النشطون</span>
                      <span className="text-xl font-black text-emerald-600">{activeDoctorsCount}</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card 3: Pending Review */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1 flex flex-col">
                      <span className="text-[10px] font-extrabold text-neutral-400 block">معلق بانتظار المراجعة</span>
                      <span className="text-xl font-black text-amber-600">{pendingDoctorsCount}</span>
                    </div>
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card 4: Active Subscriptions */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-neutral-400 block">الاشتراكات النشطة</span>
                      <span className="text-xl font-black text-indigo-600">{activeSubscriptionsCount}</span>
                    </div>
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card 5: Expired Subscriptions */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-neutral-400 block">الاشتراكات المنتهية</span>
                      <span className="text-xl font-black text-red-600">{expiredSubscriptionsCount}</span>
                    </div>
                    <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                      <X className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card 6: Total Bookings */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-neutral-400 block">إجمالي الحجوزات</span>
                      <span className="text-xl font-black text-neutral-900">{totalAppointmentsCount}</span>
                    </div>
                    <div className="p-2.5 bg-neutral-100 text-neutral-700 rounded-xl">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card 7: Today's Bookings */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-neutral-400 block">حجوزات اليوم</span>
                      <span className="text-xl font-black text-blue-600">{todayAppointmentsCount}</span>
                    </div>
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card 8: Total Revenue */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-1">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-neutral-400 block">إجمالي الإيرادات</span>
                      <span className="text-lg font-black text-emerald-700">{totalRevenueVal.toLocaleString('ar-EG')} ج.م</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-black text-xs">
                      مالي
                    </div>
                  </div>

                  {/* Card 9: Monthly Revenue */}
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-1">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-neutral-400 block">الإيرادات الشهرية</span>
                      <span className="text-lg font-black text-[#009bb9]">{monthlyRevenueVal.toLocaleString('ar-EG')} ج.م</span>
                    </div>
                    <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-xl font-black text-xs">
                      شهري
                    </div>
                  </div>
                </div>

                {/* Sub-lists: Last registered and Last requests */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Latest Registered Doctors */}
                  <div className="bg-white rounded-3xl border border-neutral-200/60 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <span className="text-[10px] font-bold text-neutral-400">آخر 5 أطباء مسجلين على المنصة</span>
                      <h4 className="font-extrabold text-sm text-[#10244A]">👨‍⚕️ الأطباء المسجلون حديثاً</h4>
                    </div>

                    <div className="divide-y divide-neutral-100">
                      {latestRegisteredDoctors.map(doc => (
                        <div key={doc.id} className="py-3 flex items-center justify-between gap-3">
                          <button
                            onClick={() => { setDoctorsSubTab('list'); setSearchTerm(doc.name); }}
                            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-extrabold rounded-full transition-colors"
                          >
                            عرض التفاصيل
                          </button>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <h5 className="font-extrabold text-xs text-neutral-900">{doc.name}</h5>
                              <p className="text-[10px] text-neutral-500 font-bold mt-0.5">{doc.jobTitle.split('-')[0]}</p>
                            </div>
                            <img src={doc.avatar} alt={doc.name} className="w-9 h-9 rounded-full object-cover border border-neutral-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Latest Booking Requests */}
                  <div className="bg-white rounded-3xl border border-neutral-200/60 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <span className="text-[10px] font-bold text-neutral-400">آخر 5 طلبات حجز مسجلة</span>
                      <h4 className="font-extrabold text-sm text-[#10244A]">📅 طلبات الحجز الأخيرة</h4>
                    </div>

                    <div className="divide-y divide-neutral-100">
                      {latestAppointments.map(apt => {
                        const doc = doctors.find(d => d.id === apt.doctorId);
                        return (
                          <div key={apt.id} className="py-3 flex items-center justify-between gap-3">
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                              apt.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : apt.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {apt.status === 'approved' ? 'مؤكد' : apt.status === 'rejected' ? 'مرفوض' : 'معلق'}
                            </span>

                            <div className="text-right">
                              <h5 className="font-extrabold text-xs text-neutral-900">{apt.patientName}</h5>
                              <p className="text-[10px] text-neutral-500 mt-0.5">
                                الكشف عند د. {doc ? doc.name.split(' ').slice(0, 3).join(' ') : 'غير معروف'} | الموعد: {apt.date}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Sub-tab 3: Expiring Subscriptions Section */}
            {doctorsSubTab === 'expiring' && (
              <div className="space-y-6">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-amber-900/90 via-amber-950/80 to-slate-900 p-6 rounded-3xl border border-amber-500/40 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⏰</span>
                      <h3 className="font-extrabold text-base text-amber-300">متابعة وتجديد الاشتراكات الموشكة على الانتهاء</h3>
                    </div>
                    <p className="text-xs text-amber-100/80 leading-relaxed font-semibold">
                      يستعرض هذا القسم جميع الأطباء الذين تبقت على اشتراكاتهم فترة قصيرة (أقل من 30 يوماً). يمكنك تمديد الاشتراك مباشرة أو إرسال بنر تنبيهي مخصص لهم.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setBannerTargetAudience('expiring_30_days');
                      setBannerTitle('تنبيه: اقترب موعد تجديد اشتراكك في المنصة');
                      setBannerDesc('مرحباً بك دكتور، نود تذكيرك بضرورة تجديد اشتراكك لضمان عدم توقف خدمات حجز العيادة واستقبال المرضى.');
                      setBannerButtonText('تجديد الاشتراك الآن');
                      setBannerButtonUrl('#settings');
                      setActiveTab('banners');
                      setIsBannerModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>📣 إنشاء بنر تنبيهي لهذه الفئة</span>
                  </button>
                </div>

                {/* Quick Expiration Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-red-200/80 shadow-sm text-right space-y-1">
                    <span className="text-[10px] text-red-600 font-extrabold uppercase">حرج للغاية (15 يوماً أو أقل)</span>
                    <h3 className="text-2xl font-black text-red-600">
                      {doctors.filter(d => getDoctorDaysRemaining(d) <= 15 && getDoctorDaysRemaining(d) > 0).length} أطباء
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-bold">يحتاجون تواصل فوري</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm text-right space-y-1">
                    <span className="text-[10px] text-amber-600 font-extrabold uppercase">موشك (30 يوماً أو أقل)</span>
                    <h3 className="text-2xl font-black text-amber-600">
                      {doctors.filter(d => getDoctorDaysRemaining(d) <= 30 && getDoctorDaysRemaining(d) > 0).length} أطباء
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-bold">ضمن فترة التذكير</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-sm text-right space-y-1">
                    <span className="text-[10px] text-neutral-500 font-extrabold uppercase">منتهي بالفعل</span>
                    <h3 className="text-2xl font-black text-neutral-800">
                      {doctors.filter(d => getDoctorDaysRemaining(d) <= 0 || !d.isActiveSubscription).length} أطباء
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-bold">يتطلب تجديد لإعادة التفعيل</span>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-indigo-200/80 shadow-sm text-right space-y-1">
                    <span className="text-[10px] text-indigo-600 font-extrabold uppercase">الباقة السنوية الموشكة</span>
                    <h3 className="text-2xl font-black text-indigo-600">
                      {doctors.filter(d => (d.subscriptionType || 'annual') === 'annual' && getDoctorDaysRemaining(d) <= 30).length} أطباء
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-bold">اشتراكات سنوية عالية القيمة</span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white p-5 rounded-3xl border border-neutral-200/60 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-96">
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ابحث باسم الطبيب، البريد، أو التخصص..." 
                        className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-black focus:outline-none focus:border-amber-500 text-right pr-12"
                      />
                      <Search className="absolute top-1/2 right-5 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                    </div>

                    <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                      <span className="text-[11px] font-extrabold text-neutral-500 ml-1">تصفية حسب الأيام المتبقية:</span>
                      {[
                        { days: 15 as const, label: '⚠️ متبقي 15 يوماً فأقل' },
                        { days: 30 as const, label: '⏳ متبقي 30 يوماً فأقل' },
                        { days: 60 as const, label: '📅 متبقي 60 يوماً فأقل' },
                        { days: 'all' as const, label: 'الكل (بما في ذلك المنتهي)' }
                      ].map(f => (
                        <button
                          key={f.days}
                          onClick={() => setExpiringDaysFilter(f.days)}
                          className={`px-3.5 py-1.5 text-[10px] font-black rounded-full transition-all border cursor-pointer ${
                            expiringDaysFilter === f.days
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                              : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expiring Doctors List */}
                <div className="bg-white rounded-3xl border border-neutral-200/60 overflow-hidden shadow-sm">
                  {(() => {
                    const expiringList = doctors.filter(doc => {
                      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            doc.email.toLowerCase().includes(searchTerm.toLowerCase());
                      if (!matchesSearch) return false;

                      const days = getDoctorDaysRemaining(doc);
                      if (expiringDaysFilter === 15) return days <= 15;
                      if (expiringDaysFilter === 30) return days <= 30;
                      if (expiringDaysFilter === 60) return days <= 60;
                      return days <= 90 || !doc.isActiveSubscription;
                    }).sort((a, b) => getDoctorDaysRemaining(a) - getDoctorDaysRemaining(b));

                    if (expiringList.length === 0) {
                      return (
                        <div className="p-12 text-center text-neutral-400 font-bold text-xs">
                          لا يوجد أطباء تنطبق عليهم شروط الاشتراك الموشك على الانتهاء ضمن المعايير المحددة.
                        </div>
                      );
                    }

                    return (
                      <div className="divide-y divide-neutral-100">
                        <div className="p-4 bg-amber-50/60 border-b border-amber-100 flex justify-between items-center text-xs font-black text-amber-900">
                          <span>مرتبين حسب الأقرب انتهاءً ({expiringList.length} طبيب)</span>
                          <span>قائمة اشتراكات الأطباء القريبة من الانتهاء</span>
                        </div>

                        {expiringList.map(doc => {
                          const expiryDate = getDoctorExpiryDate(doc);
                          const expiryFormatted = expiryDate.toISOString().slice(0, 10);
                          const daysRemaining = getDoctorDaysRemaining(doc);
                          const subType = doc.subscriptionType || 'annual';

                          return (
                            <div key={doc.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
                              
                              {/* Actions on left */}
                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                <button
                                  onClick={() => handleExtendSubscription(doc.id, 12)}
                                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                                  title="تمديد الاشتراك لسنة كاملة (12 شهر)"
                                >
                                  <span>🚀 تمديد سنة (+12)</span>
                                </button>

                                <button
                                  onClick={() => handleExtendSubscription(doc.id, 6)}
                                  className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                                  title="تمديد الاشتراك لـ 6 أشهر"
                                >
                                  <span>⚡ تمديد 6 أشهر</span>
                                </button>

                                <button
                                  onClick={() => handleViewProfile(doc.nameEn)}
                                  className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                                >
                                  عرض البروفايل
                                </button>

                                {onLoginAsDoctor && (
                                  <button
                                    onClick={() => onLoginAsDoctor(doc.id)}
                                    className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>دخول</span>
                                  </button>
                                )}
                              </div>

                              {/* Doctor info on right */}
                              <div className="flex items-start gap-4">
                                <div className="text-right space-y-1.5">
                                  <div className="flex items-center justify-end gap-2 flex-wrap">
                                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                                      daysRemaining <= 0 || !doc.isActiveSubscription
                                        ? 'bg-red-100 text-red-800 border-red-300 font-black animate-pulse'
                                        : daysRemaining <= 15
                                        ? 'bg-red-50 text-red-700 border-red-200 font-black'
                                        : 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold'
                                    }`}>
                                      {daysRemaining > 0 ? `⏰ متبقي ${daysRemaining} يوم` : '🔴 انتهى الاشتراك'}
                                    </span>

                                    <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
                                      {subType === 'annual' ? '👑 سنوي' : '⏳ 6 أشهر'}
                                    </span>

                                    <h4 className="font-extrabold text-sm text-neutral-900">{doc.name}</h4>
                                  </div>

                                  <p className="text-xs text-neutral-600 font-semibold">{doc.jobTitle}</p>

                                  <div className="flex items-center justify-end gap-3 text-[11px] text-neutral-500 font-medium flex-wrap">
                                    <span>📧 {doc.email}</span>
                                    <span>📱 {doc.phone}</span>
                                    <span className="text-amber-700 font-bold">🗓️ الانتهاء: {expiryFormatted}</span>
                                  </div>
                                </div>

                                <img 
                                  src={doc.avatar} 
                                  alt={doc.name} 
                                  className="w-12 h-12 rounded-2xl object-cover border-2 border-neutral-200 shrink-0 shadow-xs" 
                                />
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

              </div>
            )}

            {/* Sub-tab 2: Doctor Management List */}
            {doctorsSubTab === 'list' && (
              <div className="space-y-6">
                
                {/* Searching and Status Filtering Bar */}
                <div className="bg-white p-5 rounded-3xl border border-neutral-200/60 shadow-sm space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="ابحث عن طبيب بالاسم، البريد الإلكتروني، أو التخصص الطبي..." 
                      className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-black focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right pr-12"
                    />
                    <Search className="absolute top-1/2 right-5 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
                  </div>

                  {/* Status Filters */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-extrabold text-neutral-500 ml-2">حالة الحساب:</span>
                    {[
                      { key: 'all' as const, label: 'الكل' },
                      { key: 'pending' as const, label: '🟡 معلق بانتظار المراجعة' },
                      { key: 'approved' as const, label: '🟢 مقبول ونشط' },
                      { key: 'expiring' as const, label: '⏰ قربت تنتهي (30 يوم)' },
                      { key: 'rejected' as const, label: '🔴 مرفوض' },
                      { key: 'suspended' as const, label: '⚫ موقوف/منتهي' }
                    ].map(btn => (
                      <button
                        key={btn.key}
                        onClick={() => setStatusFilter(btn.key)}
                        className={`px-4 py-2 text-[10px] font-black rounded-full transition-all border ${
                          statusFilter === btn.key
                            ? 'bg-[#10244A] text-white border-[#10244A] shadow-sm'
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table list */}
                <div className="bg-white rounded-3xl border border-neutral-200/60 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                    <span className="text-[11px] font-extrabold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                      مدرج حالياً: {filteredDoctors.length} أطباء
                    </span>
                    <h3 className="font-extrabold text-sm text-neutral-900">قائمة وبيانات الأطباء في النظام</h3>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {filteredDoctors.length === 0 ? (
                      <div className="p-12 text-center text-neutral-400 font-bold text-xs">لا توجد بيانات مطابقة للبحث أو الفلتر المختار.</div>
                    ) : (
                      filteredDoctors.map(doc => {
                        const subType = doc.subscriptionType || 'annual';
                        const isVerified = doc.isVerified ?? true;
                        const isWhiteLabel = doc.whiteLabel ?? false;
                        const isMenuOpen = openDropdownDocId === doc.id;
                        const expiryDate = getDoctorExpiryDate(doc);
                        const expiryFormatted = expiryDate.toISOString().slice(0, 10);
                        const daysRemaining = getDoctorDaysRemaining(doc);

                        return (
                          <div key={doc.id} className="border-b border-neutral-100 bg-white last:border-0 hover:bg-neutral-50/40 transition-colors">
                            
                            {/* Main row info */}
                            <div className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                              
                              {/* Left Column: Concise Primary Actions & Dropdown Menu */}
                              <div className="flex flex-wrap items-center gap-2">
                                
                                {/* 1. View Doctor Profile in New Window/Tab */}
                                <button
                                  onClick={() => handleViewProfile(doc.nameEn)}
                                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5"
                                  title="فتح صفحة بروفايل الطبيب العامة في نافذة جديدة"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-[#009bb9]" />
                                  <span>عرض البروفايل</span>
                                </button>

                                {/* 2. Edit Profile Data Modal */}
                                <button
                                  onClick={() => handleStartEditing(doc)}
                                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-extrabold rounded-xl transition-all"
                                  title="تعديل بيانات الطبيب الحالية"
                                >
                                  تعديل
                                </button>

                                {/* 3. Log in as Doctor */}
                                {onLoginAsDoctor && (
                                  <button
                                    onClick={() => onLoginAsDoctor(doc.id)}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-xs flex items-center gap-1"
                                    title="تسجيل الدخول كطبيب للوحة التحكم الخاصة به"
                                  >
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>دخول كطبيب</span>
                                  </button>
                                )}

                                {/* 4. Approval / Subscription Status Toggle */}
                                {doc.approvalStatus === 'pending' ? (
                                  <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
                                    <button 
                                      onClick={() => handleApproveDoctor(doc.id)}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                                    >
                                      موافقة
                                    </button>
                                    <button 
                                      onClick={() => handleOpenRejectModal(doc.id)}
                                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                                    >
                                      رفض
                                    </button>
                                    <a 
                                      href={getWhatsAppContactUrl(doc)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                      title="تواصل عبر الواتساب لتأكيد الاشتراك"
                                    >
                                      <Phone className="w-3 h-3" />
                                      <span>واتساب</span>
                                    </a>
                                  </div>
                                ) : doc.approvalStatus === 'rejected' ? (
                                  <button 
                                    onClick={() => handleApproveDoctor(doc.id)}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all"
                                  >
                                    موافقة
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleToggleSubscription(doc.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                                      doc.isActiveSubscription 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                    }`}
                                    title="تفعيل أو إيقاف اشتراك الطبيب"
                                  >
                                    {doc.isActiveSubscription ? 'الاشتراك' : 'تفعيل الاشتراك'}
                                  </button>
                                )}

                                {/* 5. Dropdown Menu "المزيد" (⋮) for Secondary Actions */}
                                <div className="relative">
                                  <button
                                    onClick={() => setOpenDropdownDocId(isMenuOpen ? null : doc.id)}
                                    className={`px-2.5 py-1.5 rounded-xl border text-neutral-700 text-xs font-extrabold transition-all flex items-center gap-1 ${
                                      isMenuOpen ? 'bg-neutral-200 border-neutral-300' : 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200'
                                    }`}
                                    title="خيارات وإجراءات إضافية"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {isMenuOpen && (
                                    <div className="absolute left-0 top-full mt-1.5 w-56 bg-white rounded-2xl border border-neutral-200 shadow-xl z-30 p-1.5 text-right space-y-1 animate-in fade-in duration-150">
                                      
                                      {/* Action 1: Toggle White Label */}
                                      <button
                                        onClick={() => {
                                          handleToggleWhiteLabel(doc.id);
                                          setOpenDropdownDocId(null);
                                        }}
                                        className="w-full text-right px-3 py-2 hover:bg-neutral-50 rounded-xl text-xs font-extrabold text-neutral-800 flex items-center justify-between transition-colors"
                                      >
                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isWhiteLabel ? 'bg-purple-100 text-purple-800' : 'bg-neutral-100 text-neutral-500'}`}>
                                          {isWhiteLabel ? 'مفعل' : 'معطل'}
                                        </span>
                                        <span>{isWhiteLabel ? 'إظهار علامة المنصة' : 'إخفاء علامة المنصة (White Label)'}</span>
                                      </button>

                                      {/* Action 3: Reset Password */}
                                      <button
                                        onClick={() => {
                                          handleResetPassword(doc.id);
                                          setOpenDropdownDocId(null);
                                        }}
                                        className="w-full text-right px-3 py-2 hover:bg-neutral-50 rounded-xl text-xs font-extrabold text-neutral-800 flex items-center justify-between transition-colors border-t border-neutral-100 pt-1.5"
                                      >
                                        <Lock className="w-3.5 h-3.5 text-neutral-400" />
                                        <span>كلمة المرور</span>
                                      </button>

                                      {/* Action 4: Switch Package */}
                                      <button
                                        onClick={() => {
                                          handleToggleSubscriptionPackage(doc.id, subType === 'annual' ? '6months' : 'annual');
                                          setOpenDropdownDocId(null);
                                        }}
                                        className="w-full text-right px-3 py-2 hover:bg-neutral-50 rounded-xl text-xs font-extrabold text-neutral-800 flex items-center justify-between transition-colors"
                                      >
                                        <span className="text-[10px] text-neutral-400 font-bold">الباقة</span>
                                        <span>{subType === 'annual' ? 'تحويل لباقة 6 أشهر' : 'تحويل للباقة السنوية'}</span>
                                      </button>

                                      {/* Action 5: Extend Subscription */}
                                      {doc.approvalStatus === 'approved' && (
                                        <button
                                          onClick={() => {
                                            handleExtendSubscription(doc.id, 12);
                                            setOpenDropdownDocId(null);
                                          }}
                                          className="w-full text-right px-3 py-2 hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-extrabold flex items-center justify-between transition-colors"
                                        >
                                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black">+12m</span>
                                          <span>تمديد 12 شهر</span>
                                        </button>
                                      )}

                                      {/* Action 6: Delete Doctor */}
                                      <button
                                        onClick={() => {
                                          handleRemoveDoctor(doc.id);
                                          setOpenDropdownDocId(null);
                                        }}
                                        className="w-full text-right px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl text-xs font-extrabold flex items-center justify-between transition-colors border-t border-neutral-100 mt-1"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                        <span>حذف</span>
                                      </button>

                                    </div>
                                  )}
                                </div>

                              </div>

                              {/* Right Column: Doctor Info & Badges */}
                              <div className="flex items-center gap-4 text-right">
                                <div className="space-y-1">
                                  
                                  {/* Doctor Name & Compact Badges Row */}
                                  <div className="flex items-center gap-2 justify-end flex-wrap">
                                    <h4 className="font-black text-sm text-neutral-900">{doc.name}</h4>
                                  </div>

                                  {/* Clean, Small Badges directly below Doctor Name */}
                                  <div className="flex flex-wrap items-center gap-1.5 justify-end pt-0.5">
                                    
                                    {/* Status Badge */}
                                    {doc.approvalStatus === 'pending' && (
                                      <span className="text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        🟢 معلق
                                      </span>
                                    )}
                                    {doc.approvalStatus === 'rejected' && (
                                      <span className="text-[10px] font-black bg-red-100 text-red-800 border border-red-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        🔴 مرفوض
                                      </span>
                                    )}
                                    {(doc.approvalStatus === 'approved' || !doc.approvalStatus) && doc.isActiveSubscription && (
                                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        🟢 مقبول
                                      </span>
                                    )}
                                    {(doc.approvalStatus === 'approved' || !doc.approvalStatus) && !doc.isActiveSubscription && (
                                      <span className="text-[10px] font-black bg-neutral-100 text-neutral-800 border border-neutral-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        ⚫ موقوف
                                      </span>
                                    )}

                                    {/* Verification Badge */}
                                    {isVerified && (
                                      <span className="text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200/80 px-2 py-0.5 rounded-full flex items-center gap-1" title="حساب موثق">
                                        ⭐ موثق
                                      </span>
                                    )}

                                    {/* Package Badge (SINGLE badge display only) */}
                                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-800 border border-indigo-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      {subType === 'annual' ? '👑 الباقة السنوية' : '⏳ باقة 6 أشهر'}
                                    </span>

                                    {/* Expiration Date Badge */}
                                    <span 
                                      className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                                        !doc.isActiveSubscription || daysRemaining <= 0
                                          ? 'bg-red-100 text-red-800 border-red-300'
                                          : daysRemaining <= 15
                                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold'
                                          : daysRemaining <= 30
                                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      }`}
                                      title={`تاريخ انتهاء اشتراك الطبيب: ${expiryFormatted}`}
                                    >
                                      <span>⏰ الانتهاء: {expiryFormatted}</span>
                                      <span className="text-[9px] opacity-90">
                                        ({daysRemaining > 0 ? `متبقي ${daysRemaining} يوم` : 'منتهي'})
                                      </span>
                                    </span>

                                    {/* White Label Badge */}
                                    {isWhiteLabel && (
                                      <span className="text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200/80 px-2 py-0.5 rounded-full flex items-center gap-1" title="علامة المنصة مخفية">
                                        🏷 بدون علامة المنصة
                                      </span>
                                    )}

                                  </div>

                                  <p className="text-neutral-500 text-xs font-bold pt-0.5">{doc.jobTitle.split('-')[0]}</p>
                                  
                                  {/* Sub details row */}
                                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-neutral-400 font-semibold justify-end pt-0.5">
                                    <span>📧 {doc.email}</span>
                                    <span>📱 {doc.phone}</span>
                                    <span>📅 تسجل: {doc.registeredAt}</span>
                                    <span className="text-neutral-700 font-bold dir-ltr">⏰ الانتهاء: {expiryFormatted}</span>
                                  </div>

                                  {doc.approvalStatus === 'rejected' && doc.rejectionReason && (
                                    <div className="bg-red-50 text-red-800 p-2 rounded-xl text-[10px] font-bold border border-red-100 mt-2 text-right">
                                      ❌ سبب الرفض: {doc.rejectionReason}
                                    </div>
                                  )}
                                </div>

                                <img 
                                  src={doc.avatar} 
                                  alt={doc.name} 
                                  className="w-13 h-13 rounded-2xl object-cover border border-neutral-200 shrink-0 shadow-xs"
                                />
                              </div>

                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB: Doctor Dashboard Banners */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            
            {/* Header & Create Banner Button Card */}
            <div className="bg-gradient-to-l from-amber-500/10 via-amber-50/60 to-white p-6 md:p-8 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-right">
              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-end">
                  <span className="px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-full shadow-xs">
                    {currentBanners.filter(b => b.isActive).length} بنرات مفعلة
                  </span>
                  <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
                    <span>Banner لوحة الطبيب</span>
                    <Megaphone className="w-5 h-5 text-amber-600" />
                  </h2>
                </div>
                <p className="text-xs text-neutral-600 font-semibold max-w-2xl leading-relaxed">
                  أنشئ وإدارة البنرات الإعلانية والتنبيهية التي تظهر أعلى لوحة تحكم الطبيب للإعلان عن التحديثات، المميزات الجديدة، العروض والخصومات، أو إشعارات النظام.
                </p>
              </div>

              <button
                onClick={handleOpenAddBanner}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs rounded-2xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء Banner جديد</span>
              </button>
            </div>

            {/* Banners List */}
            {currentBanners.length === 0 ? (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-12 text-center space-y-3 shadow-xs">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
                  📢
                </div>
                <h4 className="font-extrabold text-sm text-neutral-800">لا توجد بنرات مضافة حالياً</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  قم بإنشاء أول بنر إعلاني ليظهر للأطباء أعلى لوحة التحكم الخاصة بهم.
                </p>
                <button
                  onClick={handleOpenAddBanner}
                  className="mt-2 px-4 py-2 bg-neutral-900 text-white font-extrabold text-xs rounded-xl shadow-xs"
                >
                  + إضافة بنر الآن
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentBanners
                  .sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return (a.priority || 0) - (b.priority || 0);
                  })
                  .map((b, idx) => {
                    const colorClasses = {
                      blue: 'border-blue-300 bg-blue-50/50 text-blue-900',
                      emerald: 'border-emerald-300 bg-emerald-50/50 text-emerald-900',
                      amber: 'border-amber-300 bg-amber-50/50 text-amber-900',
                      red: 'border-red-300 bg-red-50/50 text-red-900',
                      indigo: 'border-indigo-300 bg-indigo-50/50 text-indigo-900',
                      purple: 'border-purple-300 bg-purple-50/50 text-purple-900',
                    }[b.color || 'blue'];

                    const badgeColorClasses = {
                      blue: 'bg-blue-600 text-white',
                      emerald: 'bg-emerald-600 text-white',
                      amber: 'bg-amber-500 text-neutral-950 font-black',
                      red: 'bg-red-600 text-white',
                      indigo: 'bg-indigo-600 text-white',
                      purple: 'bg-purple-600 text-white',
                    }[b.color || 'blue'];

                    return (
                      <div 
                        key={b.id} 
                        className={`bg-white rounded-3xl border-2 p-6 shadow-sm hover:shadow-md transition-all space-y-4 text-right ${
                          b.isActive ? colorClasses.split(' ')[0] : 'border-neutral-200 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          
                          {/* Banner Info */}
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-xs ${badgeColorClasses}`}>
                              {b.imageUrl ? (
                                <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover rounded-2xl" />
                              ) : (
                                <span>
                                  {b.icon === 'crown' ? '👑' : b.icon === 'gift' ? '🎁' : b.icon === 'bell' ? '🔔' : b.icon === 'alert' ? '⚠️' : b.icon === 'star' ? '⭐' : '✨'}
                                </span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 justify-end">
                                {b.isPinned && (
                                  <span className="px-2.5 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-xs flex items-center gap-1">
                                    <Pin className="w-3 h-3" /> مثبت في الأعلى
                                  </span>
                                )}

                                <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${b.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-neutral-200 text-neutral-700'}`}>
                                  {b.isActive ? '🟢 مفعل' : '⚪ غير مفعل'}
                                </span>

                                <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-200 text-[10px] font-bold rounded-full">
                                  الأولوية: #{b.priority}
                                </span>

                                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded-full">
                                  🎯 المستهدفون: {
                                    b.targetAudience === 'all' ? 'جميع الأطباء' :
                                    b.targetAudience === 'annual' ? 'أطباء الباقة السنوية' :
                                    b.targetAudience === '6months' ? 'أطباء باقة 6 أشهر' :
                                    b.targetAudience === 'whitelabel_enabled' ? 'أطباء (إزالة العلامة التجارية - White Label)' :
                                    b.targetAudience === 'whitelabel_disabled' ? 'أطباء (المحتفظين بعلامة الحقوق في الفوتر)' :
                                    b.targetAudience === 'expiring_15_days' ? 'أطباء (ينتهي اشتراكهم خلال 15 يوم أو أقل)' :
                                    b.targetAudience === 'expiring_30_days' ? 'أطباء (ينتهي اشتراكهم خلال 30 يوم أو أقل)' :
                                    `أطباء محددون (${b.targetDoctorIds?.length || 0})`
                                  }
                                </span>
                              </div>

                              <h3 className="font-extrabold text-base text-neutral-900 pt-1">{b.title}</h3>
                              <p className="text-xs text-neutral-600 leading-relaxed font-semibold">{b.description}</p>

                              {(b.startDate || b.endDate || b.buttonText) && (
                                <div className="flex flex-wrap gap-3 text-[11px] text-neutral-500 font-bold pt-2 border-t border-neutral-100">
                                  {b.startDate && <span>📅 يبدأ: {b.startDate}</span>}
                                  {b.endDate && <span>⏳ ينتهي: {b.endDate}</span>}
                                  {b.buttonText && <span>🔘 الزر: "{b.buttonText}" ({b.buttonUrl || 'بدون رابط'})</span>}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Controls & Actions */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {/* Toggle Active */}
                            <button
                              onClick={() => handleToggleBannerActive(b.id)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                b.isActive ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {b.isActive ? 'إيقاف البنر' : 'تفعيل البنر'}
                            </button>

                            {/* Toggle Pin */}
                            <button
                              onClick={() => handleToggleBannerPinned(b.id)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                                b.isPinned ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                              }`}
                              title={b.isPinned ? 'إلغاء التثبيت' : 'تثبيت البنر في الأعلى'}
                            >
                              <Pin className="w-3.5 h-3.5" />
                              <span>{b.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}</span>
                            </button>

                            {/* Up / Down Priority */}
                            <button
                              onClick={() => handleMoveBannerPriority(b.id, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg disabled:opacity-30 cursor-pointer"
                              title="رفع الأولوية للأعلى"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveBannerPriority(b.id, 'down')}
                              disabled={idx === currentBanners.length - 1}
                              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg disabled:opacity-30 cursor-pointer"
                              title="تخفيض الأولوية للأسفل"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEditBanner(b)}
                              className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>تعديل</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteBanner(b.id)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer"
                              title="حذف البنر"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: Settings & specialties */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* Add Medical Specialty */}
            <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm text-right space-y-6">
              <h2 className="text-lg font-black text-black">إضافة تخصص طبي جديد للنظام</h2>
              
              <form onSubmit={handleAddSpecialty} className="flex flex-col sm:flex-row items-center gap-4 text-right">
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#10244A] hover:bg-[#091A3A] text-white font-extrabold text-xs rounded-full transition-all shadow-sm"
                >
                  إضافة التخصص الطبي
                </button>
                <input 
                  type="text" 
                  value={newSpecialtyName}
                  onChange={(e) => setNewSpecialtyName(e.target.value)}
                  placeholder="مثال: طب وجراحة الأورام"
                  className="flex-1 w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-full text-xs font-semibold text-black focus:outline-none focus:border-black transition-all text-right"
                />
              </form>
            </div>

            {/* List of active specialties */}
            <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm text-right">
              <h3 className="font-extrabold text-sm text-neutral-900 mb-4">التخصصات الطبية المعولمة حالياً في النظام</h3>
              <div className="flex flex-wrap gap-3 justify-start">
                {localSpecialties.map((spec) => (
                  <span 
                    key={spec.id}
                    className="px-4 py-2 bg-neutral-50 border border-neutral-200/60 rounded-full text-xs font-bold text-neutral-700 flex items-center gap-1"
                  >
                    🩺 {spec.name}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODAL 1: Rejection Reason Dialog */}
      {rejectionModalDocId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-neutral-200/80 max-w-lg w-full p-6 text-right shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <button 
                onClick={() => setRejectionModalDocId(null)}
                className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-black text-red-700 flex items-center gap-2">
                <span>⚠️</span> كتابة سبب رفض طلب انضمام الطبيب
              </h3>
            </div>

            <p className="text-xs font-semibold text-neutral-500 leading-relaxed">
              يرجى تحديد وكتابة سبب الرفض بدقة ووضوح. سيظهر هذا السبب مباشرة للطبيب داخل لوحة تحكمه الخاصة به فور دخوله ليتمكن من مراجعة بياناته، تعديلها، ثم إعادة إرسال الطلب للمراجعة والتدقيق مجدداً.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-700">سبب الرفض الموجه للطبيب:</label>
              <textarea
                rows={4}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="مثال: يرجى كتابة المؤهل العلمي بشكل كامل وإضافة رقم ترخيص مزاولة المهنة ليتسنى لنا تفعيل الحساب."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white transition-all text-right"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setRejectionModalDocId(null)}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-extrabold rounded-xl transition-colors"
              >
                إلغاء التراجع
              </button>
              <button
                onClick={handleSaveRejection}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-colors shadow-sm"
              >
                حفظ سبب الرفض ورفض الطبيب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Comprehensive Doctor Data Editing Form */}
      {editingDoctorId && editFormData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-neutral-200/80 max-w-2xl w-full p-6 text-right shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <button 
                onClick={() => { setEditingDoctorId(null); setEditFormData(null); }}
                className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-black text-[#10244A] flex items-center gap-2">
                🩺 مراجعة وتعديل بيانات الطبيب واشتراكه
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field 1: Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">الاسم بالكامل:</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 2: Job Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">المسمى الوظيفي والدرجة العلمية:</label>
                <input
                  type="text"
                  value={editFormData.jobTitle}
                  onChange={(e) => setEditFormData({ ...editFormData, jobTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 3: Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 4: Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">رقم الهاتف الأساسي:</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 5: Whatsapp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">رقم الواتساب:</label>
                <input
                  type="text"
                  value={editFormData.whatsapp || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 6: Specialty */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">التخصص الطبي الرئيسي:</label>
                <input
                  type="text"
                  value={editFormData.specialty}
                  onChange={(e) => setEditFormData({ ...editFormData, specialty: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 7: Subscription type dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">باقة الاشتراك المعتمدة:</label>
                <select
                  value={editFormData.subscriptionType}
                  onChange={(e) => {
                    const type = e.target.value as '6months' | 'annual';
                    setEditFormData({
                      ...editFormData,
                      subscriptionType: type,
                      isVerified: true
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                >
                  <option value="annual">الباقة السنوية (سنة كاملة) 👑</option>
                  <option value="6months">باقة 6 أشهر ⏳</option>
                </select>
              </div>

              {/* Field 9: White Label */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">إزالة العلامة التجارية (White Label):</label>
                <select
                  value={editFormData.whiteLabel ? 'true' : 'false'}
                  onChange={(e) => setEditFormData({ ...editFormData, whiteLabel: e.target.value === 'true' })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-purple-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                >
                  <option value="true">✓ إزالة شعار ورابط المنصة (White Label نشط)</option>
                  <option value="false">✘ إظهار شعار المنصة في فوتر بروفايل الطبيب</option>
                </select>
              </div>

              {/* Field 10: Subscription Active */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">حالة نشاط الاشتراك الإداري:</label>
                <select
                  value={editFormData.isActiveSubscription ? 'true' : 'false'}
                  onChange={(e) => setEditFormData({ ...editFormData, isActiveSubscription: e.target.value === 'true' })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                >
                  <option value="true">🟢 نشط وصالح للتشغيل الفوري</option>
                  <option value="false">🔴 موقوف / منتهي الصلاحية</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100">
              <button
                onClick={() => { setEditingDoctorId(null); setEditFormData(null); }}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-extrabold rounded-xl transition-colors"
              >
                تراجع وإلغاء
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2.5 bg-[#10244A] hover:bg-[#091A3A] text-white text-xs font-black rounded-xl transition-colors shadow-sm"
              >
                حفظ التغييرات الجديدة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Doctor Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-neutral-200/80 max-w-2xl w-full p-6 text-right shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <button 
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-black text-[#10244A] flex items-center gap-2">
                <span>📢</span>
                <span>{editingBannerId ? 'تعديل Banner لوحة الطبيب' : 'إنشاء Banner جديد للوحة الطبيب'}</span>
              </h3>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              {/* Field 1: Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">عنوان البنر <span className="text-red-500">*</span>:</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="مثال: 🎉 ميزة جديدة: نظام الحجوزات المتقدم عبر الواتساب!"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 2: Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">وصف مختصر للبنر:</label>
                <textarea
                  rows={3}
                  value={bannerDesc}
                  onChange={(e) => setBannerDesc(e.target.value)}
                  placeholder="مثال: يمكنك الآن إضافة وتعيين سكرتيرة لعيادتك مع تحديد الصلاحيات ومتابعة التقارير اليومية..."
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 3: Color Theme & Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-neutral-700">لون البنر (الثيم):</label>
                  <select
                    value={bannerColor}
                    onChange={(e) => setBannerColor(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                  >
                    <option value="blue">🔵 أزرق (تحديثات ومميزات)</option>
                    <option value="emerald">🟢 أخضر (نجاح وعروض)</option>
                    <option value="amber">🟡 أصفر (تنبيهات وترقيات)</option>
                    <option value="red">🔴 أحمر (مهم جداً وعاجل)</option>
                    <option value="indigo">🟣 نيلي (إحصائيات وتقارير)</option>
                    <option value="purple">🟪 بنفسجي (مميزات حصرية)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-neutral-700">أيقونة البنر السريعة:</label>
                  <select
                    value={bannerIcon}
                    onChange={(e) => setBannerIcon(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                  >
                    <option value="sparkles">✨ نجوم وتحديثات (Sparkles)</option>
                    <option value="crown">👑 باقة بريميوم (Crown)</option>
                    <option value="bell">🔔 تنبيه وإشعار (Bell)</option>
                    <option value="gift">🎁 عرض وهدية (Gift)</option>
                    <option value="alert">⚠️ تحذير مهم (Alert)</option>
                    <option value="star">⭐ تميز وتقييم (Star)</option>
                  </select>
                </div>
              </div>

              {/* Field 4: Image input */}
              <ImageInputWithUpload
                label="صورة مخصصة للبنر (اختياري - تتجاوز الأيقونة السريعة):"
                value={bannerImageUrl}
                onChange={(val) => setBannerImageUrl(val)}
                placeholder="رابط صورة للبنر أو ارفع صورة..."
              />

              {/* Field 5: Button Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-neutral-700">نص الزر (اختياري):</label>
                  <input
                    type="text"
                    value={bannerButtonText}
                    onChange={(e) => setBannerButtonText(e.target.value)}
                    placeholder="مثال: استعراض المميزات"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-neutral-700">رابط الزر (قسم لوحة الطبيب أو رابط خارجي):</label>
                  <input
                    type="text"
                    value={bannerButtonUrl}
                    onChange={(e) => setBannerButtonUrl(e.target.value)}
                    placeholder="مثال: #secretaries أو #account أو https://..."
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                  />
                </div>
              </div>

              {/* Field 6: Start Date & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-neutral-700">تاريخ بداية الظهور (اختياري):</label>
                  <input
                    type="date"
                    value={bannerStartDate}
                    onChange={(e) => setBannerStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-neutral-700">تاريخ انتهاء الظهور (اختياري):</label>
                  <input
                    type="date"
                    value={bannerEndDate}
                    onChange={(e) => setBannerEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                  />
                </div>
              </div>

              {/* Field 7: Target Audience */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-neutral-700">المستهدفون من البنر (Target Audience):</label>
                <select
                  value={bannerTargetAudience}
                  onChange={(e) => setBannerTargetAudience(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                >
                  <option value="all">👥 جميع الأطباء بالمنصة</option>
                  <option value="annual">👑 أطباء الباقة السنوية فقط</option>
                  <option value="6months">⏳ أطباء باقة الـ 6 شهور فقط</option>
                  <option value="whitelabel_enabled">🏷️ الأطباء المفعّل لديهم إزالة العلامة التجارية (White Label)</option>
                  <option value="whitelabel_disabled">🛡️ الأطباء المحتفظين بعلامة الحقوق في الفوتر (بدون White Label)</option>
                  <option value="expiring_15_days">⚠️ الأطباء المتبقي على انتهاء اشتراكهم 15 يوماً أو أقل</option>
                  <option value="expiring_30_days">⏳ الأطباء المتبقي على انتهاء اشتراكهم 30 يوماً أو أقل</option>
                  <option value="specific_doctors">🎯 أطباء محددين باختيار أسماء الأطباء</option>
                </select>

                {/* Specific Doctors Checklist */}
                {bannerTargetAudience === 'specific_doctors' && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2 max-h-48 overflow-y-auto text-right">
                    <span className="text-xs font-bold text-neutral-700 block">اختر الأطباء المستهدفين بالبنر:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {doctors.map(doc => {
                        const isChecked = bannerTargetDoctorIds.includes(doc.id);
                        return (
                          <label key={doc.id} className="flex items-center gap-2 text-xs font-semibold text-neutral-800 cursor-pointer p-1.5 rounded-lg hover:bg-neutral-100">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBannerTargetDoctorIds([...bannerTargetDoctorIds, doc.id]);
                                } else {
                                  setBannerTargetDoctorIds(bannerTargetDoctorIds.filter(id => id !== doc.id));
                                }
                              }}
                              className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
                            />
                            <img src={doc.avatar} alt={doc.name} className="w-6 h-6 rounded-full object-cover border" />
                            <span className="truncate">{doc.name} ({doc.subscriptionType === 'annual' ? 'سنوي' : '6 أشهر'})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Field 8: Options (Active, Pinned, Priority) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-extrabold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerIsActive}
                    onChange={(e) => setBannerIsActive(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>🟢 البنر مفعل حالياً</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-extrabold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerIsPinned}
                    onChange={(e) => setBannerIsPinned(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>📌 تثبيت في أعلى القائمة</span>
                </label>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-600">رقم الأولوية (Priority):</label>
                  <input
                    type="number"
                    min={1}
                    value={bannerPriority}
                    onChange={(e) => setBannerPriority(Number(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-extrabold rounded-xl transition-colors"
                >
                  إلغاء التراجع
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-black rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ وإضافة البنر</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
