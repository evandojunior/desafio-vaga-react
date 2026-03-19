import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Context ──────────────────────────────────────────────────────────────────

interface SelectContextType {
  value: string;
  onValueChange: (val: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  placeholder?: string;
}

const SelectContext = React.createContext<SelectContextType>({
  value: '',
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps {
  selectedValue?: string;
  onValueChange: (val: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
}

function Select({ selectedValue = '', onValueChange, placeholder, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value: selectedValue, onValueChange, isOpen, setIsOpen, placeholder }}>
      {children}
    </SelectContext.Provider>
  );
}

// ─── SelectTrigger ────────────────────────────────────────────────────────────

interface SelectTriggerProps {
  className?: string;
  isInvalid?: boolean;
  children?: React.ReactNode;
}

function SelectTrigger({ className, isInvalid, children }: SelectTriggerProps) {
  const { setIsOpen } = React.useContext(SelectContext);
  return (
    <Pressable
      onPress={() => setIsOpen(true)}
      className={`flex-row items-center border rounded-lg h-11 px-4 ${
        isInvalid ? 'border-error-500' : 'border-outline-300'
      } bg-white ${className ?? ''}`}
    >
      {children}
    </Pressable>
  );
}

// ─── SelectInput ─────────────────────────────────────────────────────────────

function SelectInput({ placeholder, className }: { placeholder?: string; className?: string }) {
  const { value } = React.useContext(SelectContext);
  return (
    <Text
      className={`flex-1 text-base ${value ? 'text-typography-900' : 'text-typography-400'} ${className ?? ''}`}
    >
      {value || placeholder || 'Selecione...'}
    </Text>
  );
}

// ─── SelectIcon ──────────────────────────────────────────────────────────────

function SelectIcon({ as: Icon }: { as?: React.ComponentType<{ size: number; color: string }> }) {
  const { isOpen } = React.useContext(SelectContext);
  if (Icon) return <Icon size={20} color="#6B7280" />;
  return <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#6B7280" />;
}

// ─── SelectPortal / SelectContent / SelectItem ───────────────────────────────

interface SelectPortalProps {
  children?: React.ReactNode;
}

function SelectPortal({ children }: SelectPortalProps) {
  return <>{children}</>;
}

interface SelectContentProps {
  className?: string;
  children?: React.ReactNode;
}

function SelectContent({ className, children }: SelectContentProps) {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <Modal transparent visible={isOpen} animationType="fade" onRequestClose={() => setIsOpen(false)}>
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setIsOpen(false)}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className={`bg-white rounded-t-2xl py-4 max-h-80 ${className ?? ''}`}>
            <FlatList
              data={[]}
              renderItem={null}
              ListHeaderComponent={<>{children}</>}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface SelectItemProps {
  label: string;
  value: string;
}

function SelectItemComponent({ label, value }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setIsOpen } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <TouchableOpacity
      onPress={() => {
        onValueChange(value);
        setIsOpen(false);
      }}
      className={`px-5 py-3.5 flex-row items-center justify-between ${isSelected ? 'bg-primary-50' : ''}`}
    >
      <Text className={`text-base ${isSelected ? 'text-primary-600 font-semibold' : 'text-typography-900'}`}>
        {label}
      </Text>
      {isSelected && <Ionicons name="checkmark" size={18} color="#1976D2" />}
    </TouchableOpacity>
  );
}

export {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectItemComponent as SelectItem,
};
