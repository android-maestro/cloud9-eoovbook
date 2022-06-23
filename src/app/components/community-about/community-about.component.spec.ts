import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityAboutComponent } from './community-about.component';

describe('CommunityAboutComponent', () => {
  let component: CommunityAboutComponent;
  let fixture: ComponentFixture<CommunityAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunityAboutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
