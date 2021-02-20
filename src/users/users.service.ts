import {ConflictException, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './users.schema';
import { AuthNewUserDto, ProfileUpdateDto } from '../auth/auth-credentials.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async findOne(_id: string): Promise<User | undefined> {
        return this.userModel.findOne({ _id }, { password: 0 });
    }

    async findOneByEmailOrNumber(emailOrNumber: string): Promise<User | undefined> {
        return this.userModel.findOne({ $or: [{ email: emailOrNumber }, { phone: emailOrNumber }] });
    }

    async update(_id: string, profileUpdateDto: ProfileUpdateDto): Promise<User> {
        return this.userModel.updateOne({ _id }, profileUpdateDto).exec();
    }

    async register(authNewUserDto: AuthNewUserDto) {
        const { password } = authNewUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = new this.userModel({ ...authNewUserDto, password: hashedPassword });

        try {
            return await createdUser.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Phone number or Email address already exists');
            }
            return error;
        }
    }
}
