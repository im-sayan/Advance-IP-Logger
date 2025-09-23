import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singup',
  standalone: false,
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.css'
})
export class SingupComponent implements OnInit {
  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { confirmPassword, ...userData } = this.formData;
    
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.authService.setAuthData(response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Registration failed';
        this.isLoading = false;
      }
    });
  }

  googleSignup(): void {
    // Implement Google OAuth signup
    console.log('Google signup clicked');
  }
}
