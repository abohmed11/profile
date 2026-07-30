/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Subscription from './components/Subscription';
import ClientWorks from './components/ClientWorks';
import FAQ from './components/FAQ';
import CreateSiteForm from './components/CreateSiteForm';
import ContactWhatsApp from './components/ContactWhatsApp';
import Footer from './components/Footer';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DoctorProfile from './components/DoctorProfile';
import AdminPanel from './components/AdminPanel';

import { 
  Doctor, Appointment, Review, LandingPageConfig, DEFAULT_LANDING_CONFIG,
  INITIAL_DOCTORS, INITIAL_APPOINTMENTS, INITIAL_SPECIALTIES,
  DoctorBanner, INITIAL_BANNERS
} from './types';
import { AlertCircle, Stethoscope } from 'lucide-react';
import {
  subscribeDoctors, saveDoctorInDb, seedDoctorsIfEmpty,
  subscribeAppointments, saveAppointmentInDb, seedAppointmentsIfEmpty,
  subscribeLandingConfig, saveLandingConfigInDb, seedLandingConfigIfEmpty,
  subscribeBanners, saveBannersInDb, seedBannersIfEmpty,
  seedSpecialtiesIfEmpty
} from './lib/firebase';
import {
  saveDoctorToSupabase,
  saveAppointmentToSupabase,
  saveLandingConfigToSupabase,
  saveBannersToSupabase,
  seedAllDataToSupabase
} from './lib/supabase';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'dashboard' | 'admin' | 'dr'>('landing');
  
  // Auth state
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'doctor' | 'secretary' | null>(null);
  const [currentDoctorId, setCurrentDoctorId] = useState<string | null>(null);
  const [currentSecretaryId, setCurrentSecretaryId] = useState<string | null>(null);
  
  // Public viewing slug/English username (e.g. "mohamed-jaber")
  const [viewingDoctorEn, setViewingDoctorEn] = useState<string | null>(null);

  // Global dynamic states
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [preselectedPlan, setPreselectedPlan] = useState<'5months' | '1year'>('5months');
  const [landingConfig, setLandingConfig] = useState<LandingPageConfig>(() => {
    try {
      const saved = localStorage.getItem('dr_landing_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load saved landing config", e);
    }
    return DEFAULT_LANDING_CONFIG;
  });

  const [doctorBanners, setDoctorBanners] = useState<DoctorBanner[]>(() => {
    try {
      const saved = localStorage.getItem('dr_banners');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load saved banners", e);
    }
    return INITIAL_BANNERS;
  });

  // Firestore Real-time Subscriptions and Auto-seeding
  useEffect(() => {
    // Seed initial data to Firestore if empty
    seedDoctorsIfEmpty(INITIAL_DOCTORS);
    seedAppointmentsIfEmpty(INITIAL_APPOINTMENTS);
    seedLandingConfigIfEmpty(DEFAULT_LANDING_CONFIG);
    seedBannersIfEmpty(INITIAL_BANNERS);
    seedSpecialtiesIfEmpty(INITIAL_SPECIALTIES);

    // Auto-seed to user's Supabase database initially
    seedAllDataToSupabase(INITIAL_DOCTORS, INITIAL_APPOINTMENTS, DEFAULT_LANDING_CONFIG, INITIAL_BANNERS);

    // Subscribe to Firestore collections in real-time
    const unsubDoctors = subscribeDoctors((fireDocs) => {
      if (fireDocs.length > 0) {
        setDoctors(fireDocs);
        // Automatically ensure every doctor in the database is synced to Supabase
        fireDocs.forEach(doc => {
          saveDoctorToSupabase(doc);
        });
      }
    });

    const unsubAppointments = subscribeAppointments((fireApts) => {
      if (fireApts.length > 0) {
        setAppointments(fireApts);
        // Automatically ensure every appointment is synced to Supabase
        fireApts.forEach(apt => {
          saveAppointmentToSupabase(apt);
        });
      }
    });

    const unsubConfig = subscribeLandingConfig((fireConfig) => {
      if (fireConfig) {
        setLandingConfig(fireConfig);
      }
    });

    const unsubBanners = subscribeBanners((fireBanners) => {
      if (fireBanners.length > 0) {
        setDoctorBanners(fireBanners);
      }
    });

    return () => {
      unsubDoctors();
      unsubAppointments();
      unsubConfig();
      unsubBanners();
    };
  }, []);

  const handleUpdateLandingConfig = (newConfig: LandingPageConfig) => {
    setLandingConfig(newConfig);
    saveLandingConfigInDb(newConfig);
    saveLandingConfigToSupabase(newConfig);
    try {
      localStorage.setItem('dr_landing_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error("Failed to save landing config", e);
    }
  };

  const handleUpdateBanners = (newBanners: DoctorBanner[]) => {
    setDoctorBanners(newBanners);
    saveBannersInDb(newBanners);
    saveBannersToSupabase(newBanners);
    try {
      localStorage.setItem('dr_banners', JSON.stringify(newBanners));
    } catch (e) {
      console.error("Failed to save banners", e);
    }
  };

  // Synchronize state with URL routing on load and back/forward navigation
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);

      // Check /doctor/username pattern
      const pathMatch = path.match(/\/doctor\/([^/]+)/i);
      const hashMatch = hash.match(/#(?:\/)?doctor\/([^/]+)/i);
      const queryMatch = searchParams.get('doctor') || searchParams.get('dr');

      const matchedUsername = pathMatch?.[1] || hashMatch?.[1] || queryMatch;

      if (matchedUsername) {
        const decoded = decodeURIComponent(matchedUsername);
        // Find if doctor exists
        const matchedDoc = doctors.find(d => (d.nameEn && d.nameEn.toLowerCase() === decoded.toLowerCase()) || d.id === decoded);
        if (matchedDoc) {
          setViewingDoctorEn(matchedDoc.nameEn || matchedDoc.id);
          setCurrentView('dr');
          return;
        }
      }

      // If the URL is home but we are in dr mode, go to landing (unless logged in)
      if (currentView === 'dr' && !matchedUsername) {
        if (currentUserRole === 'doctor') {
          setCurrentView('dashboard');
        } else if (currentUserRole === 'admin') {
          setCurrentView('admin');
        } else {
          setCurrentView('landing');
        }
      }
    };

    handleUrlRouting();

    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);

    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, [doctors, currentUserRole]);

  // Force scroll to top and clear any section hash on initial reload/refresh
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (window.location.hash) {
      const hashVal = window.location.hash.toLowerCase();
      // Only clear if it's not a doctor's public profile routing
      if (!hashVal.includes('doctor/')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, []);

  // Auto-scroll to top or target section hash when view shifts
  useEffect(() => {
    if (currentView === 'landing' && window.location.hash) {
      const hashVal = window.location.hash;
      if (hashVal.toLowerCase().includes('doctor/')) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }
      const targetId = hashVal.substring(1);
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 180);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentView, viewingDoctorEn]);

  // Login handler
  const handleLoginSuccess = (role: 'admin' | 'doctor' | 'secretary', doctorId?: string, secretaryId?: string) => {
    setCurrentUserRole(role);
    if (role === 'admin') {
      setCurrentView('admin');
    } else if ((role === 'doctor' || role === 'secretary') && doctorId) {
      setCurrentDoctorId(doctorId);
      setCurrentSecretaryId(secretaryId || null);
      setCurrentView('dashboard');
    }
    window.history.pushState(null, '', '/');
  };

  // Register success handler: Adds the new doctor to the system for administrator review
  const handleRegisterSuccess = (newDoc: Doctor) => {
    const pendingDoc: Doctor = { ...newDoc, approvalStatus: 'pending' };
    setDoctors(prev => [...prev, pendingDoc]);
    saveDoctorInDb(pendingDoc);
    saveDoctorToSupabase(pendingDoc);
  };

  // Logouts
  const handleLogout = () => {
    setCurrentUserRole(null);
    setCurrentDoctorId(null);
    setCurrentSecretaryId(null);
    setCurrentView('landing');
    window.history.pushState(null, '', '/');
  };

  // Patient added appointment from doctor's public site
  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments(prev => [...prev, newApt]);
    saveAppointmentInDb(newApt);
    saveAppointmentToSupabase(newApt);
  };

  // Review added from doctor's public site
  const handleAddReview = (doctorId: string, newReview: Review) => {
    setDoctors(prev => prev.map(doc => {
      if (doc.id === doctorId) {
        const updatedDoc = {
          ...doc,
          reviews: [...doc.reviews, newReview]
        };
        saveDoctorInDb(updatedDoc);
        saveDoctorToSupabase(updatedDoc);
        return updatedDoc;
      }
      return doc;
    }));
  };

  // Navigating to a specific doctor's public page
  const handleVisitDoctor = (usernameEn: string) => {
    setViewingDoctorEn(usernameEn);
    setCurrentView('dr');
    window.history.pushState({ doctor: usernameEn }, '', `/doctor/${usernameEn}`);
  };

  // Render logic
  return (
    <div className="w-full min-h-screen bg-[#FAF9F9] text-neutral-900 selection:bg-black selection:text-white" dir="rtl">
      
      {/* 1. LANDING VIEW */}
      {currentView === 'landing' && (
        <div className="w-full flex flex-col">
          <Header 
            onNavigate={(view) => {
              if (view === 'landing') {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'login') {
                setCurrentView('login');
              } else if (view === 'dashboard' && currentUserRole === 'doctor' && currentDoctorId) {
                setCurrentView('dashboard');
              } else if (view === 'admin' && currentUserRole === 'admin') {
                setCurrentView('admin');
              } else {
                setCurrentView('landing');
              }
              window.history.pushState(null, '', '/');
            }}
            userRole={currentUserRole}
            doctorId={currentDoctorId}
            doctors={doctors}
            landingConfig={landingConfig}
          />
          
          <main className="flex-1">
            <Hero onNavigate={(view) => setCurrentView(view)} landingConfig={landingConfig} />
            <Features landingConfig={landingConfig} />
            <Subscription 
              onStart={(plan) => {
                setPreselectedPlan(plan);
                document.getElementById('register-section')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              landingConfig={landingConfig}
            />
            <ClientWorks doctors={doctors} onVisitDoctor={handleVisitDoctor} landingConfig={landingConfig} />
            <FAQ landingConfig={landingConfig} />
            <CreateSiteForm 
              specialties={INITIAL_SPECIALTIES} 
              onRegisterSuccess={handleRegisterSuccess} 
              preselectedPlan={preselectedPlan}
              landingConfig={landingConfig}
            />
            <ContactWhatsApp landingConfig={landingConfig} />
          </main>

          <Footer landingConfig={landingConfig} />
        </div>
      )}

      {/* 2. LOGIN VIEW */}
      {currentView === 'login' && (
        <Login 
          doctors={doctors} 
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => {
            setCurrentView('landing');
            window.history.pushState(null, '', '/');
          }}
          landingConfig={landingConfig}
        />
      )}

      {/* 3. DOCTOR & SECRETARY PRIVATE DASHBOARD */}
      {currentView === 'dashboard' && (currentUserRole === 'doctor' || currentUserRole === 'secretary') && currentDoctorId && (
        (() => {
          const loggedDoctor = doctors.find(d => d.id === currentDoctorId);
          if (!loggedDoctor) return <div className="p-12 text-center">خطأ في استيراد بيانات الطبيب.</div>;
          
          const loggedSecretary = currentUserRole === 'secretary' && currentSecretaryId && loggedDoctor.secretaries
            ? loggedDoctor.secretaries.find(s => s.id === currentSecretaryId) || null
            : null;

          return (
            <Dashboard 
              doctor={loggedDoctor}
              loggedSecretary={loggedSecretary}
              userRole={currentUserRole}
              appointments={appointments}
              banners={doctorBanners}
              onUpdateDoctor={(updatedDoc) => {
                setDoctors(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
                saveDoctorInDb(updatedDoc);
                saveDoctorToSupabase(updatedDoc);
              }}
              onUpdateAppointments={(updatedApts) => {
                setAppointments(updatedApts);
                updatedApts.forEach(apt => {
                  saveAppointmentInDb(apt);
                  saveAppointmentToSupabase(apt);
                });
              }}
              onLogout={handleLogout}
              onPreviewPublicSite={(username) => {
                setViewingDoctorEn(username);
                setCurrentView('dr');
                window.history.pushState({ doctor: username }, '', `/doctor/${username}`);
              }}
            />
          );
        })()
      )}

      {/* 4. PLATFORM ADMINISTRATIVE DASHBOARD */}
      {currentView === 'admin' && currentUserRole === 'admin' && (
        <AdminPanel 
          doctors={doctors}
          appointments={appointments}
          specialties={INITIAL_SPECIALTIES}
          banners={doctorBanners}
          onUpdateBanners={handleUpdateBanners}
          onUpdateDoctors={(updatedDocs) => {
            setDoctors(updatedDocs);
            updatedDocs.forEach(d => {
              saveDoctorInDb(d);
              saveDoctorToSupabase(d);
            });
          }}
          onLogout={handleLogout}
          onVisitDoctor={(username) => {
            setViewingDoctorEn(username);
            setCurrentView('dr');
            window.history.pushState({ doctor: username }, '', `/doctor/${username}`);
          }}
          onLoginAsDoctor={(docId) => {
            setCurrentDoctorId(docId);
            setCurrentUserRole('doctor');
            setCurrentView('dashboard');
          }}
          landingConfig={landingConfig}
          onUpdateLandingConfig={handleUpdateLandingConfig}
        />
      )}

      {/* 5. LIVE PUBLIC DOCTOR PORTFOLIO VIEW */}
      {currentView === 'dr' && viewingDoctorEn && (
        (() => {
          const currentDoctor = doctors.find(d => d.nameEn === viewingDoctorEn || d.id === viewingDoctorEn);
          
          if (!currentDoctor) {
            return (
              <div className="w-full min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-6 text-center text-neutral-800">
                <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                <h2 className="text-xl font-bold">عذراً، لم نتمكن من العثور على هذا الملف الطبي!</h2>
                <button 
                  onClick={() => {
                    setCurrentView('landing');
                    window.history.pushState(null, '', '/');
                  }} 
                  className="mt-4 px-6 py-2 bg-black text-white rounded-xl text-xs font-bold"
                >
                  العودة للرئيسية
                </button>
              </div>
            );
          }

          // If Admin has deactivated this doctor's subscription
          if (!currentDoctor.isActiveSubscription) {
            return (
              <div className="w-full min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-yellow-500 shadow-xl">
                  <Stethoscope className="w-10 h-10" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h2 className="text-2xl font-black tracking-tight text-white">عذراً، هذا الموقع الطبي معطل مؤقتاً</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed font-normal">
                    الموقع الطبي للأستاذ دكتور <span className="font-bold text-white">{currentDoctor.name}</span> معطل مؤقتاً لمراجعة الاشتراك وتحديثات النطاق المعتمدة من قبل إدارة المنصة.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    if (currentUserRole === 'admin') {
                      setCurrentView('admin');
                    } else if (currentUserRole === 'doctor') {
                      setCurrentView('dashboard');
                    } else {
                      setCurrentView('landing');
                    }
                    window.history.pushState(null, '', '/');
                  }} 
                  className="px-6 py-3 bg-white text-black hover:bg-neutral-200 font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  الذهاب للصفحة الرئيسية
                </button>
              </div>
            );
          }

          return (
            <DoctorProfile 
              doctor={currentDoctor}
              appointments={appointments}
              onAddAppointment={handleAddAppointment}
              onAddReview={handleAddReview}
              onBackToPortal={() => {
                // If logged in as Doctor or Admin, return them back to dashboard/admin instead of pure landing
                if (currentUserRole === 'doctor') {
                  setCurrentView('dashboard');
                } else if (currentUserRole === 'admin') {
                  setCurrentView('admin');
                } else {
                  setCurrentView('landing');
                }
                window.history.pushState(null, '', '/');
              }}
            />
          );
        })()
      )}

    </div>
  );
}
