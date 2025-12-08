import { Router } from "express";
import {
  GetUserController,
  EditUserController,
  UploadUserPhotoController,
} from "../../controller/user/";
import { userMiddleWare } from "../../middleware/userMiddleware";
import { uploadSingle } from "../../middleware/uploadMiddleware";

const getUser = new GetUserController();
const editUser = new EditUserController();
const uploadUserPhoto = new UploadUserPhotoController();

const userRoutes = (router: Router): void => {
  router.get("/user", userMiddleWare, getUser.execute.bind(GetUserController));
  router.patch(
    "/user",
    userMiddleWare,
    editUser.execute.bind(EditUserController)
  );
  router.post(
    "/user/upload-photo",
    userMiddleWare,
    uploadSingle,
    uploadUserPhoto.execute.bind(UploadUserPhotoController)
  );
};

export { userRoutes };
