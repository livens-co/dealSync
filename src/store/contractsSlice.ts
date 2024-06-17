import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Contract, Product } from '../types';

export interface ContractsState {
  contracts: Contract[];
}

const initialState: ContractsState = {
  contracts: [],
};

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    setContracts(state, action: PayloadAction<Contract[]>) {
      state.contracts = action.payload;
    },
    addContract(state, action: PayloadAction<Partial<Contract>>) {
      const newContract: Contract = {
        ...action.payload,
        id: uuidv4(),
        proizvodi: [],
      } as Contract;
      state.contracts.push(newContract);
    },
    updateContract(state, action: PayloadAction<{ id: string; updates: Partial<Contract> }>) {
      const { id, updates } = action.payload;
      const contract = state.contracts.find((c) => c.id === id);
      if (contract) {
        Object.assign(contract, updates);
      }
    },
    addProductToContract(state, action: PayloadAction<{ contractId: string; product: Product }>) {
      const { contractId, product } = action.payload;
      const contract = state.contracts.find((c) => c.id === contractId);
      if (contract) {
        contract.proizvodi.push(product);
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
