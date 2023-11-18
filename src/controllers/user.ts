import { Request, Response } from 'express'
import User from '../model/User'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/customErrors'
import Cart from '../model/Cart'
import bcrypt from 'bcryptjs'
import { createJwt } from '../utils/tokenUtil'

interface GetCurrentUserRequest extends Request {
  user?: {
    email: string
    userId: string
  }
}

export const getCurrentUser = async (
  req: GetCurrentUserRequest,
  res: Response
) => {
  const { userId }: any = req.user
  const currentUser = await User.findById(userId)
  const cart = await Cart.find({ userId })

  res.status(StatusCodes.OK).json({ currentUser, cart })
}

export const editUser = async (req: GetCurrentUserRequest, res: Response) => {
  const { name, email, password, oldPassword } = req.body
  const { email: currentEmail }: any = req.user

  const user = await User.findOne({ email: currentEmail })

  if (!email) throw new NotFoundError('User not found')

  const passwordIsMatched = await bcrypt.compare(oldPassword, user.password)

  if (!passwordIsMatched) {
    throw new UnauthenticatedError('Wrong old password')
  } else {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const updatedUser = await User.findOneAndUpdate(
      { email: currentEmail },
      {
        name,
        email,
        password: hashedPassword,
      },
      {
        new: true,
      }
    )
    // changing jwt token
    const token = createJwt({ userId: user._id.toString(), email })

    // sending cookie
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    return res.status(StatusCodes.OK).json(updatedUser)
  }
}
