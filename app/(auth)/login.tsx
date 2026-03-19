import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthRepository } from '@/src/repositories/AuthRepository';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth, setLoading, isLoading } = useAuthStore();
  const repo = new AuthRepository();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Erro', 'Preencha todos os campos');
    try {
      setLoading(true);
      const { user, token } = await repo.login(email, password);
      setAuth(user, token);
      router.replace('/(tabs)' as any);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Login falhou');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0F0F0F] p-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-2">Bem-vindo(a)</Text>
      <Text className="text-zinc-400 mb-8 font-medium">Faça login para gerenciar suas lojas e produtos</Text>

      <Text className="text-white mb-2 font-semibold text-base">E-mail</Text>
      <TextInput
        className="bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl mb-4"
        placeholder="Digite seu e-mail"
        placeholderTextColor="#555"
        value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"
        maxLength={100}
      />

      <Text className="text-white mb-2 font-semibold text-base">Senha</Text>
      <TextInput
        className="bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl mb-8"
        placeholder="Digite sua senha"
        placeholderTextColor="#555"
        secureTextEntry
        value={password} onChangeText={setPassword}
        maxLength={100}
      />

      <Pressable onPress={handleLogin} disabled={isLoading} className="bg-white p-4 rounded-xl flex items-center justify-center mb-6">
        <Text className="text-black font-bold text-lg">{isLoading ? 'Validando...' : 'Entrar'}</Text>
      </Pressable>

      <View className="flex flex-row justify-center items-center">
        <Text className="text-zinc-400">Não tem conta? </Text>
        <Pressable onPress={() => router.push('/(auth)/register' as any)}>
          <Text className="text-white font-bold underline">Cadastre-se</Text>
        </Pressable>
      </View>
    </View>
  );
}
