import Course from './course.model.js' 
import User from '../user/user.model.js'

async function getUser(userId) {
    const user = await User.findById(userId)
    return user ? user.role : null
}

export const createCourse = async (req, res) => {
    try {
        let data = req.body;
        let teacher = req.user.uid
        const role = await getUser(teacher)
        
        if (role !== 'TEACHER_ROLE') {
            return res.status(403).send({ message: 'Access denied: the user is not a teacher' })
        }

        data.teacher = teacher
        let course = new Course(data)
        await course.save()
        return res.status(200).send(
            {
                succes: true,
                message: 'Course create succesfully',
                course
            }
        )
    } catch (e) {
        console.error(e);
        return res.status(500).send(
            {
                success: false,
                message: 'Internal Server error',
                e
            }
        )
    }
}

export const getCoursesByTeacher = async (req, res) => {
    try {
        const teacher = req.user.uid
        const role = await getUser(teacher)
        
        if (role !== 'TEACHER_ROLE') {
            return res.status(403).send({ message: 'Access denied: the user is not a teacher' })
        }

        const courses = await Course.find({ teacher: teacher })
        if(courses.length === 0) return res.status(404).send({message: 'You have not been assigned to a course'})
            return res.status(200).send({message: 'The courses you are in charge of are: ', courses})
    } catch (e) {
        console.error(e);
        return res.status(500).send(
            {
                success: false,
                message: 'Internal Server error',
                e
            }
        )
    }
}

export const updateCourse = async(req, res)=> {
    try {
        let id = req.params.id
        let data = req.body
        const teacher = req.user.uid
        const role = await getUser(teacher)
        
        if (role !== 'TEACHER_ROLE') {
            return res.status(403).send({ message: 'Access denied: the user is not a teacher' })
        }

        let updateCourse = await Course.findByIdAndUpdate(id, data, {new: true})
        if(!updateCourse) return res.status(400).send({message: 'Course not found, course not update'})

        /* 
        const students = await User.find({ role: 'STUDENT_ROLE', courses: id });

        if (students.length > 0) {
            students.forEach(async (student) => {
                await User.updateOne(
                    { _id: student._id },
                    { $set: { 'courses.$[course].title': updatedCourse.title, 'courses.$[course].description': updatedCourse.description } },
                    { arrayFilters: [{ 'course._id': id }] }
                );
            });
        } */

            return res.status(200).send({message: 'Course updated succesfully', updateCourse})
    } catch (e) {
        console.error('General error', e);
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                e
            }
        )
    }
}

export const deletedCourse = async(req, res) => {
    try {
        let id = req.params.id
        const teacher = req.user.uid
        const role = await getUser(teacher)
        
        if (role !== 'TEACHER_ROLE') {
            return res.status(403).send({ message: 'Access denied: the user is not a teacher' })
        }

        /* const students = await User.find({ role: 'STUDENT_ROLE', courses: id }); // Solo estudiantes con este curso
        students.forEach(async (student) => {
            await User.updateOne({ _id: student._id }, { $unset: { courses: "" } });
        }); */

        let courses = await Course.findByIdAndDelete(id)
        if(!courses) return res.status(404).send({message: 'Course not found, course not deleted'})
            return res.status(200).send({message: 'Deleted course for sistem', courses})
    } catch (e) {
        console.error('General error', e);
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                e
            }
        )
    }
}