import { BadRequestException, Injectable } from '@nestjs/common';
import CreateUserDto from './dto/create_user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/User.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import ViewUserDto from './dto/user_view.dto';

@Injectable()
export class UsersService {
  // user.service.ts
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<ViewUserDto> {
    const { email, password } = createUserDto;
    // lowercase email
    const lowercasedEmail = email.toLowerCase();

    // check if user already exists
    const existingUser = await this.userModel.findOne({
      email: lowercasedEmail,
    });

    if (existingUser) {
      throw new BadRequestException('user with this email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user in the database
    const user = await this.userModel.create({
      ...createUserDto,
      email: lowercasedEmail,
      password: hashedPassword,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async getUserById(userId: string): Promise<ViewUserDto> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('user with this id does not exist');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
