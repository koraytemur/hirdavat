import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem, Language, Category, Order, Discount } from '../types';
import { translations, TranslationKey } from '../i18n/translations';

interface AppState {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  getLocalizedText: (text: { nl: string; fr: string; en: string; tr: string }) => string;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; tax: number; total: number };
  
  // Categories
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  
  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  
  // Discount
  appliedDiscount: Discount | null;
  setAppliedDiscount: (discount: Discount | null) => void;
  
  // Admin mode
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  
  // Init
  initializeStore: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Language
  language: 'nl',
  setLanguage: async (lang: Language) => {
    set({ language: lang });
    await AsyncStorage.setItem('language', lang);
  },
  t: (key: TranslationKey) => {
    const { language } = get();
    return translations[language][key] || translations.en[key] || key;
  },
  getLocalizedText: (text) => {
    const { language } = get();
    return text[language] || text.en || text.nl || '';
  },
  
  // Cart
  cart: [],
  addToCart: (product: Product, quantity = 1) => {
    const { cart } = get();
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { product, quantity }] });
    }
    
    // Persist cart
    AsyncStorage.setItem('cart', JSON.stringify(get().cart));
  },
  removeFromCart: (productId: string) => {
    const { cart } = get();
    const newCart = cart.filter(item => item.product.id !== productId);
    set({ cart: newCart });
    AsyncStorage.setItem('cart', JSON.stringify(newCart));
  },
  updateQuantity: (productId: string, quantity: number) => {
    const { cart } = get();
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    set({ cart: newCart });
    AsyncStorage.setItem('cart', JSON.stringify(newCart));
  },
  clearCart: () => {
    set({ cart: [], appliedDiscount: null });
    AsyncStorage.setItem('cart', JSON.stringify([]));
  },
  getCartTotal: () => {
    const { cart, appliedDiscount } = get();
    let subtotal = cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    
    // Apply discount
    if (appliedDiscount) {
      if (appliedDiscount.discount_type === 'percentage') {
        subtotal = subtotal * (1 - appliedDiscount.discount_value / 100);
      } else {
        subtotal = Math.max(0, subtotal - appliedDiscount.discount_value);
      }
    }
    
    const tax = subtotal * 0.21;
    const total = subtotal + tax;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  },
  
  // Categories
  categories: [],
  setCategories: (categories: Category[]) => set({ categories }),
  
  // Products
  products: [],
  setProducts: (products: Product[]) => set({ products }),
  
  // Discount
  appliedDiscount: null,
  setAppliedDiscount: (discount: Discount | null) => set({ appliedDiscount: discount }),
  
  // Admin mode
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
  
  // Initialize store from AsyncStorage
  initializeStore: async () => {
    try {
      const [savedLang, savedCart] = await Promise.all([
        AsyncStorage.getItem('language'),
        AsyncStorage.getItem('cart'),
      ]);
      
      if (savedLang && ['nl', 'fr', 'en', 'tr'].includes(savedLang)) {
        set({ language: savedLang as Language });
      }
      
      if (savedCart) {
        set({ cart: JSON.parse(savedCart) });
      }
    } catch (error) {
      console.error('Error initializing store:', error);
    }
  },
}));
