import { JwtPayload } from './jwt-payload.interface'; // Import your custom type
import { Request } from 'express';

declare global {
  namespace Express {
    export interface User {
      userId: string;
      email: string;
    }
  }
}
