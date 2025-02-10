
import User from '../src/user/user.model.js'
import Course from '../src/course/course.model.js'

export const existEmail = async(email, user)=>{
    const alreadyEmail = await User.findOne({email})
    if(alreadyEmail && alreadyEmail._id != user.uid){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const existCourse = async(title, course)=> {
    const alreadyCourse = await Course.findOne({title})
    if(alreadyCourse && alreadyCourse._id != course._id){
        console.error(`Course ${title} is already taken`)
        throw new Error(`Course ${title} is already taken`)
    }
}

export const validateField = (field, value) => {
    if (field) {
        throw new Error(`${field} is not required`);
    }

    if (value) {
        throw new Error('Teacher cannot be modified');
    }

    return true;
};
