import jwt from 'jsonwebtoken';

const generateToken = (userId: string, pollID: string, name: string): string => {
    if (!process.env.JWT_SECRET) throw new Error("jwt secret not defined");

    const pollDuration = process.env.POLL_DURATION ? parseInt(process.env.POLL_DURATION) : 7200;
    
    const token = jwt.sign({pollID, name, subject: userId, iat: Math.floor(Date.now() / 1000)}, process.env.JWT_SECRET, {
        expiresIn: pollDuration            
    });

    return token;
}

export default generateToken;