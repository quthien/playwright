# Use Playwright base image
FROM mcr.microsoft.com/playwright:v1.47.2-jammy

# Expose the port for remote debugging (optional if you need it)
EXPOSE 9222

# Run Playwright's Chromium in remote server mode
CMD ["npx", "playwright", "run-server", "--port", "9222"]
