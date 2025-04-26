import { Types } from 'mongoose';

export default class UserLoginViewDto {
  _id: Types.ObjectId;
  accessToken: string;
  email: string;
  name: string;
}
