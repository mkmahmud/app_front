import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
}

interface Modal {
  id: string
  isOpen: boolean
  data?: unknown
}

interface UIState {
  sidebarOpen: boolean
  toasts: Toast[]
  modals: Record<string, Modal>
  isLoading: boolean
}

const initialState: UIState = {
  sidebarOpen: true,
  toasts: [],
  modals: {},
  isLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      state.toasts.push({
        id: crypto.randomUUID(),
        ...action.payload,
      })
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
    openModal: (state, action: PayloadAction<{ id: string; data?: unknown }>) => {
      state.modals[action.payload.id] = {
        id: action.payload.id,
        isOpen: true,
        data: action.payload.data,
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].isOpen = false
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  addToast,
  removeToast,
  openModal,
  closeModal,
  setLoading,
} = uiSlice.actions

export default uiSlice.reducer
