# #!/bin/bash

# # Exit immediately if a command exits with a non-zero status
# set -e

# echo "Reset on the origin/main..."
# git fetch
# git reset --hard origin/main

# echo "Installing Node Version Manager (nvm)..."

# # Install nvm (Node Version Manager) if not already installed
# if ! command -v nvm &> /dev/null; then
#     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
#     echo "Loading nvm into the current session..."
    
#     # Load nvm into the script (for non-login shells)
#     export NVM_DIR="$HOME/.nvm"
#     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# fi

# # Ensure nvm is available after installation
# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# # Install Node.js using nvm
# NODE_VERSION=22
# echo "Installing Node.js version $NODE_VERSION..."
# nvm install $NODE_VERSION

# # Navigate to the React app directory
# echo "Navigating to the React app directory..."
# cd React/app

# # Install npm dependencies
# echo "Installing npm dependencies..."
# npm install

# # Run the React development server
# echo "Starting the React development server..."
# npm run dev --host


#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Set environment variables
NODE_VERSION=22
APP_DIR="$HOME/SetLover/React/app"
BUILD_DIR="$APP_DIR/dist"

# Log message function
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

log "Resetting the repository to origin/main..."
git fetch origin main
git reset --hard origin/main

log "Loading nvm into the current session..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

log "Installing Node.js version $NODE_VERSION..."
nvm install $NODE_VERSION
nvm use $NODE_VERSION

log "Navigating to the React app directory..."
cd "$APP_DIR"

log "Installing npm dependencies..."
npm install 

log "Building the React app for production..."
npm run build

log "Deployment completed. Static files are located in $BUILD_DIR"
