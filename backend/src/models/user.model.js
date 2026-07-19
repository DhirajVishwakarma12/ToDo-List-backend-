import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true, 
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    privatePassword: {
        type: String,
        default: "",
    },
    verified: {
        type: Boolean,
        default: false,
    },
})

const UserModel = mongoose.model("user", userSchema);

export default UserModel;