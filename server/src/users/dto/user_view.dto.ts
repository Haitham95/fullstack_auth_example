import { Types } from 'mongoose';

export default class ViewUserDto {
  _id: Types.ObjectId;
  name: string;
  email: string;
  createdAt: Date;
}
