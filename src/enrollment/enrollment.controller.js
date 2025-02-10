import User from '../user/user.model.js'
import Courses from '../course/course.model.js'

async function getUser(userId) {
    const user = await User.findById(userId)
    return user ? user.role : null
}

export const enrollInCourse = async (req, res) => {
    try {
        let studentId = req.user.uid;  // Suponiendo que el token ya está validado y tienes el `uid` en `req.user`
        let { courseId } = req.body;

        // Verifica el rol del usuario
        const user = await User.findById(studentId);
        if (user.role !== 'STUDENT_ROLE') {
            return res.status(403).send({ message: 'Access denied: the user is not a student' });
        }

        // Encuentra al estudiante y al curso
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        // Verifica si el estudiante ya está inscrito en el curso
        if (course.students.includes(studentId)) {
            return res.status(400).send({ message: 'You are already enrolled in this course' });
        }

        // Verifica si el estudiante tiene menos de 3 cursos (si lo deseas)
        if (course.students.length >= 3) {
            return res.status(400).send({ message: 'Course is full' });
        }

        // Inscribir al estudiante en el curso
        course.students.push(studentId);
        await course.save();
        return res.status(200).send({ message: 'Enrolled in course successfully', studentId })
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