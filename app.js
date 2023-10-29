import express from 'express'
import looger from 'morgan'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

const PORT = process.env.PORT ?? 4321
const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  connectionStateRecovery: {}
})

io.on('connection', (socket) => {
  console.log(`Socket connected ==> ${socket.id}`)

  socket.on('chat message', (data) => {
    const username = socket.handshake.auth.username ?? 'anonymous'
    io.emit('chat message', data, username)
  })

  socket.on('disconnect', () => {
    console.log(`Socket disconnected ==> ${socket.id}`)
  })
})

app.use(looger('dev'))

app.get('/', (_, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

app.get('/style.css', (_, res) => {
  res.sendFile(process.cwd() + '/client/style.css')
})

httpServer.listen(PORT, () => {
  console.log(`Server running on PORT ==> ${PORT}`)
})
