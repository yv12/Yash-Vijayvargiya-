# Yash Vijayvargiya, personal site

One page, fourteen chapters, told as a continuous story rather than a resume.
Built from `Yash_Vijayvargiya_Website_Build_Brief.docx`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview  # serve the built output
```

No backend. `dist/` is a plain static folder, so Vercel, Netlify, Cloudflare
Pages or Railway static all work. Build command `npm run build`, output
directory `dist`.

## Where the words live

Everything you read on the page comes from `src/content.ts`. Chapters render
that file, nothing is hardcoded in JSX. To change copy, change that file.

Fields still marked `TODO(yash)`:

- `contact.email`
- `contact.github`
- `contact.resumeUrl`
- `artifacts[].image`, once real screenshots are dropped into `public/shots/`

Empty fields render nothing rather than a placeholder, so the site is safe to
deploy with them still blank.

## Structure

```
src/
  content.ts          all copy and data
  ui.tsx              chapter shell, nav rail, draw on entry helper
  chapters/Story.tsx  chapters 01 to 06
  chapters/Work.tsx   chapters 07 to 11, including the swipe demo
  chapters/Close.tsx  chapters 12 to 14
  styles.css          tokens, type, motion
```

## Design rules in force

- Greyscale paper and ink. `signal` blue appears only on things you can touch,
  and on the one data mark that carries the point. `flag` red appears once, on
  a rejected model.
- One idea per chapter. Body text capped at 62 characters per line.
- The only motion that is not triggered by a person is the diagrams drawing
  themselves once, on first entry. Text never animates in.
- Everything works with `prefers-reduced-motion: reduce`. No hover only
  information: the rail labels also appear on keyboard focus.

## Before publishing

- Add the real email, GitHub and resume link in `src/content.ts`.
- Replace `https://example.com/` in `public/sitemap.xml` with the real domain.
- Add project screenshots to `public/shots/` and reference them from
  `artifacts[].image`.
