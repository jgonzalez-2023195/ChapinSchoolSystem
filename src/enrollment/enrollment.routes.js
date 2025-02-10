import { Router } from "express"
import { enrollInCourse } from './enrollment.controller.js'
import { deleteFileOnError } from '../../middlewares/delete.file.on.errors.js'
import { validateTokenJWT } from '../../middlewares/validate.jwt.js'

const api = Router()

api.post('/assignment', [validateTokenJWT], enrollInCourse)

export default api