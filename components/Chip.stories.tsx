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

export const OnClick: Story = {
  args: {
    label: 'Chip',
    onClick: () => {},
  },
}

export const OnRemove: Story = {
  args: {
    label: 'Chip',
    color: 'raspberry',
    onRemove: () => {},
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Chip',
    onClick: () => {},
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-labelledby="title-ac02 desc-ac02"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
}
