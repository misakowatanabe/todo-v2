import type { Meta, StoryObj } from '@storybook/react'
import { ButtonSwitcher } from './ButtonSwitcher'

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

const plusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-labelledby="title-ac01 desc-ac01"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)

export const Default: Story = {
  args: {
    left: { icon: plusIcon },
    right: { icon: plusIcon },
    onChange: (event: any) => {
      // eslint-disable-next-line no-console
      console.log(event.target.checked)
    },
  },
}

export const WithLabel: Story = {
  args: {
    left: { icon: plusIcon, label: 'Left label' },
    right: { icon: plusIcon, label: 'Right label' },
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
