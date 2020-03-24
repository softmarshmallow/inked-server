import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as http from 'http'
import {router} from "./routes";

const app = express();

app.use(bodyParser.json());
app.use('/api', router);

// region socket io
import * as socket from 'socket.io'
const server = new http.Server(app);
const io = socket(server);

server.listen(3001);

io.on('connection', function (socket) {
  console.log("socket connected");
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
// endregion

app.listen(3000, () =>
  console.log('Server is running on http://localhost:3000'),
);
