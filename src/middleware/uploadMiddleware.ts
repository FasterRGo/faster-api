import multer from "multer";
import path from "path";
import fs from "fs";

// Garantir que as pastas existam
const uploadsDir = path.join(__dirname, "../../uploads");
const usersDir = path.join(uploadsDir, "users");
const driversDir = path.join(uploadsDir, "drivers");

[uploadsDir, usersDir, driversDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Detecta automaticamente se é motorista ou usuário pela URL
    const isDriver =
      req.path?.includes("/driver/upload-photo") || req.body.type === "drivers";
    const uploadPath = isDriver ? driversDir : usersDir;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gera nome único: timestamp + número aleatório + extensão original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Filtro de tipos de arquivo
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Aceita apenas imagens
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos de imagem são permitidos!"));
  }
};

// Configuração do multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

// Middleware para upload de uma única imagem
const multerSingle = upload.single("photo");

// Wrapper para compatibilidade com Express
export const uploadSingle = (req: any, res: any, next: any) => {
  multerSingle(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};
