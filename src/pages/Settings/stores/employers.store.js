import { makeAutoObservable, action, observable } from "mobx";
import { isId } from "../../../utils/is.type";
import {
    changeDraft,
    removeDraft,
    resetDraft,
    updateDraftObject,
    updateObjectRecursively
} from "../../../utils/store.utils";

export class EmployesStore {
    employes = [];
    employeTypes = [];
    drafts = {};
    metaInfoTable = {};
    currentEmploye=null
    changedProps = new Set();


    constructor(root) {
        this.root = root;
        makeAutoObservable(this);
    }

    getEmployes() {
        return this.employes.map(employe => {
            const draft = this.drafts[employe.id];
            return draft ? { ...employe, ...draft } : employe;
        });
    }

    getById(id, isReset = false) {
        const employe =
            this.currentEmploye || this.employes.find((x) => x.id === Number(id));
        const draft = this.drafts[id];
        return isReset ? employe : draft ? { ...employe, ...draft } : employe;
    }

    resetDraft(id, path) {
        if (!this.drafts[id]) return;
        let employe = this.getById(id,true   );

        resetDraft(this,id,employe,path)

    }

    submitDraft(id) {
        if (!this.drafts[id]) return;

        const employe = this.getById(id);
        if (!employe) return;

        const updatedClient = { ...employe };
        this.employes = this.employes.map(c => (c.id === id ? updatedClient : c));
        delete this.drafts[id];
        this.clearChangesSet();
        this.clearCurrentEmploye()
    }

    createDraft(id) {
        const employe = this.getById(id);
        if (!employe) return;

        this.drafts[id] = { ...employe };
    }

    changeById(id, path, value,withId) {
        if (!this.drafts[id]) {
            this.createDraft(id);
        }
        let draft = this.drafts[id];
        this.addChangesProps(path);
        changeDraft(this,id,draft,path,value,withId)

    }

    removeById(id, path) {
        if (!this.drafts[id]) {
            this.createDraft(id);
        }

        removeDraft(this, id, path);
    }

    setEmployes(result) {
        this.employes = result;
    }
    setMetaInfoTable(info) {
        this.metaInfoTable = info;
    }

    getMetaInfoTable() {
        return this.metaInfoTable;
    }



    setEmployeTypes(result){
        this.employeTypes = result
    }

    getEmployeTypes(){
        return this.employeTypes.map(employeType => {
            const draft = this.drafts[employeType.id];
            return draft ? { ...employeType, ...draft } : employeType;
        });
    }

    setCurrentEmploye(employe) {
        this.currentEmploye = employe;
    }
    clearCurrentEmploye() {
        this.currentEmploye = null;
    }

    addChangesProps(name) {
        this.changedProps.add(name);
    }

    clearChangesSet() {
        this.changedProps = new Set();
    }
}