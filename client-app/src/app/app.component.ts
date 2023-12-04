import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, map, of, take } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  users: Observable<User[]> = this.http.get<User[]>(
    'http://localhost:8080/users'
  );

  user1: Observable<User> = this.http.get<User>(
    'http://localhost:8080/users/' + 1
  );

  userWithError: Observable<User | null> = this.http
    .get<User>('http://localhost:8080/users/' + 999)
    .pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );

  constructor(private http: HttpClient) {}

  addNewUser() {
    const newUser: createdUser = {
      email: 'customUser@email.com',
      password: 'Pass12345134',
    };

    this.http
      .post<createdUser>('http://localhost:8080/users', newUser)
      .subscribe((res) => {
        console.log(res);
        this.http
          .get<User[]>('http://localhost:8080/users')
          .subscribe((res) => console.log(res));
      });
  }

  tryResetPassword() {
    const mail = 'user2@gmail.com';
    const mail2 = 'user222@gmail.com';
    this.http
      .post<string>('http://localhost:8080/users/resetPassword', mail)
      .subscribe((res) => console.log(res));

    this.http
      .post<string>('http://localhost:8080/users/resetPassword', mail2)
      .subscribe((res) => console.log(res));
  }

  login() {
    const user: createdUser = {
      email: 'user2@gmail.com',
      password: 'Password2',
    };

    const user2: createdUser = {
      email: 'user2@gmail.com',
      password: 'Passw3ord2',
    };

    this.http
      .post<createdUser>('http://localhost:8080/auth/login', user)
      .subscribe((res) => console.log(res));

    this.http
      .post<createdUser>('http://localhost:8080/auth/login', user2)
      .subscribe((res) => console.log(res));
  }
}

interface User {
  id: number;
  email: string;
}

interface createdUser {
  email: string;
  password: string;
}
