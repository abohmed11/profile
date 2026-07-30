/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  workingHours?: string;
  workingHoursList?: WorkingHour[];
  mapUrl?: string;
  price?: number | string;
}

export interface Service {
  id: string;
  name: string;
  price?: number;
  duration?: string; // e.g. "30 دقيقة"
  description: string;
  imageUrl?: string;
}

export interface WorkingHour {
  day: string; // e.g. "السبت", "الأحد"
  isAvailable: boolean;
  start: string;
  end: string;
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface DoctorFeatures {
  aboutAndBio: boolean; // نبذة عنك ومؤهلاتك العلمية
  servicesAndPrices: boolean; // الخدمات والعروض والأسعار
  photoGallery: boolean; // معرض صور العيادة
  videosSection?: boolean; // قسم الفيديوهات
  personalUrl: boolean; // رابط شخصي باسمك
  multipleBranches: boolean; // إضافة أكثر من فرع للعيادة
  professionalDesign: boolean; // تصميم احترافي
  easyBooking: boolean; // حجز المواعيد بسهولة
  workingHours: boolean; // مواعيد العمل وجدول العيادة
  manageAppointments: boolean; // إدارة وتنظيم المواعيد
  confirmOrCancelBooking: boolean; // تأكيد أو إلغاء الحجز
  doctorLeaves: boolean; // إجازات الطبيب والاستثناءات
  whatsappConfirmation: boolean; // تأكيد الحجز عبر واتساب
  easyControlPanel: boolean; // لوحة تحكم سهلة الاستخدام
  responsiveDesign: boolean; // يعمل على جميع الأجهزة
  continuousSupport: boolean; // دعم فني متواصل
  continuousUpdates: boolean; // تحديثات وتطوير مستمر
  patientBookingRequests: boolean; // إدارة طلبات حجوزات المرضى
  editProfileData: boolean; // تعديل بيانات البروفايل
  patientReviews: boolean; // تقييمات وآراء المرضى
  qrCodeSharing: boolean; // QR Code لمشاركة بروفايلك
  googleMapsLocation: boolean; // خرائط Google لموقع العيادة
  socialMediaLinks: boolean; // روابط السوشيال ميديا
  profileVerification: boolean; // توثيق البروفايل
  addCertificates: boolean; // إضافة الشهادات
}

export const DEFAULT_DOCTOR_FEATURES: DoctorFeatures = {
  aboutAndBio: true,
  servicesAndPrices: true,
  photoGallery: true,
  videosSection: true,
  personalUrl: true,
  multipleBranches: true,
  professionalDesign: true,
  easyBooking: true,
  workingHours: true,
  manageAppointments: true,
  confirmOrCancelBooking: true,
  doctorLeaves: true,
  whatsappConfirmation: true,
  easyControlPanel: true,
  responsiveDesign: true,
  continuousSupport: true,
  continuousUpdates: true,
  patientBookingRequests: true,
  editProfileData: true,
  patientReviews: true,
  qrCodeSharing: true,
  googleMapsLocation: true,
  socialMediaLinks: true,
  profileVerification: true,
  addCertificates: true,
};

export interface DoctorCertificate {
  id: string;
  title: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
}

export interface Doctor {
  id: string;
  name: string;
  nameEn: string; // For URL routing (e.g., /dr/ahmed-hassan)
  specialty: string;
  jobTitle: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatar: string;
  bio: string;
  experience: number; // Years of experience
  branches: Branch[];
  services: Service[];
  workingHours: WorkingHour[];
  gallery: string[];
  galleryItems?: GalleryItem[];
  videos: string[];
  reviews: Review[];
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    snapchat?: string;
    telegram?: string;
    website?: string;
  };
  isActiveSubscription: boolean;
  registeredAt: string;
  subscriptionEndDate?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  subscriptionType?: '6months' | 'annual';
  isVerified?: boolean;
  whiteLabel?: boolean;
  features?: DoctorFeatures;
  certificates?: DoctorCertificate[];
  siteType?: 'profile' | 'website';
  headerDisplayName?: string; // الاسم الثنائي أو اللقب المصغر للشريط العلوي
  headerAvatar?: string; // صورة الشريط العلوي
  secretaries?: Secretary[];
}

export interface SecretaryPermissions {
  viewAppointments: boolean;
  confirmAppointments: boolean;
  rejectAppointments: boolean;
  sendWhatsapp: boolean;
  editAppointments: boolean;
  managePatients: boolean;
  manageClinics: boolean;
  manageServices: boolean;
  manageGallery: boolean;
  manageVideos: boolean;
  manageCertificates: boolean;
}

export interface Secretary {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  branchId?: string;
  status: 'active' | 'inactive';
  permissions: SecretaryPermissions;
  createdAt?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  patientPhone: string;
  whatsappNumber?: string;
  date: string;
  time: string;
  branchId: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  serviceId?: string;
  createdAt?: string;
}

export interface FeatureCategoryConfig {
  id: string;
  title: string;
  iconName: string;
  items: string[];
}

export interface PricingPlanConfig {
  title: string;
  price: string;
  period: string;
  discountText: string;
  features: string[];
}

export interface FAQConfigItem {
  id: string;
  question: string;
  answer: string;
}

export interface SEOSettingsConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;

  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;

  googleVerificationCode: string;
  gaMeasurementId: string;
  gtmId: string;

  autoSitemap: boolean;
  lastSitemapUpdate: string;
  sitemapPagesCount: number;

  autoRobots: boolean;
  robotsTxtContent: string;

  enableSchema: boolean;
  schemaType: 'WebSite' | 'Organization' | 'MedicalOrganization' | 'FAQ' | 'Article' | 'Breadcrumb';

  allowIndexing: boolean;
  noIndexPages: string[];
  autoCanonical: boolean;

  enableBreadcrumbSchema: boolean;
  enableFaqSchema: boolean;
  enableArticleSchema: boolean;
  enableSearchBoxSchema: boolean;
  enableOrganizationSchema: boolean;
  enableOpenGraph: boolean;
  enableTwitterCard: boolean;

  autoCompressImages: boolean;
  webpConversion: boolean;
  lazyLoading: boolean;
  minifyHtml: boolean;
  minifyCss: boolean;
  minifyJs: boolean;
  browserCache: boolean;
  gzipCompression: boolean;
}

