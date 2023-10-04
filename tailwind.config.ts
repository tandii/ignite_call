import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'layout': 'repeat(1, 1fr auto)',
        'calendar-layout': 'repeat(1, 1fr 280px)',
      }
    },
  },
  plugins: [],
}
export default config
