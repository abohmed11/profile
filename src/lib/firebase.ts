/**
 * Firebase Firestore integration for Shefaa Medical SaaS Platform
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Doctor, Appointment, LandingPageConfig, DoctorBanner, SystemSpecialty } from '../types';
import { 
  saveDoctorToSupabase, 
  deleteDoctorFromSupabase, 
  saveAppointmentToSupabase, 
  deleteAppointmentFromSupabase, 
  saveLandingConfigToSupabase, 
  saveBannersToSupabase 
} from './supabase';

// Safely initialize Firebase App
let app: any = null;
let firestoreDb: any = null;

try {
  if (firebaseConfig && (firebaseConfig.apiKey || firebaseConfig.projectId)) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    firestoreDb = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
} catch (e) {
  console.warn("Firebase initialization warning (will fallback gracefully):", e);
}

export const db = firestoreDb;

// Collection References
const DOCTORS_COL = 'doctors';
const APPOINTMENTS_COL = 'appointments';
const LANDING_CONFIG_COL = 'landingConfig';
const BANNERS_COL = 'banners';
const SPECIALTIES_COL = 'specialties';

// --- DOCTORS ---
export function subscribeDoctors(onData: (doctors: Doctor[]) => void): () => void {
  if (!db) return () => {};
  const colRef = collection(db, DOCTORS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const docs: Doctor[] = [];
      snapshot.forEach((docSnap) => {
        docs.push({ id: docSnap.id, ...docSnap.data() } as Doctor);
      });
      onData(docs);
    },
    (error) => {
      console.error('Firestore subscribeDoctors error:', error);
    }
  );
}

export async function saveDoctorInDb(doctor: Doctor): Promise<void> {
  try {
    if (!db) return;
    const docRef = doc(db, DOCTORS_COL, doctor.id);
    // Sanitize any undefined values to null for Firestore safety
    const cleanDoc = JSON.parse(JSON.stringify(doctor));
    await setDoc(docRef, cleanDoc, { merge: true });

    // Auto-sync with Supabase Cloud Database
    saveDoctorToSupabase(doctor).catch((err) => {
      console.error('Auto Supabase sync doctor failed:', err);
    });
  } catch (error) {
    console.error('Failed to save doctor in Firestore:', error);
  }
}

export async function deleteDoctorFromDb(doctorId: string): Promise<void> {
  try {
    if (!db) return;
    await deleteDoc(doc(db, DOCTORS_COL, doctorId));
    
    // Auto-sync deletion with Supabase
    deleteDoctorFromSupabase(doctorId).catch((err) => {
      console.error('Auto Supabase delete doctor failed:', err);
    });
  } catch (error) {
    console.error('Failed to delete doctor from Firestore:', error);
  }
}

export async function seedDoctorsIfEmpty(initialDoctors: Doctor[]): Promise<void> {
  try {
    if (!db) return;
    const snapshot = await getDocs(collection(db, DOCTORS_COL));
    if (snapshot.empty) {
      console.log('Seeding initial doctors to Firestore...');
      for (const docData of initialDoctors) {
        await saveDoctorInDb(docData);
      }
    }
  } catch (error) {
    console.error('Error seeding doctors:', error);
  }
}

// --- APPOINTMENTS ---
export function subscribeAppointments(onData: (appointments: Appointment[]) => void): () => void {
  if (!db) return () => {};
  const colRef = collection(db, APPOINTMENTS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const appointments: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        appointments.push({ id: docSnap.id, ...docSnap.data() } as Appointment);
      });
      onData(appointments);
    },
    (error) => {
      console.error('Firestore subscribeAppointments error:', error);
    }
  );
}

export async function saveAppointmentInDb(appointment: Appointment): Promise<void> {
  try {
    if (!db) return;
    const docRef = doc(db, APPOINTMENTS_COL, appointment.id);
    const cleanApt = JSON.parse(JSON.stringify(appointment));
    await setDoc(docRef, cleanApt, { merge: true });

    // Auto-sync appointment to Supabase
    saveAppointmentToSupabase(appointment).catch((err) => {
      console.error('Auto Supabase sync appointment failed:', err);
    });
  } catch (error) {
    console.error('Failed to save appointment in Firestore:', error);
  }
}

export async function deleteAppointmentFromDb(appointmentId: string): Promise<void> {
  try {
    if (!db) return;
    await deleteDoc(doc(db, APPOINTMENTS_COL, appointmentId));

    // Auto-sync deletion with Supabase
    deleteAppointmentFromSupabase(appointmentId).catch((err) => {
      console.error('Auto Supabase delete appointment failed:', err);
    });
  } catch (error) {
    console.error('Failed to delete appointment from Firestore:', error);
  }
}

export async function seedAppointmentsIfEmpty(initialAppointments: Appointment[]): Promise<void> {
  try {
    if (!db) return;
    const snapshot = await getDocs(collection(db, APPOINTMENTS_COL));
    if (snapshot.empty) {
      console.log('Seeding initial appointments to Firestore...');
      for (const apt of initialAppointments) {
        await saveAppointmentInDb(apt);
      }
    }
  } catch (error) {
    console.error('Error seeding appointments:', error);
  }
}

// --- LANDING CONFIG ---
export function subscribeLandingConfig(onData: (config: LandingPageConfig) => void): () => void {
  if (!db) return () => {};
  const docRef = doc(db, LANDING_CONFIG_COL, 'main');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as LandingPageConfig);
      }
    },
    (error) => {
      console.error('Firestore subscribeLandingConfig error:', error);
    }
  );
}

export async function saveLandingConfigInDb(landingConfig: LandingPageConfig): Promise<void> {
  try {
    if (!db) return;
    const docRef = doc(db, LANDING_CONFIG_COL, 'main');
    const cleanConfig = JSON.parse(JSON.stringify(landingConfig));
    await setDoc(docRef, cleanConfig, { merge: true });

    // Auto-sync landing config to Supabase
    saveLandingConfigToSupabase(landingConfig).catch((err) => {
      console.error('Auto Supabase sync landing config failed:', err);
    });
  } catch (error) {
    console.error('Failed to save landing config in Firestore:', error);
  }
}

export async function seedLandingConfigIfEmpty(initialConfig: LandingPageConfig): Promise<void> {
  try {
    if (!db) return;
    const docRef = doc(db, LANDING_CONFIG_COL, 'main');
    const snapshot = await getDocs(collection(db, LANDING_CONFIG_COL));
    if (snapshot.empty) {
      console.log('Seeding initial landing config to Firestore...');
      await saveLandingConfigInDb(initialConfig);
    }
  } catch (error) {
    console.error('Error seeding landing config:', error);
  }
}

// --- BANNERS ---
export function subscribeBanners(onData: (banners: DoctorBanner[]) => void): () => void {
  if (!db) return () => {};
  const colRef = collection(db, BANNERS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const banners: DoctorBanner[] = [];
      snapshot.forEach((docSnap) => {
        banners.push({ id: docSnap.id, ...docSnap.data() } as DoctorBanner);
      });
      onData(banners);
    },
    (error) => {
      console.error('Firestore subscribeBanners error:', error);
    }
  );
}

export async function saveBannersInDb(banners: DoctorBanner[]): Promise<void> {
  try {
    if (!db) return;
    for (const b of banners) {
      const docRef = doc(db, BANNERS_COL, b.id);
      const cleanB = JSON.parse(JSON.stringify(b));
      await setDoc(docRef, cleanB, { merge: true });
    }

    // Auto-sync banners to Supabase
    saveBannersToSupabase(banners).catch((err) => {
      console.error('Auto Supabase sync banners failed:', err);
    });
  } catch (error) {
    console.error('Failed to save banners in Firestore:', error);
  }
}

export async function seedBannersIfEmpty(initialBanners: DoctorBanner[]): Promise<void> {
  try {
    if (!db) return;
    const snapshot = await getDocs(collection(db, BANNERS_COL));
    if (snapshot.empty) {
      console.log('Seeding initial banners to Firestore...');
      await saveBannersInDb(initialBanners);
    }
  } catch (error) {
    console.error('Error seeding banners:', error);
  }
}

// --- SPECIALTIES ---
export function subscribeSpecialties(onData: (specialties: SystemSpecialty[]) => void): () => void {
  if (!db) return () => {};
  const colRef = collection(db, SPECIALTIES_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: SystemSpecialty[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as SystemSpecialty);
      });
      onData(items);
    },
    (error) => {
      console.error('Firestore subscribeSpecialties error:', error);
    }
  );
}

export async function saveSpecialtiesInDb(specialties: SystemSpecialty[]): Promise<void> {
  try {
    if (!db) return;
    for (const sp of specialties) {
      const docRef = doc(db, SPECIALTIES_COL, sp.id);
      const cleanSp = JSON.parse(JSON.stringify(sp));
      await setDoc(docRef, cleanSp, { merge: true });
    }
  } catch (error) {
    console.error('Failed to save specialties in Firestore:', error);
  }
}

export async function seedSpecialtiesIfEmpty(initialSpecialties: SystemSpecialty[]): Promise<void> {
  try {
    if (!db) return;
    const snapshot = await getDocs(collection(db, SPECIALTIES_COL));
    if (snapshot.empty) {
      console.log('Seeding initial specialties to Firestore...');
      await saveSpecialtiesInDb(initialSpecialties);
    }
  } catch (error) {
    console.error('Error seeding specialties:', error);
  }
}
