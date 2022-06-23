import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsTimelineComponent } from './friends-timeline.component';

describe('FriendsTimelineComponent', () => {
  let component: FriendsTimelineComponent;
  let fixture: ComponentFixture<FriendsTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendsTimelineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendsTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
