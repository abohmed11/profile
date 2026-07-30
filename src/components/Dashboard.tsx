/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Doctor, Appointment, Branch, WorkingHour, INITIAL_SPECIALTIES, DEFAULT_DOCTOR_FEATURES, DoctorCertificate, GalleryItem, Service, Review, Secretary, SecretaryPermissions, DoctorBanner, getDoctorDaysRemaining } from '../types';
import { 
  LogOut, Eye, User, Sparkles, LayoutDashboard, Settings, Upload, 
  Trash2, CheckCircle2, Save, Phone, Mail, Award, FileText,
  Building2, Calendar, Globe, AlertCircle, Camera, Clock,
  Plus, Edit3, MapPin, DollarSign, X, Check, Copy, Share2,
  Facebook, Instagram, Linkedin, Twitter, Youtube, ExternalLink,
  MessageSquare, Send, Link2, MessageCircle, Star, Video, Image as ImageIcon,
  ToggleLeft, ToggleRight, Search, XCircle, Filter, Download, TrendingUp, BarChart2,
  Users, UserCheck, ShieldCheck, Lock, UserPlus, Menu
} from 'lucide-react';

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.87 2.89 2.89 0 0 1-2.89-2.87 2.89 2.89 0 0 1 2.89-2.88c.28 0 .55.04.81.12v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.7a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.76 1.5v-3.4a4.84 4.84 0 0 1-1-.46z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.35-.01-1.02-.2-1.52-.37-.62-.2-1.11-.31-1.07-.65.02-.18.27-.36.75-.55 2.94-1.28 4.9-2.12 5.88-2.53 2.8-1.16 3.38-1.36 3.76-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

interface DashboardProps {
  doctor: Doctor;
  loggedSecretary?: Secretary | null;
  userRole?: 'admin' | 'doctor' | 'secretary' | null;
  appointments: Appointment[];
  banners?: DoctorBanner[];
  onUpdateDoctor: (updatedDoc: Doctor) => void;
  onUpdateAppointments: (updatedApts: Appointment[]) => void;
  onLogout: () => void;
  onPreviewPublicSite: (username: string) => void;
}

const getTwoWordName = (fullName: string) => {
  if (!fullName) return 'دكتور';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  if (['د.', 'دكتور', 'دكتورة', 'أ.د', 'أ.د.', 'استشاري', 'استشارية', 'د'].includes(parts[0])) {
    return parts.slice(0, 3).join(' ');
  }
  return parts.slice(0, 2).join(' ');
};

const DEFAULT_WEEK_DAYS = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
];

