import type { Meta, StoryObj } from '@storybook/react'
import { DropdownMenu } from './DropdownMenu'
import { Icon } from './icons'

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

export const Default: Story = {
  args: {
    icon: <Icon.Ellipsis />,
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
