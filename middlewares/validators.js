import { body } from "express-validator"
import { validateErrors } from "./validate.errors.js"
import { existEmail, existCourse } from "../utils/db.validators.js"

export const registerValidatior = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty')
        .notEmpty()
        .isEmail()
        .custom(existEmail),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword(
            {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }
        )
        .isLength({min: 8, max: 100}).withMessage('The password must have a minimum of 8 characters and a maximum of 100 characters.')
        .custom((password)=>{
            const comonPasswords = ['password', 'qwerty1234', 'hola1234', 'admin1234', '12345678']
            if(comonPasswords.includes(password)){
                throw new Error('Password is too common')
            }
            return true
        }),
    body('role', 'Invalid role')
        .isIn(['STUDENT_ROLE', 'TEACHER_ROLE']),
    validateErrors
]

export const newCourse = [
    body('title', 'Title cannot be empty')
        .notEmpty()
        .custom(existCourse),
    body('teacher', 'Teacher cannot be empty')
        .notEmpty()
        .isMongoId().withMessage('Teacher id must be valid'),
    validateErrors
]