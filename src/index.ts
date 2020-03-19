import * as express from 'express'
import * as bodyParser from 'body-parser'
import { prisma } from './generated/prisma-client'

const app = express()

app.use(bodyParser.json())

app.get(`/user`, async (req, res) => {
  const result = await prisma.users()
  res.json(result)
})


app.listen(3000, () =>
  console.log('Server is running on http://localhost:3000'),
)