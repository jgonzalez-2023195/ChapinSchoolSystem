import User from '../user/user.model.js'
import { encrypt, checkPassword } from '../../utils/encryp.validations.js'
import { generateTokenJWT } from '../../utils/jwt.js';

export const test =(req, res)=>{
    console.log('Test is runig');
    res.send({message: 'Testing succesfully running'})
}

export const register = async(req, res)=> {
    try {
        let data = req.body

        // Extraer nombre de usuario y dominio del email
        const [username, domain] = data.email.split('@');

        // Definir sufijo según el rol
        const suffix = data.role === 'STUDENT_ROLE' ? '.STU' : '.TCH';

        // Modificar el email antes de guardarlo
        data.email = `${username}${suffix}@${domain}`;

        let user = new User(data)
        user.password = await encrypt(user.password)
        user.profilePicture = req.file.filename ?? null
        await user.save()
        return res.status(200).send(
            {
                success: true,
                message: `Registration succesfully, can be login to system with email: ${user.email}`
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

export const login = async(req, res)=> {
    try {
        let { emailLoggin, password } = req.body
        let user = await User.findOne(
            {
                $or: [
                    {email: emailLoggin}
                ]
            }
        )
        console.log(user)
        if(user && await checkPassword(user.password, password)){
            let loggedUser = {
                uid: user._id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                role: user.role
            }
            let token = await generateTokenJWT(loggedUser)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }

        return res.status(400).send({message: 'Invalid Credentials'})
    } catch (e) {
        console.error(e);
        return res.status(500).send(
            {
                success: false,
                message: 'General error with login function',
                e
            }
        )
    }
}