import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PodcastService } from '../services/podcast.service';
import { Podcast } from '../models/podcast.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  // Ahora se añade también safeImageUrl
  podcasts$: Observable<(Podcast & { safeAudioUrl: SafeResourceUrl, safeImageUrl?: SafeResourceUrl })[]> | undefined;

  constructor(
    private podcastService: PodcastService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.podcasts$ = this.podcastService.getPodcasts().pipe(
      map(podcasts =>
        podcasts.map(podcast => ({
          ...podcast,
          safeAudioUrl: this.sanitizeUrl(podcast.audioUrl),
          safeImageUrl: podcast.imageUrl ? this.sanitizeUrl(podcast.imageUrl) : undefined
        }))
      )
    );
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

likePodcast(podcast: Podcast) {
  const likedPodcasts = this.getLikedPodcasts();
  
  if (likedPodcasts.includes(podcast.id)) {
    console.log('Ya diste like a este podcast.');
    return;
  }

  this.podcastService.likePodcast(podcast.id);
  likedPodcasts.push(podcast.id);
  this.setLikedPodcasts(likedPodcasts);
}

// Obtener array de IDs de podcasts con like (guardados en localStorage)
getLikedPodcasts(): string[] {
  const data = localStorage.getItem('likedPodcasts');
  return data ? JSON.parse(data) : [];
}

// Guardar array en localStorage
setLikedPodcasts(podcastIds: string[]) {
  localStorage.setItem('likedPodcasts', JSON.stringify(podcastIds));
}

}
