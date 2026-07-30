/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Doctor, Appointment, Review, DoctorFeatures, DEFAULT_DOCTOR_FEATURES, DoctorCertificate, Branch, Service } from '../types';
import { DoctorCardExport } from './DoctorCardExport';
import html2canvas from 'html2canvas';
import { 
  Stethoscope, Calendar, MapPin, Clock, Phone, MessageSquare, Mail, Building2, ShieldCheck, HeartPulse,
  Star, Image, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, ExternalLink, CheckCircle, Award,
  Share2, Download, Facebook, Instagram, Linkedin, Twitter, Youtube, Check, Globe,
  Eye, X, Target, Heart, RefreshCw, Activity, Sparkles, Menu, Video, Play, Film, ChevronDown, User
} from 'lucide-react';

const getTwoWordName = (fullName: string) => {
  if (!fullName) return 'دكتور';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  if (['د.', 'دكتور', 'دكتورة', 'أ.د', 'أ.د.', 'استشاري', 'استشارية', 'د'].includes(parts[0])) {
    return parts.slice(0, 3).join(' ');
  }
  return parts.slice(0, 2).join(' ');
};

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.87 2.89 2.89 0 0 1-2.89-2.87 2.89 2.89 0 0 1 2.89-2.88c.28 0 .55.04.81.12v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.7a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.76 1.5v-3.4a4.84 4.84 0 0 1-1-.46z"/>
  </svg>
);

const TelegramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.35-.01-1.02-.2-1.52-.37-.62-.2-1.11-.31-1.07-.65.02-.18.27-.36.75-.55 2.94-1.28 4.9-2.12 5.88-2.53 2.8-1.16 3.38-1.36 3.76-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface DoctorProfileProps {
  doctor: Doctor;
  appointments: Appointment[];
  onAddAppointment: (newApt: Appointment) => void;
  onAddReview: (doctorId: string, newReview: Review) => void;
  onBackToPortal: () => void;
}

