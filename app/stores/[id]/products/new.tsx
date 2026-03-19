import React, { useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { shadow } from '@/src/utils/shadow';
import { useLocalSearchParams, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { goBack } from '@/src/utils/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PRODUCT_CATEGORIES, ProductCategory } from '@/src/types';
import { useAppStore } from '@/src/store';
import { formatCurrencyInput, parseCurrencyInput } from '@/src/utils/currency';
import { Spinner } from '@/src/components/ui/spinner';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectItem,
} from '@/src/components/ui/select';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  category: z.string().min(1, 'Selecione uma categoria') as z.ZodType<ProductCategory>,
  price: z
    .string()
    .min(1, 'Informe o preço')
    .refine((v) => parseCurrencyInput(v) > 0, {
      message: 'Preço deve ser maior que zero',
    }),
});

type FormValues = z.infer<typeof schema>;

export default function NewProductScreen() {
  const { id: storeId } = useLocalSearchParams<{ id: string }>();
  const createProduct = useAppStore((s) => s.createProduct);
  const categories = useAppStore((s) => s.categories);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => goBack(`/stores/${storeId}`)}
          style={{ paddingHorizontal: 8, paddingVertical: 4, marginLeft: 4 }}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
      ),
    });
  }, [storeId]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', category: '' as ProductCategory, price: '' },
  });

  async function onSubmit(values: FormValues) {
    const { stores } = useAppStore.getState();
    if (!stores.some((s) => s.id === storeId)) {
      router.replace('/');
      return;
    }
    await createProduct(storeId, {
      name: values.name,
      category: values.category,
      price: parseCurrencyInput(values.price),
    });
    goBack(`/stores/${storeId}`);
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
                <Text style={styles.label}>Nome do Produto <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, !!errors.name && styles.inputError]}
                  placeholder="Ex: Camiseta Básica"
                  placeholderTextColor="#555"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  maxLength={100}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />

          {/* Categoria */}
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Categoria <Text style={styles.required}>*</Text></Text>
                <Select selectedValue={value} onValueChange={onChange} isInvalid={!!errors.category}>
                  <SelectTrigger isInvalid={!!errors.category}>
                    <SelectInput placeholder="Selecione uma categoria" />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      {categories.map((cat: string) => (
                        <SelectItem key={cat} label={cat} value={cat} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
                {errors.category && (
                  <Text style={styles.errorText}>{errors.category.message}</Text>
                )}
              </View>
            )}
          />

          {/* Preço */}
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Preço (R$) <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, !!errors.price && styles.inputError]}
                  placeholder="R$ 0,00"
                  placeholderTextColor="#555"
                  value={value}
                  onChangeText={(text) => onChange(formatCurrencyInput(text))}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  returnKeyType="done"
                  maxLength={100}
                />
                {errors.price && (
                  <Text style={styles.errorText}>{errors.price.message}</Text>
                )}
              </View>
            )}
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [styles.btnCancel, pressed && styles.btnCancelPressed]}
              onPress={() => goBack(`/stores/${storeId}`)}
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
    ...shadow('#2563EB', 4, 8, 0.4, 6),
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
