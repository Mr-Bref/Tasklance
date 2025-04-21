import Pusher from 'pusher-js';
import getAuthToken from './getAuthToken';

export const createPusherClient = async () => {

    const token = await getAuthToken();
  
    return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }; 