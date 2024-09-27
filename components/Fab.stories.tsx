import type { Meta, StoryObj } from '@storybook/react'
import { Fab } from './Fab'
import { Icon } from './icons'

const meta: Meta<typeof Fab> = {
  title: 'Design System/Fab',
  component: Fab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Fab>

export const Default: Story = {
  args: {
    icon: <Icon.Plus />,
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    icon: <Icon.Plus />,
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    icon: <Icon.Plus />,
  },
}

export const Disabled: Story = {
  args: {
    icon: <Icon.Plus />,
    disabled: true,
  },
}
