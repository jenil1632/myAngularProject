import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodateComponent } from './podate.component';

describe('PodateComponent', () => {
  let component: PodateComponent;
  let fixture: ComponentFixture<PodateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
