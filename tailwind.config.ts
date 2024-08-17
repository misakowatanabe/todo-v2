import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#222222',
      gray: colors.gray,
      raspberry: '#EC4899',
      honey: '#E29C15',
      blueberry: '#4D89DD',
      greenApple: '#63BE38',
      orange: '#E38800',
      midnight: '#7A52EE',
      powderPink: '#FFD0D8',
      sky: '#ADEEF3',
      lemon: '#FFED4F',
      lime: '#30A658',
      dreamyPurple: '#E8C3FF',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
