import {makeAutoObservable} from 'mobx';
import {changeDraft, removeDraft, resetDraft,} from '../../../utils/store.utils';

export class TimeTrackingStore {
    timeTrackings = [];
    drafts = {};
    currentTimeTracking = null;
    metaInfoTable = {};
    changedProps = new Set();
    stats={
        time:null,
        cost:null,
    }

    constructor(root) {
        this.root = root;
        makeAutoObservable(this);
    }

    getTimeTrackings() {
        return Object.entries(this.timeTrackings).reduce((acc, [id, timeTracking]) => {
            const draft = this.drafts[id];
            acc[id] = draft ? { ...timeTracking, ...draft } : timeTracking;
            return acc;
        }, {});
    }

    getTimeTrackingsArray() {
        return Object.values(this.getTimeTrackings()).sort((a,b)=>a.order-b.order);
    }

    getById(id, isReset = false) {
        const timeTracking = this.currentTimeTracking || this.timeTrackings[id];
        const draft = this.drafts[id];
        return isReset ? timeTracking : draft ? { ...timeTracking, ...draft } : timeTracking;
    }

    resetDraft(id, path) {
        if (!this.drafts[id]) return;
        let timeTracking = this.getById(id, true);
        resetDraft(this, id, timeTracking, path);
    }

    submitDraft(id) {
        if (!this.drafts[id]) return;

        const timeTracking = this.getById(id);
        if (!timeTracking) return;

        this.timeTrackings[id] = {...timeTracking};
        delete this.drafts[id];
        this.clearChangesSet();
    }

    createDraft(id) {
        const timeTracking = this.getById(id);
        if (!timeTracking) return;

        this.drafts[id] = { ...timeTracking };
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

    setTimeTrackings(result) {
        this.timeTrackings = result;
    }

    setMetaInfoTable(info) {
        this.metaInfoTable = info;
    }

    getMetaInfoTable() {
        return this.metaInfoTable;
    }

    setStats(info) {
        this.stats = info;
    }

    getStats() {
        return this.stats;
    }

    setCurrentTimeTracking(timeTracking) {
        this.currentTimeTracking = timeTracking;
    }

    clearCurrentTimeTracking() {
        this.currentTimeTracking = null;
    }

    addChangesProps(name) {
        this.changedProps.add(name);
    }

    clearChangesSet() {
        this.changedProps = new Set();
    }
}