import DecryptToken from "../auth/jwt.js"

export default async function (req,res,next){
    if(!req.headers.authorization){ //si ingresaste el token en pm
        res.status(401).send("You do not have access to the information");
    }else{
        const token = req.headers.authorization.split(' ')[1]; 
        const payload=await DecryptToken(token); 
        if(payload!=null){
            req.user=payload; 
            next();
        }else{
            res.status(401).send("token error") ;
        }
    }
}