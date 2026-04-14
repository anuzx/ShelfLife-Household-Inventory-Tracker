import type { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { Household } from "../models/household.model"
import { HouseHoldSchema } from "../validator/schema"
import { ApiError } from "../utils/ApiError"
import { User } from "../models/user.model"
import { ApiRes } from "../utils/ApiResponse"
import { generateInviteCode } from "../utils/inviteCode"


export const createHousehold = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = HouseHoldSchema.safeParse(req.body)
  const creatorId = req.userId as string

  if (!parsedData.success) {
    throw new ApiError(400, "invalid input")
  }

  const { name, inviteCode, members, wasteScore } = parsedData.data

  const code = generateInviteCode()

  const houseHold = await Household.create({
    name,
    inviteCode: code,
    members: [creatorId],
    wasteScore
  })

  const user = await User.findById(creatorId)

  if (!user) {
    throw new ApiError(400, "invalid user id")
  }

  user.householdId = houseHold._id

  await user.save()

  return res.status(201).json(new ApiRes(201, "new household created", houseHold))

})

export const joinHousehold = asyncHandler(async (req: Request, res: Response) => {
  const inviteCode = req.body.inviteCode
  const userId = req.userId

  const houseHold = await Household.findOne({ inviteCode })

  if (!houseHold) {
    throw new ApiError(400, "invalid invite code")
  }

  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(400, "user does not exists")
  }

  const alreadyMember = houseHold.members.some(
    (memberId) => memberId.toString() === user._id.toString()
  )

  if (alreadyMember) {
    throw new ApiError(400, "user is already a member of this household")
  }

  houseHold.members.push(user._id)

  await houseHold.save()

  user.householdId = houseHold._id

  await user.save()

  return res.status(200).json(new ApiRes(200, "new user added", houseHold.members))
})

export const getCurrentUsersHousehold = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId

  const user = await User.findById(userId)

  if (!user) {
    throw new ApiError(400, "invalid userId")
  }

  const houseHoldId = user.householdId

  const houseHold = await Household.findById(houseHoldId)

  if (!houseHold) {
    throw new ApiError(400, "inavlid id")
  }

  return res.status(200).json(new ApiRes(200, "household of this user", houseHold))
})

export const listAllMembers = asyncHandler(async (req: Request, res: Response) => {
  const houseHoldId = req.params.id

  const houseHold = await Household.findById(houseHoldId)

  if (!houseHold) {
    throw new ApiError(400, "inavlid houseHold id")
  }

  const result = houseHold.members

  return res.status(200).json(new ApiRes(200, "list of members", result))
})
