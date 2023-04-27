import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'
export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(16)
    username: string = '';

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].*$/,
        { message: "Password too weak" }
    )
    password: string = '';
}
