export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-prefixer': {
      prefix: 'hp-',
      /**
       * Tailwind utilities get the hp- prefix for micro-frontend isolation,
       * exactly as SZHP-micro-ui does.
       *
       * The design-system classes must be left alone. In the real app that CSS
       * is served by the host shell, but standalone the @aegov plugin emits it
       * into this same pipeline, so without these the stylesheet would say
       * .hp-aegov-form-control while the markup says .aegov-form-control.
       *
       * Patterns are matched against the stringified selector node, which
       * includes the leading dot - hence the \. in each one.
       */
      ignore: [
        /Mui/,
        /ant/,
        /ccs/,
        /^\.aegov/,
        /^\.btn-/,
        /^\.control-/,
        /^\.form-control/,
        /^\.error-message$/,
        /^\.input-/,
        /^\.with-seperator$/,
      ],
    },
  },
};
