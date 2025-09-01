import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { signUpValidator } from "../../../utils/formValidator/driverValidator";
import {
  createDriver,
  findDriverByEmail,
} from "../../../database/repositories/driverRepository";

class DriverSignUpController {
  async execute(req: Request, res: Response) {
    try {
      const { email, password, name, phoneNumber } =
        await signUpValidator.validate(req.body);
      const emailAlreadyExists = await findDriverByEmail({ email });

      if (emailAlreadyExists) {
        throw new Error("Email já cadastrado");
      }

      const hashPassword = await hash(password, 8);

      const driver = await createDriver({
        email,
        name,
        password: hashPassword,
        phoneNumber,
      });

      return res.status(201).json(driver);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export { DriverSignUpController };
