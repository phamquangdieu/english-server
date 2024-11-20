const { OAuth2Client } = require('google-auth-library');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const handleUser = async (req, res, next) => {
    try {
        const { token } = req.body;
        console.log(123, token);
        // const ticket = await googleClient.verifyIdToken({
        //     idToken: token,
        //     audience: process.env.GOOGLE_CLIENT_ID,
        // });
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
          );
        // const payload = ticket.getPayload();
        // const {email, name} = payload;
        const {email, name} = response.data;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                name
            });
        }
        const jwtToken = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            'YOUR_JWT_SECRET',
            { expiresIn: '6h' }
        );
        res.status(200).json({
            message: 'success',
            token: jwtToken,
            email: user.email,
            name: user.name,
        });
    } catch (error) {
        res.status(401).json({ error: 'Google authentication failed' });
    }
};

module.exports = {
    handleUser
};