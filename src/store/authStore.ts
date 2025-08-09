import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credenciales simuladas (en una app real estarían en el backend)
const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  loginTime: string;
}

interface AuthState {
  // Estado
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  loginError: string | null;

  // Acciones
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      isAuthenticated: false,
      user: null,
      isLoading: false,
      loginError: null,

      // Función de login simulado
      login: async (username: string, password: string): Promise<boolean> => {
        set({ isLoading: true, loginError: null });

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Validar credenciales
        if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
          const mockUser: User = {
            id: 'user-001',
            username: username,
            name: 'Administrador',
            email: 'admin@gestordocumental.com',
            loginTime: new Date().toISOString()
          };

          set({
            isAuthenticated: true,
            user: mockUser,
            isLoading: false,
            loginError: null
          });

          console.log('✅ Login exitoso:', mockUser.name);
          return true;
        } else {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            loginError: 'Credenciales incorrectas. Usa: admin / admin123'
          });

          console.log('❌ Login fallido');
          return false;
        }
      },

      // Función de logout
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          loginError: null
        });
        console.log('👋 Logout exitoso');
      },

      // Limpiar errores
      clearError: () => {
        set({ loginError: null });
      },

      // Inicializar autenticación (verificar si ya está logueado)
      initializeAuth: async () => {
        set({ isLoading: true });
        
        // En una app real, aquí validarías el token con el backend
        const state = get();
        if (state.user && state.isAuthenticated) {
          console.log('🔄 Sesión restaurada para:', state.user.name);
        }
        
        set({ isLoading: false });
      }
    }),
    {
      name: 'auth-storage', // Clave para AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir estos campos
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
      })
    }
  )
);
