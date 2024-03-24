import mongoose from "mongoose";
import { UserDoc } from "./User";

enum TaskStatus {
    DONE = "done",
    DUE = "due"
}

interface TaskDoc extends mongoose.Document{
    title:string;
    houseAddress: string;
    paintColor: string;
    status?: TaskStatus;
    user: UserDoc;
}

const TaskSchema = new mongoose.Schema<TaskDoc>({
    title:{
        type: String,
        required: [true, 'Please add title']
    },
    status:{
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.DUE
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