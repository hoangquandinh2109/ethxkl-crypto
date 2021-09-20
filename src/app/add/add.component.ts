import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CryptoService } from '../services/crypto.service';
import { TransactionsService } from '../services/transaction.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, OnDestroy {
  public transactionForm: FormGroup;
  public crypto: any[];

  private traderId: string;
  private destroy$: Subject<void> = new Subject();
  constructor(
    private fb: FormBuilder,
    private transactionSvc: TransactionsService,
    private cryptoSvc: CryptoService,
    private angularFireAuth: AngularFireAuth
  ) { }

  public ngOnInit(): void {
    this.createForm();

    this.angularFireAuth.authState
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(({ uid }) => {
      this.traderId = uid;
      this.getStreams();
    })
  }

  public getStreams(): void {
    this.cryptoSvc.getStreams(this.traderId)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((query) => {
      this.crypto = query.docs.map(x => ({
        id: x.id,
        name: x.data().name
      }));
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openDialog(): void {}

  public createTransaction(): void {
    this.transactionSvc.createTransaction(this.transactionForm.value, this.traderId)
    .then(() => {
      this.transactionForm.reset();
    });
  }

  public chooseCrypto(crypto: string): void {
    this.transactionForm.controls.crypto.setValue(crypto);
  }

  private createForm(): void {
    this.transactionForm = this.fb.group({
      crypto: ['', Validators.required ],
      amount: ['', Validators.required ],
      price: ['', Validators.required ],
      cost: ['', Validators.required ],
      date: ['']
    });
  }

}
