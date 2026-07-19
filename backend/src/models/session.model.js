import  mongoose  from "mongoose";

const sessionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "user is required"]
    },
    refreshTokenHash: {
        type: String,
        required: [true, "refresh token hash is required"],
    },
    ipAddress: {
        type: String,
        required: [true, "ip address is required"], 
    },
    userAgent: {
        type: String,   
        required: [true, "user agent is required"],
    },
    revoked: {
        type: Boolean,
        default: false,
    }
},
    {
        timestamps : true
    }
)

const SessionModel = mongoose.model("sessions", sessionSchema);

export default SessionModel;