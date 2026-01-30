import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 温馨母婴配色方案
      colors: {
        // 奶油粉 - 主色
        pink: {
          50: '#FFF7F9',
          100: '#FFEFF3',
          200: '#FFE5EB',
          300: '#FFD4E0',
          400: '#FFC2D4',
          500: '#FFB5C2',
          600: '#FF9BB0',
        },
        // 蜜桃色 - 辅助色
        peach: {
          50: '#FFF9F5',
          100: '#FFF2E9',
          200: '#FFE8D8',
          300: '#FFDCC4',
          400: '#FFD4BC',
          500: '#FFC9A8',
        },
        // 奶油米色 - 背景
        cream: {
          50: '#FFFCF9',
          100: '#FFF9F5',
          200: '#FFF5E9',
          300: '#FFF1DF',
        },
        // 温暖白 - 卡片背景
        neutral: {
          warm: '#F8F6F3',
          soft: '#E8E4DE',
        },
        // 薄荷绿 - 功能色/成功状态
        mint: {
          50: '#F0FAF7',
          100: '#D9F3ED',
          200: '#C2E9E0',
          300: '#B8D4C0',
          400: '#9BC7B8',
          500: '#7FB9A8',
        },
        // 温暖黄 - 提醒/警告
        warm: {
          50: '#FFFDF5',
          100: '#FFF9E6',
          200: '#FFF3CC',
          300: '#FFE9A3',
          400: '#FFD89C',
          500: '#FFC975',
          600: '#7A6860',
          700: '#5D4E46',
          800: '#5C5550',
          900: '#4A3F3A',
        },
        // 天空蓝 - 信息提示
        sky: {
          50: '#F5FAFD',
          100: '#E8F4FA',
          200: '#D8EDF7',
          300: '#C5DBEB',
          400: '#A8CADF',
        },
        // 文字色
        text: {
          primary: '#5C5550',
          secondary: '#9C9690',
          soft: '#B8B3AE',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'PingFang SC', '-apple-system', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'PingFang SC', '-apple-system', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(255, 181, 194, 0.08), 0 8px 24px rgba(255, 181, 194, 0.12)',
        'card': '0 4px 16px rgba(255, 181, 194, 0.12), 0 12px 32px rgba(255, 181, 194, 0.16)',
        'gentle': '0 1px 4px rgba(255, 181, 194, 0.06), 0 4px 12px rgba(255, 181, 194, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
