import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "soundpodcastudec", appId: "1:952703400738:web:5ff40e384fce132db8c37b", storageBucket: "soundpodcastudec.firebasestorage.app", apiKey: "AIzaSyBmmNBDw25mLRGszsrtLduBmxLpyuOB7L0", authDomain: "soundpodcastudec.firebaseapp.com", messagingSenderId: "952703400738", measurementId: "G-VKBZ7BRXR2" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase())]
};