export const DEFAULT_SEO_CONFIG: SEOSettingsConfig = {
  metaTitle: 'منصة شفاء الطبية | بروفايل طبي احترافي للأطباء وحجز مواعيد العيادات',
  metaDescription: 'أنشئ بروفايلك الطبي الاحترافي واحصل على موقع إلكتروني خاص بعيادتك مع نظام حجز مواعيد ذكي وإدارة كاملة للعيادة وبدون أي عمولات على الحجوزات.',
  metaKeywords: 'بروفايل طبي, موقع عيادة, حجز أطباء, إدارة عيادات, تسويق طبي, حجز مواعيد طبيب, شفاء للحلول الطبية',
  canonicalUrl: 'https://shefaaportal.com',

  ogTitle: 'منصة شفاء الطبية - موقعك الطبي وتواجدك الرقمي بين يديك',
  ogDescription: 'ابنِ هويتك الرقمية كطبيب واستقبل حجوزات المرضى مباشرة مع منصة شفاء الطبية الأولى في الشرق الأوسط.',
  ogImageUrl: 'https://j.top4top.io/p_3849ast0z1.jpg',

  googleVerificationCode: 'google-site-verification=XYZ1234567890ABCDEF',
  gaMeasurementId: 'G-7X9Y2Z4W1V',
  gtmId: 'GTM-K9L8M7N',

  autoSitemap: true,
  lastSitemapUpdate: '2026-07-25 18:30',
  sitemapPagesCount: 42,

  autoRobots: true,
  robotsTxtContent: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /login/\nDisallow: /secretary/\n\nSitemap: https://shefaaportal.com/sitemap.xml`,

  enableSchema: true,
  schemaType: 'MedicalOrganization',

  allowIndexing: true,
  noIndexPages: ['/admin', '/login', '/secretary'],
  autoCanonical: true,

  enableBreadcrumbSchema: true,
  enableFaqSchema: true,
  enableArticleSchema: true,
  enableSearchBoxSchema: true,
  enableOrganizationSchema: true,
  enableOpenGraph: true,
  enableTwitterCard: true,

  autoCompressImages: true,
  webpConversion: true,
  lazyLoading: true,
  minifyHtml: true,
  minifyCss: true,
  minifyJs: true,
  browserCache: true,
  gzipCompression: true,
};

export interface LandingPageConfig {
  seo?: SEOSettingsConfig;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    secondaryCtaText?: string;
    videoUrl: string;
    mobileBgUrl: string;
    desktopBgUrl: string;
  };
  features: {
    title: string;
    subtitle: string;
    categories: FeatureCategoryConfig[];
  };
  pricing: {
    title: string;
    subtitle: string;
    plan5Months: PricingPlanConfig;
    plan1Year: PricingPlanConfig;
    ctaText: string;
  };
  clientWorks: {
    title: string;
    subtitle: string;
    featuredDoctorIds?: string[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: FAQConfigItem[];
  };
  contact: {
    title: string;
    subtitle: string;
    whatsappNumber: string;
    placeholder: string;
    buttonText: string;
  };
  login: {
    headerLoginButtonText: string;
    title: string;
    subtitle: string;
    logoUrl?: string;
  };
  createSite: {
    headerCtaButtonText: string;
    heroCtaButtonText: string;
    title: string;
    subtitle: string;
    submitButtonText: string;
    successAlertText: string;
  };
  footer?: {
    logoUrl?: string;
    description?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    youtubeUrl?: string;
    copyrightText?: string;
  };
}

