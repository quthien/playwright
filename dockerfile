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