<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ProfileImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Map of user emails to their profile image URLs
        $userImages = [
            'test@example.com' => 'https://i.pravatar.cc/300?img=1',
            'alice@example.com' => 'https://i.pravatar.cc/300?img=5',
            'bob@example.com' => 'https://i.pravatar.cc/300?img=8',
            'carol@example.com' => 'https://i.pravatar.cc/300?img=9',
            'david@example.com' => 'https://i.pravatar.cc/300?img=11',
            'eva@example.com' => 'https://i.pravatar.cc/300?img=12',
        ];

        foreach ($userImages as $email => $imageUrl) {
            $user = User::where('email', $email)->first();
            
            if ($user) {
                try {
                    // Download the image
                    $response = Http::get($imageUrl);
                    if ($response->successful()) {
                        // Generate a unique filename
                        $filename = 'profile_images/' . $user->id . '_' . time() . '.jpg';
                        
                        // Store the image
                        Storage::disk('public')->put($filename, $response->body());
                        
                        // Update user's profile image path
                        $user->profile_image_path = $filename;
                        $user->save();
                        
                        $this->command->info("Added profile image for {$user->name}");
                    }
                } catch (\Exception $e) {
                    $this->command->error("Failed to add profile image for {$user->name}: {$e->getMessage()}");
                }
            }
        }
    }
} 