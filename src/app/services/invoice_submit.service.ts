import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';



@Injectable()
export class Invoice_submit {

  private submitState = new Subject<any>();

  setState(state: any) {
    this.submitState.next(state);
  }

  getState(): Observable<any> {
    return this.submitState.asObservable();
  }
}
