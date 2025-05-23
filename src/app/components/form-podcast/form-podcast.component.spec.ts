import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPodcastComponent } from './form-podcast.component';

describe('FormPodcastComponent', () => {
  let component: FormPodcastComponent;
  let fixture: ComponentFixture<FormPodcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPodcastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPodcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
