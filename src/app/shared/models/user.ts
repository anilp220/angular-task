export interface User {
  email: string;
  password: string;
  username: string;
}

export class Patient {
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female';
  id?: number;
  constructor() {
    this.name = '';
    this.email = '';
    this.age = 0;
    this.gender = 'male'
  }
}