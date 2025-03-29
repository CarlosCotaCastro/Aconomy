<?php

namespace App\Notifications;

use App\Models\Group;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class GroupJoinRequestNotification extends Notification
{
    use Queueable;

    protected $group;
    protected $requester;

    /**
     * Create a new notification instance.
     */
    public function __construct(Group $group, User $requester)
    {
        $this->group = $group;
        $this->requester = $requester;
        
        // Add debug info
        Log::info('GroupJoinRequestNotification created', [
            'group_id' => $group->id,
            'group_name' => $group->name,
            'requester_id' => $requester->id,
            'requester_name' => $requester->name,
        ]);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        Log::info('GroupJoinRequestNotification via method called', [
            'notifiable' => $notifiable->email,
        ]);
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $approveUrl = url("/groups/{$this->group->id}/users/{$this->requester->id}/approve");
        
        Log::info('GroupJoinRequestNotification toMail method called', [
            'notifiable' => $notifiable->email,
            'approve_url' => $approveUrl,
        ]);
        
        // Create user profile section with avatar
        $userInitial = strtoupper(substr($this->requester->name, 0, 1));
        $userProfileHtml = '<div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background-color: #f3f4f6; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                <span style="font-size: 24px; color: #4f46e5;">' . $userInitial . '</span>
            </div>
            <p style="margin: 0; font-weight: bold; font-size: 16px;">' . $this->requester->name . '</p>
            <p style="margin: 0; color: #718096; font-size: 14px;">' . $this->requester->email . '</p>
        </div>';
        
        return (new MailMessage)
            ->subject("New Join Request for {$this->group->name}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("{$this->requester->name} has requested to join your group: {$this->group->name}")
            ->line($userProfileHtml)
            ->line("As a member of this group, you can approve this request.")
            ->action('Approve Request', $approveUrl)
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'group_join_request',
            'group_id' => $this->group->id,
            'group_name' => $this->group->name,
            'requester_id' => $this->requester->id,
            'requester_name' => $this->requester->name,
            'title' => 'New Group Join Request',
            'body' => "{$this->requester->name} has requested to join your group: {$this->group->name}",
            'url' => "/groups/{$this->group->id}",
        ];
    }
}
