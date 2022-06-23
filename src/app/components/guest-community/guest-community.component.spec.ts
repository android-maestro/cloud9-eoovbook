import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestCommunityComponent } from './guest-community.component';

describe('GuestCommunityComponent', () => {
  let component: GuestCommunityComponent;
  let fixture: ComponentFixture<GuestCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestCommunityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
