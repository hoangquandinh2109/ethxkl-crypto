import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TransactionsService } from '../services/transaction.service';
import { CryptoService } from '../services/crypto.service';
import { OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DecimalPipe]
})
export class HomeComponent implements OnInit, OnDestroy {
  public crypto: any = {};
  public pnl: any = {};
  public data: any = [];
  public cryptoAssets: {[key: string]: number} = {};
  public streams: any[] = [];
  public cryptos: any;
  public allCryptoCapital = 0;
  public cryptosNetAssetsBTC = 0;
  public cryptosNetAssetsUSDT = 0;

  private ws: WebSocket;
  constructor(
    private transactionSvc: TransactionsService,
    private cryptoSvc: CryptoService,
    private numberPipe: DecimalPipe,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
  ) {}

  public async ngOnInit(): Promise<void> {
    const streamsSnapShot = await this.cryptoSvc.getStreams().toPromise();
    const transactionsSnapShot = await this.transactionSvc.getTransactions().toPromise();

    this.data = transactionsSnapShot.docs.map(item => {
      const data = item.data();
      return {
        id: item.id,
        ...data,
        dateString: new Date(data.date.seconds * 1000),
        crypto: streamsSnapShot.docs.find(x => x.id === data.crypto)?.data().name
      };
    }).sort((a, b) => b.date.seconds - a.date.seconds);
    this.cryptos = streamsSnapShot.docs.map(x => {
      const { name } = x.data();
      return {
        id: x.id,
        name,
        stream: `${name}usdt@trade`,
        wallet: this.valueByCrypto(name, 'amount'),
        capital: this.valueByCrypto(name, 'cost')
      };
    });
    this.allCryptoCapital = this.cryptos.reduce((acc, cur) => acc + cur.capital, 0);

    const streamsQuery = this.cryptos.map(x => x.stream).join('/');

    this.ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streamsQuery}`
    );
    this.ws.onmessage = ev => {
      const resp = JSON.parse(ev.data);
      this.crypto[resp.stream] = resp.data;
      this.countingTotalAssets();
    };
  }

  public ngOnDestroy(): void {
    this.ws.close();
  }

  public deleteTransaction(id: string): void {
    this.transactionSvc.deleteTransaction(id);
  }

  public getCryptoPrice(stream: string): number {
    if (this.crypto[stream]) {
      return this.crypto[stream].p;
    } else {
      return 0;
    }
  }

  public netAssetOfCrypto({ id, wallet, stream, capital }): number {
    const value = wallet * this.getCryptoPrice(stream);
    this.countPNL(value, capital, id);
    this.cryptoAssets[stream] = value;
    return value;
  }

  public netAssetOfTransaction({ id, amount, crypto, cost}): number {
    const value = amount * this.getCryptoPrice(`${crypto}usdt@trade`);
    this.countPNL(value, cost, id);
    return value;
  }

  public signOut(): void {
    this.angularFireAuth.signOut().then(() => {
      this.router.navigate(['login']);
    })
  }

  public getPNL(...properties: string[]): any {
    let temp = this.pnl;

    for (let i = 0; i < properties.length; i++) {
      if (temp[properties[i]] !== undefined) {
        temp = temp[properties[i]];
      } else {
        return '';
      }
    }

    return temp;
  }

  private countingTotalAssets(): void {
    const value = Object.values(this.cryptoAssets).reduce((acc, cur) => acc + cur, 0);
    this.countPNL(value, this.allCryptoCapital, 'super');
    this.cryptosNetAssetsBTC = value / this.getCryptoPrice('btcusdt@trade');
    this.cryptosNetAssetsUSDT = value;
  }

  private countPNL(a: number, b: number, pnlId: string): any {
    const percent = this.numberPipe.transform((Math.abs(a - b) / b * 100), '1.0-2');
    const isNegative = a < b;
    const sign = isNegative ? '-' : '+';
    const value = `${sign}${this.numberPipe.transform(Math.abs(a-b), '1.0-3')}`;

    if (!this.pnl[pnlId]) {
      this.pnl[pnlId] = {
        isNegative,
        rate: `${sign}${percent}%`,
        value,
        showUSDT: false
      };
    } else {
      this.pnl[pnlId].isNegative = isNegative;
      this.pnl[pnlId].rate = `${sign}${percent}%`;
      this.pnl[pnlId].value = value;
    }
  }

  private valueByCrypto(cryptoName: string, value: string): number {
    return this.data.reduce((acc, cur) => {
      return acc + (cur.crypto === cryptoName ? cur[value] || 0 : 0);
    }, 0);
  }
}