export default function Dashboard({ 
  doctor, 
  loggedSecretary,
  userRole,
  appointments, 
  banners,
  onUpdateDoctor, 
  onUpdateAppointments, 
  onLogout, 
  onPreviewPublicSite 
}: DashboardProps) {

  // Helper to calculate initial allowed tab for secretary or doctor
  const getInitialTab = (): 'account' | 'bookings' | 'secretaries' | 'services' | 'gallery' | 'videos' | 'certificates' | 'reviews' | 'schedules' | 'contact' => {
    if (!loggedSecretary) return 'account';
    if (loggedSecretary.permissions?.viewAppointments !== false) return 'bookings';
    if (loggedSecretary.permissions?.manageServices) return 'services';
    if (loggedSecretary.permissions?.manageGallery) return 'gallery';
    if (loggedSecretary.permissions?.manageVideos) return 'videos';
    if (loggedSecretary.permissions?.manageCertificates) return 'certificates';
    if (loggedSecretary.permissions?.managePatients) return 'reviews';
    if (loggedSecretary.permissions?.manageClinics) return 'schedules';
    if (loggedSecretary.permissions?.sendWhatsapp) return 'contact';
    return 'bookings';
  };

  // Active section tab
  const [activeTab, setActiveTab] = useState<
    'account' | 'bookings' | 'secretaries' | 'services' | 'gallery' | 'videos' | 'certificates' | 'reviews' | 'schedules' | 'contact'
  >(getInitialTab());

  // Mobile navigation drawer toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Banner dismiss state
  const [dismissedBannerIds, setDismissedBannerIds] = useState<string[]>([]);

  useEffect(() => {
    if (loggedSecretary) {
      if (activeTab === 'account' || activeTab === 'secretaries') {
        setActiveTab(getInitialTab());
      } else if (activeTab === 'schedules') {
        if (!loggedSecretary.permissions?.manageClinics) {
          setActiveTab(getInitialTab());
        }
      } else if (activeTab === 'contact') {
        if (!loggedSecretary.permissions?.sendWhatsapp) {
          setActiveTab(getInitialTab());
        }
      } else if (activeTab === 'services') {
        if (!loggedSecretary.permissions?.manageServices) setActiveTab(getInitialTab());
      } else if (activeTab === 'gallery') {
        if (!loggedSecretary.permissions?.manageGallery) setActiveTab(getInitialTab());
      } else if (activeTab === 'videos') {
        if (!loggedSecretary.permissions?.manageVideos) setActiveTab(getInitialTab());
      } else if (activeTab === 'certificates') {
        if (!loggedSecretary.permissions?.manageCertificates) setActiveTab(getInitialTab());
      } else if (activeTab === 'reviews') {
        if (!loggedSecretary.permissions?.managePatients) setActiveTab(getInitialTab());
      } else if (activeTab === 'bookings') {
        if (loggedSecretary.permissions?.viewAppointments === false) {
          setActiveTab(getInitialTab());
        }
      }
    }
  }, [loggedSecretary, activeTab]);

  // --- Booking Requests Filters & Handlers ---
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');
  const [bookingBranchFilter, setBookingBranchFilter] = useState<string>(
    loggedSecretary && loggedSecretary.branchId ? loggedSecretary.branchId : 'all'
  );

  const doctorAppointments = appointments.filter(apt => apt.doctorId === doctor.id);
  const pendingBookingsCount = doctorAppointments.filter(apt => apt.status === 'pending').length;
  const approvedBookingsCount = doctorAppointments.filter(apt => apt.status === 'approved').length;
  const rejectedBookingsCount = doctorAppointments.filter(apt => apt.status === 'rejected').length;

  const filteredBookings = doctorAppointments.filter(apt => {
    if (bookingStatusFilter !== 'all' && apt.status !== bookingStatusFilter) return false;
    if (bookingBranchFilter !== 'all' && apt.branchId !== bookingBranchFilter) return false;
    if (bookingSearchTerm.trim()) {
      const term = bookingSearchTerm.trim().toLowerCase();
      const nameMatch = apt.patientName?.toLowerCase().includes(term);
      const phoneMatch = apt.patientPhone?.includes(term);
      const dateMatch = apt.date?.includes(term);
      if (!nameMatch && !phoneMatch && !dateMatch) return false;
    }
    return true;
  });

  const handleUpdateAppointmentStatus = (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    const updated = appointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt);
    onUpdateAppointments(updated);
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف طلب الحجز هذا؟')) {
      const updated = appointments.filter(apt => apt.id !== id);
      onUpdateAppointments(updated);
    }
  };

  const handleSendWhatsAppConfirmation = (apt: Appointment) => {
    const targetPhone = apt.whatsappNumber || apt.patientPhone || '';
    let cleanPhone = targetPhone.replace(/[\s\+\-]/g, '');
    if (cleanPhone.startsWith('01') && cleanPhone.length === 11) {
      cleanPhone = '2' + cleanPhone;
    } else if (cleanPhone.startsWith('00')) {
      cleanPhone = cleanPhone.substring(2);
    }

    const branchObj = formData.branches?.find(b => b.id === apt.branchId);
    const branchName = branchObj ? branchObj.name : '';

    const msg = `السلام عليكم أ./ ${apt.patientName} 🌷\n\nتم تأكيد حجز حضرتك عند د. ${formData.name}. ✅\n\n📅 التاريخ: ${apt.date}\n🕒 الميعاد: ${apt.time}${branchName ? `\n🏥 الفرع: ${branchName}` : ''}\n\nنتمنى لحضرتك دوام الصحة والعافية. 🌹`;
    
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleDownloadBookingsReport = () => {
    if (doctorAppointments.length === 0) {
      alert('لا توجد بيانات مواعيد لتحميلها حالياً.');
      return;
    }

    const BOM = "\uFEFF";
    const headers = ['اسم المريض', 'رقم الهاتف', 'رقم الواتساب', 'التاريخ', 'الوقت', 'العيادة / الفرع', 'حالة الحجز', 'تاريخ الطلب', 'ملاحظات المريض'];
    
    const rows = doctorAppointments.map(apt => {
      const branchObj = formData.branches?.find(b => b.id === apt.branchId);
      const statusText = apt.status === 'approved' ? 'مؤكد' : apt.status === 'rejected' ? 'ملغى' : 'قيد الانتظار';
      
      return [
        `"${(apt.patientName || '').replace(/"/g, '""')}"`,
        `"${(apt.patientPhone || '').replace(/"/g, '""')}"`,
        `"${(apt.whatsappNumber || apt.patientPhone || '').replace(/"/g, '""')}"`,
        `"${(apt.date || '').replace(/"/g, '""')}"`,
        `"${(apt.time || '').replace(/"/g, '""')}"`,
        `"${((branchObj ? branchObj.name : 'الفرع الرئيسي') || '').replace(/"/g, '""')}"`,
        `"${statusText}"`,
        `"${apt.createdAt ? new Date(apt.createdAt).toLocaleDateString('ar-EG') : '-'}"`,
        `"${(apt.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = BOM + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_احصائيات_حجوزات_${formData.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Profile Content Form States & Edit States ---
  // 1. Services
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');
  const [newServiceImage, setNewServiceImage] = useState('');

  // 2. Gallery
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');

  // 3. Videos
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(null);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // 4. Certificates
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertImage, setNewCertImage] = useState('');

  // 5. Patient Reviews
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewAvatar, setNewReviewAvatar] = useState('');

  // --- Image Upload Handlers ---
  const handleServiceImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewServiceImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGalleryImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewGalleryImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCertImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewCertImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleReviewAvatarUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewReviewAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  // --- Section Action Handlers ---
  // Services
  const handleEditServiceStart = (srv: Service) => {
    setEditingServiceId(srv.id);
    setNewServiceName(srv.name || '');
    setNewServiceDesc(srv.description || '');
    setNewServicePrice(srv.price !== undefined ? String(srv.price) : '');
    setNewServiceDuration(srv.duration || '');
    setNewServiceImage(srv.imageUrl || '');
  };

  const handleCancelEditService = () => {
    setEditingServiceId(null);
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServicePrice('');
    setNewServiceDuration('');
    setNewServiceImage('');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    if (editingServiceId) {
      setFormData(prev => ({
        ...prev,
        services: (prev.services || []).map(s => s.id === editingServiceId ? {
          ...s,
          name: newServiceName.trim(),
          description: newServiceDesc.trim(),
          price: newServicePrice ? parseFloat(newServicePrice) : undefined,
          duration: newServiceDuration.trim() || undefined,
          imageUrl: newServiceImage || undefined
        } : s)
      }));
      setEditingServiceId(null);
    } else {
      const srv: Service = {
        id: `srv-${Date.now()}`,
        name: newServiceName.trim(),
        description: newServiceDesc.trim(),
        price: newServicePrice ? parseFloat(newServicePrice) : undefined,
        duration: newServiceDuration.trim() || undefined,
        imageUrl: newServiceImage || undefined
      };
      setFormData(prev => ({
        ...prev,
        services: [...(prev.services || []), srv]
      }));
    }
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServicePrice('');
    setNewServiceDuration('');
    setNewServiceImage('');
    setSavedSuccess(false);
  };

  const handleDeleteService = (id: string) => {
    if (editingServiceId === id) {
      handleCancelEditService();
    }
    setFormData(prev => ({
      ...prev,
      services: (prev.services || []).filter(s => s.id !== id)
    }));
    setSavedSuccess(false);
  };

  // Gallery
  const handleEditGalleryStart = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setNewGalleryTitle(item.title || '');
    setNewGalleryImage(item.imageUrl || '');
  };

  const handleCancelEditGallery = () => {
    setEditingGalleryId(null);
    setNewGalleryTitle('');
    setNewGalleryImage('');
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryImage) return;

    if (editingGalleryId) {
      setFormData(prev => ({
        ...prev,
        galleryItems: (prev.galleryItems || []).map(g => g.id === editingGalleryId ? {
          ...g,
          title: newGalleryTitle.trim() || 'صورة العيادة',
          imageUrl: newGalleryImage
        } : g),
        gallery: (prev.gallery || []).map((img, idx) => (prev.galleryItems || [])[idx]?.id === editingGalleryId ? newGalleryImage : img)
      }));
      setEditingGalleryId(null);
    } else {
      const item: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: newGalleryTitle.trim() || 'صورة العيادة',
        imageUrl: newGalleryImage
      };
      setFormData(prev => ({
        ...prev,
        galleryItems: [...(prev.galleryItems || []), item],
        gallery: [...(prev.gallery || []), newGalleryImage]
      }));
    }
    setNewGalleryTitle('');
    setNewGalleryImage('');
    setSavedSuccess(false);
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (editingGalleryId === id) {
      handleCancelEditGallery();
    }
    setFormData(prev => ({
      ...prev,
      galleryItems: (prev.galleryItems || []).filter(g => g.id !== id),
      gallery: (prev.gallery || []).filter((_, idx) => (prev.galleryItems || [])[idx]?.id !== id)
    }));
    setSavedSuccess(false);
  };

  const handleToggleGallery = () => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...(prev.features || DEFAULT_DOCTOR_FEATURES),
        photoGallery: !(prev.features?.photoGallery ?? true)
      }
    }));
    setSavedSuccess(false);
  };

  // Videos
  const handleEditVideoStart = (index: number, vUrl: string) => {
    setEditingVideoIndex(index);
    setNewVideoUrl(vUrl);
  };

  const handleCancelEditVideo = () => {
    setEditingVideoIndex(null);
    setNewVideoUrl('');
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;

    if (editingVideoIndex !== null) {
      setFormData(prev => ({
        ...prev,
        videos: (prev.videos || []).map((v, i) => i === editingVideoIndex ? newVideoUrl.trim() : v)
      }));
      setEditingVideoIndex(null);
    } else {
      setFormData(prev => ({
        ...prev,
        videos: [...(prev.videos || []), newVideoUrl.trim()]
      }));
    }
    setNewVideoUrl('');
    setSavedSuccess(false);
  };

  const handleDeleteVideo = (index: number) => {
    if (editingVideoIndex === index) {
      handleCancelEditVideo();
    }
    setFormData(prev => ({
      ...prev,
      videos: (prev.videos || []).filter((_, i) => i !== index)
    }));
    setSavedSuccess(false);
  };

  const handleToggleVideos = () => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...(prev.features || DEFAULT_DOCTOR_FEATURES),
        videosSection: !(prev.features?.videosSection ?? true)
      }
    }));
    setSavedSuccess(false);
  };

  // Certificates
  const handleEditCertificateStart = (cert: DoctorCertificate) => {
    setEditingCertId(cert.id);
    setNewCertTitle(cert.title || '');
    setNewCertImage(cert.imageUrl || '');
  };

  const handleCancelEditCert = () => {
    setEditingCertId(null);
    setNewCertTitle('');
    setNewCertImage('');
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertImage) return;

    if (editingCertId) {
      setFormData(prev => ({
        ...prev,
        certificates: (prev.certificates || []).map(c => typeof c !== 'string' && c.id === editingCertId ? {
          ...c,
          title: newCertTitle.trim(),
          imageUrl: newCertImage
        } : c)
      }));
      setEditingCertId(null);
    } else {
      const cert: DoctorCertificate = {
        id: `cert-${Date.now()}`,
        title: newCertTitle.trim(),
        imageUrl: newCertImage
      };
      setFormData(prev => ({
        ...prev,
        certificates: [...(prev.certificates || []), cert]
      }));
    }
    setNewCertTitle('');
    setNewCertImage('');
    setSavedSuccess(false);
  };

  const handleDeleteCertificate = (id: string) => {
    if (editingCertId === id) {
      handleCancelEditCert();
    }
    setFormData(prev => ({
      ...prev,
      certificates: (prev.certificates || []).filter(c => typeof c === 'string' ? true : c.id !== id)
    }));
    setSavedSuccess(false);
  };

  const handleToggleCertificates = () => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...(prev.features || DEFAULT_DOCTOR_FEATURES),
        addCertificates: !(prev.features?.addCertificates ?? true)
      }
    }));
    setSavedSuccess(false);
  };

  const handleToggleServices = () => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...(prev.features || DEFAULT_DOCTOR_FEATURES),
        servicesAndPrices: !(prev.features?.servicesAndPrices ?? true)
      }
    }));
    setSavedSuccess(false);
  };

  const handleToggleReviews = () => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...(prev.features || DEFAULT_DOCTOR_FEATURES),
        patientReviews: !(prev.features?.patientReviews ?? true)
      }
    }));
    setSavedSuccess(false);
  };

  // Patient Reviews
  const handleEditReviewStart = (rev: Review) => {
    setEditingReviewId(rev.id);
    setNewReviewName(rev.patientName || '');
    setNewReviewComment(rev.comment || '');
    setNewReviewRating(rev.rating || 5);
    setNewReviewAvatar(rev.avatar || '');
  };

  const handleCancelEditReview = () => {
    setEditingReviewId(null);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setNewReviewAvatar('');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    if (editingReviewId) {
      setFormData(prev => ({
        ...prev,
        reviews: (prev.reviews || []).map(r => r.id === editingReviewId ? {
          ...r,
          patientName: newReviewName.trim(),
          comment: newReviewComment.trim(),
          rating: newReviewRating,
          avatar: newReviewAvatar || undefined
        } : r)
      }));
      setEditingReviewId(null);
    } else {
      const rev: Review = {
        id: `rev-${Date.now()}`,
        patientName: newReviewName.trim(),
        comment: newReviewComment.trim(),
        rating: newReviewRating,
        avatar: newReviewAvatar || undefined,
        date: new Date().toISOString().split('T')[0]
      };
      setFormData(prev => ({
        ...prev,
        reviews: [...(prev.reviews || []), rev]
      }));
    }
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setNewReviewAvatar('');
    setSavedSuccess(false);
  };

  const handleDeleteReview = (id: string) => {
    if (editingReviewId === id) {
      handleCancelEditReview();
    }
    setFormData(prev => ({
      ...prev,
      reviews: (prev.reviews || []).filter(r => r.id !== id)
    }));
    setSavedSuccess(false);
  };

  // Form State initialized with Doctor props
  const [formData, setFormData] = useState<Doctor>({
    ...doctor,
    branches: doctor.branches || [],
    secretaries: doctor.secretaries && doctor.secretaries.length > 0 ? doctor.secretaries : [
      {
        id: 'sec-1',
        name: 'سارة أحمد',
        email: 'sara@clinic.com',
        phone: '01012345678',
        status: 'active',
        permissions: {
          viewAppointments: true,
          confirmAppointments: true,
          rejectAppointments: true,
          sendWhatsapp: true,
          editAppointments: true,
          managePatients: true,
          manageClinics: false,
          manageServices: false,
          manageGallery: false,
          manageVideos: false,
          manageCertificates: false,
        }
      },
      {
        id: 'sec-2',
        name: 'منى محمد',
        email: 'mona@clinic.com',
        phone: '01198765432',
        status: 'active',
        permissions: {
          viewAppointments: true,
          confirmAppointments: true,
          rejectAppointments: true,
          sendWhatsapp: true,
          editAppointments: true,
          managePatients: true,
          manageClinics: false,
          manageServices: false,
          manageGallery: false,
          manageVideos: false,
          manageCertificates: false,
        }
      }
    ],
    socials: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
      tiktok: '',
      snapchat: '',
      telegram: '',
      website: '',
      ...(doctor.socials || {})
    }
  });
  
  // Keep local formData in sync if the doctor prop changes from the parent
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...doctor,
      branches: doctor.branches || prev.branches || [],
      socials: {
        ...(prev.socials || {}),
        ...(doctor.socials || {})
      },
      features: {
        ...(prev.features || DEFAULT_DOCTOR_FEATURES),
        ...(doctor.features || {})
      }
    }));
  }, [doctor]);

  // --- Secretary Management Modal State & Handlers ---
  const [isSecretaryModalOpen, setIsSecretaryModalOpen] = useState(false);
  const [editingSecretaryId, setEditingSecretaryId] = useState<string | null>(null);

  const [secName, setSecName] = useState('');
  const [secEmail, setSecEmail] = useState('');
  const [secPhone, setSecPhone] = useState('');
  const [secPassword, setSecPassword] = useState('');
  const [secBranchId, setSecBranchId] = useState('all');
  const [secStatus, setSecStatus] = useState<'active' | 'inactive'>('active');
  const [secPermissions, setSecPermissions] = useState<SecretaryPermissions>({
    viewAppointments: true,
    confirmAppointments: true,
    rejectAppointments: true,
    sendWhatsapp: true,
    editAppointments: true,
    managePatients: true,
    manageClinics: false,
    manageServices: false,
    manageGallery: false,
    manageVideos: false,
    manageCertificates: false,
  });

  const handleOpenAddSecretary = () => {
    setEditingSecretaryId(null);
    setSecName('');
    setSecEmail('');
    setSecPhone('');
    setSecPassword('');
    setSecBranchId('all');
    setSecStatus('active');
    setSecPermissions({
      viewAppointments: true,
      confirmAppointments: true,
      rejectAppointments: true,
      sendWhatsapp: true,
      editAppointments: true,
      managePatients: true,
      manageClinics: false,
      manageServices: false,
      manageGallery: false,
      manageVideos: false,
      manageCertificates: false,
    });
    setIsSecretaryModalOpen(true);
  };

  const handleOpenEditSecretary = (sec: Secretary) => {
    setEditingSecretaryId(sec.id);
    setSecName(sec.name || '');
    setSecEmail(sec.email || '');
    setSecPhone(sec.phone || '');
    setSecPassword(sec.password || '');
    setSecBranchId(sec.branchId || 'all');
    setSecStatus(sec.status || 'active');
    setSecPermissions(sec.permissions || {
      viewAppointments: true,
      confirmAppointments: true,
      rejectAppointments: true,
      sendWhatsapp: true,
      editAppointments: true,
      managePatients: true,
      manageClinics: false,
      manageServices: false,
      manageGallery: false,
      manageVideos: false,
      manageCertificates: false,
    });
    setIsSecretaryModalOpen(true);
  };

  const handleSaveSecretary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secName.trim() || !secPhone.trim()) {
      alert('يرجى كتابة الاسم ورقم الموبايل للسكرتيرة.');
      return;
    }

    const newSecretary: Secretary = {
      id: editingSecretaryId || `sec-${Date.now()}`,
      name: secName.trim(),
      email: secEmail.trim(),
      phone: secPhone.trim(),
      password: secPassword.trim() || undefined,
      branchId: secBranchId === 'all' ? undefined : secBranchId,
      status: secStatus,
      permissions: secPermissions,
      createdAt: new Date().toISOString()
    };

    let updatedSecretaries: Secretary[] = [];
    const currentSecretaries = formData.secretaries || [];
    if (editingSecretaryId) {
      updatedSecretaries = currentSecretaries.map(s => s.id === editingSecretaryId ? newSecretary : s);
    } else {
      updatedSecretaries = [...currentSecretaries, newSecretary];
    }

    const updatedDoc = {
      ...formData,
      secretaries: updatedSecretaries
    };

    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setIsSecretaryModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDeleteSecretary = (secId: string) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذه السكرتيرة؟')) {
      const currentSecretaries = formData.secretaries || [];
      const updatedSecretaries = currentSecretaries.filter(s => s.id !== secId);
      const updatedDoc = {
        ...formData,
        secretaries: updatedSecretaries
      };
      setFormData(updatedDoc);
      onUpdateDoctor(updatedDoc);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Helper handler for Social Media Links
  const handleSocialChange = (key: keyof Doctor['socials'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: {
        ...(prev.socials || {}),
        [key]: value
      }
    }));
    setSavedSuccess(false);
  };

  // Helper handler for Branch Google Maps Location URLs
  const handleBranchMapUrlChange = (branchId: string, mapUrl: string) => {
    setFormData(prev => ({
      ...prev,
      branches: (prev.branches || []).map(b => b.id === branchId ? { ...b, mapUrl } : b)
    }));
    setSavedSuccess(false);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerAvatarInputRef = useRef<HTMLInputElement>(null);

  const handleHeaderAvatarUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        headerAvatar: reader.result as string
      }));
      setSavedSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveHeaderAvatar = () => {
    setFormData(prev => ({
      ...prev,
      headerAvatar: undefined
    }));
    setSavedSuccess(false);
  };

  // --- Clinic / Branch Modal State ---
  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [clinicPrice, setClinicPrice] = useState('');
  const [clinicMapUrl, setClinicMapUrl] = useState('');
  const [clinicSummaryHours, setClinicSummaryHours] = useState('');
  const [clinicSchedule, setClinicSchedule] = useState<WorkingHour[]>(() => 
    DEFAULT_WEEK_DAYS.map(day => ({
      day,
      isAvailable: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].includes(day),
      start: '04:00 مساءً',
      end: '09:00 مساءً'
    }))
  );

  // Handle Text Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) || 0 : value
    }));
    setSavedSuccess(false);
  };

  // Handle Image File Upload (Convert to Data URL)
  const handleImageUpload = (file: File) => {
    setUploadError(null);
    
    // Validate File Type
    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى اختيار ملف صورة صالحة (PNG, JPG, WEBP, GIF)');
      return;
    }

    // Validate File Size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 5 ميجابايت');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormData(prev => ({
          ...prev,
          avatar: result
        }));
        setSavedSuccess(false);
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      setUploadError('حدث خطأ أثناء قراءة ملف الصورة. يرجى المحاولة مرة أخرى.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // File Input Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  // Remove Photo
  const handleRemoveAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar: ''
    }));
    setSavedSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Save Changes
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateDoctor(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  // --- Clinic Management Actions ---
  const handleOpenAddClinic = () => {
    setEditingBranchId(null);
    setClinicName('');
    setClinicAddress('');
    setClinicPhone(formData.phone || '');
    setClinicPrice('');
    setClinicMapUrl('');
    setClinicSummaryHours('السبت إلى الخميس: 4 عصراً - 9 مساءً');
    setClinicSchedule(
      DEFAULT_WEEK_DAYS.map(day => ({
        day,
        isAvailable: day !== 'الجمعة',
        start: '04:00 مساءً',
        end: '09:00 مساءً'
      }))
    );
    setIsClinicModalOpen(true);
  };

  const handleOpenEditClinic = (branch: Branch) => {
    setEditingBranchId(branch.id);
    setClinicName(branch.name || '');
    setClinicAddress(branch.address || '');
    setClinicPhone(branch.phone || '');
    setClinicPrice(branch.price ? String(branch.price) : '');
    setClinicMapUrl(branch.mapUrl || '');
    setClinicSummaryHours(branch.workingHours || '');
    
    // Prepare Schedule
    if (branch.workingHoursList && branch.workingHoursList.length > 0) {
      // Map existing or complete missing days
      const existingMap = new Map(branch.workingHoursList.map(item => [item.day, item]));
      const fullList = DEFAULT_WEEK_DAYS.map(day => {
        if (existingMap.has(day)) {
          return existingMap.get(day)!;
        }
        return {
          day,
          isAvailable: false,
          start: '04:00 مساءً',
          end: '09:00 مساءً'
        };
      });
      setClinicSchedule(fullList);
    } else {
      setClinicSchedule(
        DEFAULT_WEEK_DAYS.map(day => ({
          day,
          isAvailable: true,
          start: '04:00 مساءً',
          end: '09:00 مساءً'
        }))
      );
    }

    setIsClinicModalOpen(true);
  };

  const handleSaveClinic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName.trim()) return;

    const newBranch: Branch = {
      id: editingBranchId || `branch-${Date.now()}`,
      name: clinicName.trim(),
      address: clinicAddress.trim(),
      phone: clinicPhone.trim(),
      price: clinicPrice.trim(),
      mapUrl: clinicMapUrl.trim(),
      workingHours: clinicSummaryHours.trim(),
      workingHoursList: clinicSchedule
    };

    let updatedBranches: Branch[] = [];
    if (editingBranchId) {
      updatedBranches = formData.branches.map(b => b.id === editingBranchId ? newBranch : b);
    } else {
      updatedBranches = [...formData.branches, newBranch];
    }

    const updatedDoc = {
      ...formData,
      branches: updatedBranches
    };

    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setIsClinicModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDeleteClinic = (branchId: string) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذه العيادة ومواعيدها؟')) {
      const updatedBranches = formData.branches.filter(b => b.id !== branchId);
      const updatedDoc = {
        ...formData,
        branches: updatedBranches
      };
      setFormData(updatedDoc);
      onUpdateDoctor(updatedDoc);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  const handleDayToggle = (index: number) => {
    setClinicSchedule(prev => prev.map((item, i) => i === index ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  const handleDayTimeChange = (index: number, field: 'start' | 'end', value: string) => {
    setClinicSchedule(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  return (
    <div className="min-h-screen bg-[#060c18] text-slate-100 font-sans dir-rtl selection:bg-blue-600 selection:text-white pb-20">
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#0a152b]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 shadow-xl">
        
        <div className="flex items-center justify-between">
          {/* Right side: Branding & Doctor Quick Info (Logo / Avatar & Name) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-md shrink-0">
              {formData.avatar ? (
                <img 
                  src={formData.avatar} 
                  alt={formData.name} 
                  className="w-full h-full object-cover rounded-[10px]"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-white leading-tight flex items-center gap-1.5 sm:gap-2">
                <span>{formData.name || 'دكتور بروفايل'}</span>
                {loggedSecretary ? (
                  <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="hidden sm:inline">جلسة سكرتارية:</span>
                    <span className="text-white font-black">{loggedSecretary.name}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                    لوحة التحكم
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {loggedSecretary ? `عيادة: ${formData.name}` : (formData.jobTitle || 'إدارة البروفايل الطبي')}
              </p>
            </div>
          </div>

          {/* Left side: Actions & Mobile Hamburger Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => onPreviewPublicSite(formData.nameEn)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-blue-500/25 cursor-pointer"
              title="معاينة البروفايل"
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline">معاينة البروفايل</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>

            {/* Mobile Hamburger Menu Toggle Button (3 شرط فوق بعض) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-blue-400 hover:text-white rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              aria-label="قائمة الأقسام"
              title="الأقسام"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-rose-400" />
              ) : (
                <Menu className="w-5 h-5 text-blue-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3.5 pt-3.5 border-t border-slate-800/80 space-y-3.5 animate-fadeIn max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>أقسام لوحة التحكم (اختر القسم):</span>
              </span>
              <button 
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg"
              >
                <X className="w-3.5 h-3.5 text-rose-400" />
                <span>إغلاق</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
              {/* Group 1: الإدارة والحجوزات */}
              {!loggedSecretary && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('account'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'account'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>إعدادات الحساب</span>
                  </div>
                </button>
              )}

              {(!loggedSecretary || loggedSecretary.permissions?.viewAppointments !== false) && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('bookings'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'bookings'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>طلبات الحجز</span>
                  </div>
                  {pendingBookingsCount > 0 ? (
                    <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black animate-pulse">
                      {pendingBookingsCount} جديد
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                      {doctorAppointments.length}
                    </span>
                  )}
                </button>
              )}

              {!loggedSecretary && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('secretaries'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'secretaries'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>إدارة السكرتارية</span>
                  </div>
                  {formData.secretaries && formData.secretaries.length > 0 && (
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-extrabold">
                      {formData.secretaries.length}
                    </span>
                  )}
                </button>
              )}

              {/* Group 2: أقسام البروفايل الطبي */}
              {(!loggedSecretary || loggedSecretary.permissions?.manageServices) && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('services'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'services'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>الخدمات الطبية</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                    {formData.services?.length || 0}
                  </span>
                </button>
              )}

              {(!loggedSecretary || loggedSecretary.permissions?.manageGallery) && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('gallery'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'gallery'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>معرض الصور</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                    {formData.galleryItems?.length || 0}
                  </span>
                </button>
              )}

              {(!loggedSecretary || loggedSecretary.permissions?.manageVideos) && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('videos'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'videos'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>مكتبة الفيديوهات</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                    {formData.videos?.length || 0}
                  </span>
                </button>
              )}

              {(!loggedSecretary || loggedSecretary.permissions?.manageCertificates) && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('certificates'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'certificates'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>الشهادات والاعتمادات</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                    {formData.certificates?.length || 0}
                  </span>
                </button>
              )}

              {(!loggedSecretary || !!loggedSecretary.permissions?.managePatients) && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('reviews'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>آراء وتقييمات المرضى</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                    {formData.reviews?.length || 0}
                  </span>
                </button>
              )}

              {/* Group 3: المواعيد والتواصل */}
              {(!loggedSecretary || !!loggedSecretary.permissions?.manageClinics) && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('schedules'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'schedules'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>المواعيد والعيادات</span>
                  </div>
                  {formData.branches.length > 0 && (
                    <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-extrabold">
                      {formData.branches.length}
                    </span>
                  )}
                </button>
              )}

              {(!loggedSecretary || !!loggedSecretary.permissions?.sendWhatsapp) && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('contact'); setIsMobileMenuOpen(false); }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === 'contact'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>التواصل والروابط</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* DOCTOR DASHBOARD TOP BANNERS */}
        {(() => {
          const activeBanners = (banners || []).filter(banner => {
            if (!banner.isActive) return false;
            if (dismissedBannerIds.includes(banner.id)) return false;
            
            const today = new Date().toISOString().slice(0, 10);
            if (banner.startDate && today < banner.startDate) return false;
            if (banner.endDate && today > banner.endDate) return false;

            const docSub = doctor.subscriptionType || 'annual';
            const isWL = !!doctor.whiteLabel;
            const daysRemaining = getDoctorDaysRemaining(doctor);

            if (banner.targetAudience === 'annual' && docSub !== 'annual') return false;
            if (banner.targetAudience === '6months' && docSub !== '6months') return false;
            if (banner.targetAudience === 'whitelabel_enabled' && !isWL) return false;
            if (banner.targetAudience === 'whitelabel_disabled' && isWL) return false;
            if (banner.targetAudience === 'expiring_15_days' && daysRemaining > 15) return false;
            if (banner.targetAudience === 'expiring_30_days' && daysRemaining > 30) return false;
            if (banner.targetAudience === 'specific_doctors') {
              if (!banner.targetDoctorIds || !banner.targetDoctorIds.includes(doctor.id)) return false;
            }

            return true;
          }).sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return (a.priority || 0) - (b.priority || 0);
          });

          if (activeBanners.length === 0) return null;

          return (
            <div className="mb-6 space-y-3">
              {activeBanners.map(banner => {
                const bgGradients = {
                  blue: 'from-blue-900/90 via-blue-950/80 to-slate-900 border-blue-500/50 text-blue-100',
                  emerald: 'from-emerald-900/90 via-emerald-950/80 to-slate-900 border-emerald-500/50 text-emerald-100',
                  amber: 'from-amber-900/90 via-amber-950/80 to-slate-900 border-amber-500/50 text-amber-100',
                  red: 'from-red-900/90 via-red-950/80 to-slate-900 border-red-500/50 text-red-100',
                  indigo: 'from-indigo-900/90 via-indigo-950/80 to-slate-900 border-indigo-500/50 text-indigo-100',
                  purple: 'from-purple-900/90 via-purple-950/80 to-slate-900 border-purple-500/50 text-purple-100',
                }[banner.color || 'blue'];

                const buttonColors = {
                  blue: 'bg-blue-500 hover:bg-blue-400 text-white',
                  emerald: 'bg-emerald-500 hover:bg-emerald-400 text-white',
                  amber: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black',
                  red: 'bg-red-500 hover:bg-red-400 text-white',
                  indigo: 'bg-indigo-500 hover:bg-indigo-400 text-white',
                  purple: 'bg-purple-500 hover:bg-purple-400 text-white',
                }[banner.color || 'blue'];

                return (
                  <div
                    key={banner.id}
                    className={`relative p-5 sm:p-6 rounded-3xl border bg-gradient-to-r ${bgGradients} shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-right transition-all animate-in fade-in slide-in-from-top-2 duration-300`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {banner.imageUrl ? (
                          <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          <span>
                            {banner.icon === 'crown' ? '👑' : banner.icon === 'gift' ? '🎁' : banner.icon === 'bell' ? '🔔' : banner.icon === 'alert' ? '⚠️' : banner.icon === 'star' ? '⭐' : '✨'}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 pr-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-sm sm:text-base text-white">{banner.title}</h3>
                          {banner.isPinned && (
                            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-black">
                              📌 إعلان هـام
                            </span>
                          )}
                        </div>
                        {banner.description && (
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold max-w-3xl">
                            {banner.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0">
                      {banner.buttonText && (
                        <a
                          href={banner.buttonUrl || '#'}
                          onClick={(e) => {
                            if (banner.buttonUrl && banner.buttonUrl.startsWith('#')) {
                              e.preventDefault();
                              const tab = banner.buttonUrl.replace('#', '') as any;
                              setActiveTab(tab);
                            }
                          }}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${buttonColors}`}
                        >
                          <span>{banner.buttonText}</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setDismissedBannerIds(prev => [...prev, banner.id])}
                        className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                        title="إخفاء البنر"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Main Dashboard Layout with Side Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Vertical Sidebar Navigation (Desktop only) */}
          <aside className="hidden lg:block lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-5 lg:sticky lg:top-24">
            
            {/* Group 1: الإدارة والحجوزات */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 flex items-center gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
                <span>الإدارة والحجوزات</span>
              </h4>

              <div className="space-y-1">
                {!loggedSecretary && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('account')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'account'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Settings className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>إعدادات الحساب</span>
                    </div>
                  </button>
                )}

                {(!loggedSecretary || loggedSecretary.permissions?.viewAppointments !== false) && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'bookings'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>طلبات الحجز</span>
                    </div>
                    {pendingBookingsCount > 0 ? (
                      <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black animate-pulse">
                        {pendingBookingsCount} جديد
                      </span>
                    ) : (
                      <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                        {doctorAppointments.length}
                      </span>
                    )}
                  </button>
                )}

                {!loggedSecretary && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('secretaries')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'secretaries'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>إدارة السكرتارية</span>
                    </div>
                    {formData.secretaries && formData.secretaries.length > 0 && (
                      <span className="text-[11px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-extrabold">
                        {formData.secretaries.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            <hr className="border-slate-800/80" />

            {/* Group 2: أقسام البروفايل الطبي (Separated individual sections) */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>محتوى البروفايل الطبي</span>
              </h4>

              <div className="space-y-1">
                {(!loggedSecretary || loggedSecretary.permissions?.manageServices) && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('services')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'services'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>الخدمات الطبية</span>
                    </div>
                    <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                      {formData.services?.length || 0}
                    </span>
                  </button>
                )}

                {(!loggedSecretary || loggedSecretary.permissions?.manageGallery) && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('gallery')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'gallery'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>معرض الصور</span>
                    </div>
                    <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                      {formData.galleryItems?.length || 0}
                    </span>
                  </button>
                )}

                {(!loggedSecretary || loggedSecretary.permissions?.manageVideos) && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('videos')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'videos'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Video className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>مكتبة الفيديوهات</span>
                    </div>
                    <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                      {formData.videos?.length || 0}
                    </span>
                  </button>
                )}

                {(!loggedSecretary || loggedSecretary.permissions?.manageCertificates) && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('certificates')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'certificates'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>الشهادات والاعتمادات</span>
                    </div>
                    <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                      {formData.certificates?.length || 0}
                    </span>
                  </button>
                )}

                {(!loggedSecretary || !!loggedSecretary.permissions?.managePatients) && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'reviews'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Star className="w-4 h-4 text-yellow-400 shrink-0" />
                      <span>آراء وتقييمات المرضى</span>
                    </div>
                    <span className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-full font-extrabold">
                      {formData.reviews?.length || 0}
                    </span>
                  </button>
                )}
              </div>
            </div>

            <hr className="border-slate-800/80" />

            {/* Group 3: المواعيد والتواصل */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>المواعيد والتواصل</span>
              </h4>

              <div className="space-y-1">
                {(!loggedSecretary || !!loggedSecretary.permissions?.manageClinics) && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('schedules')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'schedules'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>المواعيد والعيادات</span>
                    </div>
                    {formData.branches.length > 0 && (
                      <span className="text-[11px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-extrabold">
                        {formData.branches.length}
                      </span>
                    )}
                  </button>
                )}

                {(!loggedSecretary || !!loggedSecretary.permissions?.sendWhatsapp) && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      activeTab === 'contact'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>التواصل والروابط</span>
                    </div>
                  </button>
                )}
              </div>
            </div>

          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-6">

        {/* Global Success Notification */}
        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center gap-3 animate-fadeIn shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>تم حفظ جميع التغييرات والبيانات بنجاح!</span>
          </div>
        )}

        {/* Rejected Account Alert */}
        {formData.approvalStatus === 'rejected' && (
          <div className="mb-6 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/35 text-right space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-rose-300">⚠️ تم رفض طلب انضمامك وتنشيط حسابك من قبل الإدارة</h3>
                <p className="text-neutral-400 text-xs font-semibold mt-0.5">يمكنك مراجعة السبب الموضح أدناه، وتعديل بيانات ملفك وإعادة إرسال الطلب للمراجعة والتدقيق فورا.</p>
              </div>
            </div>
            
            {formData.rejectionReason && (
              <div className="bg-rose-950/25 border border-rose-500/20 p-4 rounded-2xl">
                <span className="block text-xs font-black text-rose-400 mb-1">سبب الرفض الموضح من الإدارة:</span>
                <p className="text-xs font-semibold text-neutral-300 leading-relaxed">{formData.rejectionReason}</p>
              </div>
            )}

            <div className="flex items-center justify-start gap-3">
              <button
                type="button"
                onClick={() => {
                  const updatedDoc = {
                    ...formData,
                    approvalStatus: 'pending' as const
                  };
                  setFormData(updatedDoc);
                  onUpdateDoctor(updatedDoc);
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 4000);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
              >
                🔄 تعديل وإعادة إرسال طلب المراجعة الآن
              </button>
            </div>
          </div>
        )}

        {/* Pending Account Alert */}
        {formData.approvalStatus === 'pending' && (
          <div className="mb-6 p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-right flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-amber-300">📝 حسابك قيد المراجعة والتدقيق والتوثيق حالياً</h3>
                <p className="text-neutral-400 text-xs font-semibold">تتم الآن مراجعة بيانات ملفك المهني واشتراكك من قبل الإدارة لتفعيل الحساب بالكامل على المنصة.</p>
              </div>
            </div>
            <span className="hidden md:inline-block text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-black animate-pulse">
              انتظار المراجعة
            </span>
          </div>
        )}

        {/* Suspended Account Alert */}
        {formData.approvalStatus === 'suspended' && (
          <div className="mb-6 p-5 rounded-3xl bg-red-600/10 border border-red-500/30 text-right flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 text-red-400 rounded-xl shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-red-300">🚫 تم إيقاف حسابك مؤقتاً من قبل الإدارة</h3>
                <p className="text-neutral-400 text-xs font-semibold">حسابك معطل مؤقتاً حالياً. يرجى التواصل مع الدعم الفني للمنصة لمعرفة التفاصيل وتنشيط اشتراكك.</p>
              </div>
            </div>
            <span className="hidden md:inline-block text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full font-black">
              حساب موقوف
            </span>
          </div>
        )}

        {/* 1. ACCOUNT SETTINGS SECTION */}
        {activeTab === 'account' && !loggedSecretary && (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-slate-900/40 border border-blue-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5 mb-1.5">
                  <User className="w-6 h-6 text-blue-400" />
                  <span>إعدادات الحساب والبيانات الشخصية</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  تعديل معلوماتك الأساسية، الصورة الشخصية، التخصص، والبيانات العامة للظهور في صفحتك العامة.
                </p>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer shrink-0"
              >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </button>
            </div>

            {/* SECTION 1: PROFILE PICTURE UPLOAD */}
            <div className="bg-[#0b172e] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                <span>صورة البروفايل الشخصية</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6">
                ارفع صورتك الشخصية أو شعار العيادة للظهور في أعلى البروفايل وفي كرت المشاركة.
              </p>

              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                
                {/* Current Image Preview */}
                <div className="relative group shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden bg-slate-900 border-2 border-blue-500/40 shadow-2xl flex items-center justify-center relative">
                    {formData.avatar ? (
                      <img 
                        src={formData.avatar} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                        <User className="w-12 h-12 stroke-[1.5] mb-1" />
                        <span className="text-[11px] font-medium">لا توجد صورة</span>
                      </div>
                    )}

                    {/* Overlay Effect */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                    >
                      <Upload className="w-7 h-7 mb-1" />
                      <span className="text-xs font-bold">تغيير الصورة</span>
                    </div>
                  </div>
                </div>

                {/* File Upload Drop Area */}
                <div className="flex-1 w-full">
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-900/50 hover:bg-slate-900 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/jpg, image/webp" 
                      className="hidden" 
                    />

                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white mb-1">
                        اضغط لرفع صورة من جهازك أو اسحب الصورة هنا
                      </p>
                      <p className="text-xs text-slate-400">
                        يدعم صيغ JPG, PNG, WEBP (الحد الأقصى 5 ميجابايت)
                      </p>
                    </div>

                    {isUploading && (
                      <span className="text-xs text-blue-400 font-bold animate-pulse mt-1">
                        جاري رفع ومعالجة الصورة...
                      </span>
                    )}
                  </div>

                  {/* Actions & Errors */}
                  {uploadError && (
                    <div className="mt-3 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>اختيار صورة جديدة</span>
                    </button>

                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>حذف الصورة</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            </div>

            {/* SECTION: HEADER LOGO AND SHORT NAME */}
            <div className="bg-[#0b172e] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">
                    شعار الهيدر العلوي (الصورة والاسم الثنائي)
                  </h3>
                </div>
                <span className="text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full w-fit">
                  يظهر في أعلى صفحة البروفايل
                </span>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                تخصيص الشعار والاسم المختصر الظاهر في الشريط العلوي الثابت بصفحة الطبيب العامة.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left Column: Input for Header Two-Word Name */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-200">
                      الاسم الثنائي / اللقب المختصر في الهيدر
                    </label>
                    <input
                      type="text"
                      name="headerDisplayName"
                      value={formData.headerDisplayName || ''}
                      onChange={handleChange}
                      placeholder={`الافتراضي: ${getTwoWordName(formData.name || 'د. محمد جابر')}`}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                    <p className="text-[11px] text-slate-400">
                      اتركه فارغاً للاعتماد تلقائياً على الاسم الثنائي المشتق من اسمك بالكامل.
                    </p>
                  </div>

                  {/* Header Avatar Upload or Fallback */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs sm:text-sm font-bold text-slate-200">
                      صورة الشريط العلوي (اختياري)
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        ref={headerAvatarInputRef}
                        onChange={(e) => e.target.files?.[0] && handleHeaderAvatarUpload(e.target.files[0])}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => headerAvatarInputRef.current?.click()}
                        className="px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-4 h-4" />
                        <span>رفع صورة خاصة للهيدر</span>
                      </button>
                      {formData.headerAvatar && (
                        <button
                          type="button"
                          onClick={handleRemoveHeaderAvatar}
                          className="px-3.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>استخدام صورة البروفايل</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Header Preview Box */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    معاينة حية للشريط العلوي:
                  </label>
                  <div className="bg-[#10244A] border border-white/20 rounded-2xl p-3.5 shadow-lg flex items-center justify-between">
                    {/* Header Logo Preview */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 shadow-xs shrink-0 bg-white/10 flex items-center justify-center">
                        {formData.headerAvatar || formData.avatar ? (
                          <img 
                            src={formData.headerAvatar || formData.avatar} 
                            alt="Header Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white/80" />
                        )}
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-extrabold text-xs sm:text-sm text-white leading-tight">
                          {formData.headerDisplayName || getTwoWordName(formData.name || 'د. محمد جابر')}
                        </span>
                      </div>
                    </div>

                    {/* Dummy Nav Links for Preview */}
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-white/80">
                      <span className="bg-white text-[#10244A] px-2 py-0.5 rounded-md">الرئيسية</span>
                      <span>الخدمات</span>
                      <span>معرض الصور</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: BASIC PERSONAL INFORMATION */}
            <div className="bg-[#0b172e] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                <User className="w-5 h-5 text-blue-400" />
                <span>البيانات الشخصية والمهنية</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    الاسم بالكامل (بالعربية) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="مثال: د. محمد جابر السعدني"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Personal Link / Username (nameEn) */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    رابط البروفايل (اسم المستخدم بالإنجليزية) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nameEn"
                      value={formData.nameEn}
                      onChange={handleChange}
                      required
                      dir="ltr"
                      placeholder="mohamed-jaber"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left"
                    />
                  </div>
                  <div className="text-[11px] font-semibold text-blue-400 flex items-center gap-1.5 pt-0.5" dir="ltr">
                    <Globe className="w-3.5 h-3.5" />
                    <span>dr-profile.com/dr/{formData.nameEn || 'your-name'}</span>
                  </div>
                </div>

                {/* Primary Specialty */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    التخصص الرئيسي <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    {INITIAL_SPECIALTIES.map(spec => (
                      <option key={spec.id} value={spec.id} className="bg-slate-900 text-white">
                        {spec.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Years of Experience */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    سنوات الخبرة
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience || 0}
                      onChange={handleChange}
                      min="0"
                      max="60"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Job Title / Scientific Title */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    اللقب العلمي والتخصص الدقيق
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="مثال: استشاري زراعة وتجميل الأسنان - زميل الجمعية الألمانية"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

              </div>
            </div>

            {/* SECTION 3: CONTACT INFORMATION */}
            <div className="bg-[#0b172e] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>بيانات التواصل والاتصال</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    رقم الهاتف للاتصال <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    dir="ltr"
                    placeholder="01012345678"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-right"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    رقم الواتساب <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    dir="ltr"
                    placeholder="201012345678"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-right"
                  />
                  <p className="text-[11px] text-slate-400">
                    ضع كود الدولة بدون علامه + (مثال: 201012345678)
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    البريد الإلكتروني <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    dir="ltr"
                    placeholder="doctor@example.com"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left"
                  />
                </div>

              </div>
            </div>

            {/* SECTION 4: BIOGRAPHY AND QUALIFICATIONS */}
            <div className="bg-[#0b172e] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>نبذة تعريفية ومؤهلات عن الطبيب</span>
              </h3>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-slate-300">
                  نبذة عنك (تظهر في قسم "من نحن" بالبروفايل)
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="اكتب نبذة مختصرة عن مؤهلاتك العلمية، خبراتك الطبية، وأبرز الخدمات التي تقدمها للمرضى..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all leading-relaxed resize-y"
                />
              </div>
            </div>

            {/* SAVE BUTTON BOTTOM BAR */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات الآن</span>
              </button>
            </div>

          </form>
        )}

        {/* 2. BOOKING REQUESTS SECTION (قسم طلبات الحجز) */}
        {activeTab === 'bookings' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Banner Header */}
            <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-slate-900/40 border border-blue-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5 mb-1.5">
                  <Calendar className="w-6 h-6 text-emerald-400" />
                  <span>إدارة طلبات الحجز والمواعيد</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  متابعة وتأكيد كافة طلبات الحجز الواردة من المرضى، التواصل عبر الواتساب لتاكيد الحجز ، وإدارة حالة المواعيد بكل سهولة.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-2xl text-emerald-300 text-xs font-bold shrink-0">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{pendingBookingsCount} طلب جديد بانتظار التأكيد</span>
              </div>
            </div>

            {/* Monthly Statistics & File Download Card (إحصائيات الشهر وتحميل الملف) */}
            <div className="bg-[#0b172e] border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">إحصائيات الشهر وتحميل الملف</h3>
                  </div>
                  <p className="text-slate-400 text-xs">
                    متابعة مؤشرات أداء العيادة وتنزيل سجل الحجوزات بصيغة CSV توافق Excel.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadBookingsReport}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-emerald-400/30"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل ملف إحصائيات المواعيد (CSV)</span>
                </button>
              </div>

              {/* Monthly Numbers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block">إجمالي حجز الشهر الحالي</span>
                  <div className="text-xl sm:text-2xl font-black text-white">{doctorAppointments.length} موعد</div>
                  <span className="text-[10px] text-emerald-400 font-semibold">موزعة على كافة الفروع</span>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 block">الحجوزات المؤكدة</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">{approvedBookingsCount} موعد</div>
                  <span className="text-[10px] text-slate-400 font-semibold">جاهز للاستقبال</span>
                </div>
              </div>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Total Requests */}
              <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">إجمالي الطلبات</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{doctorAppointments.length}</div>
                <div className="text-[11px] text-slate-400">جميع الطلبات الواردة</div>
              </div>

              {/* Pending Requests */}
              <div className="p-5 bg-slate-900/90 border border-amber-500/30 rounded-2xl space-y-2 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">قيد الانتظار</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{pendingBookingsCount}</div>
                <div className="text-[11px] text-amber-300/80">تحتاج اتخاذ إجراء أو تأكيد</div>
              </div>

              {/* Approved Bookings */}
              <div className="p-5 bg-slate-900/90 border border-emerald-500/30 rounded-2xl space-y-2 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">الحجوزات المؤكدة</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">{approvedBookingsCount}</div>
                <div className="text-[11px] text-emerald-300/80">تم الموافقة والتأكيد عليها</div>
              </div>

              {/* Rejected / Cancelled */}
              <div className="p-5 bg-slate-900/90 border border-red-500/30 rounded-2xl space-y-2 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-300">الملغاة / المرفوضة</span>
                  <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                    <XCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-red-400">{rejectedBookingsCount}</div>
                <div className="text-[11px] text-red-300/80">مواعيد تم الاعتذار عنها</div>
              </div>
            </div>

            {/* Filter & Control Bar */}
            <div className="p-6 bg-[#0b172e] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearchTerm}
                    onChange={(e) => setBookingSearchTerm(e.target.value)}
                    placeholder="ابحث باسم المريض أو رقم الهاتف أو التاريخ..."
                    className="w-full pr-10 pl-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  {bookingSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setBookingSearchTerm('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Branch Filter if multiple branches */}
                {formData.branches.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={bookingBranchFilter}
                      onChange={(e) => setBookingBranchFilter(e.target.value)}
                      className="px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">جميع الفروع والعيادات</option>
                      {formData.branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                )}

              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setBookingStatusFilter('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    bookingStatusFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  الكل ({doctorAppointments.length})
                </button>

                <button
                  type="button"
                  onClick={() => setBookingStatusFilter('pending')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    bookingStatusFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-amber-300 hover:text-amber-200 border border-slate-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>قيد الانتظار ({pendingBookingsCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingStatusFilter('approved')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    bookingStatusFilter === 'approved'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 text-emerald-400 hover:text-emerald-300 border border-slate-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>مؤكدة ({approvedBookingsCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingStatusFilter('rejected')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    bookingStatusFilter === 'rejected'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-900 text-red-400 hover:text-red-300 border border-slate-800'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>ملغاة / مرفوضة ({rejectedBookingsCount})</span>
                </button>
              </div>
            </div>

            {/* Bookings List Cards */}
            {filteredBookings.length === 0 ? (
              <div className="p-10 bg-[#0b172e] border border-slate-800 rounded-3xl text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">لا توجد طلبات حجز حالياً في هذا القسم</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                    {bookingSearchTerm 
                      ? 'لم نجد أي نتائج تطابق عملية البحث الخاصة بك.' 
                      : 'عندما يقوم المرضى بتقديم طلبات حجز عبر رابط بروفايلك الطبي، ستظهر كافة بياناتهم هنا مباشرة لتأكيدها.'}
                  </p>
                </div>
                {bookingSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setBookingSearchTerm('')}
                    className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-xl"
                  >
                    إلغاء البحث
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((apt) => {
                  const branchObj = formData.branches?.find(b => b.id === apt.branchId);
                  const serviceObj = formData.services?.find(s => s.id === apt.serviceId);

                  return (
                    <div 
                      key={apt.id} 
                      className={`p-6 bg-[#0b172e] border rounded-3xl space-y-5 transition-all shadow-xl hover:border-slate-700 ${
                        apt.status === 'pending'
                          ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-[#0b172e] to-[#0b172e]'
                          : apt.status === 'approved'
                          ? 'border-emerald-500/30'
                          : 'border-slate-800 opacity-80'
                      }`}
                    >
                      {/* Top Row: Patient Name & Status Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                            {apt.patientName ? apt.patientName.charAt(0) : 'م'}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                              <span>{apt.patientName}</span>
                            </h4>
                            <div className="flex items-center gap-3 pt-1 text-xs text-slate-300 flex-wrap">
                              <a 
                                href={`tel:${apt.patientPhone}`} 
                                className="flex items-center gap-1 hover:text-blue-400 font-semibold"
                                dir="ltr"
                              >
                                <Phone className="w-3.5 h-3.5 text-blue-400" />
                                <span>{apt.patientPhone}</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 self-start sm:self-auto">
                          {apt.status === 'pending' && (
                            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1.5 animate-pulse">
                              <Clock className="w-3.5 h-3.5" />
                              <span>بانتظار التأكيد (قيد الانتظار)</span>
                            </span>
                          )}
                          {apt.status === 'approved' && (
                            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تم تأكيد الحجز (مؤكد)</span>
                            </span>
                          )}
                          {apt.status === 'rejected' && (
                            <span className="px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-black flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>حجز ملغى / مرفوض</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                        <div>
                          <span className="text-slate-400 block mb-0.5">📅 الموعد المطلوب:</span>
                          <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                            <span>{apt.date} • {apt.time}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block mb-0.5">🏥 الفرع / العيادة:</span>
                          <span className="font-bold text-slate-200 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span>{branchObj ? branchObj.name : 'الفرع الرئيسي'}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block mb-0.5">🕒 تم استلام الطلب:</span>
                          <span className="font-bold text-amber-300 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>
                              {apt.createdAt
                                ? (isNaN(new Date(apt.createdAt).getTime())
                                    ? apt.createdAt
                                    : new Date(apt.createdAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }))
                                : 'تاريخ غير مدون'}
                            </span>
                          </span>
                        </div>

                        {apt.notes && (
                          <div className="sm:col-span-2 md:col-span-3 pt-2 border-t border-slate-800/80">
                            <span className="text-slate-400 block mb-0.5">📝 ملاحظات المريض:</span>
                            <p className="text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 italic">
                              "{apt.notes}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Approve Button */}
                          {apt.status !== 'approved' && (!loggedSecretary || loggedSecretary.permissions?.confirmAppointments !== false) && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'approved')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>تأكيد الحجز</span>
                            </button>
                          )}

                          {/* Reject / Cancel Button */}
                          {apt.status !== 'rejected' && (!loggedSecretary || loggedSecretary.permissions?.rejectAppointments !== false) && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'rejected')}
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>رفض الطلب</span>
                            </button>
                          )}

                          {/* Re-open Pending Button */}
                          {apt.status !== 'pending' && (!loggedSecretary || loggedSecretary.permissions?.confirmAppointments !== false) && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'pending')}
                              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                              إعادة لقيد الانتظار
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Send WhatsApp confirmation */}
                          {(!loggedSecretary || loggedSecretary.permissions?.sendWhatsapp !== false) && (
                            <button
                              type="button"
                              onClick={() => handleSendWhatsAppConfirmation(apt)}
                              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                              <span>تأكيد الحجز عبر واتساب</span>
                            </button>
                          )}

                          {/* Delete Request */}
                          {(!loggedSecretary || loggedSecretary.permissions?.rejectAppointments !== false) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAppointment(apt.id)}
                              className="p-2 bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 rounded-xl transition-all cursor-pointer"
                              title="حذف الطلب"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* 2.5 SECRETARIES MANAGEMENT SECTION (قسم إدارة السكرتارية) */}
        {activeTab === 'secretaries' && !loggedSecretary && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900/80 to-slate-900/40 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5 mb-1.5">
                  <Users className="w-6 h-6 text-indigo-400" />
                  <span>👥 إدارة السكرتارية</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  إضافة وإدارة السكرتيرات المساعدات وتحديد صلاحيات كل سكرتيرة على حدة للتحكم في اللوحة وإدارة العيادات والحجوزات.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddSecretary}
                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <UserPlus className="w-5 h-5" />
                <span>إضافة سكرتيرة جديدة</span>
              </button>
            </div>

            {/* Table Container */}
            <div className="bg-[#0b172e] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  <span>قائمة السكرتارية المعتمدة ({formData.secretaries?.length || 0})</span>
                </h3>
              </div>

              {(!formData.secretaries || formData.secretaries.length === 0) ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">لا توجد سكرتيرة مضافة حالياً</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                      اضغط على زر "إضافة سكرتيرة جديدة" للبدء في إضافة المساعدات وتخصيص صلاحياتهن.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddSecretary}
                    className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-xl hover:bg-indigo-600/30 transition-all"
                  >
                    ➕ إضافة سكرتيرة
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs font-bold">
                        <th className="p-4 sm:px-6">الاسم</th>
                        <th className="p-4 sm:px-6">رقم الموبايل / التواصل</th>
                        <th className="p-4 sm:px-6">الصلاحية</th>
                        <th className="p-4 sm:px-6">الحالة</th>
                        <th className="p-4 sm:px-6 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm font-semibold">
                      {formData.secretaries.map((sec) => {
                        const activePermsCount = sec.permissions 
                          ? Object.values(sec.permissions).filter(Boolean).length 
                          : 0;
                        const branchObj = formData.branches?.find(b => b.id === sec.branchId);

                        return (
                          <tr key={sec.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-4 sm:px-6 font-bold text-white">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-black">
                                  {sec.name ? sec.name.charAt(0) : 'س'}
                                </div>
                                <div>
                                  <div className="text-slate-100 font-extrabold">{sec.name}</div>
                                  {sec.email && (
                                    <div className="text-[11px] text-slate-400 font-normal">{sec.email}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 sm:px-6 dir-ltr text-right font-bold text-indigo-300">
                              <a href={`tel:${sec.phone}`} className="hover:underline flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{sec.phone}</span>
                              </a>
                            </td>
                            <td className="p-4 sm:px-6">
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
                                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>سكرتيرة</span>
                                  <span className="text-[10px] bg-indigo-500/30 px-1.5 py-0.5 rounded-md font-extrabold text-indigo-200">
                                    ({activePermsCount} صلاحية)
                                  </span>
                                </span>
                                {branchObj && (
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Building2 className="w-3 h-3 text-cyan-400" />
                                    <span>فرع: {branchObj.name}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 sm:px-6">
                              {sec.status === 'active' ? (
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs inline-flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                  <span>نشطة</span>
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-black text-xs inline-flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                  <span>موقوفة</span>
                                </span>
                              )}
                            </td>
                            <td className="p-4 sm:px-6 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditSecretary(sec)}
                                  className="p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl transition-all cursor-pointer"
                                  title="تعديل البيانات والصلاحيات"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSecretary(sec.id)}
                                  className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl transition-all cursor-pointer"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* PROFILE CONTENT SECTIONS (الخدمات - المعرض - الفيديوهات - الشهادات - آراء المرضى) */}
        {(activeTab === 'content' || activeTab === 'services' || activeTab === 'gallery' || activeTab === 'videos' || activeTab === 'certificates' || activeTab === 'reviews') && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* Top Header Banner */}
            <div className="bg-gradient-to-r from-amber-900/40 via-slate-900/80 to-slate-900/40 border border-amber-500/20 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5 mb-1.5">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <span>
                  {activeTab === 'services' && 'الخدمات'}
                  {activeTab === 'gallery' && 'معرض صور العيادة'}
                  {activeTab === 'videos' && 'مكتبة الفيديوهات'}
                  {activeTab === 'certificates' && 'الشهادات والاعتمادات الطبية'}
                  {activeTab === 'reviews' && 'آراء وتقييمات المرضى'}
                  {activeTab === 'content' && 'أقسام ومحتوى البروفايل (الخدمات والمعرض والشهادات والآراء)'}
                </span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {activeTab === 'services' && 'إضافة وتعديل الخدمات المعروضة'}
                {activeTab === 'gallery' && 'رفع صور للعيادة او نتائج الحالات قبل وبعد'}
                {activeTab === 'videos' && 'إضافة روابط فيديوهات يوتيوب'}
                {activeTab === 'certificates' && 'رفع شهادات واعتمادات الطبيب'}
                {activeTab === 'reviews' && 'إضافة آراء المرضى وتقييماتهم'}
                {activeTab === 'content' && 'إضافة وتعديل الخدمات المعروضة، رفع صور للعيادة، إضافة روابط فيديوهات يوتيوب، رفع شهادات واعتمادات الطبيب، وإضافة آراء المرضى وتقييماتهم.'}
              </p>
            </div>

            {/* SECTION 1: الخدمات (Services) */}
            {(activeTab === 'content' || activeTab === 'services') && (!loggedSecretary || loggedSecretary.permissions?.manageServices) && (
            <div className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">الخدمات</h3>
                    <p className="text-xs text-slate-400">إضافة وتعديل عنوان ووصف وصورة وسعر الخدمة</p>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggleServices}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    (formData.features?.servicesAndPrices ?? true)
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-500/20 border-red-500/40 text-red-300'
                  }`}
                >
                  {(formData.features?.servicesAndPrices ?? true) ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-400" />
                      <span>قسم الخدمات: مفعل (On)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-red-400" />
                      <span>قسم الخدمات: معطل (Off)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Add New Service Form */}
              <form onSubmit={handleAddService} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-blue-400 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>{editingServiceId ? 'تعديل بيانات الخدمة' : 'إضافة خدمة جديدة'}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">اسم/عنوان الخدمة *</label>
                    <input 
                      type="text"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="مثال: فحص واستشارة شاملة"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">سعر الخدمة (جنيه) [اختياري]</label>
                    <input 
                      type="number"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      placeholder="مثال: 500"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">وصف الخدمة</label>
                  <textarea 
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    placeholder="اكتب شرحاً مختصراً للخدمة..."
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Upload Image File */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">رفع صورة توضيحية للخدمة (اختياري)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleServiceImageUpload(e.target.files[0])}
                      className="text-xs text-slate-400 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600/20 file:text-blue-300 hover:file:bg-blue-600/30 cursor-pointer"
                    />
                    {newServiceImage && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-blue-500/50 shrink-0">
                        <img src={newServiceImage} alt="Service" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button 
                    type="submit"
                    disabled={!newServiceName.trim()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingServiceId ? 'حفظ تعديلات الخدمة' : 'إضافة الخدمة للقائمة'}</span>
                  </button>
                  {editingServiceId && (
                    <button 
                      type="button"
                      onClick={handleCancelEditService}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </div>
              </form>

              {/* Added Services List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400">الخدمات المضافة حالياً ({formData.services?.length || 0}):</h4>
                {(!formData.services || formData.services.length === 0) ? (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl text-center">لا توجد خدمات مضافة حتى الآن.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.services.map((srv) => (
                      <div key={srv.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between gap-2.5">
                        <div className="space-y-1.5">
                          {srv.imageUrl && (
                            <img src={srv.imageUrl} alt={srv.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                          )}
                          <h5 className="text-sm font-bold text-white">{srv.name}</h5>
                          {srv.description && <p className="text-xs text-slate-400 line-clamp-2">{srv.description}</p>}
                          {srv.price && <span className="inline-block text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">{srv.price} جنيه</span>}
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 w-full">
                          <button 
                            type="button"
                            onClick={() => handleEditServiceStart(srv)}
                            className="flex-1 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 cursor-pointer py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/20 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteService(srv.id)}
                            className="flex-1 text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center gap-1 cursor-pointer py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* SECTION 2: معرض الصور (Gallery) */}
            {(activeTab === 'content' || activeTab === 'gallery') && (!loggedSecretary || loggedSecretary.permissions?.manageGallery) && (
            <div className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">معرض صور العيادة</h3>
                    <p className="text-xs text-slate-400">إضافة صور للعيادة عن طريق الرفع مباشرة (تحميل ملف وليس رابط)</p>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggleGallery}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    (formData.features?.photoGallery ?? true)
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-500/20 border-red-500/40 text-red-300'
                  }`}
                >
                  {(formData.features?.photoGallery ?? true) ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-400" />
                      <span>قسم معرض الصور: مفعل (On)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-red-400" />
                      <span>قسم معرض الصور: معطل (Off)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Add New Gallery Photo Form */}
              <form onSubmit={handleAddGalleryItem} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>{editingGalleryId ? 'تعديل صورة في المعرض' : 'رفع صورة جديدة للمعرض'}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">عنوان/وصف الصورة</label>
                    <input 
                      type="text"
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      placeholder="مثال: غرف الفحص والأجهزة الطبية"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">اختيار صورة من جهازك * (رفع مش رابط)</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleGalleryImageUpload(e.target.files[0])}
                      required={!newGalleryImage}
                      className="text-xs text-slate-400 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-600/20 file:text-amber-300 hover:file:bg-amber-600/30 cursor-pointer"
                    />
                  </div>
                </div>

                {newGalleryImage && (
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs text-slate-400 font-bold">المعاينة:</span>
                    <img src={newGalleryImage} alt="Gallery Preview" className="w-20 h-20 object-cover rounded-xl border border-amber-500/50" />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button 
                    type="submit"
                    disabled={!newGalleryImage}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingGalleryId ? 'حفظ تعديلات الصورة' : 'حفظ وإضافة الصورة المعرض'}</span>
                  </button>
                  {editingGalleryId && (
                    <button 
                      type="button"
                      onClick={handleCancelEditGallery}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </div>
              </form>

              {/* Added Gallery Photos Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400">الصور المضافة ({formData.galleryItems?.length || 0}):</h4>
                {(!formData.galleryItems || formData.galleryItems.length === 0) ? (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl text-center">لا توجد صور مضافة في المعرض حتى الآن.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formData.galleryItems.map((item) => (
                      <div key={item.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between gap-2">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-xl" />
                        <span className="text-xs font-bold text-white text-center line-clamp-1">{item.title}</span>
                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80 w-full">
                          <button 
                            type="button"
                            onClick={() => handleEditGalleryStart(item)}
                            className="flex-1 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1 cursor-pointer py-1 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/20 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="flex-1 text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center gap-1 cursor-pointer py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* SECTION 3: الفيديوهات (Videos) */}
            {(activeTab === 'content' || activeTab === 'videos') && (!loggedSecretary || loggedSecretary.permissions?.manageVideos) && (
            <div className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">قسم الفيديوهات (YouTube)</h3>
                    <p className="text-xs text-slate-400">إضافة لينكات فيديوهات يوتيوب لتظهر وتعمل مباشرة داخل الموقع</p>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggleVideos}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    (formData.features?.videosSection ?? true)
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-500/20 border-red-500/40 text-red-300'
                  }`}
                >
                  {(formData.features?.videosSection ?? true) ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-400" />
                      <span>قسم الفيديوهات: مفعل (On)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-red-400" />
                      <span>قسم الفيديوهات: معطل (Off)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Add Video Form */}
              <form onSubmit={handleAddVideo} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-red-400 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span>{editingVideoIndex !== null ? 'تعديل فيديو يوتيوب' : 'إضافة فيديو يوتيوب جديد'}</span>
                </h4>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">رابط فيديو يوتيوب (YouTube Link) *</label>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input 
                      type="url"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      dir="ltr"
                      placeholder="https://www.youtube.com/watch?v=XXXXXX أو https://youtu.be/XXXXXX"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-red-500 text-left"
                    />
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <button 
                        type="submit"
                        disabled={!newVideoUrl.trim()}
                        className="flex-1 sm:flex-initial px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{editingVideoIndex !== null ? 'حفظ التعديل' : 'إضافة الفيديو'}</span>
                      </button>
                      {editingVideoIndex !== null && (
                        <button 
                          type="button"
                          onClick={handleCancelEditVideo}
                          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          إلغاء
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>

              {/* Added Videos List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400">الفيديوهات المضافة ({formData.videos?.length || 0}):</h4>
                {(!formData.videos || formData.videos.length === 0) ? (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl text-center">لا توجد فيديوهات مضافة حتى الآن.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.videos.map((vUrl, idx) => {
                      let embedUrl = vUrl;
                      const match = vUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/);
                      if (match && match[1]) {
                        embedUrl = `https://www.youtube.com/embed/${match[1]}`;
                      }

                      return (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                            <iframe 
                              src={embedUrl}
                              title={`Video ${idx + 1}`}
                              className="w-full h-full border-0"
                              allowFullScreen
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-400 font-bold truncate dir-ltr max-w-[150px] sm:max-w-[180px]">{vUrl}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button 
                                type="button"
                                onClick={() => handleEditVideoStart(idx, vUrl)}
                                className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition-all text-xs"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleDeleteVideo(idx)}
                                className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer px-2 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-all text-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* SECTION 4: الشهادات (Certificates) */}
            {(activeTab === 'content' || activeTab === 'certificates') && (!loggedSecretary || loggedSecretary.permissions?.manageCertificates) && (
            <div className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">الشهادات والاعتمادات الطبية</h3>
                    <p className="text-xs text-slate-400">رفع صور الشهادات العلمية والترخيص وكتابة عناوينها</p>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggleCertificates}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    (formData.features?.addCertificates ?? true)
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-500/20 border-red-500/40 text-red-300'
                  }`}
                >
                  {(formData.features?.addCertificates ?? true) ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-400" />
                      <span>قسم الشهادات: مفعل (On)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-red-400" />
                      <span>قسم الشهادات: معطل (Off)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Add Certificate Form */}
              <form onSubmit={handleAddCertificate} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{editingCertId ? 'تعديل بيانات الشهادة' : 'رفع شهادة جديدة'}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">عنوان/اسم الشهادة *</label>
                    <input 
                      type="text"
                      value={newCertTitle}
                      onChange={(e) => setNewCertTitle(e.target.value)}
                      placeholder="مثال: شهادة البورد التخصصي في الطب البشري"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">تحميل صورة الشهادة *</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleCertImageUpload(e.target.files[0])}
                      required={!newCertImage}
                      className="text-xs text-slate-400 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-600/20 file:text-cyan-300 hover:file:bg-cyan-600/30 cursor-pointer"
                    />
                  </div>
                </div>

                {newCertImage && (
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-xs text-slate-400 font-bold">معاينة الشهادة:</span>
                    <img src={newCertImage} alt="Cert Preview" className="w-24 h-16 object-cover rounded-xl border border-cyan-500/50" />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button 
                    type="submit"
                    disabled={!newCertTitle.trim() || !newCertImage}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingCertId ? 'حفظ تعديلات الشهادة' : 'إضافة الشهادة'}</span>
                  </button>
                  {editingCertId && (
                    <button 
                      type="button"
                      onClick={handleCancelEditCert}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </div>
              </form>

              {/* Added Certificates List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400">الشهادات المضافة ({formData.certificates?.length || 0}):</h4>
                {(!formData.certificates || formData.certificates.length === 0) ? (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl text-center">لا توجد شهادات مضافة حتى الآن.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.certificates.map((cert: any) => (
                      <div key={cert.id || cert} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between gap-2">
                        {typeof cert !== 'string' && cert.imageUrl && (
                          <img src={cert.imageUrl} alt={cert.title} className="w-full h-32 object-cover rounded-xl" />
                        )}
                        <h5 className="text-xs font-bold text-white leading-snug">{typeof cert === 'string' ? cert : cert.title}</h5>
                        {typeof cert !== 'string' ? (
                          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80 w-full">
                            <button 
                              type="button"
                              onClick={() => handleEditCertificateStart(cert)}
                              className="flex-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 cursor-pointer py-1 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/20 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>تعديل</span>
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteCertificate(cert.id)}
                              className="flex-1 text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center gap-1 cursor-pointer py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* SECTION 5: آراء المرضى (Patient Reviews) */}
            {(activeTab === 'content' || activeTab === 'reviews') && (!loggedSecretary || loggedSecretary.permissions?.managePatients || loggedSecretary.permissions?.manageServices) && (
            <div className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">آراء وتقييمات المرضى</h3>
                    <p className="text-xs text-slate-400">إضافة صورة واسم المريض ووصف تجربته وتحديد عدد النجوم</p>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggleReviews}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    (formData.features?.patientReviews ?? true)
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-500/20 border-red-500/40 text-red-300'
                  }`}
                >
                  {(formData.features?.patientReviews ?? true) ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-emerald-400" />
                      <span>قسم آراء المرضى: مفعل (On)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-red-400" />
                      <span>قسم آراء المرضى: معطل (Off)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{editingReviewId ? 'تعديل رأي المريض' : 'إضافة رأي مريض جديد'}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">اسم المريض *</label>
                    <input 
                      type="text"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="مثال: أحمد محمود"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">تحديد النجوم (1 - 5) *</label>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star className={`w-6 h-6 ${star <= newReviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 mr-2">({newReviewRating} نجوم)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">تحميل صورة المريض (اختياري)</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleReviewAvatarUpload(e.target.files[0])}
                      className="text-xs text-slate-400 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600/20 file:text-emerald-300 hover:file:bg-emerald-600/30 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">وصف التجربة / رأي المريض *</label>
                  <textarea 
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="اكتب تفاصيل رأي وتجربة المريض..."
                    rows={2}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button 
                    type="submit"
                    disabled={!newReviewName.trim() || !newReviewComment.trim()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingReviewId ? 'حفظ تعديلات الرأي' : 'إضافة رأي المريض'}</span>
                  </button>
                  {editingReviewId && (
                    <button 
                      type="button"
                      onClick={handleCancelEditReview}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </div>
              </form>

              {/* Added Reviews List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400">آراء المرضى المضافة ({formData.reviews?.length || 0}):</h4>
                {(!formData.reviews || formData.reviews.length === 0) ? (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl text-center">لا توجد آراء مضافة حتى الآن.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.reviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between gap-2.5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            {rev.avatar ? (
                              <img src={rev.avatar} alt={rev.patientName} className="w-9 h-9 rounded-full object-cover border border-emerald-500/40" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                                {rev.patientName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <h5 className="text-xs font-bold text-white">{rev.patientName}</h5>
                              <div className="flex items-center gap-0.5">
                                {[...Array(rev.rating || 5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">"{rev.comment}"</p>
                        </div>
                        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80 w-full">
                          <button 
                            type="button"
                            onClick={() => handleEditReviewStart(rev)}
                            className="flex-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1 cursor-pointer py-1 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg border border-emerald-500/20 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteReview(rev.id)}
                            className="flex-1 text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center gap-1 cursor-pointer py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Bottom Global Save */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات النهائية</span>
              </button>
            </div>

          </div>
        )}

        {/* 2. CLINICS AND SCHEDULES SECTION (قسم المواعيد والعيادات) */}
        {activeTab === 'schedules' && (!loggedSecretary || loggedSecretary.permissions?.manageClinics) && (
          <div className="space-y-8">
            
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-slate-900/40 border border-blue-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5 mb-1.5">
                  <Building2 className="w-6 h-6 text-blue-400" />
                  <span>إدارة العيادات ومواعيد العمل</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  يمكنك هنا إضافة عيادة جديدة وتحديد أيام المواعيد وساعات عملها ورقم الهاتف وسعر الكشف، وتظهر للمرضى مباشرة ببروفايلك.
                </p>
              </div>

              <button
                onClick={handleOpenAddClinic}
                className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>إضافة عيادة جديدة</span>
              </button>
            </div>

            {/* CLINICS LIST */}
            {formData.branches.length === 0 ? (
              <div className="bg-[#0b172e] border border-slate-800 rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">لا توجد عيادات مضافة حتى الآن</h3>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-md">
                    قم بإضافة عيادتك الأولى وتحديد مواعيد استقبال المرضى والعنوان ورقم التليفون لتبدأ بحجز المواعيد.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddClinic}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة أول عيادة الان</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.branches.map((branch, index) => (
                  <div 
                    key={branch.id} 
                    className="bg-[#0b172e] border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all relative overflow-hidden group"
                  >
                    <div className="space-y-4">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white">{branch.name}</h3>
                            {branch.price && (
                              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>سعر الكشف: {branch.price}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditClinic(branch)}
                            className="p-2 bg-slate-800/80 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 rounded-xl border border-slate-700/80 transition-all cursor-pointer"
                            title="تعديل العيادة والمواعيد"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClinic(branch.id)}
                            className="p-2 bg-slate-800/80 hover:bg-red-600/20 text-slate-300 hover:text-red-400 rounded-xl border border-slate-700/80 transition-all cursor-pointer"
                            title="حذف العيادة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Address & Phone */}
                      <div className="space-y-2 text-xs sm:text-sm">
                        {branch.address && (
                          <div className="flex items-start gap-2 text-slate-300">
                            <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <span>{branch.address}</span>
                          </div>
                        )}
                        {branch.phone && (
                          <div className="flex items-center gap-2 text-slate-300" dir="ltr">
                            <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                            <span className="text-right">{branch.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Working Hours Summary */}
                      {branch.workingHours && (
                        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-400 block mb-0.5">مواعيد الحضور:</span>
                            <span>{branch.workingHours}</span>
                          </div>
                        </div>
                      )}

                      {/* Detailed Weekly Schedule Badge List */}
                      {branch.workingHoursList && branch.workingHoursList.length > 0 && (
                        <div className="pt-2">
                          <span className="text-xs font-bold text-slate-400 block mb-2">جدول الأيام والأوقات:</span>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {branch.workingHoursList.map((wh) => (
                              <div 
                                key={wh.day}
                                className={`p-2 rounded-xl border flex items-center justify-between ${
                                  wh.isAvailable 
                                    ? 'bg-blue-900/20 border-blue-500/30 text-blue-200' 
                                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                                }`}
                              >
                                <span className="font-bold">{wh.day}</span>
                                {wh.isAvailable ? (
                                  <span className="font-semibold">{wh.start} - {wh.end}</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-red-400/80">مغلق</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>عيادة متاحة بالبروفايل</span>
                      <button
                        onClick={() => handleOpenEditClinic(branch)}
                        className="text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        تعديل التفاصيل والمواعيد
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Bottom Global Save */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات النهائية</span>
              </button>
            </div>

          </div>
        )}

        {/* 3. CONTACT AND SOCIAL LINKS SECTION (قسم التواصل والروابط) */}
        {activeTab === 'contact' && (!loggedSecretary || !!loggedSecretary.permissions?.sendWhatsapp) && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-slate-900/40 border border-blue-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5 mb-1.5">
                  <Share2 className="w-6 h-6 text-cyan-400" />
                  <span>قسم وسائل التواصل، الأيقونات وخرائط العيادات</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  تعديل أرقام الهاتف والواتساب، أيقونات السوشيال ميديا التي تظهر تحت اسمك وفي الفوتر، بالإضافة لروبط الخرائط ومواقع العيادات.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSubmit()}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer shrink-0"
              >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </button>
            </div>

            {/* SECTION 1: DIRECT CONTACT NUMBERS & WHATSAPP */}
            <div className="bg-[#0b172e] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>أرقام الاتصال والتواصل الفوري (الاتصال والواتساب)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Contact Phone Number */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    رقم الاتصال المباشر <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      dir="ltr"
                      placeholder="01012345678"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-right"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    رقم الهاتف الرئيسي للاتصال المباشر وحجز المواعيد
                  </p>
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-300">
                    رقم الواتساب للتواصل <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      dir="ltr"
                      placeholder="201012345678"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-right"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    ضع كود الدولة بدون علامة + (مثال: 201012345678)
                  </p>
                </div>

              </div>
            </div>

            {/* SECTION 2: PROFILE HEADER & FOOTER SOCIAL MEDIA LINKS */}
            <div className="bg-[#0b172e] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <span>أيقونات التواصل الاجتماعي (تحت اسم البروفايل وفي الفوتر)</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    تظهر هذه الأيقونات تفاعلياً أسفل صورة البروفايل وفي أسفل فوتر الصفحة العامة
                  </p>
                </div>
              </div>

              {/* Social Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Facebook */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center">
                      <Facebook className="w-3.5 h-3.5" />
                    </div>
                    <span>رابط صفحة الفيسبوك (Facebook)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.facebook || ''}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    dir="ltr"
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                      <Instagram className="w-3.5 h-3.5" />
                    </div>
                    <span>رابط حساب الإنستغرام (Instagram)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.instagram || ''}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    dir="ltr"
                    placeholder="https://instagram.com/yourprofile"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left"
                  />
                </div>

                {/* TikTok */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-700 text-white flex items-center justify-center">
                      <TikTokIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>رابط حساب تيك توك (TikTok)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.tiktok || ''}
                    onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                    dir="ltr"
                    placeholder="https://tiktok.com/@yourprofile"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left"
                  />
                </div>

                {/* YouTube */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center">
                      <Youtube className="w-3.5 h-3.5" />
                    </div>
                    <span>رابط قناة يوتيوب (YouTube)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.youtube || ''}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    dir="ltr"
                    placeholder="https://youtube.com/@channel"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                      <Linkedin className="w-3.5 h-3.5" />
                    </div>
                    <span>رابط حساب لينكد إن (LinkedIn)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.linkedin || ''}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    dir="ltr"
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left"
                  />
                </div>

                {/* Twitter / X */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Twitter className="w-3.5 h-3.5" />
                    </div>
                    <span>رابط منصة تويتر / X</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.twitter || ''}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    dir="ltr"
                    placeholder="https://x.com/yourprofile"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left"
                  />
                </div>

                {/* Snapchat */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                      Snap
                    </div>
                    <span>رابط حساب سناب شات (Snapchat)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.snapchat || ''}
                    onChange={(e) => handleSocialChange('snapchat', e.target.value)}
                    dir="ltr"
                    placeholder="https://snapchat.com/add/yourname"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left"
                  />
                </div>

                {/* Telegram */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-600/20 text-sky-300 flex items-center justify-center">
                      <TelegramIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>رابط قناة / حساب تيليجرام (Telegram)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.socials?.telegram || ''}
                    onChange={(e) => handleSocialChange('telegram', e.target.value)}
                    dir="ltr"
                    placeholder="https://t.me/yourchannel"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left"
                  />
                </div>



              </div>

              {/* LIVE PREVIEW BOXES */}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                  معاينة حية لشكل الأيقونات في بروفايل الطبيب:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Under Profile Header Preview */}
                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-3">
                    <span className="text-[11px] font-bold text-slate-400 block">
                      1. الأيقونات أسفل اسم الطبيب وصورته:
                    </span>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {formData.whatsapp && (
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center" title="واتساب">
                          <WhatsAppIcon className="w-4 h-4" />
                        </div>
                      )}
                      {formData.socials?.facebook && (
                        <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center" title="فيسبوك">
                          <Facebook className="w-4 h-4" />
                        </div>
                      )}
                      {formData.socials?.instagram && (
                        <div className="w-9 h-9 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center" title="إنستغرام">
                          <Instagram className="w-4 h-4" />
                        </div>
                      )}
                      {formData.socials?.tiktok && (
                        <div className="w-9 h-9 rounded-full bg-slate-800 text-white border border-slate-700 flex items-center justify-center" title="تيك توك">
                          <TikTokIcon className="w-4 h-4" />
                        </div>
                      )}
                      {formData.socials?.youtube && (
                        <div className="w-9 h-9 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center" title="يوتيوب">
                          <Youtube className="w-4 h-4" />
                        </div>
                      )}
                      {formData.socials?.linkedin && (
                        <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center" title="لينكد إن">
                          <Linkedin className="w-4 h-4" />
                        </div>
                      )}
                      {formData.socials?.twitter && (
                        <div className="w-9 h-9 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center" title="تويتر">
                          <Twitter className="w-4 h-4" />
                        </div>
                      )}
                      {formData.socials?.telegram && (
                        <div className="w-9 h-9 rounded-full bg-sky-600/20 text-sky-300 border border-sky-400/30 flex items-center justify-center" title="تيليجرام">
                          <TelegramIcon className="w-4 h-4" />
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Footer Preview */}
                  <div className="p-4 bg-[#081121] border border-slate-800 rounded-2xl text-center space-y-3">
                    <span className="text-[11px] font-bold text-slate-400 block">
                      2. الأيقونات في أسفل فوتر البروفايل (Footer):
                    </span>
                    <div className="flex items-center justify-center gap-2.5 flex-wrap">
                      {formData.socials?.facebook && (
                        <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-xs">
                          <Facebook className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {formData.socials?.twitter && (
                        <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-xs">
                          <Twitter className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {formData.socials?.instagram && (
                        <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-xs">
                          <Instagram className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {formData.socials?.youtube && (
                        <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-xs">
                          <Youtube className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {formData.socials?.linkedin && (
                        <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-xs">
                          <Linkedin className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {formData.socials?.tiktok && (
                        <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-xs">
                          <TikTokIcon className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 3: CLINICS GOOGLE MAPS LOCATIONS */}
            <div className="bg-[#0b172e] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span>روابط ولوكيشنات العيادات على خرائط Google Maps</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    أدخل رابط خريطة موقع العيادة ليتمكن المرضى من فتح اتجاهات الخريطة بضغطة زر
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddClinic}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold rounded-xl transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة فرع جديد</span>
                </button>
              </div>

              {formData.branches.length === 0 ? (
                <div className="p-8 bg-slate-900/60 rounded-2xl border border-slate-800 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">لا توجد عيادات مضافة حالياً</p>
                  <button
                    type="button"
                    onClick={handleOpenAddClinic}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                  >
                    إضافة عيادة وتحديد لوكيشن الخريطة
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.branches.map((branch, index) => (
                    <div 
                      key={branch.id}
                      className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 hover:border-slate-700 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{branch.name}</h4>
                            <p className="text-xs text-slate-400">{branch.address || 'لم يتم كتابة العنوان'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Map URL Input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-300">
                          رابط الموقع على خرائط جوجل (Google Maps Link)
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <input
                            type="url"
                            value={branch.mapUrl || ''}
                            onChange={(e) => handleBranchMapUrlChange(branch.id, e.target.value)}
                            dir="ltr"
                            placeholder="https://maps.google.com/?q=loc:30.0444,31.2357"
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-left"
                          />

                          {branch.mapUrl && (
                            <a
                              href={branch.mapUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>تجربة اللوكيشن</span>
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Global Save Button */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات النهائية</span>
              </button>
            </div>

          </div>
        )}

          </main>
        </div>
      </div>

      {/* MODAL: ADD / EDIT CLINIC & WORKING HOURS */}
      {isClinicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0b172e] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6 dir-rtl text-right">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingBranchId ? 'تعديل بيانات العيادة والمواعيد' : 'إضافة عيادة جديدة ومواعيدها'}
                  </h3>
                  <p className="text-xs text-slate-400">أدخل تفاصيل ومواعيد العيادة بدقة</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsClinicModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClinic} className="space-y-6">
              
              {/* SECTION A: CLINIC BASIC INFO */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>البيانات الأساسية للعيادة</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Clinic Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      اسم العيادة / الفرع <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="مثال: عيادة المهندسين أو الفرع الرئيسي"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      رقم تليفون الحجز بالعيادة
                    </label>
                    <input
                      type="tel"
                      value={clinicPhone}
                      onChange={(e) => setClinicPhone(e.target.value)}
                      placeholder="01012345678"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      العنوان التفصيلي للعيادة <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      placeholder="مثال: 45 شارع مصدق - أمام بنك مصر - الدور الثالث"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Detection Price */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      سعر الكشف (اختياري)
                    </label>
                    <input
                      type="text"
                      value={clinicPrice}
                      onChange={(e) => setClinicPrice(e.target.value)}
                      placeholder="مثال: 300 جنيه"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Summary Text for Hours */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      ملخص المواعيد بكلمات بسيطة
                    </label>
                    <input
                      type="text"
                      value={clinicSummaryHours}
                      onChange={(e) => setClinicSummaryHours(e.target.value)}
                      placeholder="مثال: السبت والأربعاء من 4 عصراً إلى 9 مساءً"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                </div>
              </div>

              {/* SECTION B: WEEKLY SCHEDULE MANAGER */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>جدول مواعيد الأيام والساعات تفصيلياً</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">حدد أيام عمل العيادة وساعاتها</span>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {clinicSchedule.map((item, index) => (
                    <div 
                      key={item.day}
                      className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        item.isAvailable 
                          ? 'bg-slate-900 border-slate-700' 
                          : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                      }`}
                    >
                      {/* Day Name & Toggle */}
                      <label className="flex items-center gap-2.5 cursor-pointer shrink-0">
                        <input 
                          type="checkbox"
                          checked={item.isAvailable}
                          onChange={() => handleDayToggle(index)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700 cursor-pointer"
                        />
                        <span className={`text-xs font-bold ${item.isAvailable ? 'text-white' : 'text-slate-400 line-through'}`}>
                          {item.day}
                        </span>
                      </label>

                      {/* Time Controls */}
                      {item.isAvailable ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">من:</span>
                            <input 
                              type="text"
                              value={item.start}
                              onChange={(e) => handleDayTimeChange(index, 'start', e.target.value)}
                              placeholder="04:00 مساءً"
                              className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold text-xs w-28 text-center focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">إلى:</span>
                            <input 
                              type="text"
                              value={item.end}
                              onChange={(e) => handleDayTimeChange(index, 'end', e.target.value)}
                              placeholder="09:00 مساءً"
                              className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold text-xs w-28 text-center focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                          مغلق / إجازة
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsClinicModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ العيادة والمواعيد</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SECRETARY */}
      {isSecretaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0b172e] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative dir-rtl text-right">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingSecretaryId ? 'تعديل بيانات ورخص السكرتيرة' : 'إضافة سكرتيرة جديدة'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    أدخل بيانات السكرتيرة وحدد الصلاحيات المتاحة لها في اللوحة
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSecretaryModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveSecretary} className="space-y-6">
              
              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    الاسم الكامل <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={secName}
                    onChange={(e) => setSecName(e.target.value)}
                    placeholder="مثال: سارة أحمد محمود"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    رقم الموبايل / الواتساب <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={secPhone}
                    onChange={(e) => setSecPhone(e.target.value)}
                    placeholder="مثال: 01012345678"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-indigo-500 dir-ltr text-right"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    value={secEmail}
                    onChange={(e) => setSecEmail(e.target.value)}
                    placeholder="sec@clinic.com"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-indigo-500 dir-ltr text-right"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    كلمة المرور للدخول
                  </label>
                  <input
                    type="text"
                    value={secPassword}
                    onChange={(e) => setSecPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Branch Assignment */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    الفرع المسؤول عنه
                  </label>
                  <select
                    value={secBranchId}
                    onChange={(e) => setSecBranchId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">جميع الفروع والعيادات</option>
                    {formData.branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    حالة حساب السكرتيرة
                  </label>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-300">
                      <input
                        type="radio"
                        name="secStatus"
                        checked={secStatus === 'active'}
                        onChange={() => setSecStatus('active')}
                        className="accent-emerald-500"
                      />
                      <span>نشطة (مسموح بالدخول)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-red-300">
                      <input
                        type="radio"
                        name="secStatus"
                        checked={secStatus === 'inactive'}
                        onChange={() => setSecStatus('inactive')}
                        className="accent-red-500"
                      />
                      <span>موقوفة مؤقتاً</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Permissions Section */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>تحديد صلاحيات السكرتيرة:</span>
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSecPermissions({
                        viewAppointments: true,
                        confirmAppointments: true,
                        rejectAppointments: true,
                        sendWhatsapp: true,
                        editAppointments: true,
                        managePatients: true,
                        manageClinics: true,
                        manageServices: true,
                        manageGallery: true,
                        manageVideos: true,
                        manageCertificates: true,
                      })}
                      className="text-indigo-400 hover:underline cursor-pointer"
                    >
                      تحديد الكل
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => setSecPermissions({
                        viewAppointments: false,
                        confirmAppointments: false,
                        rejectAppointments: false,
                        sendWhatsapp: false,
                        editAppointments: false,
                        managePatients: false,
                        manageClinics: false,
                        manageServices: false,
                        manageGallery: false,
                        manageVideos: false,
                        manageCertificates: false,
                      })}
                      className="text-slate-400 hover:underline cursor-pointer"
                    >
                      إلغاء الكل
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  {[
                    { key: 'viewAppointments', label: 'طلبات الحجز', icon: '📅' },
                    { key: 'manageServices', label: 'الخدمات الطبية', icon: '🩺' },
                    { key: 'manageGallery', label: 'معرض الصور', icon: '🖼️' },
                    { key: 'manageVideos', label: 'مكتبة الفيديوهات', icon: '🎥' },
                    { key: 'manageCertificates', label: 'الشهادات والاعتمادات', icon: '📜' },
                    { key: 'managePatients', label: 'آراء وتقييمات المرضى', icon: '⭐' },
                    { key: 'manageClinics', label: 'المواعيد والعيادات', icon: '🏥' },
                    { key: 'sendWhatsapp', label: 'التواصل والروابط', icon: '💬' },
                  ].map((perm) => {
                    const permKey = perm.key as keyof SecretaryPermissions;
                    const isChecked = !!secPermissions[permKey];

                    return (
                      <label
                        key={perm.key}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-indigo-600/15 border-indigo-500/40 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{perm.icon}</span>
                          <span className="text-xs font-bold">{perm.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setSecPermissions(prev => {
                              const updated = { ...prev, [permKey]: val };
                              if (permKey === 'viewAppointments') {
                                updated.confirmAppointments = val;
                                updated.rejectAppointments = val;
                                updated.editAppointments = val;
                              }
                              return updated;
                            });
                          }}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSecretaryModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ بيانات السكرتيرة</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
