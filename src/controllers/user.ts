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
import { promises as fs } from 'fs'
import { v2 as cloudinary } from 'cloudinary'

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
  if (!user) throw new NotFoundError('No user')

  let avatar
  let avatarPublicId
  if (req.file) {
    const response = await cloudinary.uploader.upload(req.file.path)
    // remove the temporary image
    await fs.unlink(req.file.path)
    avatar = response.secure_url
    avatarPublicId = response.public_id
  }

  console.log(user)

  // if user image already exists, delete that image first
  if (req.file && user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId)
  }
  if (!email) throw new NotFoundError('User not found')

  let passwordIsMatched
  if (oldPassword)
    passwordIsMatched = await bcrypt.compare(oldPassword, user.password)

  if (oldPassword && !passwordIsMatched) {
    throw new UnauthenticatedError('Incorrect old password')
  } else {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password || user.password, salt)
    const updatedUser = await User.findOneAndUpdate(
      { email: currentEmail },
      {
        name,
        email,
        password: hashedPassword,
        avatar,
        avatarPublicId,
      },
      {
        new: true,
      }
    )
    // changing jwt token
    const token = createJwt({
      userId: user._id.toString(),
      email,
    })

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

// user does not provide password but provides lets say the name, we only want to change the name then.

// so lets say the password is empty, then if there is a name or email, just change whatever there is

// if no password, then get the old password and put it in the old and new password
