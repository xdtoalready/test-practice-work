import { makeAutoObservable, action, observable } from 'mobx';
import { isId } from '../../../utils/is.type';
import {
  changeDraft,
  removeDraft,
  resetDraft,
  updateDraftObject,
  updateObjectRecursively,
} from '../../../utils/store.utils';

export class LegalsStore {
  legals = [];
  legalTypes = [];
  drafts = {};
  metaInfoTable = {};
  currentService = null;
  changedProps = new Set();

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  getLegals() {
    return this.legals.map((legal) => {
      const draft = this.drafts[legal.id];
      return draft ? { ...legal, ...draft } : legal;
    });
  }

  getById(id, isReset = false) {
    const legal =
      this.currentService || this.legals.find((x) => x.id === Number(id));
    const draft = this.drafts[id];
    return isReset ? legal : draft ? { ...legal, ...draft } : legal;
  }

  resetDraft(id, path) {
    if (!this.drafts[id]) return;
    let legal = this.getById(id, true);

    resetDraft(this, id, legal, path);
  }

  submitDraft(id) {
    if (!this.drafts[id]) return;

    const legal = this.getById(id);
    if (!legal) return;

    const updatedClient = { ...legal };
    this.legals = this.legals.map((c) => (c.id === id ? updatedClient : c));
    delete this.drafts[id];
    this.clearChangesSet();
  }

  createDraft(id) {
    const legal = this.getById(id);
    if (!legal) return;

    this.drafts[id] = { ...legal };
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

  setLegals(result) {
    this.legals = result;
  }
  setMetaInfoTable(info) {
    this.metaInfoTable = info;
  }

  getMetaInfoTable() {
    return this.metaInfoTable;
  }

  setServiceTypes(result) {
    this.legalTypes = result;
  }

  getServiceTypes() {
    return this.legalTypes.map((legalType) => {
      const draft = this.drafts[legalType.id];
      return draft ? { ...legalType, ...draft } : legalType;
    });
  }

  setCurrentLegal(legal) {
    this.currentService = legal;
  }

  addChangesProps(name) {
    this.changedProps.add(name);
  }

  clearChangesSet() {
    this.changedProps = new Set();
  }
}
