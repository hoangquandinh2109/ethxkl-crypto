import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
  ) {
  }

  canActivate(): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(
      map(authCredential => {
        return authCredential !== null
      }),
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(['login']);
        }
      })
    )
  }

}
