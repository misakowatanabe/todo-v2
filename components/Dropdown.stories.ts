import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './Dropdown'

const meta: Meta<typeof Dropdown> = {
  title: 'Design System/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Dropdown>

const items = ['Work', 'Personal', 'Kids']

export const Default: Story = {
  args: {
    label: 'Dropdown',
    items: items,
  },
}
