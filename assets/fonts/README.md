# Fonts

This folder now contains the bundled font files used by the Mini App:

- `Vazirmatn-Regular.ttf`
- `Vazirmatn-Bold.ttf`

`css/main.css` loads these files via internal Mini App paths, so the Mini App
no longer depends on files outside `miniapp/`.

When a real **IRANSans** file becomes available, the simplest low-risk
option is to drop it here (for example `IRANSans.woff2` and
`IRANSans-Bold.woff2`) and add a matching `@font-face` block in
`css/main.css`, then reference it from the `--font-latin` variable instead
of `Vazirmatn`. No other file needs to change.
