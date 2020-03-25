import * as http from 'http'

// region socket io
import * as socket from 'socket.io'
import {News} from "../generated/prisma-client";


interface NewsToClientEvent {
    type: string
    data: News
}


export function initSockets(app) {

    const server = new http.Server(app);
    const io = socket(server);

    server.listen(3001);

    io.on('connection', function (socket) {
        socket.on('ping!', function (data, fn) {
            fn({"data": data, "message": "nice yo pong you client!"})
        });
    });


    const clientIo = io.of('/client');
    const crawlerIo = io.of('/crawler');
    const engineIo = io.of('/engine');


    clientIo.on('connection', function (socket) {
        console.log('clientIo connected');
        socket.volatile.emit('feed', '{//todo new news data should go here}');
        socket.on('chat message', function (msg, fn) {
            console.log('message: ' + msg);

            fn('true')
        });

        socket.on('mocknews', function (data, fn) {
            const news: NewsToClientEvent = {
                data: {
                    id: undefined,
                    time: "now",
                    title: "title",
                    content: "content",
                    originUrl: "https://news.com/1",
                    meta: {
                        crawlingAt: "now",
                        source: "UNKNOWN",
                        status: "CRAWLED",
                        categories: ["UNCATEGORIZED"],
                        tags: ["a", "b", "c"]
                    }
                },
                type: "new"
            }
            fn(news)
        })
    });
    clientIo.emit('hi', 'users!');


    crawlerIo.on('connection', function (socket) {
        console.log('crawlerIo connected');

        socket.on('crawled', function (from, msg) {
            console.log('I received a private message by ', from, ' saying ', msg);
        })
    });
    crawlerIo.emit('hi', 'crawler!');


    engineIo.on('connection', function (socket) {
        console.log('engine connected');
    });
    engineIo.emit('hi', 'engine');
// endregion
}
