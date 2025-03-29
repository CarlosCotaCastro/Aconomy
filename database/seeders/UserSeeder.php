<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
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
                'email' => 'alice@example.com',
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob@example.com',
            ],
            [
                'name' => 'Carol Davis',
                'email' => 'carol@example.com',
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david@example.com',
            ],
            [
                'name' => 'Eva Brown',
                'email' => 'eva@example.com',
            ],
        ];
        
        foreach ($additionalUsers as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);
        }
    }
} 