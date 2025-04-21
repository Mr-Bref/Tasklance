import { pusherServer } from '@/lib/pusher-server';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // BetterAuth
import { headers } from 'next/headers';
import qs from 'querystring'; // built-in node lib


export async function POST(req: NextRequest) {

  const rawBody = await req.text(); 

  const { socket_id, channel_name } = qs.parse(rawBody) as {
    socket_id?: string;
    channel_name?: string;
  };

  if (!socket_id || !channel_name) {
    return new NextResponse('Missing socket_id or channel_name', { status: 400 });
  }
  

  const session = await auth.api.getSession({
    headers: await headers()
  }); // <- vérifie que l'user est bien connecté

  const user = session?.user;

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Optionnel : Tu peux ajouter des règles ici pour limiter qui peut s’abonner à quoi

  const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, {
    user_id: user.id,
  });

  return NextResponse.json(authResponse);
}
