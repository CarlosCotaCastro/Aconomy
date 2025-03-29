<?php

namespace App\Console\Commands;

use App\Models\Group;
use App\Models\User;
use App\Notifications\GroupJoinRequestNotification;
use Illuminate\Console\Command;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test sending a notification email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User with email $email not found!");
            return Command::FAILURE;
        }
        
        $this->info("Found user: {$user->name} with ID {$user->id}");
        
        // Create a test group if it doesn't exist
        $group = Group::firstOrCreate(
            ['name' => 'Test Group'],
            ['description' => 'A test group for notification testing']
        );
        
        $this->info("Using group: {$group->name} with ID {$group->id}");
        
        // Create a test requester
        $requester = User::where('email', '!=', $email)->first();
        $this->info("Using requester: {$requester->name} with ID {$requester->id}");
        
        // Ensure users are in the group and requester is approved
        if (!$group->users()->where('user_id', $user->id)->exists()) {
            $group->users()->attach($user->id, ['approved' => true]);
            $this->info("Added {$user->name} to the group as approved member");
        }
        
        // Send test notification
        try {
            $this->info("Sending notification to {$user->email}...");
            $user->notify(new GroupJoinRequestNotification($group, $requester));
            $this->info("Notification sent successfully!");
            
            // Also check Mailpit URL
            $this->info("Check Mailpit at http://localhost:8025 to see if the email was received.");
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Error sending notification: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
