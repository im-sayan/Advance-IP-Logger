import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singin',
  standalone: false,
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent implements OnInit {
  formData = {
    email: '',
    password: ''
  };
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.formData).subscribe({
      next: (response) => {
        this.authService.setAuthData(response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed';
        this.isLoading = false;
      }
    });
  }

  googleSignin(): void {
    console.log('Google signin clicked');
  }
}
