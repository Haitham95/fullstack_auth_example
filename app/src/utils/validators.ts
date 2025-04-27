// src/utils/validators.ts
import { z } from "zod";

// Password validation regex
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Sign up schema
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .trim(),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(PASSWORD_REGEX, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Sign in schema
export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),
  password: z.string().min(1, { message: "Password is required" }),
});

// Types inferred from schemas
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
