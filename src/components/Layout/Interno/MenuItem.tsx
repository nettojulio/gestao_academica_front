"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface MenuItem {
  label: string;
  route: string;
  icon: React.ReactNode;
  roles?: string[];
  subItems?: MenuItem[];
}

interface SidebarMenuItemProps {
  item: MenuItem;
  isMenuOpen: boolean;
  openSubMenus: Record<string, boolean>;
  toggleSubMenu: (key: string) => void;
  userRoles: string[]; // Propriedade com as roles do usuário
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isMenuOpen,
  openSubMenus,
  toggleSubMenu,
  userRoles,
}) => {
  const router = useRouter();
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isOpen = openSubMenus[item.label] || false;

  // Se o item define roles e o usuário não possui nenhuma das roles permitidas, não renderiza o item.
  if (item.roles && !item.roles.some((role) => userRoles.includes(role))) {
    return null;
  }

  const handleClick = () => {
    if (hasSubItems) {
      toggleSubMenu(item.label);
    } else {
      router.push(item.route);
    }
  };

  return (
    <li>
      <div
        onClick={handleClick}
        className={`flex items-center rounded-md p-2 transition-colors duration-200 cursor-pointer ${
          isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
        }`}
      >
        {item.icon}
        {isMenuOpen && <span className="ml-3 text-white">{item.label}</span>}
        {hasSubItems && isMenuOpen && (
          <span className="ml-auto">
            {isOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </span>
        )}
      </div>
      {hasSubItems && isOpen && (
        <ul className="ml-4 mt-1">
          {item.subItems!.map((subItem, index) => (
            <SidebarMenuItem
              key={index}
              item={subItem}
              isMenuOpen={isMenuOpen}
              openSubMenus={openSubMenus}
              toggleSubMenu={toggleSubMenu}
              userRoles={userRoles}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarMenuItem;
