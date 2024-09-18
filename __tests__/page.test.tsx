import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import SigninPage from 'app/(authViews)/signin/page'

// mock useRouter:
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
    }
  },
}))

describe('Page', () => {
  it('renders a heading in sign in view', () => {
    render(<SigninPage />)
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toBeInTheDocument()
  })
})
