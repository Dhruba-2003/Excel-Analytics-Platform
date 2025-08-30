# Fix Case Sensitivity Issues for Netlify Build

## Steps to Complete:
- [x] Identify case sensitivity issues in import statements
- [x] Fix DashboardPage import to match Dashboardpage.jsx
- [x] Fix LoginPage import to match Loginpage.jsx
- [x] Fix RegisterPage import to match Registerpage.jsx
- [x] Verify build works locally
- [ ] Test Netlify deployment

## Files to Edit:
- [x] client/src/App.jsx

## Issue Details:
- Netlify build fails due to case sensitivity (Linux vs Windows)
- Import statements don't match actual file names
- Error: "Could not resolve "./pages/DashboardPage" from "src/App.jsx"

## Changes Made:
- Updated imports to use lowercase paths for files with lowercase names:
  - `./pages/dashboardpage` instead of `./pages/DashboardPage`
  - `./pages/loginpage` instead of `./pages/LoginPage`
  - `./pages/registerpage` instead of `./pages/RegisterPage`
- Updated component variable names to match:
  - `Dashboardpage` instead of `DashboardPage`
  - `Loginpage` instead of `LoginPage`
  - `Registerpage` instead of `RegisterPage`

## Result:
- ✅ Local build now succeeds (no more case sensitivity errors)
- ✅ Ready for Netlify deployment
