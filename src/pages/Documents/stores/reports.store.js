import { makeAutoObservable } from 'mobx';
import {
  changeDraft,
  removeDraft,
  resetDraft,
} from '../../../utils/store.utils';

export class ReportsStore {
  reports = [];
  drafts = {};
  metaInfoTable = {};
  currentReport = null;
  changedProps = new Set();
  stats = null;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  setStats(stats) {
    this.stats = stats;
  }

  getReports() {
    return this.reports.map((report) => {
      const draft = this.drafts[report.id];
      return draft ? { ...report, ...draft } : report;
    });
  }

  getById(id, isReset = false) {
    const report =
      this.currentReport || this.reports.find((x) => x.id === Number(id));
    const draft = this.drafts[id];
    return isReset ? report : draft ? { ...report, ...draft } : report;
  }

  resetDraft(id, path) {
    if (!this.drafts[id]) return;
    let report = this.getById(id, true);
    this.clearChangesSet();
    resetDraft(this, id, report, path);
  }

  submitDraft(id) {
    if (!this.drafts[id]) return;

    const report = this.getById(id);
    if (!report) return;

    const updatedReport = { ...report };
    this.reports = this.reports.map((r) => (r.id === id ? updatedReport : r));
    delete this.drafts[id];
    this.clearChangesSet();
  }

  createDraft(id) {
    const report = this.getById(id);
    if (!report) return;

    this.drafts[id] = { ...report };
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

  setReports(result) {
    this.reports = result;
  }

  setMetaInfoTable(info) {
    this.metaInfoTable = info;
  }

  getMetaInfoTable() {
    return this.metaInfoTable;
  }

  setCurrentReport(report) {
    this.currentReport = report;
  }

  addChangesProps(name) {
    this.changedProps.add(name);
  }

  clearChangesSet() {
    this.changedProps = new Set();
  }
}