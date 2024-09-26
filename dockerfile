# Use the Playwright base image
FROM mcr.microsoft.com/playwright:v1.44.1-jammy

# Install Mountebank
RUN npm install -g mountebank@2.7.1

# Set the working directory
WORKDIR /workspace/test_playwright_cucumber

# Copy the project files to the Docker container
COPY . .

# Install project dependencies
RUN npm install @dotenvx/dotenvx \
    && npm install @playwright/test@1.44.1 \
    && npm install

# Expose Mountebank default port
EXPOSE 2525
