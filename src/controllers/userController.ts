import { Request, Response } from "express";
import { UserModel, UserType } from "../models/userModel";
import { SendEmailOtp } from "../services/nodemailer";
import { otp } from "../services/otpGenerate";
import bcrypt from "bcryptjs";
import { jwtSign } from "../services/jwtServives";

export type ResponseUserType = {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
};

class UserController {
  private async findUser(key: string, value: string): Promise<UserType | null> {
    return await UserModel.findOne({ [key]: value });
  }

  public registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
      let user: UserType | null = await this.findUser(
        req.params.key,
        req.body.email
      );

      if (user && user.verified) {
        return res
          .status(400)
          .json({ message: "User Already exsists", data: null });
      } else if (user && !user.verified) {
        const userdeleted = await UserModel.findOneAndDelete({ _id: user._id });
        if (userdeleted) {
          console.log("unverified user deleted sucessfully");
        }
      }
      const OTP: string = otp();
      const newUserCreate: UserType = await UserModel.create({
        otp: OTP,
        ...req.body,
      });

      if (newUserCreate) {
        let savedData: ResponseUserType = {
          _id: newUserCreate._id,
          email: newUserCreate?.email,
          firstName: newUserCreate.firstName,
          lastName: newUserCreate.lastName,
        };

        const emailSend = await SendEmailOtp(newUserCreate.email, OTP);
        if (emailSend) {
          res.status(200).json({
            message:
              "User data successfully saved and an otp was send to the email",
            data: savedData,
            success: true,
          });
        } else {
          res.status(200).json({
            message: "User data successfully saved but failed to send email",
            data: savedData,
            success: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "internal server error", data: null, success: false });
    }
  };


  public verifyUser = async (req: Request, res: Response): Promise<any> => {
    try {
      let user: UserType | null = await this.findUser(
        req.params.key,
        req.body.email
      );

      if (user) {
        if (user.otp === req.body.otp) {
          const updateuser = await UserModel.findOneAndUpdate(
            { _id: user._id },
            {
              $set: {
                otp: "",
                verified: true,
              },
            },
            { new: true }
          );

          if (updateuser) {
            res
              .status(200)
              .json({ message: "User succesfully verified", success: true });
          } else {
            res
              .status(400)
              .json({ message: "Verification failed", success: false });
          }
        } else {
          res.status(400).json({
            message:
              "Otp you have entered is incorrect please enter the correct otp",
            success: false,
          });
        }
      } else {
        res
          .status(400)
          .json({ message: "No user found to verify", success: false });
      }
    } catch (error) {
      res.status(500).json({ message: error, data: null });
    }
  };


  public loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
      let user: UserType | null = await this.findUser(
        req.params.key,
        req.body.email
      );

      if (user) {
        if (user.verified) {
          if (user.email === req.body.email) {
            const checkPassword = await bcrypt.compare(
              req.body.password,
              user?.password
            );
            if (checkPassword) {
              let userData: ResponseUserType = {
                _id: user._id,
                email: user?.email,
                firstName: user.firstName,
                lastName: user.lastName,
              };
                 const token = jwtSign(user._id as string);
                 console.log(token)
                 res
                .status(200)
                .cookie("auth_token", token, {
                  httpOnly: true,
                  secure: false
                })
                .json({
                  message: "Successfully loggedIn",
                  success: true,
                  data: userData,
                });
            } else {
              res
                .status(400)
                .json({
                  message: "Invalid credentials.",
                  success: false,
                  data: null,
                });
            }
          } else {
            res
              .status(400)
              .json({
                message: "Invalid credentials",
                success: false,
                data: null,
              });
          }
        } else {
          res
            .status(400)
            .json({ message: "User don't exist", success: false, data: null });
        }
      } else {
        res
          .status(400)
          .json({ message: "User don't exist", success: false, data: null });
      }
    } catch (error) {
      res.status(500).json({ message: error, success: false, data: null });
    }
  };

  
}

export const userController = new UserController();
