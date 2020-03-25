import * as express from 'express'
import * as bodyParser from 'body-parser'
import {router} from "./routes";
import {initSockets} from "./sockets";

const app = express();

app.use(bodyParser.json());
app.use('/api', router);

initSockets(app)

app.listen(3000, () =>
  console.log('Server is running on http://localhost:3000'),
);
