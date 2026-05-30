<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class GroupImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Map group names to dummy images shipped in the seeder directory.
        $groupImages = [
            'Tech Enthusiasts' => 'tech',
            'Book Club' => 'book',
            'Sports Equipment' => 'sports',
        ];

        $sourceDir = __DIR__.'/images/groups';

        foreach ($groupImages as $groupName => $imageKey) {
            $group = Group::where('name', $groupName)->first();

            if (! $group) {
                continue;
            }

            $bannerSource = $sourceDir."/{$imageKey}_banner.png";
            $avatarSource = $sourceDir."/{$imageKey}_avatar.png";

            if (is_file($bannerSource)) {
                $bannerFilename = 'group_banners/'.$group->id.'_banner.png';
                Storage::disk('public')->put($bannerFilename, file_get_contents($bannerSource));
                $group->banner_image_path = $bannerFilename;
            }

            if (is_file($avatarSource)) {
                $avatarFilename = 'group_avatars/'.$group->id.'_avatar.png';
                Storage::disk('public')->put($avatarFilename, file_get_contents($avatarSource));
                $group->avatar_image_path = $avatarFilename;
            }

            $group->save();
            $this->command->info("Added images for group: {$group->name}");
        }
    }
}
