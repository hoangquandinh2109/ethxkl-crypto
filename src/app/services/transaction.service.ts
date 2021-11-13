import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly collectionName: string = 'transactions';

  constructor(public db: AngularFirestore) {}

  public getTransactions(traderId: string): any {
    return this.db.collection(
      this.collectionName,
      ref => ref.where('traderId', '==', traderId
    )).get();
  }

  public deleteTransaction(id: string): any {
    return this.db.collection(this.collectionName).doc(id).delete();
  }

  public createTransaction({ crypto, amount, price, cost, date, isSell}, traderId: string): any {
    return this.db.collection(this.collectionName).add({
      crypto,
      amount: Number(amount),
      price: Number(price),
      cost: Number(cost),
      date: date ? new Date(date) : new Date(),
      isSell: Boolean(isSell),
      traderId
    });
  }
}
