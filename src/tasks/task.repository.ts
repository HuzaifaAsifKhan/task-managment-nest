import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { TaskStatus } from "./task-model";
import { Task } from "./task.entity";

// @EntityRepository(Task)
// export class TaskRepository extends Repository<Task> {

// }

@Injectable()
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');
    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async getTaskss(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :userId', { userId: user.id })
        if (status) {
            query.andWhere('task.status = :status', { status })
        }
        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` })
        }
        try {
            return await query.getMany();
        } catch (error) {
            this.logger.error(`Failed to fetch Task fro user ${user.username}`, error.stack)
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTaskDTo: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDTo;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        return await task.save();
        // After saving task delete user info from task & then return task to requested user
    }
}