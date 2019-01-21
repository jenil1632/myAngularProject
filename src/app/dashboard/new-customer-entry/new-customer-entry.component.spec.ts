import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomerEntryComponent } from './new-customer-entry.component';

describe('NewCustomerEntryComponent', () => {
  let component: NewCustomerEntryComponent;
  let fixture: ComponentFixture<NewCustomerEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCustomerEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCustomerEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
