import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestSingleNewsComponent } from './guest-single-news.component';

describe('GuestSingleNewsComponent', () => {
  let component: GuestSingleNewsComponent;
  let fixture: ComponentFixture<GuestSingleNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestSingleNewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestSingleNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
