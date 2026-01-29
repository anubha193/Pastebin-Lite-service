# Pastebin Lite (Express)

## Description
A minimal Pastebin-like service built with Node.js and Express.

## Run Locally
npm install
npm run start

## Persistence
Uses Redis to persist pastes across requests and deployments.

## Design Notes
- Atomic view count handling
- Deterministic time support via TEST_MODE
- Safe HTML rendering
