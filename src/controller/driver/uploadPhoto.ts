import { Request, Response } from "express";
import { updateDriverPhoto } from "../../database/repositories/driverRepository";

class UploadDriverPhotoController {
  async execute(req: Request, res: Response) {
    try {
      const driverId = req.userId;

      if (!driverId) {
        return res.status(401).json({ message: "Motorista não autenticado" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Nenhuma imagem foi enviada" });
      }

      // Caminho relativo para acessar a imagem
      // Exemplo: /uploads/drivers/nome-arquivo.jpg
      // O middleware já salva na pasta correta, só precisamos construir o caminho
      const filePath = `/uploads/drivers/${req.file.filename}`;

      // Atualiza a foto do motorista no banco
      await updateDriverPhoto(driverId, filePath);

      return res.status(200).json({
        message: "Foto atualizada com sucesso",
        photoUrl: filePath,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { UploadDriverPhotoController };

