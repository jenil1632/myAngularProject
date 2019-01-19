import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameAutocompleteComponent } from './name-autocomplete.component';

describe('NameAutocompleteComponent', () => {
  let component: NameAutocompleteComponent;
  let fixture: ComponentFixture<NameAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
