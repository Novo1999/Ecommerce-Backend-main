import { Response, NextFunction } from 'express'
import { UnauthenticatedError } from '../errors/customErrors'
import { verifyJwt } from '../utils/tokenUtil'

type Request = {
  cookies: {
    token: string
  }
  user: {
    userId: string
    email: string
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies
  console.log(token)
  if (!token) throw new UnauthenticatedError('authentication invalid')

  try {
    const { userId, email } = verifyJwt(token)
    req.user = { userId, email }
    next()
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid')
  }
}
