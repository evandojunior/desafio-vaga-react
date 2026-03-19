import React, { useState } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Store } from '@/src/types';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from './ui/alert-dialog';
import { Button, ButtonText } from './ui/button';
import { Heading } from './ui/heading';
import { Text as GText } from './ui/text';

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
            <Button
              size="sm"
              variant="outline"
              action="default"
              onPress={() => setShowDeleteDialog(false)}
            >
              <ButtonText action="default" variant="outline">
                Cancelar
              </ButtonText>
            </Button>
            <Button
              size="sm"
              action="negative"
              onPress={handleDelete}
              isLoading={deleting}
            >
              <ButtonText>Excluir</ButtonText>
            </Button>
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
  cardPressed: {
    backgroundColor: '#222222',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  storeName: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '700',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    color: '#6B7280',
    fontSize: 12,
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#3B82F6',
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
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
});
