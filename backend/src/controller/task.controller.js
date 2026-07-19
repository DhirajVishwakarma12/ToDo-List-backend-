import TaskModel from "../models/task.model.js";

function buildTaskPayload(task, userId) {
    return {
        user: userId,
        taskName: task.taskName || task.task || "",
        description: task.description || "",
        schedule: task.schedule || "Today",
        taskDate: task.taskDate ? new Date(task.taskDate) : task.date ? new Date(task.date) : new Date(),
        startTime: task.startTime || "",
        endTime: task.endTime || "",
        duration: task.duration || "",
        isPrivate: task.isPrivate || false,
        priority: task.priority || "Medium",
        completed: task.completed || false,
        mode: task.mode || (task.completed ? "complete" : "Coming-Soon"),
    };
}

export async function creatTasks(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const taskData = Array.isArray(req.body) ? req.body : [req.body];
        if (taskData.length === 0) {
            return res.status(400).json({ message: "No task data provided" });
        }

        const tasksToCreate = taskData.map((task) => buildTaskPayload(task, userId));

        const newTasks = await TaskModel.insertMany(tasksToCreate);

        res.status(201).json({
            message: `${newTasks.length} task(s) created successfully`,
            tasks: newTasks,
        });
    } catch (error) {
        console.error("Task creation error:", error.message);
        res.status(400).json({ message: error.message });
    }
}

export async function completeTask(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const task = await TaskModel.findOneAndUpdate(
            { _id: req.params.taskId, user: userId },
            { completed: true, mode: "complete" },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({
            message: "Task marked as complete",
            task,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function Tasks(req, res) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const tasks = await TaskModel.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Tasks retrieved successfully",
            task: tasks,
            tasks,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
