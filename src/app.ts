import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import UserRoutes from './Routes/User.routes'

const app = express()

app.use(morgan('dev'))
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api', UserRoutes)

app.listen(4000, () => {
  console.log('Servidor iniciado en el puerto 4000')
})