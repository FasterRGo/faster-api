declare namespace Express {
  export interface Request {
    userId: any;
    userEmail: string;
    file?: Express.Multer.File;
    files?:
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | Express.Multer.File[];
  }
}
