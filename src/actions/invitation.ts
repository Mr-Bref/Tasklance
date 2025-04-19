"use server";

import {prisma} from "@/lib/prisma";
import sendMail from "@/lib/send-mail";
import { randomUUID } from "crypto";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from 'next/navigation'

export async function inviteToProject({
  email,
  projectId,
  role,
  message,
}: {
  email: string;
  projectId: string;
  message?: string;
  role?: Role; // Role = "VIEWER" | "MEMBER" | "MANAGER"
}) {
  console.log('triger')
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) throw new Error("Unauthorized");

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  // fallback to MEMBER if role is invalid
  const validRoles: Role[] = ["VIEWER", "MEMBER", "MANAGER"];
  const safeRole: Role = validRoles.includes(role as Role) ? (role as Role) : "MEMBER";

  await prisma.invitation.create({
    data: {
      email,
      projectId,
      inviterId: user.id,
      role: safeRole,
      token,
      expiresAt,
    },
  });

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invitation?token=${token}`;

  await sendMail({
    to: email,
    subject: "Tu as été invité sur un projet !",
    html: `
      <p>Tu as été invité à rejoindre un projet.</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
      <p><a href="${inviteLink}">Clique ici pour accepter</a></p>
      <p>Ce lien expire dans 24h.</p>
    `,
  });

  revalidatePath(`/project/${projectId}/settings`);
}



export async function checkInvitation(token: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: {
      project: true,
      inviter: true,
    },
  })

  if (!invitation || invitation.status !== 'PENDING') {
    return null
  }

  return {
    projectName: invitation.project.name,
    inviterEmail: invitation.inviter.email,
    invitedUserEmail: invitation.email,
  }
}

export async function acceptInvitation(formData: FormData) {
  const token = formData.get('token') as string
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!token || !user) {
    throw new Error('Unauthorized or invalid token.')
  }

  const invitation = await prisma.invitation.findUnique({ where: { token } })
  if (!invitation || invitation.status !== 'PENDING') {
    throw new Error('Invitation not found or already handled.')
  }

  await prisma.participant.create({
    data: {
      userId: user.id,
      projectId: invitation.projectId,
      role: invitation.role ,
    },
  })

  await prisma.invitation.update({
    where: { token },
    data: { status: 'ACCEPTED' },
  })

  redirect(`/project/${invitation.projectId}`)
}

export async function declineInvitation(formData: FormData) {
  const token = formData.get('token') as string
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!token || !user) {
    throw new Error('Unauthorized or invalid token.')
  }

  await prisma.invitation.update({
    where: { token },
    data: { status: 'DECLINED' },
  })

  redirect('/')
}

