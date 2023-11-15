import jwt from 'jsonwebtoken'

type Token = {
  userId: string
  email: string
}

export const createJwt = (payload: Token) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_TIMEOUT,
  })
}

export const verifyJwt = (token: string): Token => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!)
  return decoded as Token
}
