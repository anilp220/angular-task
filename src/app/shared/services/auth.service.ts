import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusListener = new Subject<{ isLoggedIn: boolean, userName: string }>();
  private isAuthenticated = false;
  public user: string;
  constructor(private http: HttpClient, private router: Router) {
    this.user = localStorage.getItem('user') || ''
  }

  getAuthStatusListener(): Observable<{ isLoggedIn: boolean, userName: string }> {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUser() {
    return this.user;
  }

  signup(data: User): Promise<{ message: string; success: boolean }> {
    return new Promise((resolve, reject) => {
      if (this.checkUserExists(data.email)) {
        reject({ message: 'User already exist', success: false })
      } else {
        localStorage.setItem(data.email, JSON.stringify(data));
        resolve({ message: 'User registered successfully', success: true });

      }
    })
  }

  checkUserExists(email: string) {
    let user = localStorage.getItem(email)
    console.log(user)
    return user
  }


  login(email: string, password: string): Promise<{ message: string; success: boolean; }> {
    return new Promise((resolve, reject) => {
      let user: any = this.checkUserExists(email);
      user = JSON.parse(user);
      let errorMsg = ''
      if (user) {
        if (user.password == password) {
          this.isAuthenticated = true;
          this.user = user.username;
          this.authStatusListener.next({ isLoggedIn: true, userName: this.user });
          localStorage.setItem('user', this.user);
          this.router.navigate(["/"]);
          resolve({ message: 'Logged in successfully', success: true })
          return
        }
        else errorMsg = 'Invalid Password';
      } else errorMsg = 'User does not exist';
      this.isAuthenticated = false;
      this.authStatusListener.next({ isLoggedIn: false, userName: '' })
      reject({ message: errorMsg, success: false })
    })
    // return this.http.get<User[]>('/assets/user.json').toPromise().then((users) => {
    //   const index = users.findIndex(user => {
    //     return user.email == userid && user.password == password
    //   })
    //   if (index > -1) {
    //     this.isAuthenticated = true;
    //     this.user = users[index].username;
    //     this.authStatusListener.next({ isLoggedIn: true, userName: this.user });
    //     localStorage.setItem('user', this.user);
    //     this.router.navigate(["/"]);
    //     return { success: true, message: 'Logged in successfully' }
    //   } else {
    //     this.isAuthenticated = false;
    //     this.authStatusListener.next({ isLoggedIn: false, userName: '' });
    //     return { success: false, message: 'Invalid credential' }
    //   }
    // })
  }

  getAllUsers(): Promise<{ id: number, value: string }[]> {
    return this.http.get<User[]>('/assets/user.json').toPromise()
      .then(users => {
        const userNames: any = [];
        users.map((user, index) => {
          userNames.push({ id: index + 1, value: user.username })
        })
        return userNames;
      })
  }

  logout() {
    this.isAuthenticated = false;
    this.authStatusListener.next({ isLoggedIn: false, userName: '' });
    localStorage.removeItem('user')
    this.router.navigate(["login"]);
  }

  checkUserAuth() {
    const user = localStorage.getItem('user');
    if (user) {
      this.isAuthenticated = true;
      this.user = user;
      this.authStatusListener.next({ isLoggedIn: true, userName: this.user });
    }
  }
}
