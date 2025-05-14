import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <link
          href={process.env.NODE_ENV === 'production' ? `/assets/style.css` : `/src/style.css`}
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
})
