<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\ItemGroupSyncService;
use Illuminate\Console\Command;

class RebuildSearchIndexCommand extends Command
{
    protected $signature = 'search:rebuild {--skip-backfill : Skip syncing group_item pivots from approved memberships}';

    protected $description = 'Backfill item–group links, sync Meilisearch index settings, and reimport searchable models';

    public function handle(ItemGroupSyncService $itemGroupSync): int
    {
        if (! $this->option('skip-backfill')) {
            $this->info('Backfilling item–group memberships from approved groups…');

            $userCount = User::query()->count();
            $bar = $this->output->createProgressBar($userCount);
            $bar->start();

            User::query()->each(function (User $user) use ($itemGroupSync, $bar) {
                $itemGroupSync->syncUserItemsToApprovedGroups($user);
                $bar->advance();
            });

            $bar->finish();
            $this->newLine();
        }

        $this->info('Syncing Meilisearch index settings…');
        $this->call('scout:sync-index-settings');

        $this->info('Importing items into the search index…');
        $this->call('scout:import', ['model' => 'App\Models\Item']);

        $this->info('Importing groups into the search index…');
        $this->call('scout:import', ['model' => 'App\Models\Group']);

        $this->info('Search index rebuild complete.');

        return self::SUCCESS;
    }
}
