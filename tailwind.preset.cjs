/**
 * Tailwind CSS Preset for @doderasoftware/restify-ai
 *
 * This preset provides base styles for the AI chatbot components.
 * All styles use CSS custom properties that can be overridden.
 *
 * @example
 * ```js
 * // tailwind.config.js
 * module.exports = {
 *   presets: [
 *     require('@doderasoftware/restify-ai/tailwind')
 *   ],
 *   // ... your config
 * }
 * ```
 *
 * @example CSS Custom Properties (override in your CSS):
 * ```css
 * :root {
 *   --rai-primary: #3b82f6;
 *   --rai-primary-light: rgba(59, 130, 246, 0.1);
 *   --rai-user-bubble: #3b82f6;
 *   --rai-border-color: #e5e7eb;
 *   --rai-text-primary: #111827;
 *   --rai-text-muted: #6b7280;
 * }
 * ```
 */
module.exports = {
    theme: {
        extend: {
            colors: {
                'rai-primary': 'var(--rai-primary, #3b82f6)',
                'rai-primary-light': 'var(--rai-primary-light, rgba(59, 130, 246, 0.1))',
            },
            animation: {
                'rai-bounce': 'rai-bounce 1s infinite',
                'rai-fade-in': 'rai-fade-in 0.3s ease-out',
                'rai-slide-in': 'rai-slide-in 0.3s ease-out',
            },
            keyframes: {
                'rai-bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-25%)' },
                },
                'rai-fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'rai-slide-in': {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}
