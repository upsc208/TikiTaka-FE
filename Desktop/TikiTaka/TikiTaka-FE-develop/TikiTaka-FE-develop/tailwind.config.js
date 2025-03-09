/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,css,js,jsx,ts,tsx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './public/index.html'],
  theme: {
    extend: {
      fontSize: {
        title: ['16px', {lineHeight: '18px', fontWeight: '700'}],
        'title-regular': ['16px', {lineHeight: '16px', fontWeight: '400'}],
        subtitle: ['14px', {lineHeight: '16px', fontWeight: '700'}],
        'subtitle-regular': ['14px', {lineHeight: '24px', fontWeight: '400'}],
        'subtitle-medium': ['14px', {lineHeight: '16px', fontWeight: '500'}],
        'title-bold': ['16px', {lineHeight: '18px', fontWeight: '700'}],
        'body-bold': ['12px', {lineHeight: '20px', fontWeight: '700'}],
        'body-regular': ['12px', {lineHeight: '20px', fontWeight: '400'}],
        'caption-bold': ['10px', {lineHeight: '12px', fontWeight: '700'}],
        'caption-regular': ['10px', {lineHeight: '16px', fontWeight: '400'}],
        'caption3-bold': ['8px', {lineHeight: '16px', fontWeight: '700'}],
        'caption3-regular': ['8px', {lineHeight: '16px', fontWeight: '400'}],
      },
      colors: {
        // Theme 색상
        main: '#354052', // 네이비

        main2: {
          // 노랑
          1: '#F6D47A',
          2: '#FFDF5F',
          3: '#F0C000',
          4: '#D2AB0F',
        },

        admin: {
          1: '#1954A5',
          2: '#16407B',
        },

        error: '#B3261E',

        // Text 색상 - 임시
        black: '#222222',
        body: '#666666',
        disabled: '#999999',

        // gray 색상
        gray: {
          1: '#F1F3FF', // 아주 밝은 회색 - (hover)
          2: '#D0D4E7', // 밝은 회색 - (border)
          3: '#B9BED3',
          4: '#A3A8BF', // 중간 회색
          5: '#8B8FA4',
          6: '#727586',
          7: '#646775',
          8: '#565965', // 어두운 회색 - (사이드바 글씨)
          9: '#4C4E59',
          10: '#43454F',
          11: '#3B3D46',
          12: '#2C2E35',
          13: '#24252C',
          14: '#1F2025',
          15: '#1A1B1F', // 진한 회색 - (hover 글씨)
          16: '#1A1B1F',
          18: '#F7F7F9', // 가장 밝은 회색 - (컴포넌트 배경)
        },

        green: {
          95: '#F7F7F7',
        },

        // Border 색상
        border: {
          1: '#A3A8BF', // 구분선 색상
          2: '',
        },

        // Background 색상
        bg: {
          1: '#F7F7F9', // 사이드바, 내용 배경
        },

        // overlay 색상
        ol: '#D9D9D9',

        // System 색상
        red: '#D93438',
        orange: '#FFAE00',
        yellow: '#F8D753',
        blue: '#2A54D2',
        green: '#67C451',
      },
      fontFamily: {
        lineSeedKr: ['LineSeedKr', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
