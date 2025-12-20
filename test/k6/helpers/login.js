import { postCall } from './apiCalls.js';

export function login(userEmail, userPassword) {
    const payload = {
        email: userEmail,
        password: userPassword,
    }

    const res = postCall('/auth/login', payload);
    const token = res.json('token');

    return token;
}