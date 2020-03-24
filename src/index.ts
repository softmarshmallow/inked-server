import * as express from 'express'
import * as bodyParser from 'body-parser'
import { prisma } from './generated/prisma-client'

const app = express()

app.use(bodyParser.json())

app.post(`/user`, async (req, res) => {
  const result = await prisma.createUser({
    ...req.body,
  })
  res.json(result)
})

app.post(`/news`, async (req, res) => {
  const { title, content, time } = req.body
  const result = await prisma.createNews({
    title: title,
    content: content,
    time: time,
    meta: {}
  })
  res.json(result)
})


app.get('news', async (req, res) => {
  const result = await prisma.newses
  res.json(result)
})



app.listen(3000, () =>
  console.log('Server is running on http://localhost:3000'),
)