export const DEFAULT_LANDING_CONFIG: LandingPageConfig = {
  seo: DEFAULT_SEO_CONFIG,
  hero: {
    badge: 'المنصة الأولى لبناء الهوية الرقمية للأطباء',
    title: 'بروفايل احترافي يعكس خبرتك الطبية',
    subtitle: 'من خلال موقعنا يمكنك إنشاء بروفايل طبي احترافي يعرض خبراتك وخدماتك مع نظام حجز ذكي ولوحة تحكم متكاملة دون أي عمولات على الحجوزات',
    primaryCtaText: 'أنشئ الآن',
    secondaryCtaText: 'استكشف الباقات',
    videoUrl: '5xMVNCTwwPo',
    mobileBgUrl: 'https://l.top4top.io/p_3849qe5681.jpg',
    desktopBgUrl: 'https://j.top4top.io/p_3849ast0z1.jpg'
  },
  features: {
    title: 'المميزات',
    subtitle: 'أنشئ بروفايل طبي احترافي لعيادتك، واعرض خدماتك ومواعيدك ووسائل التواصل لتسهيل وصول المرضى إليك',
    categories: [
      {
        id: 'cat-1',
        title: 'البروفايل الطبي',
        iconName: 'user',
        items: [
          'نبذة عنك ومؤهلاتك العلمية',
          'الخدمات والعروض والأسعار',
          'معرض صور العيادة',
          'رابط شخصي باسمك',
          'إضافة أكثر من فرع للعيادة',
          'تصميم احترافي'
        ]
      },
      {
        id: 'cat-2',
        title: 'إدارة المواعيد',
        iconName: 'calendar',
        items: [
          'حجز المواعيد بسهولة',
          'مواعيد العمل وجدول العيادة',
          'إدارة وتنظيم المواعيد',
          'تأكيد أو إلغاء الحجز',
          'إجازات الطبيب والاستثناءات',
          'تأكيد الحجز عبر واتساب'
        ]
      },
      {
        id: 'cat-3',
        title: 'التسويق والثقة',
        iconName: 'star',
        items: [
          'تقييمات وآراء المرضى',
          'QR Code لمشاركة بروفايلك',
          'خرائط Google لموقع العيادة',
          'روابط السوشيال ميديا',
          'توثيق البروفايل',
          'إضافة الشهادات'
        ]
      },
      {
        id: 'cat-4',
        title: 'الإدارة والدعم',
        iconName: 'shield',
        items: [
          'لوحة تحكم سهلة الاستخدام',
          'يعمل على جميع الأجهزة',
          'دعم فني متواصل',
          'تحديثات وتطوير مستمر',
          'إدارة طلبات حجوزات المرضى',
          'تعديل بيانات البروفايل'
        ]
      }
    ]
  },
  pricing: {
    title: 'باقات الاشتراك',
    subtitle: 'اختر الباقة المناسبة لتفعيل بروفايلك الطبي',
    plan5Months: {
      title: 'اشتراك لمدة 6 أشهر',
      price: '1500',
      period: 'ج.م / 6 أشهر',
      discountText: 'عرض خاص',
      features: [
        'جميع المميزات والخصائص',
        'تفعيل سريع خلال 24 ساعة',
        'دعم فني طوال فترة الاشتراك',
        'تحديثات مستقبلية مجانية'
      ]
    },
    plan1Year: {
      title: 'اشتراك لمدة سنة (العرض الأوفر)',
      price: '2500',
      period: 'ج.م / سنة',
      discountText: 'وفر 500 جنيه',
      features: [
        'جميع المميزات والخصائص',
        'تفعيل سريع خلال 24 ساعة',
        'دعم فني طوال فترة الاشتراك',
        'تحديثات مستقبلية مجانية'
      ]
    },
    ctaText: 'اشترك الآن'
  },
  clientWorks: {
    title: 'سابقة الأعمال',
    subtitle: 'نماذج حية لأطباء يستخدمون المنصة لبناء هويتهم الرقمية واستقبال الحجوزات',
    featuredDoctorIds: []
  },
  faq: {
    title: 'الأسئلة الشائعة',
    subtitle: 'إجابات عن أهم الاستفسارات الشائعة حول المنصة وطريقة العمل',
    items: [
      {
        id: 'faq-1',
        question: 'هل يعمل على جميع الأجهزة؟',
        answer: 'نعم الموقع وجميع البروفايلات الطبية متوافقة مع الهواتف والأجهزة اللوحية وأجهزة الكمبيوتر'
      },
      {
        id: 'faq-2',
        question: 'هل يوجد حجز مواعيد؟',
        answer: 'نعم، يوفر موقعنا نظام حجز مواعيد إلكتروني يتيح للمرضى حجز المواعيد بسهولة'
      },
      {
        id: 'faq-3',
        question: 'هل يمكن تعديل بياناتي؟',
        answer: 'نعم يمكنك تعديل بيانات البروفايل الطبي وتحديثها في أي وقت من خلال لوحة التحكم'
      },
      {
        id: 'faq-4',
        question: 'هل يوجد دعم فني؟',
        answer: 'نعم فريق الدعم الفني متاح لمساعدتك والرد على جميع استفساراتك'
      }
    ]
  },
  contact: {
    title: 'تواصل معنا',
    subtitle: 'فريق الدعم الفني متواجد لمساعدتك',
    whatsappNumber: '201099112233',
    placeholder: 'اكتب رسالتك هنا...',
    buttonText: 'واتساب'
  },
  login: {
    headerLoginButtonText: 'تسجيل الدخول',
    title: 'تسجيل الدخول',
    subtitle: 'مرحباً بك مجدداً! قم بتسجيل الدخول للوصول إلى لوحة التحكم',
    logoUrl: 'https://i.top4top.io/p_3857n94r80.png'
  },
  createSite: {
    headerCtaButtonText: 'أنشئ الآن',
    heroCtaButtonText: 'أنشئ الآن',
    title: 'أنشئ بروفايلك الطبي الآن',
    subtitle: 'قم بملء البيانات التالية وسنقوم بإنشاء بروفايلك الطبي وتفعيله فوراً',
    submitButtonText: 'إنشاء البروفايل الطبي',
    successAlertText: 'تم تسجيل طلبك بنجاح! سيتم مراجعته والتواصل معك للتفعيل.'
  },
  footer: {
    logoUrl: 'https://k.top4top.io/p_38573eitn0.png',
    description: 'منصة متكاملة لإنشاء بروفايلات احترافية للأطباء وإدارة حضورهم الرقمي بسهولة.',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    youtubeUrl: 'https://youtube.com',
    copyrightText: '© 2026 Dr Profile. All rights reserved.'
  }
};

export interface SystemSpecialty {
  id: string;
  name: string;
  count: number;
}

// Global state model for the SaaS prototype
export interface SaaSState {
  doctors: Doctor[];
  appointments: Appointment[];
  specialties: SystemSpecialty[];
  currentDoctorId: string | null; // Null if not logged in
  isAdminLoggedIn: boolean;
}

