import { makeAutoObservable } from 'mobx';
import { loadAvatar } from '../utils/create.utils';

export class UserStore {
  user = null;
  rights = null;
  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  setUser(result) {
    this.user = result;
  }
  setRights(result) {
    this.rights = result;
  }

  getUser() {
    return this.user;
  }
  getRigths() {
    return this.rights;
  }
}
