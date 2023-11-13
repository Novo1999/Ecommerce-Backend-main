import 'express-async-errors'
import express from 'express'
import { Request, Response } from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import mongoSanitize from 'express-mongo-sanitize'
import authRouter from './routes/auth'
import productRouter from './routes/products'
import cartRouter from './routes/cart'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware'
import { StatusCodes } from 'http-status-codes'
import { authenticateUser } from './middleware/authMiddleware'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
app.use(mongoSanitize())

app.use('/api/e-commerce/auth', authRouter)
app.use('/api/e-commerce/products', productRouter)
app.use('/api/e-commerce/cart', authenticateUser as () => void, cartRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('This server works')
})

app.use('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: 'not found' })
})

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 6700

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!)
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

run()

export default app
