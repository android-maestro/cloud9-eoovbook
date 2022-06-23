import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbnewsComponent } from './ebnews.component';

describe('EbnewsComponent', () => {
  let component: EbnewsComponent;
  let fixture: ComponentFixture<EbnewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbnewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EbnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
