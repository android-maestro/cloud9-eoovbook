import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCommunitypostComponent } from './view-communitypost.component';

describe('ViewCommunitypostComponent', () => {
  let component: ViewCommunitypostComponent;
  let fixture: ComponentFixture<ViewCommunitypostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCommunitypostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCommunitypostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
