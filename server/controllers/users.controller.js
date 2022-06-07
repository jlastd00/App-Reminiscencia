import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import User from '../models/User';
import Patient from '../models/Patient';
import { SECRET_KEY } from '../config/properties';

// Register
export async function registerUser(req, res) {
    
    const { username, email, password, confirmPassword } = req.body;
    
    // Validations
    if (!username || !email || !password || !confirmPassword) {
        return res.json({success: false, msg: 'Please fill all the fields'});
    }
    if (password !== confirmPassword) {
        return res.json({success: false, msg: 'Passwords do not match'});
    }
    const userFound = await User.findOne({email: req.body.email});
    if (userFound) return res.json({success: false, msg: 'User email already exists'});

    const token = jwt.sign({ username, email }, SECRET_KEY);

    // Create new user
    const newUser = new User({
        username: username,
        email: email,
        password: await User.encryptPassword(password),
        verifyToken: token
    })

    // Activacion de cuenta  
    
    const link = `http://localhost:4200/verify/?token=${token}`;
    console.log(link);

    const contentHTML = `
        <center>
            <h1>Activación de cuenta</h1>
            Hola,<br> Por favor, haz Click en el siguiente enlace para verificar tu email.<br>
            <a href="${link}">Click aqui para verificar</a>
        </center>
    `;
    
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'darwin.windler37@ethereal.email',
            pass: 'W29RMQ3bdJxvGydBzu'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"Juan Ramon" <darwin.windler37@ethereal.email>', // sender address
        to: newUser.email, // list of receivers
        subject: "Por favor, confirma tu cuenta de Email", // Subject line
        html: contentHTML, // html body
    });

    console.log("Message sent: ", info.messageId);
    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));  
    console.log('Mensaje enviado');

    const userRegistered = await newUser.save(); 
    if (!userRegistered) return res.status(409).json({success: false, msg: 'Failed to register user'});
    
    console.log(userRegistered);

    return res.status(201).json({success: true, msg: 'User created successfully'});
    
}

// Verificacion de cuenta
export async function verifyEmail(req, res) {

    console.log(req.protocol + "://" + req.get('host'));

    const { token } = req.body;
    //console.log(token);
    const errormsg = 'Algo ha ido mal, no se ha verificado el email';
    const successmsg = 'El Email se ha verificado con exito, ya puede iniciar sesion';
    
    if ((req.protocol + "://localhost:3000") == ("http://" + req.get('host'))) {

        console.log("El dominio coincide. La informacion viene desde un Email valido");
        
        jwt.verify(token, SECRET_KEY, async (error, decoded) => {
            if (error) {
                return res.json({success: false, msg: errormsg});
            } 
            else {
                const email = decoded.email;
                
                const user = await User.findOne({email});
                if (!user) { return res.json({success: false, msg: errormsg}); } 

                if (token == user.verifyToken) {
                    
                    const userUpdated = await User.findByIdAndUpdate(user._id, {verifyToken: ""});
                    if (!userUpdated) { return res.json({success: false, msg: errormsg}); } 

                    console.log("Email verificado");
                    return res.json({success: true, msg: successmsg});
                }
                else {
                    console.log("Email NO verificado");
                    return res.json({success: false, msg: errormsg});
                }
            }
        });
    }
    else {
        console.log("Request is from unknown source");
        return res.send('No coincide el dominio ni el host, no se puede verificar el Email');
    }
    
}

// Login
export async function loginUser(req, res) {
    
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.json({success: false, msg: 'Please fill all the fields'});
    }
    
    const userFound = await User.findOne({email: email}).populate('Patient'); // Obtengo el usuario con sus pacientes
    if (!userFound) return res.json({success: false, msg: 'User not found'});

    const matchPassword = await User.comparePassword(password, userFound.password);
    if (!matchPassword) return res.json({success: false, msg: 'Invalid password'});

    if (userFound.verifyToken !== "") { 
        return res.json({
            success: false, 
            msg: 'Su cuenta no esta activada, por favor revise su email para activarla'
        });
    }

    const token = jwt.sign({id: userFound._id}, SECRET_KEY, {
        expiresIn: 86400 // 24 horas
    })

    return res.status(200).json({
        success: true, 
        token: token,
        user: {
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            patients: userFound.patients
        }
    });
    
}

