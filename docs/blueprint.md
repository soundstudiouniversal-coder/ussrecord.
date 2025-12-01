# **App Name**: Universal Sound Studio

## Core Features:

- Demo Submission: Allow artists to submit their demos with options for file upload or SoundCloud link. Submission metadata like artist name, message, and submission timestamp are stored in Firestore.
- Contact Form: Enable users to send messages to the studio, with the contact information and message details being stored in Firestore.
- Artist Roster: Display a list of artists with their images and external links (e.g., Spotify, YouTube). Admin users can add or delete artists, with the artist data stored in Firestore.
- Releases Discography: Showcase a discography of releases, including cover art and streaming links. Admin users can add or delete releases, with the release data stored in Firestore.
- Mode Toggle: Allow users to switch between light and dark modes for enhanced UI accessibility and visual appeal. User preference will be stored in local storage to remember and persist the theme.
- Aggressive Page Transition: Provide very exciting UI transition animations when a user goes to different pages of the app, enhancing user engagement.

## Style Guidelines:

- Primary color: White (#FFFFFF) for text and accents in dark mode, Black (#000000) for text and accents in light mode, dynamically switched.
- Background color: Black (#000000) in dark mode, light gray (#f0f0f0) in light mode, dynamically switched to provide contrast.
- Font: 'Space Mono', a monospace font that provides a modern look and feel for headlines and body text.
- Simple icons that are easy to recognize, filled with white when in dark mode and filled with black when in light mode.
- Implement subtle text glow on hover for interactive elements, plus the use of dynamic star field and meteoroid streak backgrounds.
- The content width is limited to 5xl (1024px), and centered using auto margin. Header/footer should use 100% of the screen width.