import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORIES_KEY = 'CATEGORIES';
const DEFAULT_CATEGORIES = ['Personal', 'Trabajo', 'Educación', 'Salud', 'Finanzas'];

export const CategoriaService = {
  async getCategories(): Promise<string[]> {
    try {
      const categories = await AsyncStorage.getItem(CATEGORIES_KEY);
      return categories ? JSON.parse(categories) : DEFAULT_CATEGORIES;
    } catch (error) {
      console.error('Error getting categories:', error);
      return DEFAULT_CATEGORIES;
    }
  },

  async addCategory(newCategory: string): Promise<void> {
    try {
      const categories = await this.getCategories();
      if (!categories.includes(newCategory)) {
        categories.push(newCategory);
        await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
      }
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  async removeCategory(categoryToRemove: string): Promise<void> {
    try {
      const categories = await this.getCategories();
      const filtered = categories.filter(cat => cat !== categoryToRemove);
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing category:', error);
      throw error;
    }
  }
};