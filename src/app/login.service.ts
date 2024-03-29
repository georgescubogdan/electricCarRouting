import { Injectable } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public signedIn: boolean;
  public user: any;
  public stateObservable: Observable<boolean> = new Observable(observer => {
    this.amplifyService.authStateChange$
    .subscribe(authState => {
      this.signedIn = authState.state === 'signedIn';
      //console.log(this.signedIn);
      observer.next(this.signedIn);
      if (!authState.user) {
        this.user = null;
      } else {
        this.user = authState.user;
      }
    });
  });
  public userObservable: Observable<any> = new Observable(observer => {
    this.amplifyService.authStateChange$
    .subscribe(authState => {
      console.log(authState.user);
      observer.next(authState.user);
    });
  });
  constructor( private amplifyService: AmplifyService ) {
  }
}
