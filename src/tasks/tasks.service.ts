import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-model';
// import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {
    }

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTaskss(filterDto, user);
    }


    async getTaskById(id: number, user: User): Promise<Task> {
        const requestedTask = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if (!requestedTask) {
            throw new NotFoundException(`Task With ID "${id}" not found.`);
        }
        return requestedTask
    }

    async createTask(createTaskDTo: CreateTaskDto, user: User): Promise<Task> {
        // By Using Task Enity
        // const { title, description } = createTaskDTo;
        // const task = new Task();
        // task.title = title;
        // task.description = description;
        // task.status = TaskStatus.OPEN;
        // return await task.save();

        // By Using Task Repository
        return this.taskRepository.createTask(createTaskDTo, user);
    }

    async deleteTask(id: number, user: User): Promise<any> {
        // By Remove
        // const task = await this.getTaskById(id);
        // return await this.taskRepository.remove(task); //Need a entity or entities


        // By Delete
        const result = await this.taskRepository.delete({ id, userId: user.id }); // Need a condition 
        if (result.affected == 0) {
            throw new NotFoundException(`Task With ID "${id}" not found.`);
        }
    }

    async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        return await task.save();
    }
}
