import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class SendEmailDto {
    @IsNotEmpty()
    @ValidateIf(o => Array.isArray(o.to))
    @IsEmail({}, { each: true })
    to: string | string[];

    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsString()
    body: string;
}
