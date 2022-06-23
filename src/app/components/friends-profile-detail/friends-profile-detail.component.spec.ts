import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsProfileDetailComponent } from './friends-profile-detail.component';

describe('FriendsProfileDetailComponent', () => {
  let component: FriendsProfileDetailComponent;
  let fixture: ComponentFixture<FriendsProfileDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendsProfileDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendsProfileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
