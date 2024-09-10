import type { Meta, StoryObj } from '@storybook/react'
import { Heading } from './Heading'

const meta: Meta<typeof Heading> = {
  title: 'Design System/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Heading>

export const Default: Story = {
  args: {
    title: 'Heading',
  },
}
