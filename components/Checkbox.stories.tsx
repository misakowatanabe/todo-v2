import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Design System/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Controlled: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // eslint-disable-next-line no-console
      console.log(event.target.checked, event.target.id)

      setChecked((prev) => !prev)
    }

    return <Checkbox checked={checked} onchange={handleChange} id="test-id" />
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Checkbox',
  },
}

export const Disabled: Story = {
  args: {
    ...WithLabel.args,
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    ...WithLabel.args,
    disabled: true,
    checked: true,
  },
}
