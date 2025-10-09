import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreadorLoginComponent } from './creador-login.component';

describe('CreadorLoginComponent', () => {
  let component: CreadorLoginComponent;
  let fixture: ComponentFixture<CreadorLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreadorLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreadorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
