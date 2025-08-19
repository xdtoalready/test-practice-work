import { makeAutoObservable, action, observable } from 'mobx';
import { isId } from '../../../utils/is.type';
import {
  changeDraft,
  removeDraft,
  resetDraft,
  updateDraftObject,
  updateObjectRecursively,
} from '../../../utils/store.utils';

export class ClientsStore {
  clients = [];
  drafts = {};
  currentClient = null;
  metaInfoTable = {};
  changedProps = null;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
    this.changedProps = new Set();
  }

  getClients() {
    return this?.clients?.map((client) => {
      const draft = this.drafts[client.id];
      return draft ? { ...client, ...draft } : client;
    });
  }

  setMetaInfoTable(info) {
    this.metaInfoTable = info;
  }

  getMetaInfoTable() {
    return this.metaInfoTable;
  }

  createNewClient() {
    const newClient = {
      id: this.clients.length,
      description: '',
      title: '',
      status: 'new', // или другой статус по умолчанию
      manager: {},
      services: [],
      deals: [],
      activities: [],
      contactPersons: [],
      contactData: {
        address: {},
        tel: {},
        email: {},
        comment:{},
        site: {},
        requisites: {},
      },
      passwords: [],
      ymetricsToken: '',
      topvisorToken: '',
    };

    // this.clients.push(newClient);
    this.drafts[newClient.id] = { ...newClient };
    this.currentClient = newClient;
    return newClient.id;
  }

  getById(id, isReset = false) {
    const client =
      this.currentClient || this.clients.find((x) => x.id === Number(id));
    const draft = this.drafts[id];
    return isReset ? client : draft ? { ...client, ...draft } : client;
  }

  resetDraft(id, path) {
    if (!this.drafts[id]) return;
    let client = this.getById(id, true);

    resetDraft(this, id, client, path);
    this.clearChangesSet();
  }

  submitDraft(id) {
    if (!this.drafts[id]) return;

    const client = this.getById(id);
    if (!client) return;

    const updatedClient = { ...client };
    this.clients = this.clients.map((c) => (c.id === id ? updatedClient : c));
    delete this.drafts[id];
    this.clearChangesSet();
  }

  createDraft(id) {
    const client = this.getById(id);
    if (!client) return;

    this.drafts[id] = { ...client };
  }

  changeById(id, path, value, withId) {
    if (!this.drafts[id]) {
      this.createDraft(id);
    }

    let draft = this.drafts[id];
    this.addChangesProps(path);
    changeDraft(this, id, draft, path, value, withId);
  }

  addChangesProps(name) {
    this.changedProps.add(name);
  }

  clearChangesSet() {
    this.changedProps = new Set();
  }

  removeById(id, path) {
    if (!this.drafts[id]) {
      this.createDraft(id);
    }

    removeDraft(this, id, path);
  }

  setClients(result) {
    this.clients = result;
  }
  setCurrentClient(client) {
    this.currentClient = client;
  }

  clearCurrentClient() {
    this.currentClient = null;
  }
}
