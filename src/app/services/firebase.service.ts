import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) {}

  public getCryptos(){
    return this.db.collection('cryptos').snapshotChanges();
  }

  public getTransactions(){
    return this.db.collection('transactions').snapshotChanges();
  }

  public createTransaction({ crypto, amount, price}){
    return this.db.collection('transactions').add({
      crypto: crypto,
      amount: amount,
      price: price
    });
  }
}
