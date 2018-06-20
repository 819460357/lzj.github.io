import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class MerchListService {

  constructor(public router: Router) { }

  public addQrCode() {
    this.router.navigate(['main/addQrCode']);
  }

}
