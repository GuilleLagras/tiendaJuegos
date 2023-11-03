import mongoose from "mongoose";

const URI ="mongodb+srv://ecommerce-Guillermo:coderBackend@ecommerce.mola37p.mongodb.net/Ecommerce?retryWrites=true&w=majority"
mongoose
.connect(URI)
.then(()=>console.log("Conectado a base de datos"))
.catch((error)=> console.log(error))