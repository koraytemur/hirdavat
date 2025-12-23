import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { useStore } from '../store/useStore';

// Belgium VAT rate
const VAT_RATE = 0.21;

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { getLocalizedText, t, addToCart } = useStore();

  // Calculate price with VAT included
  const priceWithVat = product.price * (1 + VAT_RATE);

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {product.images && product.images.length > 0 ? (
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="cube-outline" size={48} color="#ccc" />
          </View>
        )}
        {product.stock <= 0 && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>{t('outOfStock')}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {getLocalizedText(product.name)}
        </Text>
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>€{priceWithVat.toFixed(2)}</Text>
            <Text style={styles.vatIncluded}>BTW inbegrepen</Text>
          </View>
          {product.stock > 0 && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
            >
              <Ionicons name="cart-outline" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    minHeight: 36,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  vatIncluded: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#e67e22',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
