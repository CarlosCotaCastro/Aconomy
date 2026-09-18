# Aconomy

*Alternative/Anarchist Economy for Sharing Resources*

## 🌱 About

Aconomy (from "alternative/anarchist economy") is a platform that enables friends to share everyday items with each other at no cost. The project aims to create networks of mutual aid where people can borrow rather than buy, reducing consumption while increasing access to resources.

## 💡 Core Features

- **Group Creation**: Form sharing circles with friends and community members
- **Item Lending Management**: Keep track of who borrowed what and when
- **Resource Discovery**: Find items available to borrow within your network
- **Notification System**: Receive reminders about borrowed and lent items
- **User Profiles**: Build trust through borrowing history and item care

## 🎯 Purpose

Aconomy was created with a clear vision: to help more people enjoy a better quality of life without spending money. By facilitating the sharing of resources among trusted circles, we:

- Reduce unnecessary consumption and waste
- Strengthen community bonds through mutual aid
- Provide access to items that might otherwise be unaffordable
- Create alternatives to traditional economic systems

## 🛠️ Technical Information

Aconomy is built with modern web technologies:

- **Backend**: [Laravel 12](https://laravel.com/docs/12.x) - PHP Framework
- **Frontend**: [React](https://react.dev/) via [Inertia.js](https://inertiajs.com/)
- **Authentication**: Laravel Sanctum
- **Database**: MySQL/PostgreSQL
- **API**: RESTful API using Laravel resources

## 📋 Prerequisites

- PHP 8.2+
- Composer
- Node.js & NPM
- MySQL or PostgreSQL
- Git

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/username/aconomy.git
cd aconomy
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install JavaScript dependencies:
```bash
npm install
```

4. Copy the environment file and configure your database:
```bash
cp .env.example .env
```

5. Generate an application key:
```bash
php artisan key:generate
```

6. Run database migrations:
```bash
php artisan migrate
```

7. Build assets:
```bash
npm run dev
```

8. Start the development server:
```bash
php artisan serve
```

> **Note:** This project ships with [Laravel Sail](https://laravel.com/docs/12.x/sail). If you develop inside the Docker environment, start the stack with `./vendor/bin/sail up -d` and prefix the commands below with `./vendor/bin/sail` (e.g. `./vendor/bin/sail artisan scout:import ...`). The `mysql`, `redis`, `meilisearch`, and `reverb` services are all defined in `docker-compose.yml`.

## 🔍 Search Indexing (Meilisearch)

Search is powered by [Laravel Scout](https://laravel.com/docs/12.x/scout) with the [Meilisearch](https://www.meilisearch.com/) driver. The `Item` and `Group` models are searchable.

1. Make sure the Meilisearch service is running. With Sail it starts automatically (`./vendor/bin/sail up -d`); otherwise run your own Meilisearch instance.

2. Configure Scout to use Meilisearch in your `.env`:
```bash
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
# Set this if your Meilisearch instance requires a key
MEILISEARCH_KEY=
```

3. Import (index) existing records into Meilisearch:
```bash
php artisan scout:import "App\Models\Item"
php artisan scout:import "App\Models\Group"
```

New, updated, and deleted records are synced to the index automatically. Item visibility in groups is kept in sync when members are approved, leave a group, or create items/groups.

**After resetting Meilisearch** (empty volume or `scout:flush`), run the full rebuild (backfills `group_item` pivots, syncs index settings, and reimports):

```bash
./vendor/bin/sail artisan search:rebuild
```

Use `--skip-backfill` if database pivots are already correct and you only need to reimport indexes:

```bash
./vendor/bin/sail artisan search:rebuild --skip-backfill
```

To wipe and rebuild manually: `php artisan scout:flush "App\Models\Item"` followed by `search:rebuild` or `scout:import`.

## 🔌 Realtime / WebSocket Server

Realtime notifications and messaging use [Laravel Echo](https://laravel.com/docs/12.x/broadcasting) with [Laravel Reverb](https://reverb.laravel.com) (Pusher protocol) on port `8080`.

1. Configure broadcasting in your `.env` (Reverb keys are added by `php artisan reverb:install`):
```bash
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=...
REVERB_APP_KEY=...
REVERB_APP_SECRET=...
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

2. Start the WebSocket server.

   - **With Sail / Docker:** the `reverb` service starts automatically with `./vendor/bin/sail up -d`.
   - **Locally:** run:
```bash
npm run reverb
```

3. Rebuild frontend assets after changing `VITE_REVERB_*` variables:
```bash
npm run dev
```

The client connects via `resources/js/bootstrap.js`. See `ECHO_SERVER_SETUP.md` for troubleshooting tips.

## 🧪 Testing

```bash
php artisan test
```

## 📖 Documentation

For detailed information about the technologies used in this project:

- [Laravel 13 Documentation](https://laravel.com/docs/13.x)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

We welcome contributions to Aconomy! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to get involved.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
