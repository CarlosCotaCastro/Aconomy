<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Group;
use App\Models\Item;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure test users exist
        $testUser = User::where('email', 'test@example.com')->first();
        if (!$testUser) {
            $testUser = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => Hash::make('password'),
            ]);
        }
        
        $carolUser = User::where('email', 'carol@example.com')->first();
        if (!$carolUser) {
            $carolUser = User::create([
                'name' => 'Carol',
                'email' => 'carol@example.com',
                'password' => Hash::make('password'),
            ]);
        }
        
        // Create a group for testing
        $group = Group::create([
            'name' => 'Test Sharing Group',
            'description' => 'A group for testing item sharing and searching',
        ]);
        
        // Add users to the group
        $group->users()->attach($testUser->id, ['approved' => true]);
        $group->users()->attach($carolUser->id, ['approved' => true]);
        
        // Create items for Test User
        $testUserItems = [
            [
                'name' => 'Mountain Bike',
                'description' => 'A 21-speed mountain bike, great for trails',
            ],
            [
                'name' => 'Camping Tent',
                'description' => '4-person tent, waterproof',
            ],
            [
                'name' => 'Gardening Tools',
                'description' => 'Set includes shovel, rake, and garden gloves',
            ],
            [
                'name' => 'Drill',
                'description' => 'Electric power drill with battery',
            ],
        ];
        
        foreach ($testUserItems as $itemData) {
            $item = new Item($itemData);
            $item->user_id = $testUser->id;
            $item->group_id = $group->id;
            $item->save();
        }
        
        // Create items for Carol
        $carolUserItems = [
            [
                'name' => 'Skateboard',
                'description' => 'Professional skateboard in excellent condition',
            ],
            [
                'name' => 'Tennis Racket',
                'description' => 'Lightly used tennis racket with case',
            ],
            [
                'name' => 'Sewing Machine',
                'description' => 'Portable sewing machine with various stitch options',
            ],
            [
                'name' => 'Projector',
                'description' => 'HD projector for movies or presentations',
            ],
            [
                'name' => 'Camping Stove',
                'description' => 'Portable gas stove for camping trips',
            ],
        ];
        
        foreach ($carolUserItems as $itemData) {
            $item = new Item($itemData);
            $item->user_id = $carolUser->id;
            $item->group_id = $group->id;
            $item->save();
        }
        
        $this->command->info('Test data has been seeded successfully!');
    }
}