// Initial realistic seed data for the medical platform
export const INITIAL_SPECIALTIES: SystemSpecialty[] = [
  { id: 'pediatric', name: 'أطفال', count: 15 },
  { id: 'internal', name: 'باطنة', count: 12 },
  { id: 'derma', name: 'جلدية', count: 8 },
  { id: 'dentist', name: 'أسنان', count: 14 },
  { id: 'obgyn', name: 'نساء وتوليد', count: 11 },
  { id: 'cardio', name: 'قلب', count: 6 },
  { id: 'ortho', name: 'عظام', count: 9 },
  { id: 'neurology', name: 'مخ وأعصاب', count: 5 },
  { id: 'ent', name: 'أنف وأذن وحنجرة', count: 7 },
  { id: 'psychiatry', name: 'نفسي', count: 4 },
  { id: 'family-med', name: 'طب الأسرة', count: 10 },
  { id: 'emergency', name: 'طب طوارئ', count: 3 },
  { id: 'surgery', name: 'جراحة عامة', count: 8 },
  { id: 'urology', name: 'مسالك بولية', count: 6 },
  { id: 'endo', name: 'غدد وسكر', count: 5 },
  { id: 'radiology', name: 'أشعة', count: 4 },
  { id: 'labs', name: 'تحاليل طبية', count: 9 },
  { id: 'infectious', name: 'أمراض معدية', count: 3 },
  { id: 'physio', name: 'علاج طبيعي', count: 7 },
  { id: 'physio-injury', name: 'علاج طبيعي وإصابات', count: 5 },
  { id: 'orthodontics', name: 'تقويم أسنان', count: 6 },
  { id: 'endodontics', name: 'حشوات وعلاج الجذور', count: 8 },
  { id: 'periodontics', name: 'أمراض اللثة', count: 4 },
  { id: 'implants', name: 'زراعة الأسنان', count: 11 }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-pending-1',
    name: 'د. أسامة مصطفى رضوان',
    nameEn: 'osama-radwan',
    specialty: 'derma',
    jobTitle: 'أخصائي التجميل والعلاج بالليزر وزراعة الشعر - طلب جديد',
    email: 'osama.radwan@gmail.com',
    phone: '01099887711',
    whatsapp: '201099887711',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    bio: 'طبيب تجميل وجلدية يطلب الانضمام للمنصة وإنشاء بروفايل طبي مع باقة الاشتراك السنوية.',
    experience: 8,
    branches: [
      { id: 'br-p1', name: 'عيادة مدينة نصر', address: 'مدينة نصر - شارع الطيران - برج الأطباء', phone: '01099887711', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-p1', name: 'فحص نضارة البشرة وجلسات الليزر', price: 600, duration: '30 دقيقة', description: 'جلسات العناية المتكاملة بالبشرة واستعادة النضارة.' }
    ],
    workingHours: [
      { day: 'السبت', isAvailable: true, start: '16:00', end: '21:00' },
      { day: 'الاثنين', isAvailable: true, start: '16:00', end: '21:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [],
    socials: { instagram: 'https://instagram.com' },
    isActiveSubscription: false,
    approvalStatus: 'pending',
    subscriptionType: 'annual',
    registeredAt: '2026-07-26'
  },
  {
    id: 'doc-pending-2',
    name: 'د. سارة عبد الحميد صبري',
    nameEn: 'sara-sabry',
    specialty: 'pediatric',
    jobTitle: 'استشارية طب الأطفال والحديثي الولادة وتغذية الأطفال',
    email: 'sara.sabry@hotmail.com',
    phone: '01233445566',
    whatsapp: '201233445566',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600',
    bio: 'استشارية أطفال تطلب الانضمام وتأكيد تفعيل الحساب عبر المنصة.',
    experience: 10,
    branches: [
      { id: 'br-p2', name: 'عيادة الشروق', address: 'مدينة الشروق - المركز الطبي الأول', phone: '01233445566', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-p2', name: 'متابعة النمو والتغذية والمطاعيم', price: 400, duration: '20 دقيقة', description: 'متابعة حديثي الولادة والأطفال والنمو البدني والعقلي.' }
    ],
    workingHours: [
      { day: 'الأحد', isAvailable: true, start: '14:00', end: '19:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [],
    socials: { facebook: 'https://facebook.com' },
    isActiveSubscription: false,
    approvalStatus: 'pending',
    subscriptionType: '6months',
    registeredAt: '2026-07-26'
  },
  {
    id: 'doc-pending-3',
    name: 'د. حاتم الشربيني السعيد',
    nameEn: 'hatem-elsherbini',
    specialty: 'surgery',
    jobTitle: 'استشاري جراحة الجهاز الهضمي والمناظير - دكتوراه القصر العيني',
    email: 'hatem.elsherbini@yahoo.com',
    phone: '01155443322',
    whatsapp: '201155443322',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    bio: 'جراح استشاري يطلب الانضمام وتأكيد التفعيل عبر المنصة.',
    experience: 14,
    branches: [
      { id: 'br-p3', name: 'عيادة المهندسين', address: 'المهندسين - شارع جامعة الدول العربية', phone: '01155443322', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-p3', name: 'مناظير السمنة والجهاز الهضمي', price: 1000, duration: '45 دقيقة', description: 'تشخيص وعلاج مناظير المعدة والقولون.' }
    ],
    workingHours: [
      { day: 'الثلاثاء', isAvailable: true, start: '17:00', end: '22:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [],
    socials: {},
    isActiveSubscription: false,
    approvalStatus: 'pending',
    subscriptionType: 'annual',
    registeredAt: '2026-07-26'
  },
  {
    id: 'doc-1',
    name: 'د. محمد جابر السعدني',
    nameEn: 'mohamed-jaber',
    specialty: 'dentist',
    jobTitle: 'استشاري زراعة وتجميل الأسنان - عضو الجمعية الألمانية لزراعة الأسنان',
    email: 'mohamed.jaber@shefaaportal.com',
    phone: '01012345678',
    whatsapp: '201012345678',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    bio: 'أكثر من ١٥ عاماً من الخبرة في مجال تجميل وزراعة الأسنان، نسعى دائماً لتقديم أحدث التقنيات الطبية لضمان تجربة علاجية مريحة ونتائج تدوم مدى الحياة.',
    experience: 15,
    branches: [
      { id: 'br-1', name: 'فرع القاهرة الجديدة', address: 'التجمع الخامس - شارع التسعين الشمالي - مجمع العيادات الطبي - الدور الثالث', phone: '0223456781', mapUrl: 'https://maps.google.com' },
      { id: 'br-2', name: 'فرع مصر الجديدة', address: 'مصر الجديدة - شارع الميرغني - برج الأطباء - الدور الأول', phone: '0223456782', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-1', name: 'زراعة الأسنان الفورية بأحدث الأنظمة الألمانية', price: 12000, duration: '45 دقيقة', description: 'زراعة السن المفقود في جلسة واحدة بدون ألم باستخدام تقنيات التوجيه الرقمي الثلاثي الأبعاد.' },
      { id: 'srv-2', name: 'ابتسامة هوليود وتجميل الأسنان بالفينير', price: 25000, duration: '60 دقيقة', description: 'تصميم ابتسامة متناسقة وجذابة تناسب ملامح الوجه باستخدام عدسات الفينير واللومينير فائقة الرقة.' },
      { id: 'srv-3', name: 'علاج جذور الأسنان وحشو العصب في جلسة واحدة', price: 1500, duration: '30 دقيقة', description: 'تنظيف وتطهير القنوات العصبية وحشوها بأحدث الأجهزة الدوارة في جلسة واحدة بدون أي ألم.' }
    ],
    workingHours: [
      { day: 'السبت', isAvailable: true, start: '14:00', end: '21:00' },
      { day: 'الأحد', isAvailable: false, start: '14:00', end: '21:00' },
      { day: 'الاثنين', isAvailable: true, start: '14:00', end: '21:00' },
      { day: 'الثلاثاء', isAvailable: true, start: '14:00', end: '21:00' },
      { day: 'الأربعاء', isAvailable: false, start: '14:00', end: '21:00' },
      { day: 'الخميس', isAvailable: true, start: '14:00', end: '21:00' },
      { day: 'الجمعة', isAvailable: false, start: '14:00', end: '21:00' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=800'
    ],
    videos: [
      'https://www.w3schools.com/html/mov_bbb.mp4'
    ],
    reviews: [
      { id: 'rev-1', patientName: 'أحمد محمود العشري', rating: 5, comment: 'دكتور ممتاز جداً وخلوق، عيادة نظيفة جداً ومعقمة والخدمة متميزة تليق بالمستوى.', date: '2026-07-01' },
      { id: 'rev-2', patientName: 'د. ياسمين فاروق', rating: 5, comment: 'الزراعة تمت بنجاح وبدون أي ألم يذكر. أنصح بشدة بالتعامل مع الدكتور محمد جابر لخبرته العالية.', date: '2026-07-10' }
    ],
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    },
    isActiveSubscription: true,
    registeredAt: '2026-01-10',
    approvalStatus: 'approved',
    subscriptionType: 'annual',
    isVerified: true,
    whiteLabel: false,
    siteType: 'profile',
    secretaries: [
      {
        id: 'sec-1',
        name: 'سارة أحمد (سكرتيرة المواعيد)',
        email: 'sara@clinic.com',
        phone: '01012345678',
        password: '123456',
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
        name: 'منى محمد (سكرتيرة تنفيذية)',
        email: 'mona@clinic.com',
        phone: '01198765432',
        password: '123456',
        status: 'active',
        permissions: {
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
        }
      }
    ]
  },
  {
    id: 'doc-2',
    name: 'د. منى سالم الهواري',
    nameEn: 'mona-salem',
    specialty: 'derma',
    jobTitle: 'أخصائية الجلدية والتجميل والليزر - ماجستير الأمراض الجلدية بجامعة عين شمس',
    email: 'mona.salem@shefaaportal.com',
    phone: '01198765432',
    whatsapp: '201198765432',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    bio: 'عيادتنا متخصصة في توفير أحدث الحلول التجميلية والعلاجية للعناية بالبشرة والشعر باستخدام أحدث تقنيات الليزر وحقن الفيلر والبوتكس.',
    experience: 10,
    branches: [
      { id: 'br-3', name: 'عيادة المهندسين الرئيسية', address: 'المهندسين - شارع جامعة الدول العربية - برج الأطباء الاستشاريين - الدور الرابع', phone: '0233451234', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-4', name: 'جلسة حقن الفيلر لتحديد الوجنتين والشفايف', price: 4500, duration: '30 دقيقة', description: 'جلسة سريعة وآمنة لإعطاء حجم طبيعي وتنسيق ملامح الوجه بأفضل الخامات السويسرية المعتمدة عالمياً.' },
      { id: 'srv-5', name: 'علاج آثار حب الشباب بالليزر الكربوني والفراكشنال', price: 1200, duration: '20 دقيقة', description: 'تقشير الجلد وتحفيز الكولاجين للتخلص من الندبات والتصبغات واستعادة نضارة البشرة بشكل ملحوظ.' }
    ],
    workingHours: [
      { day: 'السبت', isAvailable: true, start: '12:00', end: '18:00' },
      { day: 'الأحد', isAvailable: true, start: '12:00', end: '18:00' },
      { day: 'الاثنين', isAvailable: false, start: '12:00', end: '18:00' },
      { day: 'الثلاثاء', isAvailable: true, start: '12:00', end: '18:00' },
      { day: 'الأربعاء', isAvailable: true, start: '12:00', end: '18:00' },
      { day: 'الخميس', isAvailable: false, start: '12:00', end: '18:00' },
      { day: 'الجمعة', isAvailable: false, start: '12:00', end: '18:00' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800'
    ],
    videos: [],
    reviews: [
      { id: 'rev-3', patientName: 'سارة عبد الرحمن', rating: 5, comment: 'شغل الفيلر مع الدكتورة منى خيالي وطبيعي جداً! يدها خفيفة جداً في الحقن ومريحة.', date: '2026-07-05' }
    ],
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com'
    },
    isActiveSubscription: true,
    registeredAt: '2026-03-15',
    approvalStatus: 'approved',
    subscriptionType: '6months',
    isVerified: false,
    whiteLabel: false,
  },
  {
    id: 'doc-3',
    name: 'د. أحمد رأفت الشامي',
    nameEn: 'ahmed-raafat',
    specialty: 'pediatric',
    jobTitle: 'استشاري طب الأطفال وحديثي الولادة - دكتوراه طب الأطفال بجامعة القاهرة',
    email: 'ahmed.raafat@shefaaportal.com',
    phone: '01233445566',
    whatsapp: '201233445566',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    bio: 'نقدم رعاية طبية متخصصة وشاملة للأطفال منذ الولادة وحتى سن المراهقة، مع متابعة النمو والتطور الحركي والعقلي وتوفير جداول التطعيمات الأساسية والإضافية.',
    experience: 18,
    branches: [
      { id: 'br-4', name: 'عيادة المعادي التخصصية للأطفال', address: 'المعادي - دجلة - شارع المشتل - مجمع الأمل الطبي - الدور الثاني', phone: '025567890', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-6', name: 'فحص ومتابعة النمو لحديثي الولادة والرضع', price: 400, duration: '20 دقيقة', description: 'قياس الوزن والطول ومحيط الرأس وتقييم تطور الطفل ومناقشة التغذية السليمة مع الأم.' }
    ],
    workingHours: [
      { day: 'السبت', isAvailable: true, start: '16:00', end: '22:00' },
      { day: 'الأحد', isAvailable: true, start: '16:00', end: '22:00' },
      { day: 'الاثنين', isAvailable: true, start: '16:00', end: '22:00' },
      { day: 'الثلاثاء', isAvailable: true, start: '16:00', end: '22:00' },
      { day: 'الأربعاء', isAvailable: true, start: '16:00', end: '22:00' },
      { day: 'الخميس', isAvailable: false, start: '16:00', end: '22:00' },
      { day: 'الجمعة', isAvailable: false, start: '16:00', end: '22:00' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1502740479091-6398b19d99f4?auto=format&fit=crop&q=80&w=800'
    ],
    videos: [],
    reviews: [
      { id: 'rev-4', patientName: 'منى عبد الله', rating: 5, comment: 'الدكتور أحمد صبور جداً مع الأطفال، يفحص بضمير ويبسط المعلومات الطبية للأمهات.', date: '2026-07-09' }
    ],
    socials: {
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com'
    },
    isActiveSubscription: true,
    registeredAt: '2026-02-20'
  },
  {
    id: 'doc-4',
    name: 'د. خالد عبد الرحمن العمران',
    nameEn: 'khaled-al-omran',
    specialty: 'ortho',
    jobTitle: 'استشاري جراحة العظام والمفاصل والمناظير - زميل كلية الجراحين الملكية',
    email: 'khaled.omran@shefaaportal.com',
    phone: '01055544433',
    whatsapp: '201055544433',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    bio: 'متخصص في عمليات تغيير المفاصل، ومناظير الركبة والكتف، وعلاج إصابات الملاعب والكسور المعقدة بأحدث التقنيات الطبية.',
    experience: 16,
    branches: [
      { id: 'br-5', name: 'فرع الشيخ زايد', address: 'الشيخ زايد - هايبر وان - المركز الطبي التخصصي', phone: '023748231', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-7', name: 'متابعة وفحص خشونة الركبة والمفاصل', price: 500, duration: '20 دقيقة', description: 'تقييم درجة الخشونة ووضع خطة علاجية مخصصة تشمل العلاج الفيزيائي والحقن الموضعي.' }
    ],
    workingHours: [
      { day: 'السبت', isAvailable: true, start: '15:00', end: '20:00' },
      { day: 'الاثنين', isAvailable: true, start: '15:00', end: '20:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [
      { id: 'rev-5', patientName: 'محمود عبد الكريم', rating: 5, comment: 'طبيب محترف وخلوق جداً، عولجت من إصابة بالركبة والحمد لله عدت لممارسة الرياضة.', date: '2026-07-08' }
    ],
    socials: { facebook: 'https://facebook.com' },
    isActiveSubscription: true,
    registeredAt: '2026-04-01'
  },
  {
    id: 'doc-5',
    name: 'د. رانيا نبيل الشريف',
    nameEn: 'rania-al-sherif',
    specialty: 'obgyn',
    jobTitle: 'استشارية أمراض النساء والتوليد وعلاج تأخر الإنجاب',
    email: 'rania.sherif@shefaaportal.com',
    phone: '01222334455',
    whatsapp: '201222334455',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600',
    bio: 'متابعة الحمل الحرج والولادة بدون ألم، وتشخيص وعلاج حالات تأخر الحمل وتكيس المبايض بأحدث وسائل السونار رباعي الأبعاد.',
    experience: 12,
    branches: [
      { id: 'br-6', name: 'عيادة التجمع الخامس', address: 'التجمع الخامس - شارع الستين - مول الحكيم الطبي', phone: '022987123', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-8', name: 'متابعة الحمل والسونار رباعي الأبعاد 4D', price: 600, duration: '30 دقيقة', description: 'رؤية الجنين بوضوح تام والاطمئنان على سلامة الأعضاء والنمو السليم مع تسليم صور ملونة وفيديو.' }
    ],
    workingHours: [
      { day: 'الأحد', isAvailable: true, start: '13:00', end: '19:00' },
      { day: 'الثلاثاء', isAvailable: true, start: '13:00', end: '19:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [],
    socials: { instagram: 'https://instagram.com' },
    isActiveSubscription: true,
    registeredAt: '2026-02-15'
  },
  {
    id: 'doc-6',
    name: 'د. يوسف حسام الدين',
    nameEn: 'youssef-hossam',
    specialty: 'cardio',
    jobTitle: 'أخصائي أمراض القلب والأوعية الدموية وقسطرة الشرايين',
    email: 'youssef.hossam@shefaaportal.com',
    phone: '01111223344',
    whatsapp: '201111223344',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    bio: 'تشخيص وعلاج ارتفاع ضغط الدم، وقصور الشرايين التاجية، واختلال ضربات القلب ومتابعة مرضى ضعف عضلة القلب والصمامات.',
    experience: 9,
    branches: [
      { id: 'br-7', name: 'عيادة وسط البلد', address: 'وسط البلد - ميدان التحرير - عمارة استراند - الدور الثاني', phone: '022776655', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-9', name: 'رسم القلب بالمجهود والموجات الصوتية (إيكو)', price: 800, duration: '40 دقيقة', description: 'تقييم كفاءة عضلة القلب وصماماته واستبعاد قصور الشرايين التاجية تحت المجهود.' }
    ],
    workingHours: [
      { day: 'الاثنين', isAvailable: true, start: '17:00', end: '21:00' },
      { day: 'الخميس', isAvailable: true, start: '17:00', end: '21:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [
      { id: 'rev-6', patientName: 'سيد أبو العز', rating: 5, comment: 'طبيب محترم جداً، قام بتشخيص حالتي بدقة وأنا منتظم على علاجه وصحتي ممتازة.', date: '2026-07-11' }
    ],
    socials: {},
    isActiveSubscription: true,
    registeredAt: '2026-05-10',
    siteType: 'profile'
  },
  {
    id: 'doc-7',
    name: 'د. هالة سمير عبد العزيز',
    nameEn: 'hala-samir',
    specialty: 'ophthalmology',
    jobTitle: 'استشارية طب وجراحة العيون والليزك وعلاج المياه البيضاء بالفاكو',
    email: 'hala.samir@shefaaportal.com',
    phone: '01099112233',
    whatsapp: '201099112233',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    bio: 'خبرة طويلة في تصحيح عيوب الإبصار بالليزك والفيمتو ليزك، وجراحات المياه البيضاء والمياه الزرقاء وتجميل الجفون.',
    experience: 14,
    branches: [
      { id: 'br-8', name: 'مركز العيون بالمهندسين', address: 'المهندسين - شارع البطل أحمد عبد العزيز - برج النور - الدور الخامس', phone: '023541122', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-10', name: 'فحص قاع العين وقياس ضغط العين والنظر', price: 450, duration: '15 دقيقة', description: 'فحص شامل للعين والنظر للكشف المبكر عن المياه الزرقاء وتأثير السكري على الشبكية.' }
    ],
    workingHours: [
      { day: 'السبت', isAvailable: true, start: '16:00', end: '20:00' },
      { day: 'الأربعاء', isAvailable: true, start: '16:00', end: '20:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [],
    socials: { facebook: 'https://facebook.com', instagram: 'https://instagram.com' },
    isActiveSubscription: true,
    registeredAt: '2026-03-22',
    siteType: 'profile'
  },
  {
    id: 'doc-8',
    name: 'د. طارق محمود سليمان',
    nameEn: 'tarek-soliman',
    specialty: 'neurology',
    jobTitle: 'استشاري أمراض المخ والأعصاب والعمود الفقري - دكتوراه جامعة عين شمس',
    email: 'tarek.soliman@shefaaportal.com',
    phone: '01122339900',
    whatsapp: '201122339900',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    bio: 'متخصص في علاج جلطات وسكتات الدماغ، الصرع والشلل الرعاش، الزهايمر، الصداع المزمن والتهاب الأعصاب الطرفية.',
    experience: 20,
    branches: [
      { id: 'br-9', name: 'فرع الدقي الرئيسي', address: 'الدقي - شارع التحرير - بجوار محطة المترو - برج الأطباء الاستشاريين', phone: '023348123', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-11', name: 'جلسات تخطيط الدماغ والأعصاب الكهربائي', price: 900, duration: '45 دقيقة', description: 'رسم كهربائي للمخ لتشخيص التشنجات والصرع وقياس كفاءة مسارات الأعصاب بالأطراف.' }
    ],
    workingHours: [
      { day: 'الأحد', isAvailable: true, start: '18:00', end: '22:00' },
      { day: 'الثلاثاء', isAvailable: true, start: '18:00', end: '22:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [
      { id: 'rev-7', patientName: 'فاطمة الكردي', rating: 5, comment: 'دكتور متمكن جداً وهادئ، شخّص التهاب عصب اليد وبدأت بالتحسن السريع مع دوائه.', date: '2026-07-12' }
    ],
    socials: {},
    isActiveSubscription: true,
    registeredAt: '2026-01-05'
  },
  {
    id: 'doc-9',
    name: 'د. نادية فوزي الغندور',
    nameEn: 'nadia-elghandour',
    specialty: 'psychiatry',
    jobTitle: 'أخصائية الطب النفسي وعلاج الإدمان والاستشارات الأسرية',
    email: 'nadia.ghandour@shefaaportal.com',
    phone: '01233441122',
    whatsapp: '201233441122',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    bio: 'تقديم الجلسات النفسية لعلاج الاكتئاب، القلق، الوسواس القهري، واضطرابات المزاج، بالإضافة للاستشارات الزوجية وتعديل سلوك الأطفال.',
    experience: 11,
    branches: [
      { id: 'br-10', name: 'عيادة نيو هوب بالمعادي', address: 'المعادي - شارع الـ ٩ - فوق صيدلية العزبي - الدور الثالث', phone: '022359123', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-12', name: 'جلسة علاج معرفي سلوكي (CBT)', price: 700, duration: '50 دقيقة', description: 'جلسة علاجية فردية تركز على تعديل الأفكار السلبية والسلوكيات لتعزيز الصحة النفسية ومقاومة الضغوط.' }
    ],
    workingHours: [
      { day: 'الاثنين', isAvailable: true, start: '14:00', end: '20:00' },
      { day: 'الخميس', isAvailable: true, start: '14:00', end: '20:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [],
    socials: { twitter: 'https://twitter.com' },
    isActiveSubscription: true,
    registeredAt: '2026-06-01'
  },
  {
    id: 'doc-10',
    name: 'د. شريف عبد العظيم صقر',
    nameEn: 'sherif-sakr',
    specialty: 'internal',
    jobTitle: 'أخصائي الأمراض الباطنية والجهاز الهضمي والمناظير',
    email: 'sherif.sakr@shefaaportal.com',
    phone: '01011119999',
    whatsapp: '201011119999',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    bio: 'تشخيص وعلاج قرحة المعدة، القولون العصبي، الكبد الدهني، الغدد والسكري وضغط الدم ومشاكل سوء الهضم والتغذية العلاجية.',
    experience: 13,
    branches: [
      { id: 'br-11', name: 'عيادة هليوبوليس التخصصية', address: 'مصر الجديدة - ميدان تريومف - برج أطباء تريومف - الدور الثاني', phone: '022641123', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-13', name: 'فحص ومتابعة السكري والضغط وعسر الهضم', price: 400, duration: '20 دقيقة', description: 'قياس المؤشرات، تعديل جرعات العلاج وتقديم إرشادات غذائية متكاملة لمرضى السكري المزمن.' }
    ],
    workingHours: [
      { day: 'السبت', isAvailable: true, start: '17:00', end: '22:00' },
      { day: 'الثلاثاء', isAvailable: true, start: '17:00', end: '22:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [
      { id: 'rev-8', patientName: 'خالد توفيق', rating: 5, comment: 'دكتور ممتاز، شرح حالتي بالتفصيل وحذرني من بعض الأدوية الخاطئة، جزاه الله خيراً.', date: '2026-07-04' }
    ],
    socials: {},
    isActiveSubscription: true,
    registeredAt: '2026-02-28'
  },
  {
    id: 'doc-11',
    name: 'د. ماجدة كمال الدين سليمان',
    nameEn: 'magda-kamal',
    specialty: 'ent',
    jobTitle: 'استشارية جراحة الأنف والأذن والحنجرة - ماجستير القصر العيني',
    email: 'magda.kamal@shefaaportal.com',
    phone: '01122223333',
    whatsapp: '201122223333',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600',
    bio: 'متخصصة في جراحات اللوزتين واللحمية بمساعدة الكوبليشن، علاج الجيوب الأنفية بالمناظير، وعلاج الدوار واختلال التوازن وضعف السمع.',
    experience: 17,
    branches: [
      { id: 'br-12', name: 'عيادة شبرا الرئيسية', address: 'شبرا - شارع شبرا الرئيسي - برج الفرسان الطبي - الدور الأول', phone: '022587123', mapUrl: 'https://maps.google.com' }
    ],
    services: [
      { id: 'srv-14', name: 'تنظيف وغسيل الأذن وعلاج طنين الأذن', price: 300, duration: '15 دقيقة', description: 'إزالة الشمع بالموجات الميكروية وتطهير القناة الخارجية ووصف علاج الطنين وفحص غشاء الطبل.' }
    ],
    workingHours: [
      { day: 'الأحد', isAvailable: true, start: '15:00', end: '19:00' },
      { day: 'الأربعاء', isAvailable: true, start: '15:00', end: '19:00' }
    ],
    gallery: [],
    videos: [],
    reviews: [],
    socials: { facebook: 'https://facebook.com' },
    isActiveSubscription: true,
    registeredAt: '2026-04-10'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    doctorId: 'doc-1',
    patientName: 'عمر ياسر المصري',
    patientPhone: '01099887766',
    date: '2026-07-15',
    time: '15:30',
    branchId: 'br-1',
    status: 'approved',
    notes: 'استشارة فحص دوري لمتابعة الفينير',
    createdAt: '2026-07-13T10:00:00Z'
  },
  {
    id: 'apt-2',
    doctorId: 'doc-1',
    patientName: 'مريم محمود عبد الفتاح',
    patientPhone: '01144556677',
    date: '2026-07-16',
    time: '17:00',
    branchId: 'br-2',
    status: 'pending',
    notes: 'علاج حشو عصب وتركيب تاج أسنان',
    createdAt: '2026-07-14T09:15:00Z'
  },
  {
    id: 'apt-3',
    doctorId: 'doc-2',
    patientName: 'هند علي صبري',
    patientPhone: '01255667788',
    date: '2026-07-17',
    time: '14:00',
    branchId: 'br-3',
    status: 'pending',
    notes: 'جلسة ليزر فراكشنال لحب الشباب',
    createdAt: '2026-07-14T11:45:00Z'
  }
];

export interface DoctorBanner {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  color: 'blue' | 'emerald' | 'amber' | 'red' | 'indigo' | 'purple';
  buttonText?: string;
  buttonUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  priority: number;
  isPinned?: boolean;
  targetAudience: 'all' | 'annual' | '6months' | 'specific_doctors' | 'whitelabel_enabled' | 'whitelabel_disabled' | 'expiring_15_days' | 'expiring_30_days';
  targetDoctorIds?: string[];
  createdAt?: string;
}

export function getDoctorExpiryDate(doc: Doctor): Date {
  if (doc.subscriptionEndDate) {
    return new Date(doc.subscriptionEndDate);
  }
  const regDate = doc.registeredAt ? new Date(doc.registeredAt) : new Date();
  const subType = doc.subscriptionType || 'annual';
  const monthsToAdd = subType === '6months' ? 6 : 12;
  const expiry = new Date(regDate);
  expiry.setMonth(expiry.getMonth() + monthsToAdd);
  return expiry;
}

export function getDoctorDaysRemaining(doc: Doctor): number {
  const expiry = getDoctorExpiryDate(doc);
  const now = new Date();
  const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d2 = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const INITIAL_BANNERS: DoctorBanner[] = [
  {
    id: 'banner-1',
    title: '📢 تحديث جديد: إضافة أقسام السكرتارية وتأكيد الحجوزات المباشر عبر الواتساب!',
    description: 'يمكنك الآن إضافة وتعيين سكرتيرة لعيادتك مع تحديد الصلاحيات ومتابعة التقارير اليومية بسهولة.',
    color: 'blue',
    icon: 'sparkles',
    buttonText: 'إدارة السكرتارية',
    buttonUrl: '#secretaries',
    isActive: true,
    priority: 1,
    isPinned: true,
    targetAudience: 'all',
    createdAt: '2026-07-01'
  },
  {
    id: 'banner-2',
    title: '🌟 عرض خاص لأطباء الباقة السنوية: ترقية المظهر الهويتي مجاناً!',
    description: 'استمتع بتفعيل التخصيص الكامل للهوية البصرية واللوجو الخاص بعضويتك السنوية.',
    color: 'amber',
    icon: 'crown',
    buttonText: 'استعراض المميزات',
    buttonUrl: '#account',
    isActive: true,
    priority: 2,
    isPinned: false,
    targetAudience: 'annual',
    createdAt: '2026-07-10'
  }
];

