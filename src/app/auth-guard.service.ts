import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AmplifyService } from 'aws-amplify-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  public signedIn: boolean;
  public user: any;
  constructor(private amplifyService: AmplifyService, private router: Router) {}
  
  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      this.amplifyService.authStateChange$
      .subscribe(authState => {
        this.signedIn = authState.state === 'signedIn';
        if (!authState.user) {
          this.user = null;
        } else {
          this.user = authState.user;
        }
       
      });
      return this.amplifyService.authStateChange$
      .pipe( 
      map(user => !!user), 
      tap( (loggedIn: boolean) => { if (!loggedIn) this.router.navigate(['/home']); console.log(loggedIn) } ) 
      );
      
    }
  }