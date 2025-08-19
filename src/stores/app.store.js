import { makeAutoObservable } from 'mobx';

export class AppStore {
  employees = [];
  companies = [];
  clients = [];
  employeePositions = [];
  tasks = [];
  services = [];
  servicesByCompany = [];
  stagesByService = [];
  legalEntities = [];
  searchResults = {
    companies: [],
    deals: [],
    tasks: [],
    services: [],
  };
  isExitModalOpened = false;

  constructor(root) {
    this.root = root;
    makeAutoObservable(this);
  }

  setSearchResults(results) {
    this.searchResults = {
      companies: results.companies || [],
      deals: results.deals || [],
      tasks: results.tasks || [],
      services: results.services || [],
      stages: results.stages || [],
    };
  }
  setIsExitModalOpened(value) {
    this.isExitModalOpened = true;
  }

  clearSearchResults() {
    this.searchResults = {
      companies: [],
      deals: [],
      tasks: [],
      services: [],
    };
  }

  // Устанавливаем сотрудников
  setEmployees(employees) {
    this.employees = employees;
  }

  setLegalEntities(legals) {
    this.legalEntities = legals;
  }

  // Устанавливаем компании
  setCompanies(companies) {
    this.companies = companies;
  }

  // Устанавливаем клиентов
  setClients(clients) {
    this.clients = clients;
  }

  // Устанавливаем должности сотрудников
  setEmployeePositions(positions) {
    this.employeePositions = positions;
  }

  // Устанавливаем задачи
  setTasks(tasks) {
    this.tasks = tasks;
  }

  // Устанавливаем услуги
  setServices(services) {
    this.services = services;
  }
  setServicesByCompany(services) {
    this.servicesByCompany = services;
  }
  setStagesByService(stages) {
    this.stagesByService = stages;
  }

  clearProp(props) {
    props.forEach((propName) => {
      if (propName in this) {
        const propType = Array.isArray(this[propName]) ? [] : null;
        this[propName] = propType;
      }
    });
  }
}
