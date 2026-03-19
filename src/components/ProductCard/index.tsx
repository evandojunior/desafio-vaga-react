import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/src/types';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '../ui/alert-dialog';
import { Heading } from '../ui/heading';
import { Text as GText } from '../ui/text';
import { styles } from './styles';

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
