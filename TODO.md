# Netlify Build Fix - Import Path Casing Issue

## Issue
Netlify build was failing with error: "Could not resolve "./pages/DashboardPage" from "src/App.jsx""

## Root Cause
The import statements in `client/src/App.jsx` were using incorrect casing for some page filenames. While Windows (development environment) has case-insensitive file systems, Netlify runs on Linux which has case-sensitive file systems.

## Files Fixed
- `client/src/App.jsx` - Updated import paths to match actual filenames:
  - `./pages/DashboardPage` → `./pages/dashboardpage`
  - `./pages/LoginPage` → `./pages/loginpage`
  - `./pages/RegisterPage` → `./pages/registerpage`
  - `./pages/UserEditPage` → `./pages/userEditpage`

## Next Steps
- [x] Test the build locally with `npm run build` in the client directory - ✅ PASSED
- [ ] Push changes to repository
- [ ] Trigger new Netlify deployment
- [ ] Verify the build succeeds on Netlify

## Notes
Other page imports (AdminPage, HistoryPage, ProfilePage) were already correct and didn't need changes.
