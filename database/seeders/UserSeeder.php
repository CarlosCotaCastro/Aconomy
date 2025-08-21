<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create main test user
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create additional test users
        $additionalUsers = [
            [
                'name' => 'Alice Smith',
                'email' => 'a@a.de',
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'b@a.de',
            ],
            [
                'name' => 'Carol Davis',
                'email' => 'c@a.de',
            ],
            [
                'name' => 'David Wilson',
                'email' => 'd@a.de',
            ],
            [
                'name' => 'Eva Brown',
                'email' => 'e@a.de',
            ],
        ];

        foreach ($additionalUsers as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('a'),
                'email_verified_at' => now(),
            ]);
        }
    }
}
