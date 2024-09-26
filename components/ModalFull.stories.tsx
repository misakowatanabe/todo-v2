import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ModalFull } from './ModalFull'
import { Button } from './Button'

const meta: Meta<typeof ModalFull> = {
  title: 'Design System/ModalFull',
  component: ModalFull,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ModalFull>

export const Primary: Story = {
  args: {
    actions: <Button onClick={() => {}} label="Create" style="text" size="large" />,
  },
  render: function Render(args) {
    const [isShowing, setIsShowing] = useState(false)

    const openButton = <Button onClick={() => setIsShowing(true)} label="Open ModalFull" />

    return (
      <ModalFull
        {...args}
        actions={<Button label="Create" style="text" size="large" />}
        setIsShowing={setIsShowing}
        isShowing={isShowing}
        openButton={openButton}
      >
        <div>This is the space for ModalFull contents!</div>
      </ModalFull>
    )
  },
}
