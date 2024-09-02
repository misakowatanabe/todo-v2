import type { Meta, StoryObj } from '@storybook/react'
import { DropdownMenu } from './DropdownMenu'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Design System/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

const MenuItems = [
  {
    label: 'First item',
    onClick: () => {
      // eslint-disable-next-line no-console
      console.log('Clicked the first item!')
    },
  },
  {
    label: 'Second item',
    onClick: () => {
      // eslint-disable-next-line no-console
      console.log('Clicked the second item!')
    },
  },
  {
    label: 'Third item (disabled)',
    onClick: () => {
      // eslint-disable-next-line no-console
      console.log('Clicked the third item!')
    },
    disabled: true,
  },
]

const verticalDotsIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
)

export const Default: Story = {
  args: {
    icon: verticalDotsIcon,
    items: MenuItems,
  },
}

export const RightAligned: Story = {
  args: {
    ...Default.args,
    alignment: 'right',
  },
}

export const WithLabel: Story = {
  args: {
    ...Default.args,
    label: 'Dropdown menu',
  },
}
