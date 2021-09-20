import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CryptoService } from '../services/crypto.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit, OnDestroy {
  public data: any[];
  public crypto: string;

  private traderId: string;
  private destroy$: Subject<void> = new Subject();
  constructor(
    public cryptoSvc: CryptoService,
    private angularFireAuth: AngularFireAuth
  ) { }

  public ngOnInit(): void {
    this.angularFireAuth.authState
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(async ({ uid }) => {
      this.traderId = uid;
      this.getData();
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addCrypto(): void {
    this.cryptoSvc.createCrypto(this.crypto, this.traderId)
    .then(() => {
      this.crypto = '';
    });
  }

  private getData(): void {
    this.cryptoSvc.getCryptos(this.traderId)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((querySnapshot) => {
      this.data = querySnapshot.map(item => ({
        id: item.payload.doc.id,
        ...item.payload.doc.data()
      }));
    });
  }

}
