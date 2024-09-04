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

const contents = (
  <div className="flex flex-col gap-6">
    <div className="relative">
      <input
        id="id-b03"
        type="email"
        name="id-b03"
        placeholder="your name"
        className="peer relative h-10 w-full rounded border border-gray-200 px-4 text-sm text-gray-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
      />
      <label
        htmlFor="id-b03"
        className="absolute left-2 -top-2 z-[1] px-2 text-xs text-gray-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-gray-400 peer-disabled:before:bg-transparent"
      >
        Your email
      </label>
      <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-gray-400 transition peer-invalid:text-pink-500">
        <span>Type your email address</span>
      </small>
    </div>
    <div className="relative my-6">
      <input
        id="id-b13"
        type="password"
        name="id-b13"
        placeholder="your password"
        className="peer relative h-10 w-full rounded border border-gray-200 px-4 pr-12 text-sm text-gray-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
      />
      <label
        htmlFor="id-b13"
        className="absolute left-2 -top-2 z-[1] px-2 text-xs text-gray-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-gray-400 peer-disabled:before:bg-transparent"
      >
        Your password
      </label>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-2.5 right-4 h-5 w-5 cursor-pointer stroke-gray-400 peer-disabled:cursor-not-allowed"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </svg>
      <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-gray-400 transition peer-invalid:text-pink-500">
        <span>Type your password</span>
      </small>
    </div>
  </div>
)

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
        {contents}
      </Modal>
    )
  },
}
