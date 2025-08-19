import { makeAutoObservable } from 'mobx';
import { isId } from '../../../utils/is.type';
import {
  changeDraft,
  removeDraft,
  resetDraft,
  updateDraftObject,
  updateObjectRecursively,
} from '../../../utils/store.utils';

export class ActsStore {
  acts = [];
  actTypes = [];
  drafts = {};
  metaInfoTable = {};
  currentAct = null;
  changedProps = new Set();

  stats = null;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  setStats(stats) {
    this.stats = stats;
  }

  getActs() {
    return this.acts.map((act) => {
      const draft = this.drafts[act.id];
      return draft ? { ...act, ...draft } : act;
    });
  }

  getById(id, isReset = false) {
    const act =
      this.currentAct || this.acts.find((x) => x.id === Number(id));
    const draft = this.drafts[id];
    return isReset ? act : draft ? { ...act, ...draft } : act;
  }

  resetDraft(id, path) {
    if (!this.drafts[id]) return;
    let act = this.getById(id, true);
    this.clearChangesSet();
    resetDraft(this, id, act, path);
  }

  submitDraft(id) {
    if (!this.drafts[id]) return;

    const act = this.getById(id);
    if (!act) return;

    const updatedAct = { ...act };
    this.acts = this.acts.map((a) => (a.id === id ? updatedAct : a));
    delete this.drafts[id];
    this.clearChangesSet();
  }

  createDraft(id) {
    const act = this.getById(id);
    if (!act) return;

    this.drafts[id] = { ...act };
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

  setActs(result) {
    this.acts = result;
  }

  setMetaInfoTable(info) {
    this.metaInfoTable = info;
  }

  getMetaInfoTable() {
    return this.metaInfoTable;
  }

  setActTypes(result) {
    this.actTypes = result;
  }

  getActTypes() {
    return this.actTypes.map((actType) => {
      const draft = this.drafts[actType.id];
      return draft ? { ...actType, ...draft } : actType;
    });
  }

  setCurrentAct(act) {
    this.currentAct = act;
  }

  addChangesProps(name) {
    this.changedProps.add(name);
  }

  clearChangesSet() {
    this.changedProps = new Set();
  }
}