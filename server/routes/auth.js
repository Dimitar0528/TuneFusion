import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {User} from '../db/models/index.js'
import sgMail from '@sendgrid/mail';

const router = express.Router();
const secretKey = process.env.JWT_SECRET_KEY;

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { name } });

        if (existingUser) {
            return res.status(400).json({ error: 'name already taken!' });
        }

        const adminUser = await User.findOne({ where: { role: 'admin' } });

        if (name.toLowerCase().includes('admin') && adminUser) {
            return res.status(403).json({ error: 'Request denied! You cannot create administrator accounts!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = name.toLowerCase().includes('admin') ? 'admin' : 'user';

        const newUser = await User.create({
            uuid: crypto.randomUUID(),
            name,
            email_address: email,
            password: hashedPassword,
            role,
        });

        return res.status(200).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ where: { name } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid name! Please check your name again.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password! Please check your password again.' });
        }

        const token = jwt.sign({ userUUID: user.uuid, userRole: user.role }, secretKey, {
            expiresIn: '24h',
        });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 86400000,
            sameSite: 'Strict',
            path: '/',
        };

        res.cookie('_token', token, cookieOptions);

        const responseData = {
            user_uuid: user.uuid,
        };

        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error authenticating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/logout', (req, res) => {
    res.cookie('_token', '', {
        maxAge: 0,
        httpOnly: true,
        path: '/',
    });

    res.status(200).json({ message: 'You have successfully logged out of your account!' });
});

router.get('/getToken', (req, res) => {
    const tokenCookie = req.headers.cookie;
    if (!tokenCookie) return null;

    const token = tokenCookie.split('=')[1].trim();

    try {
        const decodedUserToken = jwt.verify(token, secretKey);
        const { userUUID, userRole } = decodedUserToken;

        return res.status(200).json({ id: userUUID, role: userRole });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: error.message });
    }
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/sendOTP', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const otp = generateOTP();
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'OTP Verification',
        html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`,
    };

    try {
        await sgMail.send(msg);
        return res.status(200).json({ otp });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ error: 'Failed to send OTP' });
    }
});

export default router;
