import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public firebaseSvc: FirebaseService
  ) { }

  ngOnInit(): void {
    this.firebaseSvc.getTransactions().subscribe((querySnapshot) => {
      querySnapshot.forEach((item) => {
        console.log(item.payload.doc.id, item.payload.doc.data());
      });
    })
  }

}
