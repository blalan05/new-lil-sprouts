# PWA Setup Guide

Your Lil Sprouts application is now configured as a Progressive Web App (PWA)! 🎉

## What's Been Configured

✅ **Web App Manifest** (`public/manifest.json`)
- App name, description, and display settings
- Icon references
- App shortcuts for quick access

✅ **Service Worker** (`public/service-worker.js`)
- Offline functionality
- Asset caching
- Background sync support (ready for future features)

✅ **Meta Tags** (in `src/entry-server.tsx`)
- Theme color
- Mobile web app capabilities
- Apple iOS support

✅ **Service Worker Registration** (in `src/entry-client.tsx`)
- Automatic registration on page load
- Update detection and refresh handling

## Next Steps

### 1. Generate PWA Icons

You need to create the icon files for your PWA. Here are your options:

#### Option A: Use the Icon Generator Script (Recommended)

1. **Install sharp** (image processing library):
   ```bash
   pnpm add -D sharp
   ```

2. **Create your source icon**:
   - Design a square icon (1024x1024px recommended)
   - Save it as `public/icons/icon-source.png`
   - Make sure it's square and looks good at small sizes

3. **Run the generator**:
   ```bash
   node scripts/generate-pwa-icons.js
   ```

   This will create all required icon sizes automatically.

#### Option B: Use Online Tools

1. Visit [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) or [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload your icon image
3. Download the generated icons
4. Place them in `public/icons/` directory

#### Option C: Create Manually

Create these icon sizes and save them in `public/icons/`:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### 2. Test Your PWA

#### Desktop Testing (Chrome)

1. Build your app: `pnpm build`
2. Start the server: `pnpm start`
3. Open Chrome and navigate to your app
4. Open DevTools (F12) > **Application** tab
5. Check:
   - **Manifest**: Should show your app details and icons
   - **Service Workers**: Should show "activated and running"
   - **Cache Storage**: Should show cached assets

#### Mobile Testing

1. Deploy your app to production (PWA requires HTTPS)
2. On Android (Chrome):
   - Visit your site
   - Tap the menu (3 dots) > "Add to Home screen"
   - The app will appear as an icon on your home screen
3. On iOS (Safari):
   - Visit your site
   - Tap the Share button > "Add to Home Screen"
   - The app will appear as an icon on your home screen

### 3. Verify PWA Features

- ✅ **Installable**: Users can add it to their home screen
- ✅ **Offline**: Basic pages work offline (cached assets)
- ✅ **App-like**: Opens in standalone mode (no browser UI)
- ✅ **Fast**: Assets are cached for faster loading

## PWA Features Explained

### Service Worker Caching Strategy

The service worker uses a **cache-first** strategy for static assets:
- Static pages and assets are cached
- API requests always go to the network
- If offline, cached pages are served

### Offline Functionality

Currently supports:
- ✅ Viewing cached pages offline
- ✅ Basic navigation between cached pages

Future enhancements (ready to implement):
- 📝 Offline form submission queue
- 🔔 Push notifications
- 📱 Background sync

### App Shortcuts

Users can long-press the app icon to see shortcuts:
- Schedule
- Families
- Payments

## Troubleshooting

### Icons Not Showing

1. Check that all icon files exist in `public/icons/`
2. Verify file names match exactly (case-sensitive)
3. Check browser console for 404 errors
4. Clear browser cache and reload

### Service Worker Not Registering

1. Check browser console for errors
2. Ensure you're using HTTPS (required for service workers)
3. Check that `service-worker.js` is accessible at `/service-worker.js`
4. Clear browser cache and reload

### Manifest Not Loading

1. Check DevTools > Application > Manifest
2. Verify `manifest.json` is accessible at `/manifest.json`
3. Check for JSON syntax errors
4. Ensure all referenced icons exist

### Updates Not Showing

The service worker checks for updates every hour. To force an update:
1. Unregister the service worker in DevTools > Application > Service Workers
2. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Or wait for the automatic update check

## Production Checklist

Before deploying to production:

- [ ] All icon files are generated and in `public/icons/`
- [ ] App is served over HTTPS (required for PWA)
- [ ] Test "Add to Home Screen" on Android and iOS
- [ ] Verify service worker is registering correctly
- [ ] Test offline functionality
- [ ] Check manifest in DevTools
- [ ] Update `manifest.json` with your production URL if needed

## Additional Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify all files are in the correct locations
3. Ensure HTTPS is enabled (required for service workers)
4. Test in Chrome DevTools > Application tab

---

**Note**: PWA features require HTTPS in production. Your nginx configuration already includes SSL, so you're all set! 🚀
