# filename: dockerfile


# Base image
FROM node:14

# Define a dedicated user (replace with your desired username)
# USER thien

# Optional: Define a dedicated group
# RUN groupadd -r admin

# Add user to the admin group
# RUN usermod -a -G admin thien

# Set the working directory
WORKDIR /playwright

# Install Playwright and dependencies
RUN npm install playwright

# Download browsers compatible with the installed Playwright version
RUN npx playwright install

# Install additional dependencies
RUN apt-get update && \
    apt-get install -y \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libdrm2 \
    libxkbcommon0 \
    libasound2

# Set ownership and permissions (using default user/group)
# RUN chown -R thien:thien /root/.cache/ms-playwright

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . playwright/

# Set the entry point for the container
CMD ["tail", "-f", "/dev/null"]