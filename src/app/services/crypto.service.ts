import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly collectionName: string = 'crypto';

  constructor(public db: AngularFirestore) {}

  public getCryptos(traderId: string): any {
    return this.db.collection(
      this.collectionName,
      ref => ref.where('traderId', '==', traderId)
    ).snapshotChanges();
  }

  public getStreams(traderId: string): any {
    return this.db.collection(
      this.collectionName,
      ref => ref.where('traderId', '==', traderId)
    ).get();
  }

  public deleteCrypto(id: string): any {
    return this.db.collection(this.collectionName).doc(id).delete();
  }

  public createCrypto(name: string, traderId: string): any {
    return this.db.collection(this.collectionName).add({ name, traderId });
  }
}
