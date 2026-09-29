# PWA Icons

This directory contains the Progressive Web App (PWA) icons for Lil Sprouts.

## Required Icons

The following icon sizes are required for the PWA:

- `icon-72x72.png` - Android Chrome
- `icon-96x96.png` - Android Chrome
- `icon-128x128.png` - Android Chrome
- `icon-144x144.png` - Android Chrome
- `icon-152x152.png` - iOS Safari
- `icon-192x192.png` - Android Chrome (home screen)
- `icon-384x384.png` - Android Chrome (splash screen)
- `icon-512x512.png` - Android Chrome (splash screen)

## Generating Icons

### Option 1: Using the Script (Recommended)

1. **Install sharp** (if not already installed):
   ```bash
   pnpm add -D sharp
   ```

2. **Create a source icon**:
   - Create a square icon image (1024x1024px recommended)
   - Save it as `icon-source.png` in this directory (`public/icons/icon-source.png`)
   - The icon should be square and have a transparent or solid background

3. **Run the generation script**:
   ```bash
   node scripts/generate-pwa-icons.js
   ```

### Option 2: Manual Creation

You can use any image editing tool (Photoshop, GIMP, Figma, etc.) to create the icons:

1. Start with a 1024x1024px square image
2. Export/resize to each required size
3. Save each as `icon-{size}x{size}.png` in this directory

### Option 3: Online Tools

You can use online PWA icon generators:

- **PWA Asset Generator**: https://github.com/onderceylan/pwa-asset-generator
- **RealFaviconGenerator**: https://realfavicongenerator.net/
- **Favicon.io**: https://favicon.io/

## Icon Design Guidelines

- **Size**: Square (1:1 aspect ratio)
- **Format**: PNG with transparency or solid background
- **Style**: Should work well at small sizes (72px) and large sizes (512px)
- **Colors**: Should match your app's theme color (#2d3748)
- **Content**: Should be recognizable even at small sizes

## Testing

After generating icons:

1. Build your application: `pnpm build`
2. Start the server: `pnpm start`
3. Open Chrome DevTools > Application > Manifest
4. Verify all icons are listed and loading correctly
5. Test "Add to Home Screen" on mobile devices

## Notes

- The `icon-source.png` file is not required for production - it's only used to generate the other icons
- You can add `icon-source.png` to `.gitignore` if you don't want to commit it
- The icons are referenced in `public/manifest.json`
