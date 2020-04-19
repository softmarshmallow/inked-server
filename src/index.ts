import * as express from 'express'
import * as bodyParser from 'body-parser'
import {router} from "./routes";
import {initSockets} from "./sockets";
import {initializeFirebaseAdmin} from "./utils/firebase";

const app = express();

import * as cors from 'cors'
app.use(cors());
// app.all('/*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
//     next();
// });


app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use('/static', express.static('public'));
app.use('/api', router);

initSockets(app);
initializeFirebaseAdmin();

app.listen(3000, () =>
  console.log('Server is running on http://localhost:3000'),
);
