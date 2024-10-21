import jwt from "jsonwebtoken"
import "dotenv/config"

export default async function (Usuario){ 
    const options={ 
    expiresIn:"3h",
    issuer:"proyect"
}   
    const payload = {"id":Usuario.id, "username":Usuario.name};
    const token=jwt.sign(payload,process.env.SECRET_KEY,options); 
    return token; 
    }