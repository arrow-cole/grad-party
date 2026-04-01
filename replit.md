# Graduation Invite

A digital graduation party invitation web app for Aaron, built with React and Tailwind CSS.

## Tech Stack

- **Frontend:** React 18 (Create React App)
- **Styling:** Tailwind CSS 3
- **RSVP:** Formspree integration
- **Notifications:** SweetAlert2

## Project Structure

```
src/
  components/
    Navbar.js       - Navigation bar
    Home.js         - Main invitation content
    RSVPForm.js     - RSVP form (submits to Formspree)
    Location.js     - Event location/map
    Donate.js       - Donation section
    Footer.js       - Footer
    Facebook.js     - Social media links
  images/           - Static image assets
  App.js            - Main component tree
  index.js          - React entry point
public/             - Static assets (index.html, icons)
build/              - Production build output
```

## Running Locally

The app runs on port 5000 via the "Start application" workflow:

```
PORT=5000 HOST=0.0.0.0 DANGEROUSLY_DISABLE_HOST_CHECK=true npm start
```

## Deployment

Configured as a static site deployment:
- Build command: `npm run build`
- Public directory: `build`
