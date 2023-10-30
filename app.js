import express from 'express'
import looger from 'morgan'
import { createServer } from 'node:http'
import path from 'path'
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

app.use(express.static(path.join(process.cwd(), './client/')))

httpServer.listen(PORT, () => {
  console.log(`Server running on PORT ==> ${PORT}`)
})
