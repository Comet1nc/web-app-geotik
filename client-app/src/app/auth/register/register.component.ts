import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { createdUser } from 'src/app/models/created-user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/\d/),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordsMatch }
  );

  constructor(private auth: AuthService) {}

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pass1 = control.get('password')?.value;
    const pass2 = control.get('confirmPassword')?.value;

    return pass1 !== pass2 ? { passwordMismatch: true } : null;
  }

  submitRegistration() {
    if (this.registerForm.valid) {
      const userToRegister: createdUser = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };

      this.auth.register(userToRegister);

      this.registerForm.reset();

      this.auth.setTabIndex(0);
    }
  }

  clearLogin() {
    this.registerForm.get('email')?.setValue('');
  }
}
