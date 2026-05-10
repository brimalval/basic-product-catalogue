# Theming Guide

All visual design tokens live in one file:

```
apps/frontend/src/styles/theme.css
```

Editing this file is the only change needed to retheme the entire site. No component files need to be touched.

## How the tokens work

Tokens are CSS custom properties in HSL format, **without** the `hsl()` wrapper — this is a Tailwind/shadcn convention that lets opacity modifiers like `bg-primary/50` work correctly.

```css
/* Format: <hue> <saturation>% <lightness>% */
--primary: 222.2 47.4% 11.2%;
```

To find HSL values for a hex color: https://www.cssportal.com/hex-to-hsl/

## Token reference

| Token | Controls |
|-------|----------|
| `--background` | Page background |
| `--foreground` | Default text color |
| `--card` / `--card-foreground` | Card surface + text |
| `--popover` / `--popover-foreground` | Dropdown/tooltip surface + text |
| `--primary` / `--primary-foreground` | Primary buttons, active states |
| `--secondary` / `--secondary-foreground` | Secondary buttons, tags |
| `--muted` / `--muted-foreground` | Subtle backgrounds, placeholder text |
| `--accent` / `--accent-foreground` | Hover highlights |
| `--destructive` / `--destructive-foreground` | Error/delete actions |
| `--border` | All borders |
| `--input` | Input field borders |
| `--ring` | Focus ring color |
| `--radius` | Border radius for all components |

## Quick swap examples

### Blue-tinted brand
```css
:root {
  --primary: 217 91% 40%;
  --primary-foreground: 0 0% 100%;
  --ring: 217 91% 40%;
}
```

### Warm earthy brand
```css
:root {
  --primary: 25 80% 35%;
  --primary-foreground: 0 0% 100%;
  --accent: 30 60% 92%;
  --accent-foreground: 25 80% 25%;
  --ring: 25 80% 35%;
}
```

### Rounder UI
```css
:root {
  --radius: 1rem;
}
```

### Sharp/flat UI
```css
:root {
  --radius: 0rem;
}
```

## Dark mode

The `.dark` block in `theme.css` controls dark mode tokens. The site does not currently toggle dark mode at runtime — to enable it, add a class toggle on `<html>` using a theme switcher component and apply `class="dark"`.

## Using shadcn palette presets

shadcn ships a set of pre-built palettes (zinc, slate, stone, rose, orange, etc.) at:
https://ui.shadcn.com/themes

To use one: copy the `:root` and `.dark` blocks from the Themes page and paste them into `theme.css`, replacing the existing blocks.
