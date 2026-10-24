import { describe, it, expect, vi } from 'vitest';
import { TasksService } from './tasks.service.js';
import type { PrismaService } from './prisma.service.js';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  it('debe obtener las tareas desde Prisma', async () => {
    const prismaMock = {
      task: {
        findMany: vi.fn(),
      },
    };

    prismaMock.task.findMany.mockResolvedValue([
      { id: 1, titulo: 'Aprender React' },
      { id: 2, titulo: 'Aprender NestJS' },
      { id: 3, titulo: 'Aprender PostgreSQL' },
    ]);

    const service = new TasksService(prismaMock as unknown as PrismaService);

    const resultado = await service.obtenerTareas();

    expect(resultado).toHaveLength(3);
    expect(prismaMock.task.findMany).toHaveBeenCalledOnce();
  });

  it('debe crear una tarea utilizando Prisma', async () => {
    const prismaMock = {
      task: {
        create: vi.fn(),
      },
    };

    const tareaCreada = {
      id: 1,
      titulo: 'Aprender Vitest',
    };

    prismaMock.task.create.mockResolvedValue(tareaCreada);

    const service = new TasksService(prismaMock as unknown as PrismaService);

    const resultado = await service.crearTarea('  Aprender Vitest  ');

    expect(resultado).toEqual(tareaCreada);

    expect(prismaMock.task.create).toHaveBeenCalledWith({
      data: {
        titulo: 'Aprender Vitest',
      },
    });
  });

  it('debe actualizar una tarea utilizando Prisma', async () => {
    const prismaMock = {
      task: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    };

    prismaMock.task.findUnique.mockResolvedValue({
      id: 1,
      titulo: 'Aprender React',
    });

    prismaMock.task.update.mockResolvedValue({
      id: 1,
      titulo: 'Dominar React',
    });

    const service = new TasksService(prismaMock as unknown as PrismaService);

    const resultado = await service.actualizarTarea(1, '  Dominar React  ');

    expect(resultado).toEqual({
      id: 1,
      titulo: 'Dominar React',
    });

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        titulo: 'Dominar React',
      },
    });
  });

  it('debe lanzar un error si la tarea no existe', async () => {
    const prismaMock = {
      task: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    };

    prismaMock.task.findUnique.mockResolvedValue(null);

    const service = new TasksService(prismaMock as unknown as PrismaService);

    await expect(service.actualizarTarea(999, 'Nuevo título')).rejects.toThrow(
      NotFoundException,
    );

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });

    expect(prismaMock.task.update).not.toHaveBeenCalled();
  });

  it('debe eliminar una tarea utilizando Prisma', async () => {
    const prismaMock = {
      task: {
        findUnique: vi.fn(),
        delete: vi.fn(),
      },
    };

    const tarea = {
      id: 1,
      titulo: 'Aprender React',
    };

    prismaMock.task.findUnique.mockResolvedValue(tarea);
    prismaMock.task.delete.mockResolvedValue(tarea);

    const service = new TasksService(prismaMock as unknown as PrismaService);

    const resultado = await service.eliminarTarea(1);

    expect(resultado).toEqual(tarea);

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(prismaMock.task.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('debe lanzar un error al eliminar una tarea inexistente', async () => {
    const prismaMock = {
      task: {
        findUnique: vi.fn(),
        delete: vi.fn(),
      },
    };

    prismaMock.task.findUnique.mockResolvedValue(null);

    const service = new TasksService(prismaMock as unknown as PrismaService);

    await expect(service.eliminarTarea(999)).rejects.toThrow(NotFoundException);

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });

    expect(prismaMock.task.delete).not.toHaveBeenCalled();
  });
});
