import React from "react";
import { User } from "./User";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen?: boolean;
    toggleSidebar?: () => void;
    user: User | null;
}