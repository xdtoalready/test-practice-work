import {
  handleHttpError,
  handleHttpResponse,
  http,
  mockHttp,
  setMockProvider,
} from './shared/http';
import mocks from './root.mocks';
mockHttp.onGet('/notifications').reply(200, mocks.createNotifications());
const getNotifications = () => {
  setMockProvider();

  return http
    .get('/notifications')
    .then(handleHttpResponse)
    .catch(handleHttpError);
};

export default { getNotifications };
