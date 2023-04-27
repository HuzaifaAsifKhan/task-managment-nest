import { TasksService } from "./tasks.service";
import { Test, TestingModule } from "@nestjs/testing";
import { TasksController } from "./tasks.controller";
import { TaskRepository } from "./task.repository";
import { filter } from "rxjs";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./task-model";

const mockUser = { username: 'Zefi', id: 12 };
const mockCreateTask = { title: 'Test task', description: 'Test task description' };
const mockTaskRepository = () => ({
    getTaskss: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
});

describe('Task Service', () => {
    let taskService;
    let taskRepository;

    beforeEach(async () => {
        const task: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ]
        }).compile();
        taskService = task.get<TasksService>(TasksService);
        taskRepository = task.get<TaskRepository>(TaskRepository);
    });

    describe('Get Tasks', () => {
        it('get all tasks from repository', async () => {
            taskRepository.getTaskss.mockResolvedValue('Tasks Value')
            expect(taskRepository.getTaskss).not.toHaveBeenCalled();
            const filter: GetTaskFilterDto = null;
            const tasks = await taskService.getTasks(filter, mockUser);
            expect(taskRepository.getTaskss).toHaveBeenCalled();
            expect(tasks).toBe('Tasks Value');
        })
    });

    describe('Task By ID', () => {
        it('find task successfully retreive the task', async () => {
            taskRepository.findOne.mockResolvedValue('Task value')
            const result = await taskService.getTaskById(1, mockUser)
            expect(result).toBe('Task value');
            expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: mockUser.id } })
        })

        it('throw error if not found', () => {
            taskRepository.findOne.mockResolvedValue(null)
            expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        })
    });

    describe('Create Task', () => {
        it('create task and return the task', async () => {
            taskRepository.createTask.mockResolvedValue('Task Value');
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const task = await taskService.createTask(mockCreateTask, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockCreateTask, mockUser);
            expect(task).toBe('Task Value');
        })
    });

    describe('Delete Task', () => {
        it('delete task and return nothing', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            const result = await taskService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
        });

        it('throw error if task does not exist', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(taskService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('Update Task', () => {
        it('update a task status', async () => {
            const save = jest.fn().mockResolvedValue({ status: TaskStatus.DONE });
            taskService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            });
            expect(taskService.getTaskById).not.toHaveBeenCalled();
            const result = await taskService.updateTask(1, TaskStatus.DONE, mockUser);
            expect(taskService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toBe(TaskStatus.DONE);
        });
    })
})