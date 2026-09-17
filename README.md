# ProjectOff / Connector

A user-hosted content discovery and peer-to-peer sharing project.

## Current live slice

This branch contains a deployable Cloudflare Worker MVP with:

- Connector landing/explore UI
- local browser node identity
- content metadata publishing
- category/search discovery
- peer-reference workflow
- zero media storage in the directory layer

The current slice deliberately does **not** claim durable browser hosting or full WebRTC streaming. Those are the next transport milestones.

## Architecture

```text
CONNECTOR
   |
   +-- Discovery
   +-- Identity
   |
   +-- P2P Core
         |
         +-- Browser Node
         +-- Desktop Node
         +-- Server Node
               |
               +-- Video / Audio / Files
               +-- Streaming / Download
               +-- Multi-peer swarm
               +-- Self-hosted nodes
```

## Deploy

### Cloudflare Workers

1. Install Node.js 20+.
2. Install dependencies: `npm install`
3. Authenticate Wrangler: `npx wrangler login`
4. Deploy: `npm run deploy`

The repository is configured by `wrangler.toml` and serves the application from `src/worker.js`.

## Important product rule

The Connector directory stores metadata, not user media. A future node implementation will expose content through authenticated peer-to-peer transport. Direct WebRTC is preferred; signaling and connectivity assistance must never be confused with media storage.

## Next milestones

1. Replace in-memory metadata with durable D1 storage.
2. Add signed node identities and capability handshake.
3. Add WebRTC signaling + STUN/TURN fallback.
4. Add chunk protocol with checksums, resume and concurrent transfers.
5. Add browser streaming using MediaSource/ReadableStream where supported.
6. Add desktop/server node with persistent storage and automatic seeding.
7. Add multi-peer swarm and availability tracking.
8. Add abuse reports, takedown workflow, rate limits and content policy.
9. Add self-host package with Docker Compose.
10. Add end-to-end tests for discovery, handshake, transfer, resume and playback.

## Prototype reference

The original browser-to-browser prototype used PeerJS, a short connection code, chunked transfer and browser download. It is retained as the conceptual transport starting point while the production architecture is built in layers.
