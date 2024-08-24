import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import Drawer from './Drawer'
import { Button } from './Button'

const meta: Meta<typeof Drawer> = {
  title: 'Design System/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Drawer>

export const Primary: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false)

    const openButton = (
      <Button
        onClick={() => setIsOpen(true)}
        label="Open"
        aria-haspopup="menu"
        aria-label="Side drawer"
        aria-expanded={isOpen ? true : false}
        aria-controls="basic-drawer"
      />
    )

    return (
      <>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus, sem et cursus
          suscipit, erat orci dapibus nisi, quis egestas massa arcu eget felis. Nam laoreet porta
          enim, nec mollis nulla aliquet eu. Mauris nec urna maximus, tincidunt ligula at, feugiat
          mauris. Phasellus dignissim pretium urna vitae faucibus. Donec mi odio, volutpat quis
          bibendum ac, tempor a ligula. Morbi in dui ac odio facilisis tempus. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Duis maximus placerat molestie. Donec ex lorem, mollis
          nec felis et, rutrum tempus nulla. Aenean dapibus magna in arcu sodales, eu luctus est
          iaculis. Morbi vitae elementum magna. Vestibulum purus risus, pulvinar at urna non,
          laoreet condimentum orci. Mauris metus nibh, porttitor in auctor id, condimentum sit amet
          velit. Aliquam iaculis scelerisque mi ac ultrices.
        </div>
        <Drawer isOpen={isOpen} openButton={openButton} setIsOpen={setIsOpen}>
          <div className="flex flex-col gap-6">
            <div>Hello!</div>
            <div>Drawer contents here.</div>
            <Button
              onClick={() => setIsOpen(false)}
              label="Close"
              aria-haspopup="menu"
              aria-label="Side drawer"
              aria-expanded={isOpen ? true : false}
              aria-controls="basic-drawer"
            />
          </div>
        </Drawer>
      </>
    )
  },
}
