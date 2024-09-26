import clsx from 'clsx'

// TODO: Icon inside either Dropdown, DropdownMenu or ListItem should also inherit size of its parent component
type IconProps = {
  /** Size can be customisable by specifying width and height.
   * Size will be inherited by a parent component on Button, ButtonSwitcher, Chip.
   */
  size?: 'small' | 'medium' | 'large' | { width: number; height: number }
  className?: string
  viewBox?: string
  fill?: boolean
  stroke?: string
  strokeWidth?: number
}

const IconBase = ({
  size,
  path,
  viewBox,
  fill,
  stroke,
  strokeWidth,
  ...props
}: { path: React.ReactNode } & IconProps) => (
  <svg
    width={
      typeof size === 'string'
        ? clsx({ 16: size === 'small', 18: size === 'medium', 20: size === 'large' })
        : size
          ? size.width
          : undefined
    }
    height={
      typeof size === 'string'
        ? clsx({ 16: size === 'small', 18: size === 'medium', 20: size === 'large' })
        : size
          ? size.height
          : undefined
    }
    xmlns="http://www.w3.org/2000/svg"
    fill={fill ? 'currentColor' : 'none'}
    viewBox={viewBox ?? '0 0 24 24'}
    stroke={stroke ?? 'currentColor'}
    strokeWidth={strokeWidth ?? 2}
    role="graphics-symbol"
    {...props}
  >
    {path}
  </svg>
)

export const Icon = {
  Plus: ({ ...props }: IconProps) => (
    <IconBase
      path={<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />}
      {...props}
    />
  ),
  Ellipsis: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <>
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </>
      }
      {...props}
    />
  ),
  Grab: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <>
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
          <circle cx="6" cy="12" r="1"></circle>
          <circle cx="6" cy="5" r="1"></circle>
          <circle cx="6" cy="19" r="1"></circle>
        </>
      }
      {...props}
    />
  ),
  Label: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </>
      }
      {...props}
    />
  ),
  Escape: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <g fill="none" fillRule="evenodd">
          <path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8" />
        </g>
      }
      {...props}
    />
  ),
  Close: ({ ...props }: IconProps) => (
    <IconBase
      path={<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />}
      {...props}
    />
  ),
  Settings: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </>
      }
      {...props}
    />
  ),
  Inbox: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <>
          <path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" />
          <path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z" />
        </>
      }
      {...props}
    />
  ),
  Clip: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
      }
      {...props}
    />
  ),
  List: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </>
      }
      {...props}
    />
  ),
  Grid: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <>
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </>
      }
      {...props}
    />
  ),
  ChevronUp: ({ ...props }: IconProps) => <IconBase path={<path d="M6 9l6 6 6-6" />} {...props} />,
  Check: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
        />
      }
      {...props}
    />
  ),
  Spinner: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <>
          <circle cx="12" cy="12" r="10" className="stroke-gray-200" strokeWidth="4" />
          <path
            d="M12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2"
            className="stroke-black"
            strokeWidth="4"
          />
        </>
      }
      {...props}
    />
  ),
  Menu: ({ ...props }: IconProps) => (
    <IconBase
      path={
        <>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </>
      }
      {...props}
    />
  ),
  ArrowLeft: ({ ...props }: IconProps) => (
    <IconBase path={<path d="M19 12H6M12 5l-7 7 7 7" />} {...props} />
  ),
}
