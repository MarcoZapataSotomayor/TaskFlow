import { IsString, IsNotEmpty, Matches } from "class-validator";


export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/, {
        message: 'El titulo debe contener al menos un caracter no vacio',
    })

    titulo: string;
}