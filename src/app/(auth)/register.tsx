import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthRepository } from '@/src/repositories/AuthRepository';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth, setLoading, isLoading } = useAuthStore();
  const repo = new AuthRepository();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert('Erro', 'Preencha todos os campos');
    }
    try {
      setLoading(true);
      const { user, token } = await repo.register(name, email, password);
      setAuth(user, token);
      router.replace('/(tabs)' as any);
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || 'Falha ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0F0F0F] p-6 justify-center">
      <Text className="text-white text-3xl font-bold mb-2">Criar Conta</Text>
      <Text className="text-zinc-400 mb-8 font-medium">Cadastre-se agora mesmo</Text>

      <Text className="text-white mb-2 font-semibold text-base">Nome</Text>
      <TextInput
        className="bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl mb-4"
        placeholder="Digite seu nome"
        placeholderTextColor="#555"
        value={name} onChangeText={setName} autoCapitalize="words"
      />

      <Text className="text-white mb-2 font-semibold text-base">E-mail</Text>
      <TextInput
        className="bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl mb-4"
        placeholder="Digite seu e-mail"
        placeholderTextColor="#555"
        value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"
      />

      <Text className="text-white mb-2 font-semibold text-base">Senha</Text>
      <TextInput
        className="bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl mb-8"
        placeholder="******"
        placeholderTextColor="#555"
        secureTextEntry
        value={password} onChangeText={setPassword}
      />

      <Pressable onPress={handleRegister} disabled={isLoading} className="bg-white p-4 rounded-xl flex items-center justify-center mb-6">
        <Text className="text-black font-bold text-lg">{isLoading ? 'Registrando...' : 'Cadastrar'}</Text>
      </Pressable>

      <View className="flex flex-row justify-center items-center">
        <Text className="text-zinc-400">Já tem conta? </Text>
        <Pressable onPress={() => router.replace('/(auth)/login' as any)}>
          <Text className="text-white font-bold underline">Faça Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
