import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getToken } from './shared/http';

window.Pusher = Pusher;

const echo = new Echo({
  // namespace: 'App.Events',
  broadcaster: 'reverb',
  key: process.env.REACT_APP_REVERB_APP_KEY,
  wsHost: process.env.REACT_APP_REVERB_HOST,
  wsPort: process.env.REACT_APP_REVERB_PORT,
  forceTLS: 'http',
  enabledTransports: ['ws', 'wss'],
  // channelAuthorization
  auth: {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  },
});


export default echo;