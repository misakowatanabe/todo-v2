import type { Meta, StoryObj } from '@storybook/react'
import { Accordion } from './Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Design System/Accordion',
  component: Accordion,
  parameters: {
    layout: 'top',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Primary: Story = {
  args: {
    label: 'Open the accordion',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus, sem et cursus suscipit erat orci dapibus nisi, quis egestas massa arcu eget felis. Nam laoreet porta enim, nec',
  },
}
