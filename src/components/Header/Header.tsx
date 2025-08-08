import React, { useState } from 'react';
import { Bell, User, Moon, Sun, LogOut, Settings, CheckCircle, Clock, XCircle } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme, useAuth, useNotifications } from "@/App";
import { Link } from 'react-router-dom';
import ecoiaLogo from '@/assets/ecoia-logo.png';

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Simulate KYC status based on user data
  const kycStatus = user?.kycStatus || 'not_verified'; // 'verified', 'pending', 'not_verified'

  const getKycStatusDisplay = () => {
    switch (kycStatus) {
      case 'verified':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          text: 'Vérifié',
          tooltip: 'Votre profil KYC a été validé par l\'administrateur.',
          ariaLabel: 'Statut KYC : Vérifié'
        };
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4 text-yellow-600" />,
          text: 'En attente',
          tooltip: 'Votre profil KYC est en attente de validation.',
          ariaLabel: 'Statut KYC : En attente'
        };
      case 'not_verified':
      default:
        return {
          icon: <XCircle className="h-4 w-4 text-red-600" />,
          text: 'Non vérifié',
          tooltip: 'Veuillez soumettre vos documents KYC pour vérification.',
          ariaLabel: 'Statut KYC : Non vérifié'
        };
    }
  };

  const { icon, text, tooltip, ariaLabel } = getKycStatusDisplay();

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          {/* <img src={ecoiaLogo} alt="ECOIA" className="h-8 w-auto" /> */}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* KYC Status */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary cursor-default"
                aria-label={ariaLabel}
              >
                {icon}
                Statut KYC : {text}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9"
          aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3">
              <h4 className="font-semibold">Notifications</h4>
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground mt-2">Aucune notification</p>
              ) : (
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-2 rounded text-sm ${
                        notification.read ? 'bg-muted/50' : 'bg-primary/10'
                      }`}
                    >
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-muted-foreground text-xs">{notification.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Menu utilisateur">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2">
              <p className="font-medium">{user?.name || 'Utilisateur'}</p>
              <p className="text-sm text-muted-foreground">{user?.email || 'user@ecoia.io'}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile-view" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Mon Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile-edit" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};