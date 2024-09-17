import { Request, Response } from "express";
import { UserModel, UserType } from "../models/userModel";


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



         const newUserCreate: UserType = await UserModel.create(req.body);

         if(newUserCreate){
            let savedData: UserType = {
                _id: newUserCreate._id,
                email: newUserCreate?.email,
                firstName: newUserCreate.firstName,
                lastName: newUserCreate.lastName
              }
            res.status(200).json({message: "User data successfully saved", data: savedData});
         }


      } catch (error) {
        console.log(error)
       res.status(500).send({message: "internal server error"});
      }
    }
}


export const userController = new UserController();