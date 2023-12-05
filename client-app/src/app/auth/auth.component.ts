import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  selectedTabIndex = 0;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.selectedIndex$.subscribe((index) => {
      this.selectedTabIndex = index;
    });
  }
}
