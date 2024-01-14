import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import UserRoutes from './Routes/User.routes'

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use('/api', UserRoutes)

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000')
})