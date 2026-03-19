import React from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '@/src/hooks/useStores';
import { useAppStore } from '@/src/store';
import { Spinner } from '@/components/ui/spinner';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres').max(255),
});

type FormValues = z.infer<typeof schema>;

export default function EditStoreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore(id);
  const updateStore = useAppStore((s) => s.updateStore);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: store?.name ?? '',
      address: store?.address ?? '',
    },
  });

  if (!store) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  async function onSubmit(values: FormValues) {
    await updateStore(id, values);
    router.back();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Nome */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nome da Loja <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, !!errors.name && styles.inputError]}
                  placeholder="Ex: Loja Centro"
                  placeholderTextColor="#555"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />

          {/* Endereço */}
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Endereço <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline, !!errors.address && styles.inputError]}
                  placeholder="Ex: Rua das Flores, 123 – Centro"
                  placeholderTextColor="#555"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={2}
                  returnKeyType="done"
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address.message}</Text>
                )}
              </View>
            )}
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [styles.btnCancel, pressed && styles.btnCancelPressed]}
              onPress={() => router.back()}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.btnSubmit, pressed && styles.btnSubmitPressed]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner size="small" />
              ) : (
                <Text style={styles.btnSubmitText}>Salvar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: '#0F0F0F' },
  scrollContent: { flexGrow: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
  },
  formContainer: {
    flex: 1,
    padding: 16,
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F9FAFB',
    fontSize: 14,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    paddingTop: 16,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  btnCancelPressed: {
    backgroundColor: '#1A1A1A',
  },
  btnCancelText: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '600',
  },
  btnSubmit: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  btnSubmitPressed: {
    backgroundColor: '#1D4ED8',
  },
  btnSubmitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
