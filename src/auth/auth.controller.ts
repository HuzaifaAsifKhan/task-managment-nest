import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get()
    getTasks() {
        return 'auth controller';
    }

    @Post('/signup')
    @UsePipes(ValidationPipe)
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    logIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ token: string }> {
        return this.authService.logIn(authCredentialsDto);
    }

}
