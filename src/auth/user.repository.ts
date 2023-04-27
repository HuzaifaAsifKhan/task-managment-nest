import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from "./dto/jwt-payload.interface";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(
        private dataSource: DataSource,
        private jwtService: JwtService) {
        super(User, dataSource.createEntityManager());
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        const user = new User();
        user.username = username;
        user.salt = await user.genSalt();
        user.password = await user.hashPassword(password, user.salt);
        try {
            await user.save();
        } catch (error: any) {
            console.log(error);
            if (error.code == 23505) {
                throw new ConflictException(error?.detail ? error?.detail : 'Already exists')
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async logIn(authCredentialsDto: AuthCredentialsDto): Promise<{ token: string }> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ where: { username } });
        if (user && await user.validatePassword(password)) {
            const payload: IJwtPayload = await user.toAuthJSON();
            const token = await this.jwtService.sign(payload);
            return { token }
        } else {
            throw new UnauthorizedException(`Invalid Credentials`);
        };
    }
}