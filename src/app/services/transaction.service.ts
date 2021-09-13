import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly collectionName: string = 'transactions';

  constructor(public db: AngularFirestore) {}

  public getTransactions(): any {
    return this.db.collection(this.collectionName).get();
  }

  public deleteTransaction(id: string): any {
    return this.db.collection(this.collectionName).doc(id).delete();
  }

  public createTransaction({ crypto, amount, price, cost, date}): any {
    return this.db.collection(this.collectionName).add({
      crypto,
      amount: Number(amount),
      price: Number(price),
      cost: Number(cost),
      date: date ? new Date(date) : new Date()
    });
  }
}
