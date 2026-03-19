import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/src/types';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from './ui/alert-dialog';
import { Heading } from './ui/heading';
import { Text as GText } from './ui/text';

interface ProductCardProps {
  product: Product;
  storeId: string;
  storeName?: string;
  onDelete: (productId: string) => Promise<void>;
}

const categoryBadgeColors: Record<string, { bg: string; text: string }> = {
  Roupas: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
  Calçados: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22C55E' },
  Acessórios: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' },
  Eletrônicos: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' },
  Alimentos: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22C55E' },
  Bebidas: { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366F1' },
  Higiene: { bg: 'rgba(107, 114, 128, 0.15)', text: '#9CA3AF' },
  Papelaria: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B' },
  Brinquedos: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6' },
  Outros: { bg: 'rgba(107, 114, 128, 0.15)', text: '#9CA3AF' },
};

function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function ProductCard({ product, storeId, storeName, onDelete }: ProductCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(product.id);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  const categoryStyle = categoryBadgeColors[product.category] ?? { bg: 'rgba(107, 114, 128, 0.15)', text: '#9CA3AF' };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.row}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="cube-outline" size={20} color="#3B82F6" />
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: categoryStyle.bg }]}>
                <Text style={[styles.badgeText, { color: categoryStyle.text }]}>
                  {product.category}
                </Text>
              </View>
              {storeName && (
                <View style={styles.storeBadge}>
                  <Ionicons name="storefront-outline" size={10} color="#6B7280" />
                  <Text style={styles.storeBadgeText} numberOfLines={1}>
                    {storeName}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Price + actions */}
          <View style={styles.right}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <View style={styles.actions}>
              <Pressable
                onPress={() => router.push(`/stores/${storeId}/products/${product.id}/edit`)}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
                hitSlop={8}
              >
                <Ionicons name="pencil" size={15} color="#3B82F6" />
              </Pressable>
              <Pressable
                onPress={() => setShowDeleteDialog(true)}
                style={({ pressed }) => [styles.actionBtn, styles.actionBtnDanger, pressed && styles.actionBtnDangerPressed]}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={15} color="#EF4444" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <AlertDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md">Excluir Produto</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <GText size="sm" className="text-typography-600">
              Tem certeza que deseja excluir{' '}
              <GText size="sm" bold>
                {product.name}
              </GText>
              ?
            </GText>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Pressable
              onPress={() => setShowDeleteDialog(false)}
              style={({ pressed }) => [styles.dialogBtn, styles.dialogBtnCancel, pressed && styles.dialogBtnCancelPressed]}
            >
              <Text style={styles.dialogBtnCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              disabled={deleting}
              style={({ pressed }) => [styles.dialogBtn, styles.dialogBtnDelete, pressed && styles.dialogBtnDeletePressed, deleting && { opacity: 0.6 }]}
            >
              {deleting
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.dialogBtnDeleteText}>Excluir</Text>
              }
            </Pressable>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 12,
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 6,
  },
  productName: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  storeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  storeBadgeText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '500',
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  price: {
    color: '#22C55E',
    fontSize: 15,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPressed: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  actionBtnDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  actionBtnDangerPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  dialogBtn: {
    height: 38,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  dialogBtnCancel: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  dialogBtnCancelPressed: {
    backgroundColor: '#F3F4F6',
  },
  dialogBtnCancelText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  dialogBtnDelete: {
    backgroundColor: '#DC2626',
  },
  dialogBtnDeletePressed: {
    backgroundColor: '#B91C1C',
  },
  dialogBtnDeleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
