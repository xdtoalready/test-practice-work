import {loadAvatar} from "../../utils/create.utils";
import {makeAutoObservable} from "mobx";
import {changeDraft, removeDraft,resetDraft} from "../../utils/store.utils";

export class MembersStore {
    members = [];
    drafts = {};

    constructor(root) {
        this.root = root;
        makeAutoObservable(this);
    }

    getMembers() {
        return this.members.map(client => {
            const draft = this.drafts[client.id];
            return draft ? { ...client, ...draft } : client;
        });
    }

    getById(id,isReset=false) {
        const client = this.members.find(x => x.id === Number(id));
        const draft = this.drafts[id];
        return isReset ? client :  draft ? { ...client, ...draft } : client;
    }

    resetDraft(id, path) {
        if (!this.drafts[id]) return;
        let client = this.getById(id,true   );

        resetDraft(this,id,client,path)

    }

    submitDraft(id) {
        if (!this.drafts[id]) return;

        const client = this.getById(id);
        if (!client) return;

        const updatedClient = { ...client };
        this.members = this.members.map(c => (c.id === id ? updatedClient : c));
        delete this.drafts[id];
    }

    createDraft(id) {
        const client = this.getById(id);
        if (!client) return;

        this.drafts[id] = { ...client };
    }

    changeById(id, path, value,withId) {
        if (!this.drafts[id]) {
            this.createDraft(id);
        }
        let draft = this.drafts[id];
        changeDraft(this,id,draft,path,value,withId)
    }

    removeById(id, path) {
        if (!this.drafts[id]) {
            this.createDraft(id);
        }

        removeDraft(this, id, path);
    }

    setMembers(result) {
        this.members = result;
    }

}