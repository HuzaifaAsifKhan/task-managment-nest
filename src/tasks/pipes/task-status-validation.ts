import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-model";

export class TaskStatusValidationPipe implements PipeTransform {

    readonly taskStatus = TaskStatus
    constructor() { }

    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status`);
        }
        return value;
    }

    private isStatusValid(status: any) {
        return Object.values(this.taskStatus).includes(status);
    }
}