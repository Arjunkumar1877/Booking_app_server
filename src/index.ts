import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config"

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


app.get("/api/test", async(req: Request, res: Response)=>{
 res.json({message: "Hello from expres"})
})

app.listen(7000, ()=>{
    console.log("Server connected")
})