import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommunityMemberComponent } from './edit-community-member.component';

describe('EditCommunityMemberComponent', () => {
  let component: EditCommunityMemberComponent;
  let fixture: ComponentFixture<EditCommunityMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCommunityMemberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCommunityMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
