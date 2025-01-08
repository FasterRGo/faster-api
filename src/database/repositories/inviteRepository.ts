import { prisma } from "../../service/prisma";
import { Invite, InviteStatus } from "@prisma/client";

type IInvite = Omit<Invite, "id" | "createdAt" | "updatedAt">;

const listInvitesOfARoom = async (roomId: string) => {
  return await prisma.invite.findMany({
    where: {
      Room: { id: roomId },
    },
  });
};

const createInvite = async (invite: IInvite) => {
  return await prisma.invite.create({
    data: invite,
  });
};

const deleteInvite = async (id: number) => {
  return await prisma.invite.delete({
    where: {
      id,
    },
  });
};

const updateSocketIdOfAInvite = async (inviteId: number, socketId: string) => {
  await prisma.invite.update({
    where: { id: inviteId },
    data: {
      socketId,
    },
  });
};

const updateInviteStatus = async (inviteId: number, status: InviteStatus) => {
  await prisma.invite.update({
    where: { id: inviteId },
    data: {
      status,
    },
  });
};

const findInviteBySocketId = async (socketId: string) => {
  return await prisma.invite.findFirst({ where: { socketId } });
};

export {
  createInvite,
  deleteInvite,
  listInvitesOfARoom,
  updateSocketIdOfAInvite,
  updateInviteStatus,
  findInviteBySocketId,
};
