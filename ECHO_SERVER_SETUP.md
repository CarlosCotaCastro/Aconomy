# Laravel Reverb (WebSockets)

This application uses [Laravel Reverb](https://reverb.laravel.com) for real-time messaging and notifications. Reverb replaces the legacy `laravel-echo-server` + Socket.IO stack.

## Requirements

- `BROADCAST_CONNECTION=reverb` in `.env`
- Reverb app credentials (`REVERB_APP_*`) and Vite vars (`VITE_REVERB_*`)
- Reverb server running on port **8080** (default)

## Start with Sail

```bash
./vendor/bin/sail up -d
```

The `reverb` service in `docker-compose.yml` runs:

```bash
php artisan reverb:start --host=0.0.0.0 --port=8080
```

## Start frontend assets

```bash
./vendor/bin/sail npm run dev
```

## Verify

1. Browser console: `Reverb WebSocket connected`
2. Open a chat in two browsers — messages appear without refresh
3. `POST /broadcasting/auth` returns **200** when subscribing to a conversation

## Environment (Sail)

PHP broadcasts events to Reverb over HTTP from the `laravel.test` container. The browser connects over WebSockets from your machine. Use **two hosts**:

```env
REVERB_HOST=reverb          # server → Reverb container on the Sail network
VITE_REVERB_HOST=localhost  # browser → published port on your machine
```

Do not set both to `localhost` in Sail — Laravel will hit `localhost:8080` inside its own container and fail with `cURL error 7`.

After changing `VITE_REVERB_*`, restart Vite: `./vendor/bin/sail npm run dev`.

## Troubleshooting

- **`cURL error 7` / Failed to connect to localhost:8080 when posting**: set `REVERB_HOST=reverb` (not `localhost`) while keeping `VITE_REVERB_HOST=localhost`
- **Connection refused on port 8080**: `./vendor/bin/sail ps` — ensure `reverb` container is up
- **403 on `/broadcasting/auth`**: hard refresh; CSRF is synced via `CsrfTokenSync`
- **Events not received**: confirm `BROADCAST_CONNECTION=reverb` (not `redis` alone)

## Local URLs

| Service | URL |
|---------|-----|
| App | `http://localhost` |
| Reverb WebSocket | `ws://localhost:8080` |
