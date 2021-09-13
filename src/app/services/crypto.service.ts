import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly collectionName: string = 'crypto';

  constructor(public db: AngularFirestore) {}

  public getCryptos(): any {
    return this.db.collection(this.collectionName).snapshotChanges();
  }

  public getStreams(): any {
    return this.db.collection(this.collectionName).get();
  }

  public deleteCrypto(id: string): any {
    return this.db.collection(this.collectionName).doc(id).delete();
  }

  public createCrypto(name): any {
    return this.db.collection(this.collectionName).add({ name });
  }
}
