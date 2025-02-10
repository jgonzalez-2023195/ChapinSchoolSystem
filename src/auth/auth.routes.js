import { Router } from "express"
import { 
    login, 
    register, 
    test 
} from './auth.controller.js'
import { uploadProfilePicture } from "../../middlewares/multer.uploads.js"
import { registerValidatior } from "../../middlewares/validators.js"
import { deleteFileOnError } from "../../middlewares/delete.file.on.errors.js"

const api = Router()

api.post(
    '/register',
    [
        uploadProfilePicture.single("profilePicture"),
        registerValidatior,
        deleteFileOnError
    ],
    register
)
api.post('/login', login)
api.get('/test', test)

export default api