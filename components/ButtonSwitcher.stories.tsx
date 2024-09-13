import type { Meta, StoryObj } from '@storybook/react'
import { ButtonSwitcher } from './ButtonSwitcher'
import { Icon } from './icons'

const meta: Meta<typeof ButtonSwitcher> = {
  title: 'Design System/ButtonSwitcher',
  component: ButtonSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ButtonSwitcher>

export const Default: Story = {
  args: {
    left: { icon: <Icon.List /> },
    right: { icon: <Icon.Grid /> },
    onChange: (event: any) => {
      // eslint-disable-next-line no-console
      console.log(event.target.checked)
    },
  },
}

export const LargeWithLabel: Story = {
  args: {
    left: { icon: <Icon.List />, label: 'Left label' },
    right: { icon: <Icon.Grid />, label: 'Right label' },
    size: 'large',
    onChange: (event: any) => {
      // eslint-disable-next-line no-console
      console.log(event.target.checked)
    },
  },
}

export const MediumWithLabel: Story = {
  args: {
    left: { icon: <Icon.List />, label: 'Left label' },
    right: { icon: <Icon.Grid />, label: 'Right label' },
    size: 'medium',
    onChange: (event: any) => {
      // eslint-disable-next-line no-console
      console.log(event.target.checked)
    },
  },
}

export const SmallWithLabel: Story = {
  args: {
    left: { icon: <Icon.List />, label: 'Left label' },
    right: { icon: <Icon.Grid />, label: 'Right label' },
    size: 'small',
    onChange: (event: any) => {
      // eslint-disable-next-line no-console
      console.log(event.target.checked)
    },
  },
}

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'large',
  },
}

export const Medium: Story = {
  args: {
    ...Default.args,
    size: 'medium',
  },
}

export const Small: Story = {
  args: {
    ...Default.args,
    size: 'small',
  },
}
