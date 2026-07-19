import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"]
    },
    taskName: {
        type: String,
        required: [true, "taskName is required"],
    },
    description: {
        type: String,
        default: "",
    },
    schedule: {
        type: String,
        enum: ["Yesterday", "Today", "Tomorrow"],
        default: "Today"
    },
    // The calendar day this task belongs to.  Unlike `schedule`, this value
    // does not change when the day rolls over.
    taskDate: {
        type: Date,
        required: [true, "taskDate is required"],
    },
    isEditable: {
        type: Boolean,
        default: true,
    },
    startTime: {
        type: String,
        default: "",
    },
    endTime:{
        type: String,
        default: "",
    }
    ,duration: {
        type: String,
        default: "",
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
    completed: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        enum: ["todo", "Coming-Soon", "in-progress", "complete"],
        default: "Coming-Soon",
    },
}, {
    timestamps: true,
});

const TaskModel = mongoose.model("task", taskSchema);

export default TaskModel;
