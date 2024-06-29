import mongoose from "mongoose";

mongoose.set('strictQuery',false)
// useful for ensuring that Mongoose does not throw errors for queries that do not match the schema exactly. This is particularly helpful when working with MongoDB queries that might have flexible or dynamic schemas.

const connectiondb = async() => {

    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URL)

        if(connection){
            
            console.log(`database connection app ${connection.host}`)
        }
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectiondb