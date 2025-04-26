import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export default class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // ^              // Start of string
  // (?=.*[a-z])    // At least one lowercase letter
  // (?=.*[A-Z])    // At least one uppercase letter
  // (?=.*\d)       // At least one digit
  // (?=.*[\W_])    // At least one special character (non-word character or underscore)
  // .{8,}          // Minimum 8 characters total
  // $              // End of string
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}
