import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsFriendComponent } from './friends-friend.component';

describe('FriendsFriendComponent', () => {
  let component: FriendsFriendComponent;
  let fixture: ComponentFixture<FriendsFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendsFriendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendsFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
