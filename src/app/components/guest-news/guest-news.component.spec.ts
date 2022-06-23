import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestNewsComponent } from './guest-news.component';

describe('GuestNewsComponent', () => {
  let component: GuestNewsComponent;
  let fixture: ComponentFixture<GuestNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestNewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
