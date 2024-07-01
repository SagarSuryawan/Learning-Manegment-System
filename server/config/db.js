import mongoose from "mongoose";

mongoose.set('strictQuery',false)


// this method is with try & catch 

// useful for ensuring that Mongoose does not throw errors for queries that do not match the schema exactly. This is particularly helpful when working with MongoDB queries that might have flexible or dynamic schemas.

// const connectiondb = async() => {

//     try {
//         const {connection} = await mongoose.connect(process.env.MONGO_URL)

//         if(connection){
            
//             console.log(`database connection app ${connection.host}`)
//         }
//     } catch (error) {
//         console.log(error)
//         process.exit(1)
//     }
// }



// this method is .then and .catch

const connectioDb = async () => {
    mongoose.connect(process.env.MONGO_URL)
    .then((conn) =>{
        console.log(`app is connected to database ${conn.connection.host}`)
    })
    .catch((error) =>{
        console.log(error)
        process.exit(1)
    })
}

export default connectioDb