export default function DoctorProfile({ 
  doctor, appointments, onAddAppointment, onAddReview, onBackToPortal 
}: DoctorProfileProps) {
  
  const docFeatures = doctor.features || DEFAULT_DOCTOR_FEATURES;

  // Interactive active section scroll-highlight state
  const [activeSection, setActiveSection] = useState('about-section');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Certificate Image Lightbox State
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<DoctorCertificate | null>(null);
  // Clinic Photo Lightbox Preview State
  const [selectedClinicPhoto, setSelectedClinicPhoto] = useState<{ url: string; title: string } | null>(null);

  // Clinic Gallery Photos (4 large top photos, 4 smaller bottom photos)
  const clinicLargePhotos = [
    {
      id: 'c1',
      title: 'الاستقبال الرئيسي ومدخل العيادة',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'c2',
      title: 'غرفة الكشف والتجهيزات الطبية',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'c3',
      title: 'غرفة المناظير والجراحة المعقمة',
      imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'c4',
      title: 'منطقة الانتظار والعناية بالأطفال',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  const clinicSmallPhotos = [
    {
      id: 'cs1',
      title: 'الممرات الداخلية والتعقيم',
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'cs2',
      title: 'أجهزة التشخيص والمناظير الدقيقة',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'cs3',
      title: 'غرفة المتابعة والعناية المركزة',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'cs4',
      title: 'وحدة الفحوصات والتحاليل الطبية',
      imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800'
    }
  ];

  // Selected Branch for Contact Section
  const [selectedBranchId, setSelectedBranchId] = useState(doctor.branches[0]?.id || 'b1');

  const activeBranch = doctor.branches.find(b => b.id === selectedBranchId) || doctor.branches[0] || {
    id: 'b1',
    name: 'فرع العيادة الرئيسي',
    address: 'العنوان غير محدد بالتفصيل',
    phone: doctor.phone || '٠١١٤١٥٤١٠٣٠',
    workingHours: 'الأحد - الثلاثاء - الخميس من ٨-١٠ مساءً'
  };

  // Format certificates correctly (handling both old plain strings and new DoctorCertificate objects)
  const defaultCertificates: DoctorCertificate[] = [
    {
      id: 'cert-def-1',
      title: 'شهادة الدكتوراه والبورد التخصصي في الطب والجراحة',
      imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df53f7eb?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'cert-def-2',
      title: 'شهادة عضوية الجمعية الطبية التخصصية العالمية',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'cert-def-3',
      title: 'ترخيص الاعتماد وترخيص مزاولة المهن الطبية',
      imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  const certs: DoctorCertificate[] = (doctor.certificates && doctor.certificates.length > 0)
    ? doctor.certificates.map((cert: any, idx: number) => {
        if (typeof cert === 'string') {
          return {
            id: `cert-${idx}`,
            title: cert,
            imageUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df53f7eb?auto=format&fit=crop&q=80&w=1200'
          };
        }
        return cert;
      })
    : defaultCertificates;

  // Mobile Certificate Slider State
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  // Desktop Certificate Slider State
  const [desktopCertStartIndex, setDesktopCertStartIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Reviews Slider & Auto-play State
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [reviewTouchStartX, setReviewTouchStartX] = useState<number | null>(null);

  // Default fallbacks for data arrays
  const defaultReviews: Review[] = [
    {
      id: 'rev-def-1',
      patientName: 'أحمد محمود',
      rating: 5,
      comment: 'دكتور ممتاز جداً وخبرة عالية وتعامل راقي من طاقم العيادة.',
      date: '2025-01-10'
    },
    {
      id: 'rev-def-2',
      patientName: 'سارة العتيبي',
      rating: 5,
      comment: 'عناية ممتازة ومواعيد دقيقة، أنصح بالتواصل مع العيادة.',
      date: '2025-01-15'
    },
    {
      id: 'rev-def-3',
      patientName: 'محمود علي',
      rating: 5,
      comment: 'تجربة ممتازة وتشخيص دقيق جداً بفضل الله.',
      date: '2025-01-18'
    }
  ];

  const defaultGallery = [
    {
      id: 'gal-def-1',
      title: 'مقر العيادة والاستقبال',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'gal-def-2',
      title: 'غرفة الفحص المجهزة بالكامل',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const defaultVideos = [
    {
      id: 'vid-def-1',
      title: 'فيديو نصائح وإرشادات طبية هام للمرضى',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const defaultServices: Service[] = [
    { id: 'srv-def-1', name: 'الكشف الطبي الشامل والمعاينة', description: 'فحص طبي دقيق وشامل مع تشخيص الحالة ووضع الخطة العلاجية المناسبة.', price: 500 },
    { id: 'srv-def-2', name: 'استشارة ومتابعة الدورية', description: 'متابعة دورية لتقييم استجابة العلاج وتعديل الخطة الطبية حسب الحاجة.', price: 300 },
    { id: 'srv-def-3', name: 'الاستشارة الطبية الفورية', description: 'جلسة تقييم سريعة للحالات العاجلة وتقديم التوصيات الطبية الأولية.', price: 400 }
  ];

  // Memoized reviews to display
  const reviewsToDisplay = React.useMemo(() => {
    return (doctor.reviews && doctor.reviews.length > 0) ? doctor.reviews : defaultReviews;
  }, [doctor.reviews]);

  // Gallery Photos to display (supporting galleryItems or gallery strings)
  const galleryPhotosToDisplay = React.useMemo(() => {
    if (doctor.galleryItems && doctor.galleryItems.length > 0) {
      return doctor.galleryItems;
    }
    if (doctor.gallery && doctor.gallery.length > 0) {
      return doctor.gallery.map((url, idx) => ({
        id: `gal-${idx}`,
        title: `صورة العيادة #${idx + 1}`,
        imageUrl: url
      }));
    }
    return defaultGallery;
  }, [doctor.galleryItems, doctor.gallery]);

  // Videos to display (YouTube embed conversion)
  const videosToDisplay = React.useMemo(() => {
    if (doctor.videos && doctor.videos.length > 0) {
      return doctor.videos.map((vUrl, idx) => {
        let embedUrl = vUrl;
        if (vUrl.includes('youtube.com/embed/')) {
          embedUrl = vUrl;
        } else {
          const match = vUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/);
          if (match && match[1]) {
            embedUrl = `https://www.youtube.com/embed/${match[1]}`;
          }
        }
        return {
          id: `vid-${idx}`,
          title: `فيديو #${idx + 1}`,
          embedUrl
        };
      });
    }
    return defaultVideos;
  }, [doctor.videos]);

  // Services to display
  const servicesToDisplay = React.useMemo(() => {
    return (doctor.services && doctor.services.length > 0) ? doctor.services : defaultServices;
  }, [doctor.services]);

  // Auto-play reviews every 4 seconds
  useEffect(() => {
    if (!reviewsToDisplay || reviewsToDisplay.length <= 1) return;
    const timer = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviewsToDisplay.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviewsToDisplay]);

  // Profile Download Handler & Card Reference
  const [isCardExportOpen, setIsCardExportOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [cardImgSrc, setCardImgSrc] = useState<string>(doctor.avatar);
  const [qrImgSrc, setQrImgSrc] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCardImgSrc(doctor.avatar);
  }, [doctor.avatar]);

  const getBranchWorkingHoursText = (b: Branch) => {
    if (b.workingHoursList && b.workingHoursList.length > 0) {
      const avail = b.workingHoursList.filter(wh => wh.isAvailable);
      if (avail.length > 0) {
        const days = avail.map(wh => wh.day).join('، ');
        const time = `${avail[0].start} - ${avail[0].end}`;
        return `${days} (${time})`;
      }
    }
    if (doctor.workingHours && doctor.workingHours.length > 0) {
      const avail = doctor.workingHours.filter(wh => wh.isAvailable);
      if (avail.length > 0) {
        const days = avail.map(wh => wh.day).join('، ');
        const time = `${avail[0].start} - ${avail[0].end}`;
        return `${days} (${time})`;
      }
    }
    return 'السبت إلى الأربعاء (7:00 م - 10:00 م)';
  };

  const createAvatarDataUrl = (name: string): string => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      const grad = ctx.createLinearGradient(0, 0, 300, 300);
      grad.addColorStop(0, '#e0f2fe');
      grad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(0, 0, 300, 300, 40);
      } else {
        ctx.rect(0, 0, 300, 300);
      }
      ctx.fill();

      const cleanName = (name || 'دكتور').replace(/^دكتور\s*|^د\.\s*/, '').trim();
      const initial = cleanName.charAt(0) || 'د';
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 110px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, 150, 150);

      return canvas.toDataURL('image/png');
    } catch (e) {
      return '';
    }
  };

  const convertImageToBase64 = async (url: string, fallbackName: string = ''): Promise<string> => {
    if (!url) return createAvatarDataUrl(fallbackName);
    if (url.startsWith('data:')) return url;

    return new Promise<string>((resolve) => {
      let isDone = false;
      const finish = (res: string) => {
        if (!isDone) {
          isDone = true;
          resolve(res || createAvatarDataUrl(fallbackName));
        }
      };

      // 1-second timeout safety guarantee
      const timer = setTimeout(() => {
        finish(createAvatarDataUrl(fallbackName));
      }, 1000);

      // Try image loading with crossOrigin
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 300;
          canvas.height = img.naturalHeight || 300;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const data = canvas.toDataURL('image/png');
            if (data && data.length > 300) {
              finish(data);
              return;
            }
          }
        } catch (e) {
          // Canvas taint fallback
        }
        finish(createAvatarDataUrl(fallbackName));
      };
      img.onerror = () => {
        clearTimeout(timer);
        finish(createAvatarDataUrl(fallbackName));
      };
      img.src = url;
    });
  };

  const safeDrawImageOnCanvas = (
    ctx: CanvasRenderingContext2D,
    src: string,
    drawFn: (img: HTMLImageElement) => void
  ): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (!src) return resolve();
      let done = false;
      const finish = () => {
        if (!done) {
          done = true;
          resolve();
        }
      };
      const timer = setTimeout(finish, 600);
      const img = new Image();
      img.onload = () => {
        clearTimeout(timer);
        try {
          drawFn(img);
        } catch (e) {
          console.warn('Canvas draw error:', e);
        }
        finish();
      };
      img.onerror = () => {
        clearTimeout(timer);
        finish();
      };
      img.src = src;
    });
  };

  const downloadCanvasFallback = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;

      const branches = displayBranches && displayBranches.length > 0 ? displayBranches : [
        {
          id: 'default-branch',
          name: 'الفرع الرئيسي',
          address: doctor.branches?.[0]?.address || 'العنوان الرئيسي للعيادة',
          phone: doctor.phone || '+201000000000',
          workingHours: ''
        }
      ];

      const specialty = doctor.jobTitle || '';
      const branchCount = branches.length;
      const clinicsBoxHeight = 55 + (branchCount * 85);
      const headerContentHeight = specialty ? 120 : 85;
      const totalHeight = 40 + headerContentHeight + clinicsBoxHeight + 40;
      canvas.height = totalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Canvas Background (White)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, totalHeight);

      // 2. Outer Card Border with Rounded Corners
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(16, 16, 568, totalHeight - 32, 28);
      } else {
        ctx.rect(16, 16, 568, totalHeight - 32);
      }
      ctx.fill();
      ctx.stroke();

      // 3. Doctor Title & Name (Starts directly with "دكتور")
      let currentY = 42;

      // "دكتور"
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 22px "Cairo", "Tajawal", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('دكتور', 300, currentY);

      currentY += 36;

      // Doctor Name (No verification badge)
      const cleanDoctorName = doctor.name.replace(/^دكتور\s*|^د\.\s*/, '').trim();
      ctx.fillStyle = '#00a8cc';
      ctx.font = '900 32px "Cairo", "Tajawal", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cleanDoctorName, 300, currentY);

      currentY += 46;

      // Job Title / Specialty
      if (specialty) {
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 18px "Cairo", "Tajawal", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(specialty, 300, currentY);
        currentY += 40;
      } else {
        currentY += 10;
      }

      // 4. Clinics Box ("العيادات:")
      const boxX = 40;
      const boxY = currentY;
      const boxW = 520;

      ctx.fillStyle = '#f4f4f6';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(boxX, boxY, boxW, clinicsBoxHeight, 20);
      } else {
        ctx.rect(boxX, boxY, boxW, clinicsBoxHeight);
      }
      ctx.fill();

      // Clinics Title Header
      let innerY = boxY + 20;
      ctx.fillStyle = '#111827';
      ctx.font = '900 22px "Cairo", "Tajawal", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('العيادات:', boxX + boxW - 25, innerY);

      innerY += 36;

      // Render each branch
      branches.forEach((b, idx) => {
        // Branch Name
        ctx.fillStyle = '#111827';
        ctx.font = '900 19px "Cairo", "Tajawal", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(b.name, boxX + boxW - 25, innerY);

        // Address
        ctx.fillStyle = '#374151';
        ctx.font = '500 15px "Cairo", "Tajawal", sans-serif';
        ctx.fillText(b.address, boxX + boxW - 25, innerY + 26);

        // Phone
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 15px "Cairo", "Tajawal", sans-serif';
        ctx.fillText(b.phone || doctor.phone || '', boxX + boxW - 25, innerY + 50);

        innerY += 82;

        if (idx < branches.length - 1) {
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(boxX + 25, innerY - 12);
          ctx.lineTo(boxX + boxW - 25, innerY - 12);
          ctx.stroke();
        }
      });

      // 5. Trigger Immediate File Download
      const fileName = `بطاقة_دكتور_${cleanDoctorName.replace(/\s+/g, '_')}.png`;
      const imageUri = canvas.toDataURL('image/png', 1.0);

      const link = document.createElement('a');
      link.href = imageUri;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Canvas download error:', e);
    }
  };

  const handleDownloadProfile = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      await downloadCanvasFallback();
    } catch (err) {
      console.error('Failed to download profile card image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShareLocation = async () => {
    const shareData = {
      title: doctor.name,
      text: `الملف التعريفي والعيادة للطبيب ${doctor.name} - ${doctor.jobTitle}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      }
    } catch (_err) {
      // User cancelled share or browser clipboard fallback failed silently
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX - currentX;

    // Swipe threshold of 50px
    if (diff > 50) {
      // Swiped left (show next in standard LTR viewport representation)
      setActiveCertIndex((prev) => (prev + 1) % certs.length);
      setTouchStartX(null);
    } else if (diff < -50) {
      // Swiped right (show previous in standard LTR viewport representation)
      setActiveCertIndex((prev) => (prev - 1 + certs.length) % certs.length);
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  // Review Touch Swipe Handlers for Mobile
  const handleReviewTouchStart = (e: React.TouchEvent) => {
    setReviewTouchStartX(e.touches[0].clientX);
  };

  const handleReviewTouchMove = (e: React.TouchEvent) => {
    if (reviewTouchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = reviewTouchStartX - currentX;

    if (diff > 40) {
      setActiveReviewIndex((prev) => (prev + 1) % reviewsToDisplay.length);
      setReviewTouchStartX(null);
    } else if (diff < -40) {
      setActiveReviewIndex((prev) => (prev - 1 + reviewsToDisplay.length) % reviewsToDisplay.length);
      setReviewTouchStartX(null);
    }
  };

  const handleReviewTouchEnd = () => {
    setReviewTouchStartX(null);
  };

  // Branch Selector State inside the Doctor side card
  const [activeCardBranchId, setActiveCardBranchId] = useState(doctor.branches[0]?.id || '');

  // Booking Form State
  const [selectedBranch, setSelectedBranch] = useState(doctor.branches[0]?.id || '');
  const [selectedService, setSelectedService] = useState(doctor.services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientWhatsapp, setPatientWhatsapp] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [latestBooking, setLatestBooking] = useState<Appointment | null>(null);

  // Review Form State
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [showVerifiedBadgeMessage, setShowVerifiedBadgeMessage] = useState(false);

  // Intersection Observer for highlighting the active section in the top header
  useEffect(() => {
    const sections = ['about-section', 'services-section', 'clinic-section', 'videos-section', 'certificates-section', 'reviews-section', 'booking-section'];
    
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
  }, []);

  // Filter out available working days for selector
  const availableWorkingHours = doctor.workingHours.filter(wh => wh.isAvailable);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    if (!patientName.trim() || !patientPhone.trim() || !patientWhatsapp.trim() || !selectedDate || !selectedTime) {
      alert('يرجى ملء كافة خانات الحجز الإجبارية');
      return;
    }

    const cleanPhone = patientPhone.trim().replace(/[\s\+\-]/g, '');
    const isDigitsOnly = /^[0-9\u0660-\u0669]+$/.test(cleanPhone);

    if (!isDigitsOnly) {
      setPhoneError('رقم الهاتف يجب أن يحتوي على أرقام فقط');
      return;
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: doctor.id,
      patientName,
      patientPhone,
      whatsappNumber: patientWhatsapp || patientPhone,
      branchId: selectedBranch,
      serviceId: selectedService,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      notes: patientNotes,
      createdAt: new Date().toISOString()
    };

    onAddAppointment(newApt);
    setLatestBooking(newApt);
    setBookingSuccess(true);

    // Reset Form
    setPatientName('');
    setPatientPhone('');
    setPatientWhatsapp('');
    setPatientNotes('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) {
      alert('يرجى ملء اسمك وترك تعليق');
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      patientName: revName,
      rating: revRating,
      comment: revComment,
      date: new Date().toISOString().split('T')[0]
    };

    onAddReview(doctor.id, newRev);
    setReviewSuccess(true);
    setRevName('');
    setRevComment('');
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const handleNotifyViaWhatsApp = () => {
    if (!latestBooking) return;
    
    const serviceName = doctor.services.find(s => s.id === latestBooking.serviceId)?.name || '';
    const branchName = doctor.branches.find(b => b.id === latestBooking.branchId)?.name || '';
    
    const text = `مرحباً د. ${doctor.name}، أود تأكيد رغبتي في حجز موعد عيادة عبر موقعك الإلكتروني:
- المريض: ${latestBooking.patientName}
- الهاتف: ${latestBooking.patientPhone}
- الخدمة: ${serviceName}
- العيادة/الفرع: ${branchName}
- التاريخ والوقت: ${latestBooking.date} الساعة ${latestBooking.time}
بانتظار تأكيدكم الكريم للموعد.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${doctor.whatsapp}?text=${encoded}`, '_blank');
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(targetId);
    }
  };

  // Find the address of the selected active branch inside the doctor's side card
  const displayBranches = React.useMemo(() => {
    const defaultList: Branch[] = [
      {
        id: 'b1',
        name: 'عيادة المهندسين',
        address: 'مستشفى منظار - 16 ش الدكتور المحروقي - متفرع من ش البطل احمد عبد العزيز- ميدان اسوان المهندسين',
        phone: doctor.phone || '٠١١٤١٥٤١٠٣٠',
        workingHoursList: [
          { day: 'السبت', isAvailable: true, start: '7 م', end: '10 م' },
          { day: 'الأحد', isAvailable: true, start: '7 م', end: '10 م' },
          { day: 'الاثنين', isAvailable: true, start: '7 م', end: '10 م' },
          { day: 'الثلاثاء', isAvailable: true, start: '7 م', end: '10 م' },
          { day: 'الأربعاء', isAvailable: true, start: '7 م', end: '10 م' },
        ]
      },
      {
        id: 'b2',
        name: 'عيادة مدينة نصر',
        address: '83 شارع أبو داوود الظاهري أمام مكتبات المعايرجي - برج الركن الشرقي - مدينة نصر',
        phone: '٠١١١٣٨١٩٦٦٦',
        workingHoursList: [
          { day: 'السبت', isAvailable: true, start: '4 م', end: '8 م' },
          { day: 'الثلاثاء', isAvailable: true, start: '4 م', end: '8 م' },
          { day: 'الخميس', isAvailable: true, start: '4 م', end: '8 م' },
        ]
      }
    ];

    const list = [...(doctor.branches || [])];
    while (list.length < 2) {
      const nextDefault = defaultList[list.length];
      list.push(nextDefault);
    }
    return list;
  }, [doctor.branches, doctor.phone]);

  const activeCardBranchIdValue = activeCardBranchId || displayBranches[0].id;
  const selectedBranchObj = displayBranches.find(b => b.id === activeCardBranchIdValue) || displayBranches[0];

  // Currently selected branch object for the booking form schedule
  const currentBookingBranchId = selectedBranch || displayBranches[0]?.id;
  const currentBookingBranchObj = displayBranches.find(b => b.id === currentBookingBranchId) || displayBranches[0];

  const currentBranchSlots = React.useMemo(() => {
    if (currentBookingBranchObj?.workingHoursList && currentBookingBranchObj.workingHoursList.length > 0) {
      return currentBookingBranchObj.workingHoursList.filter(wh => wh.isAvailable);
    }
    if (doctor.workingHours && doctor.workingHours.filter(wh => wh.isAvailable).length > 0) {
      return doctor.workingHours.filter(wh => wh.isAvailable);
    }
    return [
      { day: 'السبت', isAvailable: true, start: '7 م', end: '10 م' },
      { day: 'الأحد', isAvailable: true, start: '7 م', end: '10 م' },
      { day: 'الاثنين', isAvailable: true, start: '7 م', end: '10 م' },
      { day: 'الثلاثاء', isAvailable: true, start: '7 م', end: '10 م' },
      { day: 'الأربعاء', isAvailable: true, start: '7 م', end: '10 م' },
    ];
  }, [currentBookingBranchObj, doctor.workingHours]);

  return (
    <div className="w-full min-h-screen font-sans selection:bg-[#009bb9] selection:text-white bg-slate-50 text-[#1E293B]" style={{ fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      
      {/* Premium Floating Fixed Header for the Public site */}
      <header className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-50 max-w-7xl mx-auto rounded-2xl backdrop-blur-md px-3.5 sm:px-6 py-2.5 flex items-center justify-between transition-colors duration-300 bg-[#10244A] text-white shadow-md border border-white/10">
        
        {/* Right side: Doctor Avatar + Two-Word Name */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-xs shrink-0 bg-white/10 flex items-center justify-center">
            {doctor.headerAvatar || doctor.avatar ? (
              <img 
                src={doctor.headerAvatar || doctor.avatar} 
                alt={doctor.headerDisplayName || doctor.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white/80" />
            )}
          </div>
          <div className="flex flex-col text-right">
            <span className="font-extrabold text-xs sm:text-sm md:text-base text-white leading-tight">
              {doctor.headerDisplayName || getTwoWordName(doctor.name)}
            </span>
          </div>
        </div>

        {/* Center: Scroll Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 md:gap-2 lg:gap-3 font-black text-xs lg:text-sm text-white">
          {docFeatures.aboutAndBio && (
            <a 
              href="#about-section" 
              onClick={(e) => handleLinkClick(e, 'about-section')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'about-section' 
                  ? 'bg-white text-[#10244A] px-3.5 py-1.5 rounded-xl font-black shadow-xs' 
                  : 'text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl font-extrabold'
              }`}
            >
              الرئيسية
            </a>
          )}
          {docFeatures.servicesAndPrices && servicesToDisplay.length > 0 && (
            <a 
              href="#services-section" 
              onClick={(e) => handleLinkClick(e, 'services-section')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'services-section' 
                  ? 'bg-white text-[#10244A] px-3.5 py-1.5 rounded-xl font-black shadow-xs' 
                  : 'text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl font-extrabold'
              }`}
            >
              الخدمات
            </a>
          )}
          {docFeatures.photoGallery && galleryPhotosToDisplay.length > 0 && (
            <a 
              href="#clinic-section" 
              onClick={(e) => handleLinkClick(e, 'clinic-section')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'clinic-section' 
                  ? 'bg-white text-[#10244A] px-3.5 py-1.5 rounded-xl font-black shadow-xs' 
                  : 'text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl font-extrabold'
              }`}
            >
              معرض الصور
            </a>
          )}
          {(docFeatures.videosSection ?? true) && videosToDisplay.length > 0 && (
            <a 
              href="#videos-section" 
              onClick={(e) => handleLinkClick(e, 'videos-section')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'videos-section' 
                  ? 'bg-white text-[#10244A] px-3.5 py-1.5 rounded-xl font-black shadow-xs' 
                  : 'text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl font-extrabold'
              }`}
            >
              الفيديوهات
            </a>
          )}
          {docFeatures.addCertificates && certs.length > 0 && (
            <a 
              href="#certificates-section" 
              onClick={(e) => handleLinkClick(e, 'certificates-section')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'certificates-section' 
                  ? 'bg-white text-[#10244A] px-3.5 py-1.5 rounded-xl font-black shadow-xs' 
                  : 'text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl font-extrabold'
              }`}
            >
              الشهادات
            </a>
          )}
          {docFeatures.patientReviews && reviewsToDisplay.length > 0 && (
            <a 
              href="#reviews-section" 
              onClick={(e) => handleLinkClick(e, 'reviews-section')}
              className={`whitespace-nowrap transition-all duration-200 ${
                activeSection === 'reviews-section' 
                  ? 'bg-white text-[#10244A] px-3.5 py-1.5 rounded-xl font-black shadow-xs' 
                  : 'text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-xl font-extrabold'
              }`}
            >
              آراء المرضى
            </a>
          )}
        </nav>

        {/* Left side: Quick Book Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Book Button */}
          {docFeatures.easyBooking && (
            <a 
              href="#booking-section"
              onClick={(e) => handleLinkClick(e, 'booking-section')}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2 bg-white hover:bg-emerald-50 text-[#10244A] hover:text-[#0c1b38] text-xs sm:text-sm font-black rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-4 h-4 text-[#10244A]" />
              <span>احجز الآن</span>
            </a>
          )}

          {/* Mobile 3-bar Hamburger Menu Button (White, no frame) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-white hover:text-white/80 transition-all flex items-center justify-center cursor-pointer bg-transparent border-0 outline-none focus:outline-none"
            aria-label="القائمة"
          >
            {isMobileMenuOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7 text-white" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-50 md:hidden bg-white/98 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-2xl p-5 space-y-3 text-right">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-extrabold text-sm text-[#10244A]">أقسام الصفحة</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5 font-bold text-xs text-[#10244A]">
            {docFeatures.aboutAndBio && (
              <a 
                href="#about-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'about-section');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'about-section' ? 'bg-[#10244A] text-white font-black' : 'hover:bg-slate-100'
                }`}
              >
                الرئيسية
              </a>
            )}
            {docFeatures.servicesAndPrices && servicesToDisplay.length > 0 && (
              <a 
                href="#services-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'services-section');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'services-section' ? 'bg-[#10244A] text-white font-black' : 'hover:bg-slate-100'
                }`}
              >
                الخدمات
              </a>
            )}
            {docFeatures.photoGallery && galleryPhotosToDisplay.length > 0 && (
              <a 
                href="#clinic-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'clinic-section');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'clinic-section' ? 'bg-[#10244A] text-white font-black' : 'hover:bg-slate-100'
                }`}
              >
                معرض الصور
              </a>
            )}
            {(docFeatures.videosSection ?? true) && videosToDisplay.length > 0 && (
              <a 
                href="#videos-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'videos-section');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'videos-section' ? 'bg-[#10244A] text-white font-black' : 'hover:bg-slate-100'
                }`}
              >
                الفيديوهات
              </a>
            )}
            {docFeatures.addCertificates && certs.length > 0 && (
              <a 
                href="#certificates-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'certificates-section');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'certificates-section' ? 'bg-[#10244A] text-white font-black' : 'hover:bg-slate-100'
                }`}
              >
                الشهادات
              </a>
            )}
            {docFeatures.patientReviews && reviewsToDisplay.length > 0 && (
              <a 
                href="#reviews-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'reviews-section');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'reviews-section' ? 'bg-[#10244A] text-white font-black' : 'hover:bg-slate-100'
                }`}
              >
                آراء المرضى
              </a>
            )}
            {docFeatures.easyBooking && (
              <a 
                href="#booking-section"
                onClick={(e) => {
                  handleLinkClick(e, 'booking-section');
                  setIsMobileMenuOpen(false);
                }}
                className="mt-2 p-3 bg-[#10244A] text-white text-center font-extrabold rounded-xl shadow-md"
              >
                احجز موعد الآن
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main Grid Wrapper */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          
          {/* Right Column (Sticky Profile Side Card) */}
          <div className="lg:col-span-1 lg:sticky lg:top-28 z-20">
            <div className="bg-slate-50 border border-slate-200/80 rounded-[32px] overflow-hidden flex flex-col items-center text-center">
              
              {/* Doctor Avatar Card - Full Width, 340px Height with Premium Gradient Overlay */}
              <div className="relative w-full h-[340px] overflow-hidden bg-neutral-50 shrink-0">
                <img 
                  src={doctor.avatar} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              </div>

              {/* Card Padding Container for Content */}
              <div className="p-6 pt-5 w-full flex flex-col items-center text-center gap-5">
                
                {/* 1. Name with custom interactive Twitter-like verification rosette */}
                <div className="relative w-full flex flex-col items-center">
                  {showVerifiedBadgeMessage && docFeatures.profileVerification && (
                    <div className="absolute bottom-full mb-3 bg-white text-[#10244A] text-[11px] font-black py-2 px-3.5 rounded-xl z-30 flex items-center gap-1.5 whitespace-nowrap animate-bounce-short">
                      <span>طبيب موثوق</span>
                    </div>
                  )}

                  <h2 className="text-xl md:text-2xl font-black text-[#10244A] flex items-center gap-1.5 justify-center">
                    {doctor.name}
                    {docFeatures.profileVerification && (
                      <button 
                        onMouseEnter={() => setShowVerifiedBadgeMessage(true)}
                        onMouseLeave={() => setShowVerifiedBadgeMessage(false)}
                        onClick={() => {
                          setShowVerifiedBadgeMessage(true);
                          setTimeout(() => setShowVerifiedBadgeMessage(false), 3000);
                        }}
                        className="inline-flex items-center justify-center transition-transform active:scale-90 focus:outline-none animate-premium-badge"
                        title="طبيب موثوق"
                      >
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1877F2] fill-current shrink-0 transition-colors">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.407-.17-.867-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.407.17 .867.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.62 3.71l-3.27-3.27 1.1-1.1 2.17 2.17 5.85-5.85 1.11 1.11-6.96 6.94z" />
                        </svg>
                      </button>
                    )}
                  </h2>
                </div>

                {/* 2. Specialization (التخصص) */}
                <p className="text-xs md:text-sm text-black/70 font-normal leading-relaxed px-2">
                  {doctor.jobTitle}
                </p>

                {/* 3. Rating & Stars (النجوم والتقييم) */}
                {(() => {
                  const reviewsCount = doctor.reviews.length;
                  const avgRating = reviewsCount > 0 
                    ? (doctor.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(1)
                    : '4.9';
                  return (
                    <div className="flex items-center justify-center gap-1.5 bg-amber-50/60 px-3.5 py-1 rounded-full">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-800 pr-1">{avgRating}</span>
                      <span className="text-[10px] text-neutral-400 font-bold">({reviewsCount || 12} تقييم)</span>
                    </div>
                  );
                })()}

                {/* 4. Social & Action Icons under Doctor Name */}
                <div className="w-full flex items-center justify-center gap-2.5 pt-1.5 pb-0.5 flex-wrap">
                  {doctor.whatsapp && doctor.whatsapp.trim() !== '' && (
                    <a 
                      href={`https://wa.me/${doctor.whatsapp.trim()}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#25D366] hover:border-[#25D366] hover:text-white hover:scale-110 transition-all duration-300"
                      title="واتساب العيادة"
                    >
                      <WhatsAppIcon className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {doctor.socials?.facebook && doctor.socials.facebook.trim() !== '' && (
                    <a 
                      href={doctor.socials.facebook.trim()} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white hover:scale-110 transition-all duration-300"
                      title="صفحة الفيسبوك"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {doctor.socials?.instagram && doctor.socials.instagram.trim() !== '' && (
                    <a 
                      href={doctor.socials.instagram.trim()} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:text-white hover:scale-110 transition-all duration-300"
                      title="حساب الانستجرام"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {doctor.socials?.tiktok && doctor.socials.tiktok.trim() !== '' && (
                    <a 
                      href={doctor.socials.tiktok.trim()} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-black hover:border-black hover:text-white hover:scale-110 transition-all duration-300"
                      title="تيك توك"
                    >
                      <TikTokIcon className="w-4 h-4" />
                    </a>
                  )}
                  {doctor.socials?.youtube && doctor.socials.youtube.trim() !== '' && (
                    <a 
                      href={doctor.socials.youtube.trim()} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white hover:scale-110 transition-all duration-300"
                      title="قناة اليوتيوب"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {doctor.socials?.linkedin && doctor.socials.linkedin.trim() !== '' && (
                    <a 
                      href={doctor.socials.linkedin.trim()} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white hover:scale-110 transition-all duration-300"
                      title="لينكد إن"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {doctor.socials?.twitter && doctor.socials.twitter.trim() !== '' && (
                    <a 
                      href={doctor.socials.twitter.trim()} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white hover:scale-110 transition-all duration-300"
                      title="تويتر (X)"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {doctor.socials?.telegram && doctor.socials.telegram.trim() !== '' && (
                    <a 
                      href={doctor.socials.telegram.trim()} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#0088cc] hover:border-[#0088cc] hover:text-white hover:scale-110 transition-all duration-300"
                      title="تيليجرام"
                    >
                      <TelegramIcon className="w-4 h-4" />
                    </a>
                  )}
                  {doctor.socials?.website && doctor.socials.website.trim() !== '' && (
                    <a 
                      href={doctor.socials.website.trim()} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#10244A] hover:border-[#10244A] hover:text-white hover:scale-110 transition-all duration-300"
                      title="الموقع الإلكتروني"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  <button 
                    onClick={handleShareLocation}
                    type="button"
                    className={`w-10 h-10 rounded-full border text-neutral-800 flex items-center justify-center shadow-xs transition-all duration-300 cursor-pointer ${
                      shareSuccess 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'bg-slate-100 border-slate-200/80 hover:bg-[#10244A] hover:border-[#10244A] hover:text-white hover:scale-110'
                    }`}
                    title="مشاركة الموقع والصفحة"
                  >
                    {shareSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={handleDownloadProfile}
                    disabled={isDownloading}
                    type="button"
                    className={`w-10 h-10 rounded-full border text-neutral-800 flex items-center justify-center shadow-xs transition-all duration-300 cursor-pointer ${
                      downloadSuccess 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'bg-slate-100 border-slate-200/80 hover:bg-[#10244A] hover:border-[#10244A] hover:text-white hover:scale-110'
                    }`}
                    title="تحميل الملف التعريفي (CV)"
                  >
                    {isDownloading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : downloadSuccess ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Clinic Location & Maps Widget (بديل الباركود) */}
                <div className="w-full bg-slate-50 border border-slate-200/80 p-3.5 sm:p-4 rounded-[24px] text-right space-y-2.5 sm:space-y-3 mt-2">
                  {/* Clinic Tabs Selector - Sleeker fitted width */}
                  <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 p-1.5 bg-neutral-100 rounded-2xl">
                    {displayBranches.map((b) => {
                      const isActive = (activeCardBranchId || displayBranches[0].id) === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setActiveCardBranchId(b.id);
                            setSelectedBranch(b.id);
                          }}
                          className={`py-1.5 sm:py-2 px-4 rounded-xl text-xs font-black transition-all text-center cursor-pointer leading-snug break-words flex items-center justify-center min-h-[34px] sm:min-h-[38px] max-w-[85%] ${
                            isActive
                              ? 'bg-[#10244A] text-white shadow-xs'
                              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/70'
                          }`}
                          title={b.name}
                        >
                          {b.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Branch Info & Map Box */}
                  {selectedBranchObj && (
                    <div className="space-y-2.5">
                      {/* Address */}
                      <div className="flex items-start justify-end gap-2 text-right bg-neutral-50 p-2.5 sm:p-3 rounded-xl">
                        <div className="flex-1 space-y-0.5">
                          <span className="block text-xs font-black text-slate-900 leading-tight">{selectedBranchObj.name}</span>
                          <p className="text-xs font-normal text-black/70 leading-snug">
                            {selectedBranchObj.address}
                          </p>
                        </div>
                        <MapPin className="w-4 h-4 text-[#10244A] shrink-0 mt-[1px]" />
                      </div>

                      {/* Embedded Map - Reduced height by 20-25% (h-32 on mobile) */}
                      <div className="relative rounded-xl overflow-hidden h-32 sm:h-36 w-full bg-neutral-100">
                        <iframe 
                          title={`خريطة ${selectedBranchObj.name}`}
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedBranchObj.name + ' ' + selectedBranchObj.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          className="w-full h-full border-0"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Booking/Call Buttons (تحت الخريطة) */}
                <div className="w-full grid grid-cols-2 gap-2.5 pt-1">
                  <a 
                    href="#booking-section"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="w-full py-3 bg-[#10244A] hover:bg-[#0c1b38] text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>احجز موعد</span>
                  </a>
                  <a 
                    href={`tel:${doctor.phone}`}
                    className="w-full py-3 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200/80 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>اتصل الآن</span>
                  </a>
                </div>

              </div>

            </div>
          </div>

          {/* Left Column (Main Information, Services, Clinic, Reviews, Booking) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Section 1: Doctor Bio & Features / "عن الدكتور" */}
            {docFeatures.aboutAndBio && (() => {
              const doctorNameOnly = doctor.name.replace(/^(الأستاذ\s+)?(الدكتور\s+\/|د\.\s*)/, '');
              return (
                <section id="about-section" className="scroll-mt-28 bg-slate-50 border border-slate-200/80 rounded-[32px] p-6 md:p-8 text-right space-y-4">
                  
                  {/* Headers */}
                  <div className="space-y-2 text-right">
                    <div className="flex items-center justify-start">
                      <span className="text-[#10244A] font-black text-sm border-b-2 border-[#10244A] pb-0.5 inline-block">
                        عن الدكتور
                      </span>
                    </div>
                    
                    <h2 className="text-base sm:text-lg font-extrabold text-[#10244A] tracking-tight">
                      دكتور {doctorNameOnly}
                    </h2>

                    {/* Bio Description - 2 to 3 lines */}
                    <p className="text-black/70 text-xs sm:text-sm font-normal leading-relaxed pt-1 max-w-3xl line-clamp-3">
                      {doctor.bio || `طبيب متخصص يمتلك خبرة واسعة وسجلاً حافلاً في تقديم أفضل الخدمات والرعاية الطبية الشاملة للمرضى والعملاء بأعلى معايير الجودة والأمان.`}
                    </p>
                  </div>

                </section>
              );
            })()}

            {/* Section 2: Services List (الخدمات) */}
            {docFeatures.servicesAndPrices && servicesToDisplay.length > 0 && (
              <section id="services-section" className="scroll-mt-28 space-y-8">
                
                {/* Centered Main Title */}
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#10244A] tracking-tight">
                    الخدمات
                  </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
                  {servicesToDisplay.map((srv, idx) => {
                    const fallbackImages = [
                      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
                      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
                      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800',
                    ];
                    const imgSrc = (srv as any).imageUrl || fallbackImages[idx % fallbackImages.length];

                    return (
                      <div 
                        key={srv.id || idx}
                        className="max-w-[320px] sm:max-w-none mx-auto w-full bg-white border border-slate-200/90 rounded-[22px] sm:rounded-[28px] p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col text-center group"
                      >
                        {/* Service Top Image */}
                        <div className="w-full aspect-[16/9] rounded-[14px] sm:rounded-[18px] overflow-hidden bg-slate-100">
                          <img 
                            src={imgSrc} 
                            alt={srv.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>

                        {/* Service Bottom Text Content */}
                        <div className="pt-2.5 pb-1.5 px-1.5 sm:pt-3 sm:pb-2 sm:px-2 flex flex-col items-center justify-center gap-1.5">
                          <h3 className="text-sm sm:text-base md:text-lg font-black text-[#10244A] leading-snug text-center">
                            {srv.name}
                          </h3>
                          {srv.description && (
                            <p className="text-xs sm:text-sm text-black/70 font-normal leading-relaxed text-center line-clamp-3">
                              {srv.description}
                            </p>
                          )}
                          {srv.price && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-1">
                              {srv.price} جنيه
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Section 3: Clinic Gallery (معرض الصور) */}
            {docFeatures.photoGallery && galleryPhotosToDisplay.length > 0 && (
              <section id="clinic-section" className="scroll-mt-28 space-y-8 text-right">
                
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#10244A] tracking-tight">
                    معرض الصور
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  {galleryPhotosToDisplay.map((photo, idx) => (
                    <div 
                      key={photo.id || idx}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
                    >
                      <div className="relative w-full h-60 sm:h-72 md:h-80 overflow-hidden bg-neutral-100 rounded-none">
                        <img 
                          src={photo.imageUrl} 
                          alt={photo.title} 
                          className="w-full h-full object-cover rounded-none pointer-events-none select-none" 
                        />
                      </div>

                      <div className="p-4 flex-1 flex items-center justify-center text-center bg-slate-50 border-t border-slate-200/80">
                        <h3 className="text-base sm:text-lg font-black text-[#10244A] leading-snug">
                          {photo.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>

              </section>
            )}

            {/* Section 4: Videos Section (الفيديوهات) */}
            {(docFeatures.videosSection ?? true) && videosToDisplay.length > 0 && (
              <section id="videos-section" className="scroll-mt-28 bg-slate-50 border border-slate-200/80 rounded-[32px] p-6 md:p-8 space-y-6 text-right">
                
                {/* Header */}
                <div className="space-y-2 text-center border-b border-slate-200/70 pb-4">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-[#10244A] tracking-tight text-center">
                    فيديوهات
                  </h2>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2">
                  {videosToDisplay.map((vid, idx) => (
                    <div 
                      key={vid.id || idx}
                      className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                      {/* YouTube Player Container */}
                      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden rounded-t-2xl">
                        <iframe 
                          src={vid.embedUrl} 
                          title={vid.title} 
                          className="w-full h-full border-0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        />
                      </div>

                      {/* Card Title */}
                      <div className="p-4 bg-white text-right">
                        <h3 className="font-extrabold text-sm sm:text-base text-[#10244A] leading-snug">
                          {vid.title}
                        </h3>
                      </div>

                    </div>
                  ))}
                </div>

              </section>
            )}

            {/* Section 5: Certificates & Accreditations (الشهادات) */}
            {docFeatures.addCertificates && certs.length > 0 && (
              <section id="certificates-section" className="scroll-mt-28 bg-slate-50 border border-slate-200/80 rounded-[32px] p-6 md:p-10 space-y-6 text-right">
                
                <div className="text-center space-y-1.5 border-b border-neutral-100 pb-4">
                  <h3 className="text-xl md:text-2xl font-black text-[#10244A] text-center">الشهادات</h3>
                </div>

                {/* Desktop View (sm and larger) */}
                <div className="hidden sm:block relative max-w-[814px] mx-auto pt-2 group/carousel">
                  {/* Navigation Arrows for Desktop (Inside Container) */}
                  {certs.length > 3 && (
                    <>
                      {/* Right Arrow (slides right in RTL, showing previous items - decrease start index) */}
                      <button
                        type="button"
                        onClick={() => setDesktopCertStartIndex((prev) => (prev > 0 ? prev - 1 : certs.length - 3))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-[#10244A] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
                        aria-label="Previous Certificate"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Left Arrow (slides left in RTL, showing next items - increase start index) */}
                      <button
                        type="button"
                        onClick={() => setDesktopCertStartIndex((prev) => (prev < certs.length - 3 ? prev + 1 : 0))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-[#10244A] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
                        aria-label="Next Certificate"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Viewport for Desktop Carousel */}
                  <div className="overflow-hidden w-full rounded-[24px]">
                    <div 
                      className="flex gap-8 transition-transform duration-500 ease-out"
                      style={{ 
                        transform: `translateX(${desktopCertStartIndex * (250 + 32)}px)` 
                      }}
                    >
                      {certs.map((cert) => (
                        <div 
                          key={cert.id}
                          onClick={() => setSelectedCertForPreview(cert)}
                          className="group bg-neutral-50 hover:bg-white rounded-[24px] overflow-hidden transition-all duration-300 text-right w-[250px] h-[306px] shrink-0 flex flex-col cursor-pointer relative"
                        >
                          {/* Image occupying 100% height & width of the card */}
                          <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-100">
                            <img 
                              src={cert.imageUrl} 
                              alt={cert.title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              draggable="false"
                            />
                            {/* Subtle dark gradient overlay on image */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300" />
                          </div>

                          {/* Content overlay at the bottom - fully visible with wrapped text */}
                          <div className="absolute bottom-0 inset-x-0 p-4.5 z-10 flex flex-col gap-1 text-right bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12">
                            <h4 className="text-sm font-black text-white font-almarai leading-snug whitespace-normal break-words drop-shadow-md">
                              {cert.title}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bullet Indicators (Dots) for Desktop */}
                  {certs.length > 3 && (
                    <div className="flex justify-center gap-1.5 mt-4">
                      {Array.from({ length: certs.length - 2 }).map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setDesktopCertStartIndex(idx)}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            desktopCertStartIndex === idx ? 'w-4 bg-[#10244A]' : 'w-1.5 bg-neutral-200 hover:bg-neutral-300'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile View (Touch Slider & Auto-play, displays 1 card at a time, sized 230x302) */}
                <div className="block sm:hidden relative">
                  {/* Viewport with Swipe Event Handlers */}
                  <div 
                    className="relative overflow-hidden w-full max-w-[230px] h-[302px] mx-auto rounded-[24px] bg-neutral-50/30 p-0.5"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Sliding Track (Strictly LTR for mathematical consistency) */}
                    <div 
                      className="flex h-full transition-transform duration-500 ease-out"
                      dir="ltr"
                      style={{ 
                        width: `${certs.length * 100}%`,
                        transform: `translateX(-${activeCertIndex * (100 / certs.length)}%)`
                      }}
                    >
                      {certs.map((cert) => (
                        <div 
                          key={cert.id} 
                          style={{ width: `${100 / certs.length}%` }} 
                          className="h-full shrink-0 p-0.5 flex justify-center items-center"
                          dir="rtl" // Restore Arabic layout inside the card
                        >
                          {/* Sized card container (230x302) */}
                          <div 
                            onClick={() => setSelectedCertForPreview(cert)}
                            className="w-full h-full bg-neutral-50 rounded-[24px] overflow-hidden group transition-all duration-300 text-right flex flex-col cursor-pointer relative"
                          >
                            {/* Image occupying 100% height & width of the card */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-100">
                              <img 
                                src={cert.imageUrl} 
                                alt={cert.title} 
                                className="w-full h-full object-cover"
                                draggable="false"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                            </div>

                            {/* Content overlay at the bottom - fully visible with wrapped text */}
                            <div className="absolute bottom-0 inset-x-0 p-4 z-10 flex flex-col gap-1 text-right bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-10">
                              <h4 className="text-xs font-black text-white font-almarai leading-snug whitespace-normal break-words drop-shadow-md">
                                {cert.title}
                              </h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Next/Prev Arrow Buttons for mobile viewport */}
                    {certs.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCertIndex((prev) => (prev - 1 + certs.length) % certs.length);
                          }}
                          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-neutral-100 flex items-center justify-center text-[#10244A] active:scale-90 transition-transform"
                          aria-label="Previous Certificate"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCertIndex((prev) => (prev + 1) % certs.length);
                          }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-neutral-100 flex items-center justify-center text-[#10244A] active:scale-90 transition-transform"
                          aria-label="Next Certificate"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Bullet Indicators (Dots) */}
                  {certs.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-3">
                      {certs.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveCertIndex(idx)}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            activeCertIndex === idx ? 'w-4 bg-[#10244A]' : 'w-1 bg-neutral-200 hover:bg-neutral-300'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Section 6: Patient Reviews (الآراء) */}
            {docFeatures.patientReviews && reviewsToDisplay.length > 0 && (
              <section id="reviews-section" className="scroll-mt-28 space-y-6">
                
                <div className="text-center space-y-1">
                  <h3 className="text-2xl md:text-3xl font-black text-[#10244A] text-center">
                    آراء المرضى
                  </h3>
                </div>

                {/* Desktop View (Grid Layout) */}
                <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {reviewsToDisplay.map((rev, idx) => (
                    <div 
                      key={rev.id || idx}
                      className="w-full bg-white border border-slate-200/90 rounded-[28px] p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
                    >
                      {/* Top Circular Avatar */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-xs shrink-0 my-1">
                        <img 
                          src={rev.avatar || (idx % 3 === 0 
                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" 
                            : idx % 3 === 1
                            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
                            : "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400")} 
                          alt={rev.patientName} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>

                      {/* Details & Review text */}
                      <div className="pt-3 pb-1 px-1 flex flex-col items-center justify-between flex-1 space-y-1.5">
                        <h3 className="text-base md:text-lg font-black text-[#10244A] leading-snug text-center">
                          {rev.patientName}
                        </h3>

                        {/* Rating Stars */}
                        <div className="flex items-center justify-center gap-1 my-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                i < (rev.rating || 5) 
                                  ? 'text-amber-400 fill-amber-400' 
                                  : 'text-slate-200 fill-slate-200'
                              }`} 
                            />
                          ))}
                        </div>

                        {/* Comment */}
                        <p className="text-xs md:text-sm font-normal text-black/70 leading-snug text-center line-clamp-3">
                          "{rev.comment}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile View (Touch Slider with 4-second auto-play & navigation controls) */}
                <div className="block sm:hidden relative">
                  <div 
                    className="relative overflow-hidden w-full max-w-[270px] mx-auto p-1"
                    dir="ltr"
                    onTouchStart={handleReviewTouchStart}
                    onTouchMove={handleReviewTouchMove}
                    onTouchEnd={handleReviewTouchEnd}
                  >
                    {/* Sliding Track */}
                    <div 
                      className="flex transition-transform duration-500 ease-out"
                      style={{ 
                        width: `${reviewsToDisplay.length * 100}%`,
                        transform: `translateX(-${activeReviewIndex * (100 / reviewsToDisplay.length)}%)`
                      }}
                    >
                      {reviewsToDisplay.map((rev, idx) => (
                        <div 
                          key={rev.id || idx} 
                          style={{ width: `${100 / reviewsToDisplay.length}%` }} 
                          className="shrink-0 p-1 flex justify-center items-center"
                          dir="rtl"
                        >
                          {/* Individual Review Card */}
                          <div className="w-full bg-white border border-slate-200/90 rounded-[24px] p-4.5 shadow-xs flex flex-col items-center text-center justify-between space-y-2 min-h-[220px]">
                            {/* Circular Avatar */}
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-xs shrink-0 my-0.5">
                              <img 
                                src={rev.avatar || (idx % 3 === 0 
                                  ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" 
                                  : idx % 3 === 1
                                  ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
                                  : "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400")} 
                                alt={rev.patientName} 
                                className="w-full h-full object-cover" 
                              />
                            </div>

                            {/* Patient Name */}
                            <h3 className="text-sm font-black text-[#10244A] leading-snug">
                              {rev.patientName}
                            </h3>

                            {/* Rating Stars */}
                            <div className="flex items-center justify-center gap-1 my-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3.5 h-3.5 ${
                                    i < (rev.rating || 5) 
                                      ? 'text-amber-400 fill-amber-400' 
                                      : 'text-slate-200 fill-slate-200'
                                  }`} 
                                />
                              ))}
                            </div>

                            {/* Comment Text */}
                            <p className="text-xs font-normal text-black/70 leading-relaxed px-1 line-clamp-4">
                              "{rev.comment}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Arrow Navigation Buttons */}
                    {reviewsToDisplay.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReviewIndex((prev) => (prev - 1 + reviewsToDisplay.length) % reviewsToDisplay.length);
                          }}
                          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-neutral-200/80 flex items-center justify-center text-[#10244A] active:scale-90 transition-transform cursor-pointer"
                          aria-label="Previous Review"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReviewIndex((prev) => (prev + 1) % reviewsToDisplay.length);
                          }}
                          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-neutral-200/80 flex items-center justify-center text-[#10244A] active:scale-90 transition-transform cursor-pointer"
                          aria-label="Next Review"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Bullet Indicator Dots */}
                  {reviewsToDisplay.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-3">
                      {reviewsToDisplay.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveReviewIndex(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            activeReviewIndex === idx ? 'w-5 bg-[#10244A]' : 'w-1.5 bg-neutral-200 hover:bg-neutral-300'
                          }`}
                          aria-label={`Review Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </section>
            )}

            {/* Section 5: Clinical Booking Engine (الحجز) */}
            {docFeatures.easyBooking && (
              <section id="booking-section" className="scroll-mt-28 space-y-6">
                
                <div className="text-center space-y-1.5">
                  <h3 className="text-xl md:text-2xl font-black text-[#10244A] text-center">حجز موعد</h3>
                </div>

                <div className="bg-slate-50 border border-slate-200/90 rounded-[32px] md:rounded-[40px] p-4 sm:p-6 md:p-8 transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-stretch" dir="rtl">
                    
                    {/* Clinics & Schedules Panel (First on Mobile: order-1) */}
                      <div className="lg:col-span-5 order-1 lg:order-2 bg-white border border-slate-200/80 rounded-[28px] p-5 md:p-6 flex flex-col items-center justify-start text-center space-y-5 shadow-xs">
                        {/* Dark Circle Clock Icon */}
                        <div className="w-11 h-11 bg-[#10244A] text-white rounded-full flex items-center justify-center shrink-0 shadow-xs">
                          <Clock className="w-5 h-5 text-white" />
                        </div>

                        {/* Section 1: العيادات */}
                        <div className="space-y-2.5 w-full">
                          <h4 className="font-black text-base md:text-lg text-[#10244A] tracking-tight">
                            العيادات
                          </h4>

                          <div className="relative w-full max-w-[210px] mx-auto">
                            <select 
                              value={selectedBranch || displayBranches[0]?.id}
                              onChange={(e) => {
                                setSelectedBranch(e.target.value);
                                setActiveCardBranchId(e.target.value);
                                setSelectedDate('');
                                setSelectedTime('');
                              }}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-full text-xs font-extrabold text-[#10244A] text-center cursor-pointer focus:outline-none focus:border-[#10244A] shadow-2xs appearance-none pr-7 pl-7"
                            >
                              {displayBranches.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        {/* Section 2: المواعيد */}
                        <div className="pt-1 w-full space-y-3.5">
                          <h4 className="font-black text-base md:text-lg text-[#10244A] tracking-tight">
                            المواعيد
                          </h4>

                          {/* Grid of Day Slots for Selected Branch (3 per row) */}
                          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full max-w-[360px] mx-auto">
                            {currentBranchSlots.map((wh, idx) => {
                              const isSelected = selectedDate === wh.day;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDate(wh.day);
                                    setSelectedTime(`${wh.start} - ${wh.end}`);
                                  }}
                                  className={`p-2 sm:p-2.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                                    isSelected 
                                      ? 'bg-[#10244A] text-white border-[#10244A] shadow-sm font-bold scale-[1.02]' 
                                      : 'bg-slate-50 border-slate-200/90 text-slate-800 hover:border-[#10244A]/30 hover:bg-slate-100 shadow-2xs'
                                  }`}
                                >
                                  <span className="font-extrabold text-[11px] sm:text-xs leading-snug mb-0.5">{wh.day}</span>
                                  <span className={`text-[10px] sm:text-[11px] font-medium whitespace-nowrap ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                                    {wh.start} - {wh.end}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* Patient Form Inputs (Second on Mobile: order-2) */}
                      <form 
                        onSubmit={handleBookingSubmit} 
                        className="lg:col-span-7 order-2 lg:order-1 bg-white rounded-[28px] p-5 sm:p-6 md:p-8 flex flex-col justify-between space-y-5 border border-slate-200/80 shadow-xs"
                      >
                        <div className="space-y-4">
                          {/* Full Name */}
                          <div className="w-full">
                            <input 
                              type="text" 
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              placeholder="الاسم الكامل"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200/90 rounded-full text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#10244A] focus:bg-white placeholder:text-slate-400 text-right transition-all shadow-2xs"
                              required
                            />
                          </div>

                          {/* Mobile Phone */}
                          <div className="w-full">
                            <input 
                              type="text" 
                              inputMode="numeric"
                              value={patientPhone}
                              onChange={(e) => {
                                setPatientPhone(e.target.value);
                                if (phoneError) setPhoneError('');
                              }}
                              placeholder="رقم الجوال"
                              className={`w-full px-5 py-3.5 bg-slate-50 border ${
                                phoneError ? 'border-red-500 focus:border-red-600' : 'border-slate-200/90 focus:border-[#10244A]'
                              } rounded-full text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white placeholder:text-slate-400 text-right transition-all shadow-2xs`}
                              required
                            />
                            {phoneError && (
                              <p className="text-red-500 text-xs font-bold mt-1.5 px-3 text-right">
                                {phoneError}
                              </p>
                            )}
                          </div>

                          {/* WhatsApp Phone */}
                          <div className="w-full">
                            <input 
                              type="text" 
                              inputMode="numeric"
                              value={patientWhatsapp}
                              onChange={(e) => setPatientWhatsapp(e.target.value.replace(/\D/g, ''))}
                              placeholder="رقم الواتساب لتاكيد الحجز"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200/90 rounded-full text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#10244A] focus:bg-white placeholder:text-slate-400 text-right transition-all shadow-2xs"
                              required
                            />
                          </div>

                          {/* Date Selector Input */}
                          <div className="relative w-full">
                            <input 
                              type="text" 
                              value={selectedDate ? `${selectedDate} ${selectedTime ? `(${selectedTime})` : ''}` : ''}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              placeholder="يوم - شهر - سنة"
                              className="w-full px-5 py-3.5 pr-10 bg-slate-50 border border-slate-200/90 rounded-full text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#10244A] focus:bg-white placeholder:text-slate-400 text-right transition-all shadow-2xs"
                              required
                            />
                            <Calendar className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                          {/* Additional Notes */}
                          <div className="w-full">
                            <textarea 
                              value={patientNotes}
                              onChange={(e) => setPatientNotes(e.target.value)}
                              placeholder="ملاحظات إضافية..."
                              rows={4}
                              className="w-full p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#10244A] focus:bg-white placeholder:text-slate-400 text-right transition-all shadow-2xs resize-none"
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                          type="submit"
                          className="w-full py-3.5 md:py-4 bg-[#10244A] hover:bg-[#0c1b38] text-white font-extrabold text-sm rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-2"
                        >
                          <Calendar className="w-4 h-4 text-white" />
                          <span>تأكيد الحجز</span>
                        </button>
                      </form>

                    </div>
                  </div>
              </section>
            )}

          </div>

        </div>

      </main>

      {/* Shared Footer */}
      <footer className="w-full bg-[#0E1F42] text-white py-7 md:py-9 border-t border-white/10 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center space-y-5 md:space-y-6">
          
          {/* Clickable Resized Logo Image with Hover Animation (Navigates to Main Portal) */}
          {!doctor.whiteLabel && (
            <button 
              onClick={onBackToPortal}
              className="group cursor-pointer outline-none focus:outline-none transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 active:scale-95 my-1"
              title="الانتقال إلى الصفحة الرئيسية"
            >
              <img 
                src="https://k.top4top.io/p_38573eitn0.png" 
                alt="لوجو منصة بروفايلي" 
                className="h-14 sm:h-16 md:h-20 w-auto object-contain filter drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-300 group-hover:brightness-110"
              />
            </button>
          )}

          {/* Copyright Notice */}
          <p className="text-[11px] text-white/70 font-semibold">
            {doctor.whiteLabel 
              ? `جميع الحقوق محفوظة © ${new Date().getFullYear()} - عيادة د. ${doctor.name}`
              : `جميع الحقوق محفوظة © ${new Date().getFullYear()} - منصة بروفايلي`
            }
          </p>

          {/* Centered Social Media Icons (Enlarged circles with 25% border transparency) */}
          <div className="flex items-center justify-center gap-3.5 pt-1 flex-wrap">
            {doctor.socials?.facebook && doctor.socials.facebook.trim() !== '' && (
              <a 
                href={doctor.socials.facebook.trim()} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-[#1877F2] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                title="فيسبوك"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
            )}
            {doctor.socials?.twitter && doctor.socials.twitter.trim() !== '' && (
              <a 
                href={doctor.socials.twitter.trim()} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-[#1DA1F2] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                title="تويتر (X)"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
            )}
            {doctor.socials?.instagram && doctor.socials.instagram.trim() !== '' && (
              <a 
                href={doctor.socials.instagram.trim()} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-[#dc2743] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                title="انستجرام"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
            )}
            {doctor.socials?.youtube && doctor.socials.youtube.trim() !== '' && (
              <a 
                href={doctor.socials.youtube.trim()} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-[#FF0000] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                title="يوتيوب"
              >
                <Youtube className="w-4.5 h-4.5" />
              </a>
            )}
            {doctor.socials?.linkedin && doctor.socials.linkedin.trim() !== '' && (
              <a 
                href={doctor.socials.linkedin.trim()} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-[#0A66C2] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                title="لينكدإن"
              >
                <Linkedin className="w-4.5 h-4.5" />
              </a>
            )}
            {doctor.socials?.tiktok && doctor.socials.tiktok.trim() !== '' && (
              <a 
                href={doctor.socials.tiktok.trim()} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                title="تيك توك"
              >
                <TikTokIcon className="w-4.5 h-4.5" />
              </a>
            )}
            {doctor.socials?.telegram && doctor.socials.telegram.trim() !== '' && (
              <a 
                href={doctor.socials.telegram.trim()} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-[#0088cc] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                title="تيليجرام"
              >
                <TelegramIcon className="w-4.5 h-4.5" />
              </a>
            )}
            {doctor.socials?.website && doctor.socials.website.trim() !== '' && (
              <a 
                href={doctor.socials.website.trim()} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center hover:bg-white hover:text-[#10244A] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                title="الموقع الإلكتروني"
              >
                <Globe className="w-4.5 h-4.5" />
              </a>
            )}
          </div>

        </div>
      </footer>

      {/* Certificate Fullscreen Lightbox Modal */}
      {selectedCertForPreview && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setSelectedCertForPreview(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl text-right animate-scale-up" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <button 
                onClick={() => setSelectedCertForPreview(null)}
                className="p-2 hover:bg-neutral-200 text-neutral-500 hover:text-black rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-black text-sm md:text-base text-[#10244A] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#009bb9]" />
                <span>{selectedCertForPreview.title}</span>
              </h3>
            </div>
            
            {/* Modal Image Wrapper with certificate proportions */}
            <div className="p-6 md:p-8 flex items-center justify-center bg-neutral-950/5 max-h-[70vh] overflow-y-auto">
              <img 
                src={selectedCertForPreview.imageUrl} 
                alt={selectedCertForPreview.title} 
                className="max-h-[60vh] object-contain rounded-xl shadow-lg border-4 border-white transition-all"
              />
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center text-xs text-neutral-500 font-bold">
              <span>بروتوكول التحقق الطبي المستمر من الهوية والمؤهلات</span>
              <span className="text-[#009bb9] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                تم التوثيق والاعتماد
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Clinic Photo Lightbox Preview Modal */}
      {selectedClinicPhoto && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedClinicPhoto(null)}
        >
          <div 
            className="relative bg-white rounded-none shadow-2xl max-w-4xl w-full overflow-hidden text-right animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0d4f3c] text-white flex justify-between items-center">
              <button 
                onClick={() => setSelectedClinicPhoto(null)}
                className="p-1.5 rounded-none hover:bg-white/10 text-white transition-colors"
                aria-label="إغلاق المعاينة"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{selectedClinicPhoto.title}</span>
              </h3>
            </div>
            
            {/* Modal Image Wrapper */}
            <div className="p-4 sm:p-6 flex items-center justify-center bg-neutral-900 max-h-[75vh] overflow-hidden">
              <img 
                src={selectedClinicPhoto.url} 
                alt={selectedClinicPhoto.title} 
                className="max-h-[65vh] object-contain rounded-none shadow-md"
              />
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center text-xs text-neutral-500 font-bold">
              <span>تجهيزات العيادة الطبية المتطورة</span>
              <span className="text-[#0d4f3c] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                عيادة دكتور {doctor.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Offscreen Card Template matching user's exact screenshot */}
      <div 
        style={{ 
          position: 'fixed', 
          left: '-9999px', 
          top: '-9999px', 
          width: '400px', 
          zIndex: -9999, 
          opacity: 0, 
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        <div 
          ref={cardRef}
          id="downloadable-doctor-card"
          className="w-[400px] bg-white rounded-[32px] p-7 shadow-2xl border border-slate-100 text-center font-sans text-neutral-900 dir-rtl select-none"
          style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
        >
          {/* Doctor Title & Name */}
          <div className="space-y-1.5 mb-4">
            <div className="text-lg font-bold text-neutral-900">
              دكتور
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-extrabold text-[#00a8cc]">
                {doctor.name.replace(/^دكتور\s*|^د\.\s*/, '').trim()}
              </span>
            </div>

            <div className="text-sm font-bold text-neutral-800 leading-snug px-3 pt-1">
              {doctor.jobTitle}
            </div>
          </div>

          {/* Clinics Box */}
          <div className="w-full bg-[#f4f4f6] rounded-[24px] p-5 text-right space-y-4">
            <div className="text-base font-black text-neutral-900 text-right">
              العيادات:
            </div>

            {displayBranches.map((b, idx) => (
              <div key={b.id || idx} className="space-y-1">
                <div className="text-base font-black text-neutral-900">
                  {b.name}
                </div>
                <div className="text-sm text-neutral-700 font-medium leading-relaxed">
                  {b.address}
                </div>
                <div className="text-sm text-neutral-900 font-bold dir-ltr text-right">
                  {b.phone || doctor.phone}
                </div>
                {idx < displayBranches.length - 1 && (
                  <div className="w-full border-t border-slate-200/90 my-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Digital Business Card Export Modal */}
      <DoctorCardExport 
        doctor={doctor} 
        branches={displayBranches} 
        isOpen={isCardExportOpen} 
        onClose={() => setIsCardExportOpen(false)} 
      />

      {/* Booking Success Popup Modal (رسالة منبثقة بتفاصيل الحجز) */}
      {bookingSuccess && latestBooking && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in dir-rtl"
          onClick={() => setBookingSuccess(false)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 text-right space-y-4 sm:space-y-5 shadow-2xl relative animate-scale-up border border-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setBookingSuccess(false)}
              className="absolute left-3 top-3 sm:left-4 sm:top-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Header Icon & Title */}
            <div className="text-center space-y-2 pt-1 sm:pt-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-7 h-7 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-base sm:text-xl font-black text-[#10244A]">
                تم إرسال طلب الحجز
              </h3>
              <p className="text-slate-600 text-[11px] sm:text-xs font-semibold leading-relaxed max-w-sm mx-auto">
                تم إرسال طلب الحجز إلى العيادة. سيتم مراجعة طلبك والتواصل معك في أقرب وقت لتأكيد الحجز
              </p>
            </div>

            {/* Details Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs space-y-2 sm:space-y-2.5 text-right">
              <h4 className="font-extrabold text-xs sm:text-sm text-[#10244A] pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>تفاصيل الحجز:</span>
              </h4>

              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">اسم المريض:</span>
                <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{latestBooking.patientName}</span>
              </div>

              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">رقم الجوال:</span>
                <span className="font-bold text-slate-800" dir="ltr">{latestBooking.patientPhone}</span>
              </div>

              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">رقم الواتساب:</span>
                <span className="font-bold text-slate-800" dir="ltr">{latestBooking.whatsappNumber || latestBooking.patientPhone}</span>
              </div>

              {displayBranches.find(b => b.id === latestBooking.branchId) && (
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">العيادة / الفرع:</span>
                  <span className="font-bold text-slate-800">
                    {displayBranches.find(b => b.id === latestBooking.branchId)?.name}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">الموعد المحدد:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {latestBooking.date} ({latestBooking.time})
                </span>
              </div>

              {latestBooking.notes && (
                <div className="pt-0.5">
                  <span className="text-slate-500 font-medium block mb-0.5">ملاحظات:</span>
                  <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200 text-[10px] sm:text-[11px] leading-relaxed">
                    {latestBooking.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-1">
              <button 
                type="button"
                onClick={() => setBookingSuccess(false)}
                className="w-full py-2.5 sm:py-3 bg-[#10244A] hover:bg-[#0c1b38] text-white font-extrabold text-xs sm:text-sm rounded-full transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>تم</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
