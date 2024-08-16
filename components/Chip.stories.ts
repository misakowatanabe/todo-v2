import type { Meta, StoryObj } from '@storybook/react'
import { Chip } from './Chip'

const meta: Meta<typeof Chip> = {
  title: 'Design System/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
}

export default meta
type Story = StoryObj<typeof Chip>

export const Primary: Story = {
  args: {
    style: 'primary',
    label: 'Chip',
  },
}

export const Secondary: Story = {
  args: {
    style: 'secondary',
    label: 'Chip',
  },
}

export const Text: Story = {
  args: {
    style: 'text',
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
