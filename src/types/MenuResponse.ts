export interface MenuDTO {
    menuId: number;
    name: string;
    url: string;
    childMenus: MenuDTO[];
}

export interface RoleMenuDTO {
    menus: MenuDTO[];
}
