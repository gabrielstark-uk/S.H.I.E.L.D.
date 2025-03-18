#!/bin/bash

# Exit on error
set -e

echo "Building FrequencyGuard application..."

# Clean and create dist directory
echo "Cleaning dist directory..."
rm -rf dist
mkdir -p dist

# Build client
echo "Building client..."
npm run build

# Build server
echo "Building server..."
npm run build:server

# Start the server
echo "Starting server..."
npm start