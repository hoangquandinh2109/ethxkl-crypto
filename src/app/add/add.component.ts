import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  public transactionForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private firebaseSvc: FirebaseService
  ) { }

  public ngOnInit(): void {
    this.createForm();
  }

  public createTransaction(): void {
    this.firebaseSvc.createTransaction(this.transactionForm.value)
  }

  private createForm() {
    this.transactionForm = this.fb.group({
      crypto: ['', Validators.required ],
      amount: ['', Validators.required ],
      price: ['', Validators.required ]
    });
  }

}
