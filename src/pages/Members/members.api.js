import {
  handleHttpError,
  handleHttpResponse,
  http,
  mockHttp,
  resetApiProvider,
  setMockProvider,
} from '../../shared/http';
import mocks from './members.mocks';
import useStore from '../../hooks/useStore';
import { useEffect, useRef } from 'react';
import mapBackendToMock from './members.mapper';

mockHttp.onGet('/members').reply(200, mocks.createMembers());
mockHttp.onPost('/members').reply(200, mocks.createMembers());

const useMembersApi = () => {
  mockHttp.onGet('/members').reply(200, mocks.createMembers());
  const { membersStore } = useStore();
  const getMembers = () => {
    // setMockProvider();
    resetApiProvider();
    return http
      .get('/api/selector/employees')
      .then(handleHttpResponse)
      .then((res) => mapBackendToMock(res.body.data))
      .then((res) => membersStore.setMembers(res))
      .then(() => membersStore.getMembers())
      .catch(handleHttpError);
  };

  const setMembers = (body) => {
    // setMockProvider();
    return http
      .post('/members', body)
      .then(handleHttpResponse)
      .then((res) => membersStore.setMembers(res.body))
      .catch(handleHttpError);
  };

  return { setMembers, getMembers };
};

export default useMembersApi;
