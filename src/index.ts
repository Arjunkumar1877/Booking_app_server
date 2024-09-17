import express, {Express} from 'express';
import cors from 'cors';
import "dotenv/config";
import { connectDb } from './utils/database';
import userRoutes from './routes/userRoute';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());





connectDb()

app.use("/user", userRoutes)


// console.log(app.locals)
app.listen(7000, ()=>{
    console.log("Server connected on 7000");
});



