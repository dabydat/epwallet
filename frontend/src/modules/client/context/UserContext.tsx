import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Client } from '@types';
import { ContextException } from '@shared/exceptions/context.exception';

interface UserContextType {
    user: Client | null;
    setUser: (user: Client | null) => void;
    isAuthenticated: boolean;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Client | null>(() => {
        const stored = localStorage.getItem('e_wallet_user');
        return stored ? JSON.parse(stored) : null;
    });

    const handleSetUser = (newUser: Client | null) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem('e_wallet_user', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('e_wallet_user');
        }
    };

    const logout = () => handleSetUser(null);

    return (
        <UserContext.Provider value={{ user, setUser: handleSetUser, isAuthenticated: !!user, logout }}>
            {children}
        </UserContext.Provider>
    );
}


export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) throw new ContextException('useUser', 'UserProvider');
    return context;
}
