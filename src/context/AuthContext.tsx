import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserAccount } from '../types';
import { generateSalt, hashPassword, verifyPassword } from '../utils/crypto';

export const INITIAL_REGISTERED_ACCOUNTS: UserAccount[] = [
  {
    id: 'USR-001',
    email: 'admin@supermarket.com',
    name: 'Admin Supervisor',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin%20Supervisor',
    branch: 'Branch A',
    phone: '+1 (555) 019-2831',
    joinedDate: '2023-01-15',
    salt: 'demosaltadmin123',
    passwordHash: '4634e2f919c5d1c887bbfbc42d14022b727375fedd4d356ae234b6daea39a991',
    isRealAccount: true,
  },
  {
    id: 'USR-002',
    email: 'sarah.jenkins@supermarket.com',
    name: 'Sarah Jenkins',
    role: 'executive',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Jenkins',
    branch: 'Branch A',
    phone: '+1 (555) 014-9920',
    joinedDate: '2023-03-20',
    salt: 'demosaltexec123',
    passwordHash: 'bd008afffbee18c784862d45336998a02fed362f6dbe2dd0a220888d898d5317',
    isRealAccount: true,
  },
  {
    id: 'USR-003',
    email: 'pallavisk46@gmail.com',
    name: 'Pallavi S K',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Pallavi%20S%20K',
    branch: 'Branch A',
    phone: '+1 (555) 018-8472',
    joinedDate: '2024-01-10',
    salt: 'demosaltpallavi123',
    passwordHash: 'a290244170bc5c9ee027e6307befba9c9f2cd6ce68fb17518b616b4964919c89',
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
          return parsed;
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

  // Real Email validation regex
  const isValidEmail = (emailStr: string): boolean => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailStr.trim());
  };

  // Login: verifies real email format and checks matching password
  const login = async (
    email: string,
    password?: string,
    desiredRole?: UserRole
  ): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return { success: false, message: 'Please enter your email ID.' };
    }

    if (!isValidEmail(trimmedEmail)) {
      return {
        success: false,
        message: 'Please enter a valid real email address (e.g., name@gmail.com or name@company.com).',
      };
    }

    const trimmedPass = (password || '').trim();
    if (!trimmedPass) {
      return { success: false, message: 'Please enter your password.' };
    }

    if (trimmedPass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    // Check if account already exists
    const existing = accounts.find((a) => a.email.toLowerCase() === trimmedEmail.toLowerCase());

    if (existing) {
      // Secure Password check: Verify using hashed comparison
      let passwordMatched = false;

      if (existing.passwordHash && existing.salt) {
        passwordMatched = await verifyPassword(trimmedPass, existing.salt, existing.passwordHash);
      } else if (existing.password) {
        // Upgrade legacy plaintext account to salted hash
        passwordMatched = existing.password === trimmedPass;
        if (passwordMatched) {
          const salt = generateSalt();
          const hash = await hashPassword(trimmedPass, salt);
          existing.salt = salt;
          existing.passwordHash = hash;
          delete existing.password;
        }
      }

      if (!passwordMatched) {
        return {
          success: false,
          message: 'Incorrect password for this email ID. Please check your Dashboard password.',
        };
      }

      // If desiredRole was specified and different, update it
      const updatedUser: User = {
        ...existing,
        role: desiredRole || existing.role,
      };

      setAccounts((prev) =>
        prev.map((acc) => (acc.id === existing.id ? { ...acc, role: updatedUser.role, salt: existing.salt, passwordHash: existing.passwordHash } : acc))
      );

      setCurrentUser(updatedUser);
      return { success: true };
    }

    // If account doesn't exist yet, automatically create secure account with hashed password and log in
    const selectedRole: UserRole = desiredRole || 'admin';
    const usernamePart = trimmedEmail.split('@')[0] || trimmedEmail;
    const formattedName =
      usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1).replace(/[._-]/g, ' ');

    const salt = generateSalt();
    const passwordHash = await hashPassword(trimmedPass, salt);

    const newUser: User = {
      id: `ACC-${Date.now()}`,
      name: formattedName,
      email: trimmedEmail,
      role: selectedRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}`,
      branch: 'Branch A',
      phone: '+1 (555) 000-0000',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const newAccount: UserAccount = {
      ...newUser,
      salt,
      passwordHash,
      isRealAccount: true,
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  // Register a new account with email, secure password, and role
  const registerAccount = async (
    email: string,
    password?: string,
    role: UserRole = 'admin',
    name?: string,
    branch?: string
  ): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return { success: false, message: 'Please enter your email ID.' };
    }

    if (!isValidEmail(trimmedEmail)) {
      return {
        success: false,
        message: 'Please enter a valid real email address (e.g., name@gmail.com).',
      };
    }

    const trimmedPass = (password || '').trim();
    if (!trimmedPass || trimmedPass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const existing = accounts.find((a) => a.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (existing) {
      return {
        success: false,
        message: 'An account with this email ID already exists. Please switch to Sign In.',
      };
    }

    const usernamePart = trimmedEmail.split('@')[0] || trimmedEmail;
    const formattedName =
      name || usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1).replace(/[._-]/g, ' ');

    const salt = generateSalt();
    const passwordHash = await hashPassword(trimmedPass, salt);

    const newUser: User = {
      id: `ACC-${Date.now()}`,
      name: formattedName,
      email: trimmedEmail,
      role: role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}`,
      branch: branch || 'Branch A',
      phone: '+1 (555) 000-0000',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const newAccount: UserAccount = {
      ...newUser,
      salt,
      passwordHash,
      isRealAccount: true,
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  // Logout current session
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sm_current_user');
  };

  // Logout all sessions and clear all stored accounts
  const logoutAll = () => {
    setCurrentUser(null);
    setAccounts([]);
    localStorage.removeItem('sm_current_user');
    localStorage.removeItem('sm_registered_accounts');
    sessionStorage.clear();
  };

  const switchUser = (userId: string) => {
    const target = accounts.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === userId ? { ...acc, role: newRole } : acc))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isExecutive: currentUser?.role === 'executive',
    login,
    registerAccount,
    logout,
    logoutAll,
    switchUser,
    updateUserRole,
    availableUsers: accounts,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
