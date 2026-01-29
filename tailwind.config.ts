import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 阳光宝贝配色方案
      colors: {
        // 珊瑚橙 - 主色
        coral: {
          50: '#FFF5F3',
          100: '#FFE8E3',
          200: '#FFD4CC',
          300: '#FFB5A7',
          400: '#FF8A6B',
          500: '#FF6B4A',
          600: '#E85A3C',
        },
        // 薄荷绿 - 完成状态
        mint: {
          50: '#EFFAF7',
          100: '#D4F3EA',
          200: '#A8E6D5',
          300: '#7DD3C0',
          400: '#5BC4AD',
          500: '#3DAE96',
        },
        // 阳光黄 - 提醒强调
        sunny: {
          50: '#FFFBF0',
          100: '#FFF4D9',
          200: '#FFE9B3',
          300: '#FFD97D',
          400: '#FFC94D',
          500: '#FFB81C',
        },
        // 薰衣草紫 - 点缀
        lavender: {
          50: '#F9F5FF',
          100: '#F0E8FF',
          200: '#E2D4FF',
          300: '#C9B3FF',
          400: '#A78BFA',
        },
        // 奶油色背景
        cream: {
          50: '#FFFCF8',
          100: '#FFF9F3',
          200: '#FFF3E8',
          300: '#FFECD9',
        },
        // 暖棕色文字
        warm: {
          600: '#7A6860',
          700: '#5D4E46',
          800: '#4A3F3A',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(255, 138, 107, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'card': '0 8px 32px rgba(255, 138, 107, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
