import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent {
  resetForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private auth: AuthService) {}

  submitReset() {
    if (this.resetForm.valid) {
      this.auth.resetPassword(this.resetForm.get('email')?.value);
    }
  }

  clearLogin() {
    this.resetForm.get('email')?.setValue('');
  }
}
