## User Schemas and Models

### UserSchema

```javascript
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
```

### TaskSchema

```javascript
const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    taskType: { type: String, enum: ["reminder", "habit", "todo"], required: true },
    creationDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { discriminatorKey: "taskType" }
);

const Task = mongoose.model("Task", taskSchema);
```

### Todo Schema

```javascript
const todoSchema = new Schema({
  status: { type: String, enum: ["created", "in_progress", "completed"], required: true },
  color: { type: String, default: "#FFFFFF" },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
  isOnProgress: { type: Boolean, default: false },
});

const Todo = Task.discriminator("Todo", todoSchema);
```

### Habit Schema

```javascript
const habitSchema = new Schema({
  frequency: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
});

const Habit = Task.discriminator("Habit", habitSchema);
```

### Reminder Schema

```javascript
const reminderSchema = new Schema({
  reminderTime: { type: Date, required: true },
});

const Reminder = Task.discriminator("Reminder", reminderSchema);
```

### DailySchedule Schema

```javascript
const dailyScheduleSchema = new Schema({
  date: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
});

const DailySchedule = mongoose.model("DailySchedule", dailyScheduleSchema);
```

### UserSetting Schema

```javascript
const userSettingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  darkMode: { type: Boolean, default: false },
  notificationEnabled: { type: Boolean, default: true },
});

const UserSetting = mongoose.model("UserSetting", userSettingSchema);
```
