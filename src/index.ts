import * as express from 'express'
import * as bodyParser from 'body-parser'
import {router} from "./routes";
import {initSockets} from "./sockets";
import {initializeFirebaseAdmin} from "./utils/firebase";

const app = express();

// import * as cors from 'cors'
// app.use(cors());
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Authorization");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD, OPTIONS")
    next();
});


app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use('/static', express.static('public'));
app.use('/api', router);

initSockets(app);
initializeFirebaseAdmin();

app.listen(3000, () =>
  console.log('Server is running on http://localhost:3000'),
);
