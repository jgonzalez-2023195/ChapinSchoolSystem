import { Router } from "express"
import { createCourse, deletedCourse, getCoursesByTeacher, updateCourse } from './course.controller.js'
import { newCourse, updateCourses } from "../../middlewares/validators.js"
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
api.put('/update/:id', 
    [
        updateCourses,
        validateTokenJWT,
        deleteFileOnError
    ],
    updateCourse
)
api.delete('/delete/:id', [validateTokenJWT], deletedCourse)

export default api