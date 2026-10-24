import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from './prisma.service.js';

@Injectable()
export class TasksService {
    constructor(
    private readonly prisma: PrismaService,
    ) {}

    private tareas = [
        { id:1, titulo: 'Aprender React' },
        { id: 2, titulo: 'Aprender NestJS' },
        { id: 3, titulo: 'Aprender PostgreSQL' },
    ];


    async obtenerTareas() {
        return await this.prisma.task.findMany();
    }

    async crearTarea(titulo: string) {
        return await this.prisma.task.create({
            data: {
                titulo: titulo.trim(),
            },
        });
    }

    async actualizarTarea(id: number, nuevoTitulo: string) {
        const tarea = await this.prisma.task.findUnique({
            where: { id },
        });

        if (!tarea) {
            throw new NotFoundException('La tarea no existe');
        }

        return await this.prisma.task.update({
            where: { id },
            data: {
                titulo: nuevoTitulo.trim(),
            },
        });
    }

    async eliminarTarea(id: number) {
        const tarea = await this.prisma.task.findUnique({
            where: { id },
        });

        if (!tarea) {
            throw new NotFoundException('La tarea no existe');
         }

        return await this.prisma.task.delete({
            where: { id },
        });
    }
}