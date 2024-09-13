import type { Meta, StoryObj } from '@storybook/react'
import { Chip } from './Chip'
import { Icon } from './icons'

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

export const SmallWithOnRemove: Story = {
  args: {
    size: 'small',
    label: 'Chip',
    color: 'raspberry',
    onRemove: () => {},
  },
}

export const MediumWithOnRemove: Story = {
  args: {
    size: 'medium',
    label: 'Chip',
    color: 'raspberry',
    onRemove: () => {},
  },
}

export const LargeWithOnRemove: Story = {
  args: {
    size: 'large',
    label: 'Chip',
    color: 'raspberry',
    onRemove: () => {},
  },
}

export const SmallWithIcon: Story = {
  args: {
    size: 'small',
    label: 'Chip',
    onClick: () => {},
    icon: <Icon.Inbox />,
  },
}

export const MediumWithIcon: Story = {
  args: {
    size: 'medium',
    label: 'Chip',
    onClick: () => {},
    icon: <Icon.Inbox />,
  },
}

export const LargeWithIcon: Story = {
  args: {
    size: 'large',
    label: 'Chip',
    onClick: () => {},
    icon: <Icon.Inbox />,
  },
}
