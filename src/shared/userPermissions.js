export const UserPermissions = {
  // Администрирование
  SUPER_ADMIN: 'superAdmin',

  // Сделки
  ACCESS_DEALS: 'accessDeals',
  ACCESS_ALL_DEALS: 'accessAllDeals',
  CREATE_DEALS: 'createDeals',
  EDIT_DEALS: 'editDeals',
  DELETE_DEALS: 'deleteDeals',

  // Компании
  ACCESS_COMPANIES: 'accessCompanies',
  ACCESS_ALL_COMPANIES: 'accessAllCompanies',
  CREATE_COMPANIES: 'createCompanies',
  EDIT_COMPANIES: 'editCompanies',
  DELETE_COMPANIES: 'deleteCompanies',

  // Клиенты
  VIEW_CLIENTS: 'viewClients',
  CREATE_CLIENTS: 'createClients',
  EDIT_CLIENTS: 'editClients',
  DELETE_CLIENTS: 'deleteClients',

  // Услуги
  ACCESS_SERVICES: 'accessServices',
  ACCESS_ALL_SERVICES: 'accessAllServices',
  CREATE_SERVICES: 'createServices',
  EDIT_SERVICES: 'editServices',
  DELETE_SERVICES: 'deleteServices',

  // Задачи
  VIEW_ALL_TASKS: 'viewAllTasks',

  // Счета
  ACCESS_BILLS: 'accessBills',
  ACCESS_ALL_BILLS: 'accessAllBills',
  CREATE_BILLS: 'createBills',
  EDIT_BILLS: 'editBills',
  DELETE_BILLS: 'deleteBills',

  //Акты
  ACCESS_ACTS: 'accessBills',
  ACCESS_ALL_ACTS: 'accessAllBills',
  CREATE_ACTS: 'createBills',
  UPDATE_ACTS: 'updateBills',
  DELETE_ACTS: 'deleteBills',

  // Другое
  ACCESS_EMPLOYEES: 'accessEmployees',
  ACCESS_LEGAL_ENTITIES: 'accessLegalEntities',
  VIEW_ALL_TIME_SPENDINGS: 'viewAllTimeSpendings',
  EDIT_TIME_TRACKINGS: 'editTimeTrackings',
  ACCESS_ALL_CALLS:'accessAllCalls'
};

export const PermissionGroups = {
  DEALS: [
    UserPermissions.ACCESS_DEALS,
    UserPermissions.ACCESS_ALL_DEALS,
    UserPermissions.CREATE_DEALS,
    UserPermissions.EDIT_DEALS,
    UserPermissions.DELETE_DEALS,
  ],

  COMPANIES: [
    UserPermissions.ACCESS_COMPANIES,
    UserPermissions.ACCESS_ALL_COMPANIES,
    UserPermissions.CREATE_COMPANIES,
    UserPermissions.EDIT_COMPANIES,
    UserPermissions.DELETE_COMPANIES,
  ],

  CLIENTS: [
    UserPermissions.VIEW_CLIENTS,
    UserPermissions.CREATE_CLIENTS,
    UserPermissions.EDIT_CLIENTS,
    UserPermissions.DELETE_CLIENTS,
  ],

  SERVICES: [
    UserPermissions.ACCESS_SERVICES,
    UserPermissions.ACCESS_ALL_SERVICES,
    UserPermissions.CREATE_SERVICES,
    UserPermissions.EDIT_SERVICES,
    UserPermissions.DELETE_SERVICES,
  ],

  BILLS: [
    UserPermissions.ACCESS_BILLS,
    UserPermissions.ACCESS_ALL_BILLS,
    UserPermissions.CREATE_BILLS,
    UserPermissions.EDIT_BILLS,
    UserPermissions.DELETE_BILLS,
  ],
  ACTS:[
      UserPermissions.ACCESS_ACTS,
      UserPermissions.ACCESS_ALL_SERVICES,
      UserPermissions.CREATE_ACTS,
      UserPermissions.UPDATE_ACTS,
      UserPermissions.DELETE_ACTS,
  ]
};

export const isValidPermission = (permission) => {
  // Создаем список всех возможных разрешений
  const allPermissions = [
    ...Object.values(UserPermissions),
    ...Object.values(PermissionGroups).flat(),
  ];

  // Если передан массив - проверяем каждое разрешение
  if (Array.isArray(permission)) {
    return permission.every((p) => allPermissions.includes(p));
  }

  // Если передано одно разрешение - проверяем его наличие в списке
  return allPermissions.includes(permission);
};
