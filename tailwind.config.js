import tailwindAnimate from 'tailwindcss-animate';
import containerQuery from '@tailwindcss/container-queries';
import intersect from 'tailwindcss-intersect';

export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
        './node_modules/streamdown/dist/**/*.js'
    ],
    safelist: ['border', 'border-border'],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'hsl(var(--border) / 0.06)',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    background: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                },
                // Morandi 品牌色
                morandi: {
                    warm: 'hsl(var(--morandi-warm))',
                    cool: 'hsl(var(--morandi-cool))',
                    silver: 'hsl(var(--morandi-silver))',
                    sage: 'hsl(var(--morandi-sage))',
                    rose: 'hsl(var(--morandi-rose))',
                    clay: 'hsl(var(--morandi-clay))',
                    // 兼容旧命名
                    main: 'hsl(var(--background))',
                    sidebar: 'hsl(var(--sidebar-background))',
                    accent: 'hsl(var(--morandi-silver))',
                    text: 'hsl(var(--foreground))',
                },
                // 状态色
                success: 'hsl(var(--color-success))',
                warning: 'hsl(var(--color-warning))',
                error: 'hsl(var(--color-error))',
                highlight: 'hsl(var(--color-highlight))',
            },
            fontFamily: {
                serif: ['var(--font-serif)'],
                sans: ['var(--font-sans)'],
                mono: ['var(--font-mono)'],
            },
            fontSize: {
                'xs': ['14px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
                'sm': ['16px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
                'base': ['20px', { lineHeight: '1.6' }],
                'lg': ['22px', { lineHeight: '1.5' }],
                'xl': ['25px', { lineHeight: '1.4' }],
                '2xl': ['26px', { lineHeight: '1.4' }],
                '3xl': ['32px', { lineHeight: '1.3' }],
                '4xl': ['36px', { lineHeight: '1.2' }],
            },
            spacing: {
                '0.5': '2px',
                '1': '4px',
                '1.5': '6px',
                '2': '8px',
                '2.5': '10px',
                '3': '12px',
                '3.5': '14px',
                '4': '16px',
                '5': '20px',
                '6': '24px',
                '7': '28px',
                '8': '32px',
                '9': '36px',
                '10': '40px',
                '11': '44px',
                '12': '48px',
                '14': '56px',
                '16': '64px',
                '20': '80px',
                '24': '96px',
            },
            borderRadius: {
                'none': '0',
                'xs': 'var(--radius-xs)',
                'sm': 'var(--radius-sm)',
                'md': 'var(--radius-md)',
                'lg': 'var(--radius-lg)',
                'xl': 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                '3xl': 'var(--radius-3xl)',
                'full': 'var(--radius-full)',
            },
            boxShadow: {
                'level-1': 'var(--shadow-level-1)',
                'level-2': 'var(--shadow-level-2)',
                'level-3': 'var(--shadow-level-3)',
                'level-4': 'var(--shadow-level-4)',
                'level-5': 'var(--shadow-level-5)',
                'inner-soft': 'var(--shadow-inner)',
                'glow': 'var(--shadow-glow)',
                'focus': 'var(--shadow-focus)',
                'card': 'var(--shadow-card)',
                'card-hover': 'var(--shadow-card-hover)',
                'modal': 'var(--shadow-modal)',
                'popover': 'var(--shadow-popover)',
                'airy': 'var(--shadow-level-3)',
            },
            transitionDuration: {
                'instant': 'var(--duration-instant)',
                'fast': 'var(--duration-fast)',
                'normal': 'var(--duration-normal)',
                'slow': 'var(--duration-slow)',
                'slower': 'var(--duration-slower)',
            },
            transitionTimingFunction: {
                'out': 'var(--ease-out)',
                'in-out': 'var(--ease-in-out)',
                'spring': 'var(--ease-spring)',
            },
            animation: {
                'fade-in': 'fadeIn var(--duration-normal) var(--ease-out)',
                'fade-in-up': 'fadeInUp var(--duration-slow) var(--ease-out)',
                'fade-in-scale': 'fadeInScale var(--duration-slow) var(--ease-out)',
                'slide-in-right': 'slideInFromRight var(--duration-slow) var(--ease-out)',
                'modal-pop': 'modalPop var(--duration-slower) var(--ease-out)',
                'shimmer': 'shimmer 1.5s infinite',
                'pulse-soft': 'pulse 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'softGlow 4s ease-in-out infinite',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
            },
        }
    },
    plugins: [
        tailwindAnimate,
        containerQuery,
        intersect,
        function ({addUtilities}) {
            addUtilities(
                {
                    '.border-t-solid': {'border-top-style': 'solid'},
                    '.border-r-solid': {'border-right-style': 'solid'},
                    '.border-b-solid': {'border-bottom-style': 'solid'},
                    '.border-l-solid': {'border-left-style': 'solid'},
                    '.border-t-dashed': {'border-top-style': 'dashed'},
                    '.border-r-dashed': {'border-right-style': 'dashed'},
                    '.border-b-dashed': {'border-bottom-style': 'dashed'},
                    '.border-l-dashed': {'border-left-style': 'dashed'},
                    // 标签工具类
                    '.label-xs': {
                        'font-size': 'var(--font-size-xs)',
                        'font-weight': '600',
                        'letter-spacing': 'var(--tracking-widest)',
                        'text-transform': 'uppercase',
                    },
                    '.label-sm': {
                        'font-size': 'var(--font-size-sm)',
                        'font-weight': '600',
                        'letter-spacing': 'var(--tracking-wider)',
                        'text-transform': 'uppercase',
                    },
                },
                ['responsive']
            );
        },
    ],
};
