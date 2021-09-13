import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { CryptoComponent } from './crypto/crypto.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent,
  },
  {
    path: 'crypto',
    canActivate: [AuthGuard],
    component: CryptoComponent,
  },
  {
    path: 'add',
    canActivate: [AuthGuard],
    component: AddComponent,
  },
  {
    path: 'edit/:id',
    canActivate: [AuthGuard],
    component: EditComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
