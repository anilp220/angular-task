import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  private authStatusSub: Subscription;
  error = ''
  constructor(public authService: AuthService) {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit() {
  }

  async onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    try {
      this.isLoading = true;
      const result = await this.authService.login(form.value.email, form.value.password);
      if (!result.success) {
        this.error = result.message;
      }
    } catch (error) {
      this.isLoading = false
      console.log(error)
      this.error = error.message;
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
