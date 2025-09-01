import { Request, Response } from "express";

import { prisma } from "../../../service/prisma";

class ListenerRideController {
  async execute(req: Request, res: Response) {
    const { isWorking, socketId } = req.body;

    try {
      const driver = await prisma.driver.update({
        where: { id: req.userId },
        data: {
          isWorking,
          socketId,
        },
      });

      return res.status(200).json({ driver, status: isWorking });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { ListenerRideController };
