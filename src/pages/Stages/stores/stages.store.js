import { makeAutoObservable, action, observable } from 'mobx';
import { isId } from '../../../utils/is.type';
import {
  changeDraft,
  removeDraft,
  resetDraft, TimeTrackingStoreMixin,
  updateDraftObject,
  updateObjectRecursively,
} from '../../../utils/store.utils';

export class StagesStore {
  stages = [];
  stageTypes = [];
  drafts = {};
  currentStage = null;
  templateTypes = [];
  metaInfoTable = {};
  changedProps = new Set();

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  getStages() {
    const stagesArray = this.stages;
    return stagesArray.map((stage) => {
      const draft = this.drafts[stage.id];
      return draft ? { ...stage, ...draft } : stage;
    });
  }

  getById(id, isReset = false) {
    const stage =
      this.currentStage || this.stages.find((x) => x.id === Number(id));
    const draft = this.drafts[id];
    return isReset ? stage : draft ? { ...stage, ...draft } : stage;
  }

  resetDraft(id, path) {
    if (!this.drafts[id]) return;
    let stage = this.getById(id, true);

    resetDraft(this, id, stage, path);
  }

  submitDraft(id) {
    if (!this.drafts[id]) return;

    const stage = this.getById(id);
    if (!stage) return;

    const updatedStage = { ...stage };
    this.stages = this.stages.map((c) => (c.id === id ? updatedStage : c));
    delete this.drafts[id];
    this.clearChangesSet();
  }

  createDraft(id) {
    const stage = this.getById(id);
    if (!stage) return;

    this.drafts[id] = { ...stage };
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

  setStages(result) {
    this.stages = result;
  }

  setStageTypes(result) {
    this.stageTypes = result;
  }

  getStageTypes() {
    return this.stageTypes.map((stageType) => {
      const draft = this.drafts[stageType.id];
      return draft ? { ...stageType, ...draft } : stageType;
    });
  }

  setStageTemplates(result) {
    this.templateTypes = result;
  }

  getStageTemplates() {
    return this.templateTypes.map((template) => {
      const draft = this.drafts[template.id];
      return draft ? { ...template, ...draft } : template;
    });
  }

  setCurrentStage(stage) {
    this.currentStage = stage;
  }

  setMetaInfoTable(info) {
    this.metaInfoTable = info;
  }

  getMetaInfoTable() {
    return this.metaInfoTable;
  }

  clearCurrentStage() {
    this.currentStage = null;
  }

  addChangesProps(name) {
    this.changedProps.add(name);
  }

  clearChangesSet() {
    this.changedProps = new Set();
  }

  updateTimeTracking(taskId, timeTrackingId, updatedValue) {
    TimeTrackingStoreMixin.updateTimeTracking.call(this, taskId, timeTrackingId, updatedValue, 'tasks.');
  }

  addTimeTracking(taskId, value) {
    TimeTrackingStoreMixin.addTimeTracking.call(this, taskId, value, 'tasks.');
  }

  deleteTimeTracking(taskId, timeTrackingId) {
    TimeTrackingStoreMixin.deleteTimeTracking.call(this, taskId, timeTrackingId, 'tasks.');
  }

}
