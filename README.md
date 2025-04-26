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

## 🧪 Testing

```bash
php artisan test
```

## 📖 Documentation

For detailed information about the technologies used in this project:

- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

We welcome contributions to Aconomy! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to get involved.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
