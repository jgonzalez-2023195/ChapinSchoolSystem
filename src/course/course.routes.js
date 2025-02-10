import { Router } from "express"
import { createCourse, getCoursesByTeacher } from './course.controller.js'
import { newCourse } from "../../middlewares/validators.js"
import { deleteFileOnError } from "../../middlewares/delete.file.on.errors.js"
import { validateTokenJWT } from "../../middlewares/validate.jwt.js"

const api = Router()

api.post('/new',
    [
        newCourse,
        validateTokenJWT,
        deleteFileOnError
    ], 
    createCourse
)
api.get('/list', [validateTokenJWT], getCoursesByTeacher)

export default api