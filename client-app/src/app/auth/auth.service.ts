import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError } from 'rxjs';
import { createdUser } from '../models/created-user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private selectedIndexSource = new BehaviorSubject<number>(0);
  selectedIndex$ = this.selectedIndexSource.asObservable();

  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router
  ) {}

  login(userToLogin: createdUser) {
    this.http
      .post<createdUser>('http://localhost:8080/auth/login', userToLogin)
      .pipe(
        catchError((err) => {
          this._snackBar.open('Nieudane logowanie.', 'X');
          return err;
        })
      )
      .subscribe((res) => this._snackBar.open('Witamy w systemie!', 'X'));
  }

  register(userToRegister: createdUser) {
    this.http
      .post<createdUser>('http://localhost:8080/users', userToRegister)
      .pipe(
        catchError((err) => {
          this._snackBar.open('Nieudana rejestracja.', 'X');
          return err;
        })
      )
      .subscribe((res) => {
        this.selectedIndexSource.next(0);
        this._snackBar.open(
          'Rejestracja udana! Ciesz się korzystaniem z naszych usług.',
          'X'
        );
        this.selectedIndexSource.next(0);
        this.setTabIndex(0);
      });
  }

  resetPassword(email: string) {
    this.http
      .post<string>('http://localhost:8080/users/resetPassword', email)
      .pipe(
        catchError((err) => {
          this._snackBar.open(
            'Nie ma konta powiązanego z podanym adresem email',
            'X'
          );
          return err;
        })
      )
      .subscribe((res) => {
        this._snackBar.open('Sprawdź swoją skrzynkę e-mail.', 'X');
        this.router.navigate(['/auth']);
      });
  }

  setTabIndex(index: number) {
    this.selectedIndexSource.next(index);
  }
}
