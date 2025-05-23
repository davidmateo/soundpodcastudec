// src/app/services/podcast.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, updateDoc,increment, collectionData, query } from '@angular/fire/firestore'; // Firebase v9+ modular
import { Observable } from 'rxjs';
import { Podcast } from '../models/podcast.model';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {
  constructor(private firestore: Firestore) {}

  getPodcasts(): Observable<Podcast[]> {
    const podcastRef = collection(this.firestore, 'podcast');
    return collectionData(podcastRef, { idField: 'id' }) as Observable<Podcast[]>;
  }

// Método para dar like a un podcast, solo una vez por navegador
// Método para dar like a un podcast, solo una vez por navegador
async likePodcast(id: string): Promise<void> {
  const likedPodcastsStr = localStorage.getItem('likedPodcasts');
  const likedPodcasts = likedPodcastsStr ? JSON.parse(likedPodcastsStr) as string[] : [];

  if (likedPodcasts.includes(id)) {
    console.log('Ya has dado like a este podcast.');
    return;
  }

  const podcastDoc = doc(this.firestore, `podcasts/${id}`);

  try {
    // Incrementar el campo 'likes' atómicamente
    await updateDoc(podcastDoc, {
      likes: increment(1)
    });

    likedPodcasts.push(id);
    localStorage.setItem('likedPodcasts', JSON.stringify(likedPodcasts));
  } catch (error) {
    console.error('Error al dar like:', error);
  }
}

  
  
}
