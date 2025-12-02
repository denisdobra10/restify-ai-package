/**
 * Restify AI Tailwind CSS Configuration
 * 
 * This package uses Tailwind CSS and expects your project to have:
 * 1. A `primary` color defined in your Tailwind theme
 * 2. Dark mode support via the `dark` class
 * 
 * Example in your tailwind.config.js:
 * 
 * module.exports = {
 *   darkMode: 'class',
 *   theme: {
 *     extend: {
 *       colors: {
 *         primary: {
 *           DEFAULT: '#3b82f6', // or your brand color
 *           50: '#eff6ff',
 *           100: '#dbeafe',
 *           // ... etc
 *         }
 *       }
 *     }
 *   },
 *   // Add this package's components to content
 *   content: [
 *     './src/**\/*.{vue,js,ts}',
 *     './node_modules/@doderasoftware/restify-ai/**\/*.{vue,js,ts}'
 *   ]
 * }
 * 
 * If you use DaisyUI, the primary color is already defined.
 */

// This is a preset that consumers can optionally extend
module.exports = {
  theme: {
    extend: {
      // Default fallback colors if user doesn't define primary
      colors: {
        // These are fallbacks - user's theme will override
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
