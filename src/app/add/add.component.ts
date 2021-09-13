import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CryptoService } from '../services/crypto.service';
import { TransactionsService } from '../services/transaction.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, OnDestroy {
  public transactionForm: FormGroup;
  public crypto: any[];

  private destroy$: Subject<void> = new Subject();
  constructor(
    private fb: FormBuilder,
    private transactionSvc: TransactionsService,
    private cryptoSvc: CryptoService
  ) { }

  public ngOnInit(): void {
    this.createForm();
    this.cryptoSvc.getStreams()
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
    this.transactionSvc.createTransaction(this.transactionForm.value)
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
