import jwt from 'jsonwebtoken';
export const createJwt = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
    });
};
export const verifyJwt = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
};
//# sourceMappingURL=tokenUtil.js.map