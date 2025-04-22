<?php

namespace App\Notifications;

use App\Models\Group;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GroupJoinRequestApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $group;

    protected $approver;

    /**
     * Create a new notification instance.
     */
    public function __construct(Group $group, User $approver)
    {
        $this->group = $group;
        $this->approver = $approver;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Create group profile section
        $groupInfoHtml = '<div style="text-align: center; margin-bottom: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
            <h2 style="margin: 0; color: #4f46e5; font-size: 20px;">'.$this->group->name.'</h2>
            <p style="margin: 10px 0 0; color: #6b7280;">'.
                ($this->group->description ? $this->group->description : 'No description provided').
            '</p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #9ca3af;">'.
                count($this->group->users).' members
            </p>
        </div>';

        return (new MailMessage)
            ->subject("Welcome to {$this->group->name}!")
            ->greeting("Good news, {$notifiable->name}!")
            ->line("{$this->approver->name} has approved your request to join the group {$this->group->name}.")
            ->line($groupInfoHtml)
            ->line('You now have access to all items shared within this group and can borrow them from other members.')
            ->action('View Group', url("/groups/{$this->group->id}"))
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
            'type' => 'group_join_request_approved',
            'group_id' => $this->group->id,
            'group_name' => $this->group->name,
            'approver_id' => $this->approver->id,
            'approver_name' => $this->approver->name,
            'title' => 'Group Join Request Approved',
            'body' => "You are now a member of {$this->group->name}",
            'url' => "/groups/{$this->group->id}",
        ];
    }
}
