import * as express from 'express'
import * as bodyParser from 'body-parser'
import {router} from "./routes";
import {initSockets} from "./sockets";
import * as cors from 'cors'
import {initializeFirebaseAdmin} from "./utils/firebase";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', router);

initSockets(app);
initializeFirebaseAdmin();

app.listen(3000, () =>
  console.log('Server is running on http://localhost:3000'),
);
