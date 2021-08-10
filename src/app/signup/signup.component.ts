import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  private authStatusSub: Subscription;
  error: string = ''
  constructor(public authService: AuthService) {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit() {
  }

  async onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    try {
      this.error = '';
      const result = await this.authService.signup(form.value);
      console.log(result)
    } catch (error) {
      console.log(error)
      this.error = error.message
    }

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
