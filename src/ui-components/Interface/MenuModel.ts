interface Header {
    userId: number;
    empId: string;
    firstName: string;
    lastName: string;
    email: string;
    personalId: string;
    systemRoleId: number;
    isSuperUser: boolean;
    menuRoleId: number;
    menuId: number;
    code: string;
    nameTH: string;
    nameEN: string;
    icon: string | null;
    href: string;
    visible: boolean;
    menuGroup: string;
    refCode: string | null;
    isGrpHd: boolean;
    canCheckDisplay: boolean;
    canCheckCreate: boolean;
    canCheckEdit: boolean;
    canCheckDelete: boolean;
    canCheckActive: boolean;
    canDisplay: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canActive: boolean;
    sequence: number;
  }
  
  interface Item {
    menuRoleId: number;
    menuId: number;
    code: string;
    nameTH: string;
    nameEN: string;
    icon: string | null;
    href: string;
    visible: boolean;
    menuGroup: string;
    refCode: string | null;
    isGrpHd: boolean;
    canCheckDisplay: boolean;
    canCheckCreate: boolean;
    canCheckEdit: boolean;
    canCheckDelete: boolean;
    canCheckActive: boolean;
    canDisplay: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canActive: boolean;
    sequence: number;
  }
  
  interface Menu {
    headers: Header[];
    items: Item[];
  }
  