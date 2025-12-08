import { Request, Response } from "express";
import { updateUserPhoto } from "../../database/repositories/userRepository";
import path from "path";

class UploadUserPhotoController {
  async execute(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Nenhuma imagem foi enviada" });
      }

      // Caminho relativo para acessar a imagem
      // Exemplo: /uploads/users/nome-arquivo.jpg
      const filePath = `/uploads/users/${req.file.filename}`;

      // Atualiza a foto do usuário no banco
      await updateUserPhoto(userId, filePath);

      return res.status(200).json({
        message: "Foto atualizada com sucesso",
        photoUrl: filePath,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export { UploadUserPhotoController };

