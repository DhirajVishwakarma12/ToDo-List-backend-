import dotenv from "dotenv"

dotenv.config()


if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI not defined in enviroment variable")
}

if(!process.env.FRONTEND_URL){
    throw new Error("MONGO_URI not defined in enviroment variable")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET not defined in enviroment variable")
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID not defined in enviroment variable")
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET not defined in enviroment variable")
}

if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("GOOGLE_REFRESH_TOKEN not defined in enviroment variable")
}
if(!process.env.GOOGEL_USER){
    throw new Error("GOOGEL_USER not defined in enviroment variable")
}

const config ={
    MONGO_URI : process.env.MONGO_URI ,
    JWT_SECRET : process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID :process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET :process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN :process.env.GOOGLE_REFRESH_TOKEN,
    GOOGEL_USER :process.env.GOOGEL_USER,
    FRONTEND_URL:process.env.FRONTEND_URL
}

export default config;