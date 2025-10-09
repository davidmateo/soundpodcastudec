import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreadorDashboardComponent } from './creador-dashboard.component';

describe('CreadorDashboardComponent', () => {
  let component: CreadorDashboardComponent;
  let fixture: ComponentFixture<CreadorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreadorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreadorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
