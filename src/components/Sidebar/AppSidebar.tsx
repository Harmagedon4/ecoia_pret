import React from 'react';
import {
  Home,
  FileText,
  CreditCard,
  User,
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Assurez-vous d'importer votre logo.
// Par exemple : import ecoiaLogo from '@/assets/ecoia-logo.png';
import ecoiaLogo from '/logo_ecoia.png';

const menuItems = [
  { title: "Tableau de bord", url: "/accueil", icon: Home },
  { title: "Nouvelle demande", url: "/faire-demande", icon: PlusCircle },
  { title: "Mes demandes", url: "/liste-demande", icon: FileText },
  { title: "Remboursement", url: "/methode-paiement", icon: CreditCard },
  { title: "Mon profil", url: "/profile-view", icon: User },
  { title: "Support", url: "/support", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const getNavClasses = ({ isActive }) =>
    isActive
      ? "bg-primary text-primary-foreground font-medium rounded-lg"
      : "hover:bg-muted/50 text-foreground rounded-lg";

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <div className="flex justify-center p-4 h-16">
        <img
          src={ecoiaLogo}
          alt="ECOIA Logo"
          className={`h-32 w-auto transition-all duration-300 ${collapsed ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
        />
      </div>
      <SidebarContent className="p-4 pt-0">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-lg font-semibold">
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="my-2">
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 transition-all ${getNavClasses({ isActive })}`
                      }
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {!collapsed && <span className="text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}