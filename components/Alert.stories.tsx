import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'
import { useState } from 'react'

const meta: Meta<typeof Alert> = {
  title: 'Design System/Alert',
  component: Alert,
  parameters: {
    layout: 'top',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Alert>

export const Info: Story = {
  args: {
    severity: 'info',
  },
  render: function Render(args) {
    const [info, setInfo] = useState<string | null>('This is the info alert!')

    return <Alert {...args} message={info} onClose={() => setInfo(null)} />
  },
}

export const Critical: Story = {
  args: {
    severity: 'critical',
  },
  render: function Render(args) {
    const [error, setError] = useState<string | null>('This is the critical alert!')

    return <Alert {...args} message={error} onClose={() => setError(null)} />
  },
}