// Forgot password
export async function forgotPassword(req, res) { 

    const { email } = req.body;
    
    const user = await User.findOne({email: email});
    if (!user) return res.json({success: false, msg: 'El usuario no existe'});

    // 
    const hash = await bcrypt.hash(email, 10);
    const token = jwt.sign({ email, hash }, SECRET_KEY);

    const userUpdated = await User.findByIdAndUpdate(user._id, {resetToken: token});
    if (!userUpdated) { return res.json({success: false, msg: 'Ha ocurrido un error'}); }

    const link = `http://localhost:4200/reset-password/?token=${token}`;
    console.log(link);

    const contentHTML = `
        <center>
            <h1>Cambio de contraseña</h1>
            Hola,<br> Por favor, haz Click en el siguiente enlace para introducir la nueva contraseña.<br>
            <a href="${link}">Click aqui para introducir la contraseña</a>
        </center>
    `;
    
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'darwin.windler37@ethereal.email',
            pass: 'W29RMQ3bdJxvGydBzu'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"Juan Ramon" <darwin.windler37@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Cambio de contraseña", // Subject line
        html: contentHTML, // html body
    });

    console.log("Message sent: ", info.messageId);
    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));  
    console.log('Mensaje enviado');

    return res.json({success: true, msg: 'Solicitud recibida, revise su email para resetear su contraseña'});
}

// Reset password
export async function resetPassword(req, res) {
    
    const { userToken, password, confirmPassword } = req.body;
    
    jwt.verify(userToken, SECRET_KEY, async (error, decoded) => {
        if (error) {
            return res.json({success: false, msg: 'Ha ocurrido un error'});
        } 
        else {
            const email = decoded.email;
            
            const user = await User.findOne({email});
            if (!user) { return res.json({success: false, msg: 'Ha ocurrido un error'}); } 

            if (userToken !== user.resetToken) { return res.json({success: false, msg: 'Ha ocurrido un error'}); }

            if (!password || !confirmPassword) {
                return res.json({success: false, msg: 'Por favor, rellena todos los campos'});
            }
            if (password !== confirmPassword) {
                return res.json({success: false, msg: 'Las contraseñas no coinciden'});
            }

            const passwordExists = await User.comparePassword(password, user.password);
            if (passwordExists) return res.json({success: false, msg: 'La contraseña no es válida'});

            const userUpdated = await User.findByIdAndUpdate(user._id, 
                {
                    resetToken: "",
                    password: await User.encryptPassword(password)
                });
            if (!userUpdated) { return res.json({success: false, msg: 'Ha ocurrido un error'}); } 

            return res.json({success: true, msg: 'Contraseña reestablecida con exito, ya puede iniciar sesion'});
        }
    })
}

// Validate reset token
export async function validateResetToken(req, res) {
    
    const { token } = req.body;

    jwt.verify(token, SECRET_KEY, async (error, decoded) => {
        if (error) {
            return res.json({success: false, msg: 'Ha ocurrido un error'});
        } 
        else {
            const email = decoded.email;
            
            const user = await User.findOne({email});
            if (!user) { return res.json({success: false, msg: 'Ha ocurrido un error'}); } 

            if (user.resetToken == "") { return res.json({success: false, msg: 'Ha ocurrido un error'}); }

            if (token == user.resetToken) {
                
                console.log("Todo correcto, se puede cambiar la contraseña");
                return res.json({success: true, token: token, msg: 'Correcto, ya puede cambiar la contraseña'});
            }
            else {
                console.log("No coinciden los token");
                return res.json({success: false, msg: 'Ha ocurrido un error'});
            }
        }
    });    

}

// Dashboard
export function dashboardUser(req, res) {
    return res.json({user: req.user});
}

// Profile
export function profileUser(req, res) {
    return res.json({user: req.user});
}
