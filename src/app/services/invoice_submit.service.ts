import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';



@Injectable()
export class Invoice_submit {

  private submitState = new Subject<any>();
  private submitEditState = new Subject<any>();

  setState(state: any) {
    this.submitState.next(state);
  }

  setEditState(state: any) {
    this.submitEditState.next(state);
  }

  getState(): Observable<any> {
    return this.submitState.asObservable();
  }

  getEditState(): Observable<any> {
    return this.submitEditState.asObservable();
  }
}
