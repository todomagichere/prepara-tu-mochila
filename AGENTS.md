# Project instructions

- Whenever a served CSS or JavaScript asset changes, update its version query string in `index.html` (for example, `assets/styles.css?v=...`) in the same change. This ensures browsers load the new production asset instead of a cached version.
