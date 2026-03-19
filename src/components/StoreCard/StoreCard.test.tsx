import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { StoreCard } from './index';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: (props: any) => <Text>{props.name}</Text>,
  };
});

// Mock the UI components used to simplify test
jest.mock('../ui/alert-dialog', () => ({
  AlertDialog: ({ isOpen, children }: any) => (isOpen ? <>{children}</> : null),
  AlertDialogContent: ({ children }: any) => <>{children}</>,
  AlertDialogHeader: ({ children }: any) => <>{children}</>,
  AlertDialogBody: ({ children }: any) => <>{children}</>,
  AlertDialogFooter: ({ children }: any) => <>{children}</>,
}));

jest.mock('../ui/heading', () => {
  const { Text } = require('react-native');
  return {
    Heading: ({ children }: any) => <Text>{children}</Text>,
  };
});

jest.mock('../ui/text', () => {
  const { Text } = require('react-native');
  return {
    Text: ({ children }: any) => <Text>{children}</Text>,
  };
});

const mockStore = {
  id: 'store-1',
  name: 'My Store',
  address: '123 Fake St',
  productsCount: 5,
  logo: null,
  createdAt: new Date().toISOString(),
};

describe('StoreCard component', () => {
  it('renders store details correctly', () => {
    const onDeleteMock = jest.fn();
    render(<StoreCard store={mockStore} onDelete={onDeleteMock} />);

    expect(screen.getByText('My Store')).toBeTruthy();
    expect(screen.getByText('123 Fake St')).toBeTruthy();
    expect(screen.getByText('5 prods.')).toBeTruthy();
  });

  it('navigates to store details on press', () => {
    const { router } = require('expo-router');
    const onDeleteMock = jest.fn();
    
    render(<StoreCard store={mockStore} onDelete={onDeleteMock} />);
    
    fireEvent.press(screen.getByText('My Store'));

    expect(router.push).toHaveBeenCalledWith('/stores/store-1');
  });

  it('navigates to edit screen when edit button is pressed', () => {
    const { router } = require('expo-router');
    const onDeleteMock = jest.fn();
    
    render(<StoreCard store={mockStore} onDelete={onDeleteMock} />);
    
    const pencilIcon = screen.getByText('pencil');
    expect(pencilIcon).toBeTruthy();
    fireEvent.press(pencilIcon);

    expect(router.push).toHaveBeenCalledWith('/stores/store-1/edit');
  });

  it('shows delete dialog and calls onDelete when confirmed', async () => {
    const onDeleteMock = jest.fn().mockResolvedValue(undefined);
    
    render(<StoreCard store={mockStore} onDelete={onDeleteMock} />);
    
    const trashIcon = screen.getByText('trash-outline');
    expect(trashIcon).toBeTruthy();
    
    // Open dialog
    fireEvent.press(trashIcon);
    
    // Dialog should be open
    expect(await screen.findByText('Excluir Loja')).toBeTruthy();
    
    const confirmButtonTexts = await screen.findAllByText('Excluir');
    const confirmButton = confirmButtonTexts[confirmButtonTexts.length - 1]; 
    
    fireEvent.press(confirmButton);
    
    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith('store-1');
    });
  });
});

