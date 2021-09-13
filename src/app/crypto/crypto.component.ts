import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit, OnDestroy {
  public data: any[];
  public crypto: string;

  private destroy$: Subject<void> = new Subject();
  constructor(
    public cryptoSvc: CryptoService
  ) { }

  public ngOnInit(): void {
    this.cryptoSvc.getCryptos()
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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addCrypto(): void {
    this.cryptoSvc.createCrypto(this.crypto)
    .then(() => {
      this.crypto = '';
    });
  }

}
