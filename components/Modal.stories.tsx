import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'

const meta: Meta<typeof Modal> = {
  title: 'Design System/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Modal>

export const Primary: Story = {
  args: {
    title: 'Title',
  },
  render: function Render(args) {
    const [isShowing, setIsShowing] = useState(false)

    const openButton = <Button onClick={() => setIsShowing(true)} label="Open Modal" />
    const okButton = <Button onClick={() => setIsShowing(false)} label="Login" />

    return (
      <Modal
        {...args}
        setIsShowing={setIsShowing}
        isShowing={isShowing}
        openButton={openButton}
        okButton={okButton}
      >
        <div>This is the space for modal contents!</div>
      </Modal>
    )
  },
}

export const NonCloseable: Story = {
  args: {
    title: 'Title',
  },
  render: function Render(args) {
    const [isShowing, setIsShowing] = useState(false)

    const openButton = <Button onClick={() => setIsShowing(true)} label="Open Modal" />
    const okButton = <Button onClick={() => setIsShowing(false)} label="Login" />

    return (
      <Modal
        {...args}
        setIsShowing={setIsShowing}
        isShowing={isShowing}
        openButton={openButton}
        okButton={okButton}
        closeable={false}
      >
        <div>You can close this modal only by clicking the primary button!</div>
      </Modal>
    )
  },
}
