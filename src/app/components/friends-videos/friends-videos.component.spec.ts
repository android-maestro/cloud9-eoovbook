import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsVideosComponent } from './friends-videos.component';

describe('FriendsVideosComponent', () => {
  let component: FriendsVideosComponent;
  let fixture: ComponentFixture<FriendsVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendsVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendsVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
