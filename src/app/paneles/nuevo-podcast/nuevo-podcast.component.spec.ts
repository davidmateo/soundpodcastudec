import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPodcastComponent } from './nuevo-podcast.component';

describe('NuevoPodcastComponent', () => {
  let component: NuevoPodcastComponent;
  let fixture: ComponentFixture<NuevoPodcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoPodcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoPodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
