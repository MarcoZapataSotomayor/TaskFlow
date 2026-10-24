import { Param, ParseIntPipe, Body, Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';


@Controller('tareas') //http://localhost:3000/tareas
export class TasksController {
    constructor(
        private readonly tasksService: TasksService
    ){}

    @Get()
    obtenerTareas() {
        return this.tasksService.obtenerTareas();
    }

    @Post()
    crearTarea(@Body() datos: CreateTaskDto) {
        return this.tasksService.crearTarea(datos.titulo);
    }

    @Patch(':id')
    actualizarTarea(
        @Param('id', ParseIntPipe) id: number,
        @Body() datos: CreateTaskDto,
    ) {
        return this.tasksService.actualizarTarea(id, datos.titulo);
    }

    @Delete(':id')
    eliminarTarea(
        @Param('id', ParseIntPipe) id:number,
    ) {
        return this.tasksService.eliminarTarea(id);
    }
}