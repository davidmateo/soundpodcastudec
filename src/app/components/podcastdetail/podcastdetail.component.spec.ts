import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastdetailComponent } from './podcastdetail.component';

describe('PodcastdetailComponent', () => {
  let component: PodcastdetailComponent;
  let fixture: ComponentFixture<PodcastdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastdetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
