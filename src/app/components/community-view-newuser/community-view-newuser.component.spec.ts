import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityViewNewuserComponent } from './community-view-newuser.component';

describe('CommunityViewNewuserComponent', () => {
  let component: CommunityViewNewuserComponent;
  let fixture: ComponentFixture<CommunityViewNewuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityViewNewuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityViewNewuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
