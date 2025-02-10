'use strict'

import jwt from 'jsonwebtoken'

export const validateTokenJWT = async(req, res, next)=> {
    try {
        let secretKey = process.env.SECRET_KEY
        let { authorization } = req.headers
        if(!authorization) return res.status(401).send({message: 'Unauthorized'})
        let user = jwt.verify(authorization, secretKey)
        req.user = user
        next()
    } catch (e) {
        console.error(e);
        return res.status(401).send({message: 'Invalid credentials'})
    }
}