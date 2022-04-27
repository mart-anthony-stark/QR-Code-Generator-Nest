import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from './interfaces/index';
import { SignupDto, LoginDto } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserInterface>,
  ) {}

  async signup(dto: SignupDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new BadRequestException('Email is already taken');
    const user = new this.userModel(dto);

    user.password = await argon.hash(dto.password);
    await user.save();

    delete user.password;
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new BadRequestException('Account not found');

    const match = await argon.verify(user.password, dto.password);
    if (!match) return new ForbiddenException('Incorrect password');

    delete user.password;
    return user;
  }
}
