import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductEntryComponent } from './new-product-entry.component';

describe('NewProductEntryComponent', () => {
  let component: NewProductEntryComponent;
  let fixture: ComponentFixture<NewProductEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProductEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProductEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
