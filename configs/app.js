'use strict'

import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import authRoutes from '../src/auth/auth.routes.js'
import coursesRoutes from '../src/course/course.routes.js'
import enrollmentRoutes from '../src/enrollment/enrollment.routes.js'

const configs = (app)=> {
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
    // app.use(limiter)
}

const routes = (app)=> {
    app.use('/v1/schoolSystem', authRoutes)
    app.use('/v1/courses', coursesRoutes)
    app.use('/v1/courses/enrollment/STU', enrollmentRoutes)
}

export const initServer = ()=> {
    const app = express()
    try {
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port: ${process.env.PORT}`)
    } catch (e) {
        console.error('Server init failed: ', e);
    }
}