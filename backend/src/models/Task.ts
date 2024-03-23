import mongoose from "mongoose";
import { UserDoc } from "./User";

enum TaskStatus {
    DONE = "done",
    DUE = "due"
}

interface TaskDoc extends mongoose.Document{
    houseAddress: string;
    paintColor: string;
    status: TaskStatus;
    user: UserDoc;
}

const TaskSchema = new mongoose.Schema<TaskDoc>({
    status:{
        type: String,
        enum: Object.values(TaskStatus),
        required: [true, 'Please add status']
    },
    houseAddress:{
        type: String,
        required: [true, 'Please add houseAddress']
    },
    paintColor:{
        type: String,
        required: [true, 'Please add paintColor']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Task = mongoose.model<TaskDoc>('Task', TaskSchema);

export{TaskDoc, Task, TaskStatus}