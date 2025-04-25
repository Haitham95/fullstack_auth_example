import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  // Select: false means that this field will not be returned in the response by default
  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: Date.now, required: false })
  createdAt: Date;

  @Prop({ reguired: false, default: null })
  refreshToken?: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
