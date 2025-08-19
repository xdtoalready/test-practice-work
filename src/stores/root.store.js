import { ClientsStore } from '../pages/Clients/stores/clients.store';
import { ThemeStore } from './theme.store';
import { UserStore } from './user.store';
import { ServicesStore } from '../pages/Services/stores/services.store';
import { MembersStore } from '../pages/Members/members.store';
import { StagesStore } from '../pages/Stages/stores/stages.store';
import { TasksStore } from '../pages/Tasks/stores/tasks.store';
import { EmployesStore } from '../pages/Settings/stores/employers.store';
import { LegalsStore } from '../pages/Settings/stores/legals.store';
import { AppStore } from './app.store';
import { BillsStore } from '../pages/Documents/stores/bills.store';
import { DealsStore } from '../pages/Deals/stores';
import { TimeTrackingStore } from '../pages/TimeTracking/stores/timeTracking.store';
import { CalendarStore } from '../pages/Calendar/calendar.store';
import { CallsStore } from '../pages/Calls/stores';
import NotificationsStore from './notification.store';
import { ActsStore } from '../pages/Documents/stores/acts.store';
export class RootStore {
  constructor() {
    this.appStore = new AppStore(this);
    this.clientsStore = new ClientsStore(this);

    this.notificationsStore = new NotificationsStore(this);
    this.themeStore = new ThemeStore(this);
    this.userStore = new UserStore(this);
    this.servicesStore = new ServicesStore(this);
    this.membersStore = new MembersStore(this);
    this.stagesStore = new StagesStore(this);
    this.tasksStore = new TasksStore(this);
    this.employesStore = new EmployesStore(this);
    this.legalsStore = new LegalsStore(this);
    this.billsStore = new BillsStore(this);
    this.actsStore = new ActsStore(this);
    this.dealsStore = new DealsStore(this);
    this.timeTrackingStore = new TimeTrackingStore(this);
    this.calendarStore = new CalendarStore(this);
    this.callsStore = new CallsStore(this);
  }
}
