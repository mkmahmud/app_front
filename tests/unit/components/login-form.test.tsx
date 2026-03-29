import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { LoginForm } from '@/features/auth/components/login-form'
import authReducer from '@/features/auth/slice/auth.slice'
import uiReducer from '@/store/ui.slice'

// Mock useAuth hook
const mockLogin = jest.fn()
jest.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}))

function renderLoginForm() {
  const store = configureStore({
    reducer: { auth: authReducer, ui: uiReducer },
  })
  return render(
    <Provider store={store}>
      <LoginForm />
    </Provider>
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockReset()
  })

  it('renders all form fields', () => {
    renderLoginForm()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty submission', async () => {
    renderLoginForm()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid email', async () => {
    renderLoginForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('calls login with correct data on valid submission', async () => {
    mockLogin.mockResolvedValue({ success: true })
    renderLoginForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i, { selector: 'input[type=\"password\"]' }), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: false,
      })
    })
  })

  it('shows server error message on failed login', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' })
    renderLoginForm()
    const user = userEvent.setup()


    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i, { selector: 'input[type=\"password\"]' }), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('toggles password visibility', async () => {
    renderLoginForm()
    const user = userEvent.setup()
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input[type=\"password\"]' })

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByLabelText(/show password/i))
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(screen.getByLabelText(/hide password/i))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
