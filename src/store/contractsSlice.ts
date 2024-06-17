import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Contract, Product } from '../types';

export interface ContractsState {
  contracts: Contract[];
}

// Load contracts from localStorage
const loadContracts = (): Contract[] => {
  const data = localStorage.getItem('contracts');
  return data ? JSON.parse(data) : [];
};

const initialState: ContractsState = {
  contracts: loadContracts(),
};

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setContracts(state, action: PayloadAction<Contract[]>) {
      state.contracts = action.payload;
      localStorage.setItem('contracts', JSON.stringify(state.contracts));
    },
    addContract(state, action: PayloadAction<Partial<Contract>>) {
      const newContract: Contract = {
        ...action.payload,
        id: uuidv4(),
        proizvodi: [],
      } as Contract;
      state.contracts.push(newContract);
      localStorage.setItem('contracts', JSON.stringify(state.contracts));
    },
    updateContract(state, action: PayloadAction<{ id: string; updates: Partial<Contract> }>) {
      const { id, updates } = action.payload;
      const contract = state.contracts.find((c) => c.id === id);
      if (contract) {
        Object.assign(contract, updates);
        localStorage.setItem('contracts', JSON.stringify(state.contracts));
      }
    },
    addProductToContract(state, action: PayloadAction<{ contractId: string; product: Product }>) {
      const { contractId, product } = action.payload;
      const contract = state.contracts.find((c) => c.id === contractId);
      if (contract) {
        contract.proizvodi.push(product);
        localStorage.setItem('contracts', JSON.stringify(state.contracts));
      }
    },
    updateProductStatus(
      state,
      action: PayloadAction<{ contractId: string; productId: string; status: string }>
    ) {
      const { contractId, productId, status } = action.payload;
      const contract = state.contracts.find((c) => c.id === contractId);
      if (contract) {
        const product = contract.proizvodi.find((p) => p.id === productId);
        if (product) {
          product.status = status;
          localStorage.setItem('contracts', JSON.stringify(state.contracts));
        }
      }
    },
  },
});

export const {
  setContracts,
  addContract,
  addProductToContract,
  updateContract,
  updateProductStatus,
} = contractsSlice.actions;
export default contractsSlice.reducer;
