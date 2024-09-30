import express from "express";
const router = express.Router();
import nodemailer from 'nodemailer';
import AccountServices from "../services/account-services.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const AccountSrv  = new AccountServices();


router.post("/login", async (request, response) => { 
    const user = request.body.username;
    const pass = request.body.password;
    try {
      const token = await AccountSrv.login(user, pass);
      if(token!=false){
      return response.status(200).json({
        "succes":true,
        "message":"",
        "token":token});
      }else{
        return response.status(401).json({
          "succes":false,
          "message":"Incorrect username or password",
          "token":""});
      }
    } catch (error) {
      return response.json(error);
    }
  });

  
router.get("/login/token", async (request, response) => { 
    id = request.user.id; 
    try {
    const decoded = await AccountSrv.getUserByIdTokeb(id);
    return response.status(200).json(decoded);
    } catch (error) {
    console.error("Error", error);
    return response.json("Error");    }
  });



  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Usa el servicio que prefieras
    auth: {
        user: "botworky@gmail.com",
        pass: "svak yhbh fusu glhl",
    },

});


  const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: "botworky@gmail.com",
        to: to,
        subject: subject,
        text: text,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

router.get('/confirm/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const email = decoded.email;
        const user = await AccountSrv.getPendingUser(email);
        if (user) {
            await AccountSrv.registerUser(user.Nombre,user.mail,user.telefono,user.fechaNacimiento,user.password);
            return res.status(200).json({ message: "Your account has been confirmed!" });
        } else {
            return res.status(400).json({ error: "No pending account found." });
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Invalid or expired token." });
    }
});


router.post("/register", async (request, response) => {
    const { username, email, password, telefono, fechaNacimiento, fotoPerfil } = request.body;
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^[0-9]{10,15}$/; // Regex para validar el teléfono (puedes ajustarlo según tus necesidades)
    const photoRegex = /\.(jpg|jpeg)$/i; 

    // Validaciones de campos obligatorios
    if (!username || !email || !password) {
        return response.status(400).json({ error: "There is an empty field" });
    }

    // Validación del formato de email
    if (!emailRegex.test(email)) {
        return response.status(400).json({ error: "The email is invalid" });
    }

    // Validación del tamaño del username
    if (username.length <= 3) {
        return response.status(400).json({ error: "The username must be more than 3 characters" });
    }

    // Validación del tamaño de la contraseña
    if (password.length <= 3) {
        return response.status(400).json({ error: "The password must be more than 3 characters" });
    }

    // Validación del teléfono
    if (telefono && !phoneRegex.test(telefono)) {
        return response.status(400).json({ error: "The phone number is invalid. It should contain only digits and be between 10 to 15 characters long." });
    }

    // Validación de fecha de nacimiento (puedes ajustar el formato según tus necesidades)
    if (!fechaNacimiento || isNaN(new Date(fechaNacimiento).getTime())) {
        return response.status(400).json({ error: "The date of birth is invalid." });
    }

    // Validación de foto de perfil
    // Permitir que 'fotoPerfil' sea null
    if (fotoPerfil && !photoRegex.test(fotoPerfil)) {
        return response.status(400).json({ error: "The profile picture must be a JPG file." });
    }

    try {
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 

        // Incluye 'fotoPerfil' en la llamada a 'registerPendingUser'
        await AccountSrv.registerPendingUser(username, email, telefono, fechaNacimiento, hashedPassword, fotoPerfil);

        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        const confirmationUrl = `http://localhost:3000/confirm/${token}`;
        await sendEmail(email, 'Confirm your account', `Please confirm your account by clicking this link: ${confirmationUrl}`);
        
        return response.status(201).json({ message: "Registration successful. Please check your email to confirm your account." });    
    } catch (error) {
        console.error(error);
        if (error.code === '23505') { 
            return response.status(400).json({ error: "The username or email is already in use" });
        }
        return response.status(500).json({ error: "Server error" });
    }
});



export default router;