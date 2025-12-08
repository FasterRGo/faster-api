import { Router } from "express";
import { userMiddleWare } from "../../middleware/userMiddleware";
import { CreateInviteController } from "../../controller/invite/createInvite";
import { JoinRoomController } from "../../controller/invite/joinRoom";
import { GetRoomParticipantsController } from "../../controller/invite/getRoomParticipants";
import { GetUserInviteInRoomController } from "../../controller/invite/getUserInviteInRoom";
import { GetRideByRoomIdController } from "../../controller/invite/getRideByRoomId";

const createInvite = new CreateInviteController();
const joinRoom = new JoinRoomController();
const getRoomParticipants = new GetRoomParticipantsController();
const getUserInviteInRoom = new GetUserInviteInRoomController();
const getRideByRoomId = new GetRideByRoomIdController();

const inviteRoutes = (router: Router): void => {
  router.post(
    "/invite/room/:roomId",
    userMiddleWare,
    createInvite.execute.bind(CreateInviteController)
  );
  router.post(
    "/invite/join",
    userMiddleWare,
    joinRoom.execute.bind(JoinRoomController)
  );
  router.get(
    "/invite/room/:roomId/participants",
    userMiddleWare,
    getRoomParticipants.execute.bind(GetRoomParticipantsController)
  );
  router.get(
    "/invite/room/:roomId/my-invite",
    userMiddleWare,
    getUserInviteInRoom.execute.bind(GetUserInviteInRoomController)
  );
  router.get(
    "/invite/room/:roomId/ride",
    userMiddleWare,
    getRideByRoomId.execute.bind(GetRideByRoomIdController)
  );
};

export { inviteRoutes };

