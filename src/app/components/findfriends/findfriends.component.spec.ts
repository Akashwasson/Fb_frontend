import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindfriendsComponent } from './findfriends.component';

describe('FindfriendsComponent', () => {
  let component: FindfriendsComponent;
  let fixture: ComponentFixture<FindfriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindfriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindfriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
