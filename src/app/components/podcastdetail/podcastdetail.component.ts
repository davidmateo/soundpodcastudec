import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { PodcastService } from '../../services/podcast.service';
import { Podcast } from '../../models/podcast.model';

@Component({
  selector: 'app-podcastdetail',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './podcastdetail.component.html',
  styleUrls: ['./podcastdetail.component.css']
})
export class PodcastdetailComponent implements OnInit {

  podcast: (Podcast & { safeAudioUrl?: SafeResourceUrl }) | undefined;

  suggestedPodcasts: Podcast[] = [];

  constructor(
    private route: ActivatedRoute,
    private podcastService: PodcastService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    const slug = this.route.snapshot.paramMap.get('title');

    this.podcastService.getPodcasts().subscribe(podcasts => {

      const foundPodcast = podcasts.find(
        p => this.generateSlug(p.title) === slug
      );

      if (!foundPodcast) return;

      this.podcast = {
        ...foundPodcast,
        safeAudioUrl: foundPodcast.audioUrl
          ? this.sanitizeUrl(foundPodcast.audioUrl)
          : undefined
      };

      // generar sugeridos
      this.suggestedPodcasts = podcasts
        .filter(p => p.title !== foundPodcast.title)
        .slice(0,4);

    });

  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}