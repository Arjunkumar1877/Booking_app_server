import { Request, Response } from "express";
import { UserModel, UserType } from "../models/userModel";
import { SendEmailOtp } from "../services/nodemailer";
import { otp } from "../services/otpGenerate";


class UserController{

    private async findUser(key: string, value: string): Promise<UserType | null>{
          return await UserModel.findOne({[key]: value})
    }

    public registerUser =  async(req: Request, res: Response): Promise<any> => {
      try {
      let  user: UserType | null = await this.findUser(req.params.key, req.body.email);
   
       if(user){
        return res.status(400).json({message: "User Already exsists", data: null})
       }
       const OTP: string = otp()
         const newUserCreate: UserType = await UserModel.create({otp: OTP, ...req.body});

         if(newUserCreate){
            let savedData: UserType = {
                _id: newUserCreate._id,
                email: newUserCreate?.email,
                firstName: newUserCreate.firstName,
                lastName: newUserCreate.lastName
              }
              
           const emailSend = await  SendEmailOtp(newUserCreate.email, OTP)
           if(emailSend){
            res.status(200).json({message: "User data successfully saved and an otp was send to the email", data: savedData});
           }else{
            res.status(200).json({message: "User data successfully saved but failed to send email", data: savedData});
           }
         }


      } catch (error) {
        console.log(error)
       res.status(500).send({message: "internal server error"});
      }
    }



}


export const userController = new UserController();