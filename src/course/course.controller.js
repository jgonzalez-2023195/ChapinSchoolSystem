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

// Inscribirse en un curso
export const enrollInCourse = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id; // Asumiendo que el ID del estudiante está en el token de usuario

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Verificar si el estudiante ya está inscrito
        if (course.students.includes(studentId)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Inscribir al estudiante
        course.students.push(studentId);
        await course.save();

        res.json({ message: 'Enrollment successful', course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error enrolling in course' });
    }
};

// Obtener cursos en los que está inscrito un estudiante
export const getEnrolledCourses = async (req, res) => {
    const studentId = req.user._id; // Asumiendo que el ID del estudiante está en el token de usuario

    try {
        const courses = await Course.find({ students: studentId });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching enrolled courses' });
    }
};

export const unenrollFromCourse = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id; // Asumiendo que el ID del estudiante está en el token de usuario

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Verificar si el estudiante está inscrito
        if (!course.students.includes(studentId)) {
            return res.status(400).json({ message: 'Not enrolled in this course' });
        }

        // Cancelar inscripción
        course.students.pull(studentId);
        await course.save();

        res.json({ message: 'Unenrollment successful', course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error unenrolling from course' });
    }
}