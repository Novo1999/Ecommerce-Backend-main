import { Request, Response } from 'express'
import User from '../model/User'
import { StatusCodes } from 'http-status-codes'
import { NotFoundError, UnauthenticatedError } from '../errors/customErrors'
import Cart from '../model/Cart'
import bcrypt from 'bcryptjs'
import { createJwt } from '../utils/tokenUtil'
import { v2 as cloudinary } from 'cloudinary'
import { formatImage } from '../middleware/multerMiddleware'

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
  let { name, email, password, oldPassword } = req.body
  const { email: currentEmail }: any = req.user
  const user = await User.findOne({ email: currentEmail })
  if (!user) throw new NotFoundError('No user')

  let avatar
  let avatarPublicId
  // file upload
  if (req.file) {
    const file = formatImage(req.file)
    const response = await cloudinary.uploader.upload(file)
    avatar = response.secure_url
    avatarPublicId = response.public_id
  }

  // if user image already exists, delete that image first
  if (req.file && user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId)
  }
  if (!email) throw new NotFoundError('User not found')

  // if user does not provide the password, then just edit the other information user changes
  let passwordIsMatched
  if (oldPassword === '' && password === '') {
    passwordIsMatched = true
  } else {
    passwordIsMatched = await bcrypt.compare(oldPassword, user.password)
  }

  // if password matches
  if (passwordIsMatched) {
    const salt = await bcrypt.genSalt(10)
    // hash the password only if the user provided the password
    let hashedPassword
    if (password === '') {
      hashedPassword = user.password
    } else {
      hashedPassword = await bcrypt.hash(password, salt)
    }
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
  } else {
    throw new UnauthenticatedError('Incorrect old password')
  }
}
