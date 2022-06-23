import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityNavbarComponent } from './community-navbar.component';

describe('CommunityNavbarComponent', () => {
  let component: CommunityNavbarComponent;
  let fixture: ComponentFixture<CommunityNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
