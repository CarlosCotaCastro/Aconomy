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
        return ['mail'];
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
        
        return (new MailMessage)
            ->subject("New Join Request for {$this->group->name}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("{$this->requester->name} has requested to join your group: {$this->group->name}")
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
            //
        ];
    }
}
