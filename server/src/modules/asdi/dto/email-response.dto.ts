export class EmailResponseDto {
    id?: string;
    status: 'OK' | 'Error';
    message: string;
}
