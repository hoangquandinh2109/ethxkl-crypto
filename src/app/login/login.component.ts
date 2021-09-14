import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public email: string;
  public password: string;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) { }

  public signIn() {
    this.angularFireAuth.signInWithEmailAndPassword(this.email, this.password)
    .then((result) => {
      console.log(result)
      this.router.navigate([''])
    })
    .catch((error) => {
      console.log(error)
    })
  }

}
