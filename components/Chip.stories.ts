import type { Meta, StoryObj } from '@storybook/react'
import { Chip } from './Chip'

const meta: Meta<typeof Chip> = {
  title: 'Design System/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Chip>

export const Filled: Story = {
  args: {
    style: 'filled',
    label: 'Chip',
  },
}

export const Outline: Story = {
  args: {
    style: 'outline',
    label: 'Chip',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Chip',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    label: 'Chip',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Chip',
  },
}

export const OnRemove: Story = {
  args: {
    label: 'Chip',
    onRemove: () => {},
  },
}
