import type { Request, Response } from "express"
import { ApiError } from "../utils/ApiError"
import { LoginSchema, RegisterSchema } from "../validator/schema"
import { User } from "../models/user.model"
import { asyncHandler } from "../utils/asyncHandler"
import bcrypt from "bcrypt"
import { ApiRes } from "../utils/ApiResponse"
import jwt from "jsonwebtoken"


export const handleRegister = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = RegisterSchema.safeParse(req.body)

  if (!parsedData.success) {
    throw new ApiError(400, "inavlid input")
  }

  const { name, email, password } = parsedData.data

  const existEmail = await User.findOne({
    email
  })

  if (existEmail) {
    throw new ApiError(400, "this email already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  const result = await User.findById(user._id).select("-password")

  res.status(201).json(new ApiRes(201, "user created", result))
})

export const handleLogin = asyncHandler(async (req: Request, res: Response) => {

  const parsedData = LoginSchema.safeParse(req.body)

  if (!parsedData.success) {
    throw new ApiError(400, "inavlid input")
  }

  const { email, password } = parsedData.data

  const exisitngUser = await User.findOne({ email })

  if (!exisitngUser) {
    throw new ApiError(400, "invalid email or password")
  }

  const validPassword = await bcrypt.compare(password, exisitngUser.password)

  if (!validPassword) {
    throw new ApiError(400, "invalid email or password")
  }

  const token = jwt.sign({
    id: exisitngUser._id,
    email
  }, "secret_key")

  res.status(200).json(new ApiRes(200, "signin done", { token }))
})
