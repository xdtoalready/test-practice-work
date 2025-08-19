import { makeAutoObservable, action, observable } from 'mobx';
import { isId } from '../../../utils/is.type';
import {
  changeDraft,
  removeDraft,
  resetDraft,
  updateDraftObject,
  updateObjectRecursively,
} from '../../../utils/store.utils';

export class ServicesStore {
  services = [];
  serviceTypes = [];
  drafts = {};
  metaInfoTable = {};
  currentService = null;
  changedProps = new Set();

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  getServices() {
    return this.services.map((service) => {
      const draft = this.drafts[service.id];
      return draft ? { ...service, ...draft } : service;
    });
  }

  getById(id, isReset = false) {
    const service =
      this.currentService || this.services.find((x) => x.id === Number(id));
    const draft = this.drafts[id];
    return isReset ? service : draft ? { ...service, ...draft } : service;
  }

  resetDraft(id, path) {
    if (!this.drafts[id]) return;
    let service = this.getById(id, true);

    resetDraft(this, id, service, path);
  }

  submitDraft(id) {
    if (!this.drafts[id]) return;

    const service = this.getById(id);
    if (!service) return;

    const updatedClient = { ...service };
    this.services = this.services.map((c) => (c.id === id ? updatedClient : c));
    this.currentService = null;
    delete this.drafts[id];
    this.clearChangesSet();
  }

  createDraft(id) {
    const service = this.getById(id);
    if (!service) return;

    this.drafts[id] = { ...service };
  }

  changeById(id, path, value, withId) {
    if (!this.drafts[id]) {
      this.createDraft(id);
    }
    let draft = this.drafts[id];
    this.addChangesProps(path);
    changeDraft(this, id, draft, path, value, withId);
  }

  removeById(id, path) {
    if (!this.drafts[id]) {
      this.createDraft(id);
    }

    removeDraft(this, id, path);
  }

  setServices(result) {
    this.services = result;
  }
  setMetaInfoTable(info) {
    this.metaInfoTable = info;
  }

  getMetaInfoTable() {
    return this.metaInfoTable;
  }

  setServiceTypes(result) {
    this.serviceTypes = result;
  }

  getServiceTypes() {
    return this.serviceTypes.map((serviceType) => {
      const draft = this.drafts[serviceType.id];
      return draft ? { ...serviceType, ...draft } : serviceType;
    });
  }

  setCurrentService(service) {
    this.currentService = service;
  }

  clearCurrentService() {
    this.currentService = null;
  }

  addChangesProps(name) {
    this.changedProps.add(name);
  }

  clearChangesSet() {
    this.changedProps = new Set();
  }
}
