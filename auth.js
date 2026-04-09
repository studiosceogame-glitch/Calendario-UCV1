const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, serve a page that will check auth and redirect
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirigiendo...</title>
        <script>
          // Check authentication and redirect
          fetch('/auth/me')
            .then(response => response.json())
            .then(user => {
              if (user.error) {
                window.location.href = '/';
              } else {
                window.location.href = '/dashboard';
              }
            })
            .catch(() => {
              window.location.href = '/';
            });
        </script>
      </head>
      <body>
        <p>Autenticando...</p>
      </body>
      </html>
    `);
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.redirect('/');
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

module.exports = router;