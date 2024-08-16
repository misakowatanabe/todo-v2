import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './Dropdown'

const meta: Meta<typeof Dropdown> = {
  title: 'Design System/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

export const Primary: Story = {
  args: {
    // style: 'primary',
    label: 'Dropdown',
  },
}
