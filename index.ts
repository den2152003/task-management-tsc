import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import mainV1Routes from "./api/v1/routes/index.route";
import * as database from './config/database';

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// const corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

mainV1Routes(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});