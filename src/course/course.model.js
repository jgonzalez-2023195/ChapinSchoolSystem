import { Schema, model } from "mongoose"

const courseSchema = Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            maxLength: [100, `Can't be overcome 100 characters`]
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxLength: [500, `Can't be overcome 500 characters`]
        },
        teacher: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'There should be one teacher in charge per course']
        },
        students: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    }
)

export default model('Course', courseSchema)