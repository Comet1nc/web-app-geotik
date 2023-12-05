import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { createdUser } from 'src/app/models/created-user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/\d/),
      Validators.pattern(/[A-Z]/),
      Validators.pattern(/[a-z]/),
    ]),
  });

  constructor(private auth: AuthService) {}

  submitLogin() {
    if (this.loginForm.valid) {
      const userToLogin: createdUser = this.loginForm.value;

      this.auth.login(userToLogin);

      this.loginForm.reset();
    }
  }

  clearLogin() {
    this.loginForm.get('email')?.setValue('');
  }
}
