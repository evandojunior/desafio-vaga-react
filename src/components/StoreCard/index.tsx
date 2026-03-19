import React, { useState } from 'react';
import { Pressable, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Store } from '@/src/types';
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

interface StoreCardProps {
  store: Store;
  onDelete: (id: string) => Promise<void>;
}

export function StoreCard({ store, onDelete }: StoreCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(store.id);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  return (
    <>
      <Pressable
        onPress={() => router.push(`/stores/${store.id}`)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.row}>
          {/* Store icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="storefront" size={22} color="#3B82F6" />
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.storeName} numberOfLines={1}>
              {store.name}
            </Text>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={12} color="#6B7280" />
              <Text style={styles.addressText} numberOfLines={1}>
                {store.address}
              </Text>
            </View>
          </View>

          {/* Badge + actions */}
          <View style={styles.right}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {store.productsCount} {store.productsCount === 1 ? 'prod.' : 'prods.'}
              </Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                onPress={() => router.push(`/stores/${store.id}/edit`)}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
                hitSlop={8}
              >
                <Ionicons name="pencil" size={16} color="#3B82F6" />
              </Pressable>
              <Pressable
                onPress={() => setShowDeleteDialog(true)}
                style={({ pressed }) => [styles.actionBtn, styles.actionBtnDanger, pressed && styles.actionBtnDangerPressed]}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>

      <AlertDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="md">Excluir Loja</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <GText size="sm" className="text-typography-600">
              Tem certeza que deseja excluir a loja{' '}
              <GText size="sm" bold>
                {store.name}
              </GText>
              ? Todos os produtos associados também serão removidos.
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
