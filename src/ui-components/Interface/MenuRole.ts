export interface MenuRole {
    menuRoleId: number
    systemRoleId: number
    menuId: number
    nameTH: string
    nameEN: string
    visible: boolean
    menuGroup: string
    refCode: any
    isGrpHd: boolean
    sequence: number
    canCheckDisplay: boolean
    canDisplay: boolean
    canCheckCreate: boolean
    canCreate: boolean
    canCheckEdit: boolean
    canEdit: boolean
    canCheckDelete: boolean
    canDelete: boolean
    canCheckActive: boolean
    canActive: boolean
  }
  
  export function MenuRoleConvert (source:MenuRole) {
    let SourceSlice = source
    let InjectTer:MenuRole  = SourceSlice as MenuRole 
    return InjectTer 
  }