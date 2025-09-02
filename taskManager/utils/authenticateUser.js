import express from 'express';

export const authenticateUser = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authorization.split(' ')[1];
    if (token !== 'your-secret-token') {
        return res.status(403).json({ message: "Invalid token" });
    }

    next();
};