import clsx from 'clsx'

type NumberNotificationProps = { isCurrentPath: boolean; todoLength?: number }

export function NumberNotification({ isCurrentPath, todoLength }: NumberNotificationProps) {
  if (todoLength == null) return null

  return (
    <div
      className={clsx(
        'flex text-xs h-4 min-w-4 justify-center rounded text-black',
        isCurrentPath ? 'bg-white' : 'bg-gray-200',
        { invisible: todoLength === 0 },
      )}
    >
      {todoLength}
    </div>
  )
}
