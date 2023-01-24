import express from 'express'
import { prismaClient } from './database/prismaClient'
import swaggerUI from 'swagger-ui-express'
import swaggerDocument from '../swagger.json'
import { css } from './css'
import { logger } from './logger'
import fs from 'fs'

const app = express()
app.use(express.json())
const port = process.env.PORT || 5000

app.post('/users', async (request, response) => {
  // logger.info('access user post')
  const { email, username, name } = request.body

  const verifyIfExistsUser = await prismaClient.user.findFirst({
    where: {
      username,
      OR: {
        email,
      },
    },
  })

  if (verifyIfExistsUser)
    return response.status(400).json({ error: 'User already exists' })

  const userCreated = await prismaClient.user.create({
    data: {
      email,
      username,
      name,
    },
  })

  return response.json(userCreated)
})

app.get('/users', async (request, response) => {
  logger.info('access user get')

  const users = await prismaClient.user.findMany()

  return response.json(users)
})

app.get('/logs/app', async (request, response) => {
  const file = fs.readFileSync('./app1.log')
  return response.json(file.toString())
})

app.get('/logs/error', async (request, response) => {
  const file = fs.readFileSync('/var/task/src/logs/error.log')
  return response.json(file.toString())
})

const options = {
  customCss: css,
}
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument, options))

app.listen(port, () => console.log(`Server is  running on port ${port}`))
