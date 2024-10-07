
import { query } from "express";

import AccountRepository from "../repositories/account-repository.js";
import login from "../../auth/login.js";

const AccountRepositories= new AccountRepository();

export default class AccountServices {

    async login(user, pass) {
        try{
        const Us= await this.getUserByPayload(user,pass) 
        if(Us!=null){
          const token =await login(Us) 
          return token;
        }else{
          return false;
        }
        }catch(error){
          console.log(error);
          return res.json(error);
        }
    }
    

    async getUserByPayload(user,pass){
        return await AccountRepositories.getUser(user,pass) 
      }

      async registerPendingUser(username,email,telefono,fechaNacimiento,hashedPassword,fotoPerfil)
      {
        console.log("entre registerPendingUser");
        
      await AccountRepositories.registerPendingUser(username,email,telefono,fechaNacimiento,hashedPassword,fotoPerfil);
      return "inserted registerPendingUser";
      }

      async getPendingUser(email)
      {
      const response = await AccountRepositories.getPendingUser(email);
      return response;
      }

      
      async getUserByIdTokeb(id)
      {
      const response = await AccountRepositories.getUserByIdTokeb(id);
      return response;
      }



      async registerUser(username,email,telefono,fechaNacimiento,hashedPassword)
        {
        await AccountRepositories.registerUser(username,email,telefono,fechaNacimiento,hashedPassword);
        return "inserted";
        }


        async confirmUser(email) { 
          const result = await AccountRepositories.confirmUser(email);
          return result;
      }
}
