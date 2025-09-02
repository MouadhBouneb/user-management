export class RegisterUserDTO {
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
}

export class LoginUserDTO {
  email!: string;
  password!: string;
}
