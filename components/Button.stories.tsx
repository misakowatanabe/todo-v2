import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { Icon } from './icons'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    style: 'primary',
    label: 'Button',
  },
}

export const Secondary: Story = {
  args: {
    style: 'secondary',
    label: 'Button',
  },
}

export const Text: Story = {
  args: {
    style: 'text',
    label: 'Button',
  },
}

export const Critical: Story = {
  args: {
    style: 'critical',
    label: 'Button',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
    label: 'Button',
  },
}

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
}

export const LargeWithIcon: Story = {
  args: {
    label: 'Button',
    size: 'large',
    icon: <Icon.Plus />,
  },
}

export const MediumWithIcon: Story = {
  args: {
    label: 'Button',
    size: 'medium',
    icon: <Icon.Plus />,
  },
}

export const SmallWithIcon: Story = {
  args: {
    label: 'Button',
    size: 'small',
    icon: <Icon.Plus />,
  },
}

export const SmallWithoutLabel: Story = {
  args: {
    size: 'small',
    icon: <Icon.Plus />,
  },
}

export const MediumWithoutLabel: Story = {
  args: {
    size: 'medium',
    icon: <Icon.Plus />,
  },
}

export const LargeWithoutLabel: Story = {
  args: {
    size: 'large',
    icon: <Icon.Plus />,
  },
}
