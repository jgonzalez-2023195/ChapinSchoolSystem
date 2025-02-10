import { Schema, model } from 'mongoose'

const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [30, `Can't be overcome 30 characters`]
        },
        surname: {
            type: String,
            required: [true, 'Surname is required'],
            maxLength: [30, `Can't be overcome 30 characters`]
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, `Password must be 8 characters`],
            maxLength: [100, `Can't be overcome 100 characters`]
        },
        profilePicture: {
            type: String
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            uppercase: true,
            enum: ['STUDENT_ROLE', 'TEACHER_ROLE']
        }
    }
)

export default model('User', userSchema)