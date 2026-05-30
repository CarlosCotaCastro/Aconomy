<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProfileImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Map of user emails to dummy avatars shipped in the seeder directory.
        $userImages = [
            'test@example.com' => 'test',
            'alice@example.com' => 'alice',
            'bob@example.com' => 'bob',
            'carol@example.com' => 'carol',
            'david@example.com' => 'david',
            'eva@example.com' => 'eva',
        ];

        $sourceDir = __DIR__.'/images/profiles';

        foreach ($userImages as $email => $imageKey) {
            $user = User::where('email', $email)->first();

            if (! $user) {
                continue;
            }

            $source = $sourceDir."/{$imageKey}.png";

            if (! is_file($source)) {
                continue;
            }

            $filename = 'profile_images/'.$user->id.'.png';
            Storage::disk('public')->put($filename, file_get_contents($source));

            $user->profile_image_path = $filename;
            $user->save();

            $this->command->info("Added profile image for {$user->name}");
        }
    }
}
