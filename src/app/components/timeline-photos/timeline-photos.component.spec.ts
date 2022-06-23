import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelinePhotosComponent } from './timeline-photos.component';

describe('TimelinePhotosComponent', () => {
  let component: TimelinePhotosComponent;
  let fixture: ComponentFixture<TimelinePhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelinePhotosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelinePhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
