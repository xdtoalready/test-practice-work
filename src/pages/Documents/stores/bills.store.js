import { makeAutoObservable, action, observable } from 'mobx';
import { isId } from '../../../utils/is.type';
import {
  changeDraft,
  removeDraft,
  resetDraft,
  updateDraftObject,
  updateObjectRecursively,
} from '../../../utils/store.utils';

export class BillsStore {
  bills = [];
  billTypes = [];
  drafts = {};
  metaInfoTable = {};
  currentBill = null;
  changedProps = new Set();

  stats = null;

  // ...

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  setStats(stats) {
    this.stats = stats;
  }

  getBills() {
    return this.bills.map((bill) => {
      const draft = this.drafts[bill.id];
      return draft ? { ...bill, ...draft } : bill;
    });
  }

  getById(id, isReset = false) {
    const bill =
      this.currentBill || this.bills.find((x) => x.id === Number(id));
    const draft = this.drafts[id];
    return isReset ? bill : draft ? { ...bill, ...draft } : bill;
  }

  resetDraft(id, path) {

    if (!this.drafts[id]) return;
    let bill = this.getById(id, true);
    this.clearChangesSet();
    resetDraft(this, id, bill, path);
  }

  submitDraft(id) {
    if (!this.drafts[id]) return;

    const bill = this.getById(id);
    if (!bill) return;

    const updatedClient = { ...bill };
    this.bills = this.bills.map((c) => (c.id === id ? updatedClient : c));
    delete this.drafts[id];
    this.clearChangesSet();
  }

  createDraft(id) {
    const bill = this.getById(id);
    if (!bill) return;

    this.drafts[id] = { ...bill };
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

  setBills(result) {
    this.bills = result;
  }
  setMetaInfoTable(info) {
    this.metaInfoTable = info;
  }

  getMetaInfoTable() {
    return this.metaInfoTable;
  }

  setBillTypes(result) {
    this.billTypes = result;
  }

  getBillTypes() {
    return this.billTypes.map((billType) => {
      const draft = this.drafts[billType.id];
      return draft ? { ...billType, ...draft } : billType;
    });
  }

  setCurrentBill(bill) {
    this.currentBill = bill;
  }

  addChangesProps(name) {
    this.changedProps.add(name);
  }

  clearChangesSet() {
    this.changedProps = new Set();
  }
}
