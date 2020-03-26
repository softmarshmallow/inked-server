# inked server

run docker compose

`docker-compose up -d`


install prisma cli
`yarn install -g prisma`

prisma generate
`prisma generate`

prisma deploy
`prisma deploy`


run server
`yarn run dev`

deploy server production
`pm2 start ecosystem.config.js`


### enviroments

- Prisma 
- mongodb
- express
- graphql





### siblings

- [inked-news-crawler](https://github.com/softmarshmallow/inked-news-crawler)
- [inked-engine](https://github.com/softmarshmallow/inked-engine)
- [inked-flutter](https://github.com/softmarshmallow/inked-flutter)



### realtime communication

socket io related

namespaces
- crawler
- engine
- client


events by namespaces
- crawler
    - on crawled
- engine
    - on crawled receive
    - on analysis complete
- client
    - on new data
    - on data update
