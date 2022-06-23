import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineVideosComponent } from './timeline-videos.component';

describe('TimelineVideosComponent', () => {
  let component: TimelineVideosComponent;
  let fixture: ComponentFixture<TimelineVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
