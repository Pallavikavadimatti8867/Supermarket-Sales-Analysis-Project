import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserAccount } from '../types';

export const INITIAL_REGISTERED_ACCOUNTS: UserAccount[] = [
  {
    id: 'ACC-001',
    email: 'pallavisk46@gmail.com',
    name: 'Pallavi (Admin)',
    password: 'Password@123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch A',
    phone: '+1 (555) 100-2000',
    joinedDate: '2023-01-01',
    isRealAccount: true,
  },
  {
    id: 'ACC-002',
    email: 'admin@supermarket.com',
    name: 'Eleanor Vance (Admin)',
    password: 'Admin@2026',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch A',
    phone: '+1 (555) 234-5678',
    joinedDate: '2023-01-15',
    isRealAccount: true,
  },
  {
    id: 'ACC-003',
    email: 'sarah.jenkins@supermarket.com',
    name: 'Sarah Jenkins (Admin Executer)',
    password: 'Sarah@2026',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch A',
    phone: '+1 (555) 345-6789',
    joinedDate: '2024-03-10',
    isRealAccount: true,
  },
  {
    id: 'ACC-004',
    email: 'david.kim@supermarket.com',
    name: 'David Kim (Admin Executer)',
    password: 'David@2026',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch B',
    phone: '+1 (555) 456-7890',
    joinedDate: '2024-04-12',
    isRealAccount: true,
  },
  {
    id: 'ACC-005',
    email: 'emily.chen@supermarket.com',
    name: 'Emily Chen (Admin Executer)',
    password: 'Emily@2026',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch A',
    phone: '+1 (555) 567-8901',
    joinedDate: '2024-05-20',
    isRealAccount: true,
  },
  {
    id: 'ACC-006',
    email: 'marcus.vance@supermarket.com',
    name: 'Marcus Vance (Admin Executer)',
    password: 'Marcus@2026',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch C',
    phone: '+1 (555) 678-9012',
    joinedDate: '2024-06-01',
    isRealAccount: true,
  },
  {
    id: 'ACC-007',
    email: 'aisha.patel@supermarket.com',
    name: 'Aisha Patel (Admin Executer)',
    password: 'Aisha@2026',
    role: 'executive',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branch: 'Branch B',
    phone: '+1 (555) 789-0123',
    joinedDate: '2024-06-15',
    isRealAccount: true,
  },
];

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isExecutive: boolean;
  login: (email: string, password?: string, desiredRole?: UserRole) => Promise<{ success: boolean; message?: string }>;
  registerAccount: (
    email: string,
    password?: string,
    role?: UserRole,
    name?: string,
    branch?: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  logoutAll: () => void;
  switchUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  availableUsers: UserAccount[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accounts stored in localStorage
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('sm_registered_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed];
          for (const initAcc of INITIAL_REGISTERED_ACCOUNTS) {
            if (!merged.some((a) => a.email.toLowerCase() === initAcc.email.toLowerCase())) {
              merged.push(initAcc);
            }
          }
          return merged;
        }
      } catch (e) {
        console.error('Failed to parse saved accounts', e);
      }
    }
    return INITIAL_REGISTERED_ACCOUNTS;
  });

  // Current session - null by default until user logs in
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sm_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Persist accounts
  useEffect(() => {
    localStorage.setItem('sm_registered_accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Persist current session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sm_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sm_current_user');
    }
  }, [currentUser]);

  // Open direct login: Any email ID & password can be entered directly!
  const login = async (
    email: string,
    password?: string,
    desiredRole?: UserRole
  ): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return { success: false, message: 'Please enter your email ID.' };
    }

    const trimmedPass = password?.trim() || '';

    // Check if account already exists in directory
    const existing = accounts.find((a) => a.email.toLowerCase() === trimmedEmail.toLowerCase());

    const selectedRole: UserRole =
      desiredRole ||
      (existing ? existing.role : trimmedEmail.toLowerCase().includes('exec') ? 'executive' : 'admin');

    const roleTitle = selectedRole === 'admin' ? 'Admin' : 'Admin Executer';

    // Format display name from email or existing account
    let computedName = '';
    if (existing) {
      computedName = existing.name.replace(
        /\((Admin|Admin Executer|Executive)\)/i,
        `(${roleTitle})`
      );
    } else {
      const emailPrefix = trimmedEmail.includes('@') ? trimmedEmail.split('@')[0] : trimmedEmail;
      const cleanPrefix = emailPrefix.replace(/[._]/g, ' ');
      const capitalized = cleanPrefix.charAt(0).toUpperCase() + cleanPrefix.slice(1);
      computedName = `${capitalized} (${roleTitle})`;
    }

    const safeUser: User = {
      id: existing ? existing.id : `ACC-${Date.now().toString().slice(-4)}`,
      email: trimmedEmail,
      name: computedName,
      role: selectedRole,
      branch: existing?.branch || 'Branch A',
      phone: existing?.phone || '+1 (555) 100-2000',
      joinedDate: existing?.joinedDate || new Date().toISOString().split('T')[0],
      avatar:
        existing?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    // Update or save account
    if (existing) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === existing.id
            ? {
                ...acc,
                name: computedName,
                role: selectedRole,
                password: trimmedPass || acc.password,
              }
            : acc
        )
      );
    } else {
      const newAcc: UserAccount = {
        ...safeUser,
        password: trimmedPass || 'Password@123',
        isRealAccount: true,
      };
      setAccounts((prev) => [...prev, newAcc]);
    }

    setCurrentUser(safeUser);
    return { success: true };
  };

  // Register account helper (optional, can also be used directly)
  const registerAccount = async (
    email: string,
    password?: string,
    role: UserRole = 'admin',
    name?: string,
    branch?: string
  ): Promise<{ success: boolean; message?: string }> => {
    return login(email, password, role);
  };

  // Logout current session
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sm_current_user');
  };

  // Logout ALL email IDs and terminate all active sessions
  const logoutAll = () => {
    setCurrentUser(null);
    localStorage.removeItem('sm_current_user');
    sessionStorage.clear();
  };

  // Switch to an authorized account
  const switchUser = (userId: string) => {
    const found = accounts.find((a) => a.id === userId);
    if (found) {
      const { password: _, ...safeUser } = found;
      setCurrentUser(safeUser);
    }
  };

  // Update an existing user's role (Admin <-> Admin Executer)
  const updateUserRole = (userId: string, newRole: UserRole) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === userId) {
          const roleTitle = newRole === 'admin' ? 'Admin' : 'Admin Executer';
          const updatedName = acc.name.replace(/\((Admin|Admin Executer|Executive)\)/i, `(${roleTitle})`);
          return { ...acc, role: newRole, name: updatedName };
        }
        return acc;
      })
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isExecutive = currentUser?.role === 'executive';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin,
        isExecutive,
        login,
        registerAccount,
        logout,
        logoutAll,
        switchUser,
        updateUserRole,
        availableUsers: accounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
