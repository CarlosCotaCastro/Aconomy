<?php

namespace App\Notifications;

use App\Models\ReturnRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReturnRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $returnRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(ReturnRequest $returnRequest)
    {
        $this->returnRequest = $returnRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $lending = $this->returnRequest->lending;
        $item = $lending->item;
        $borrower = $lending->borrower;
        
        $approveUrl = url("/return-requests/{$this->returnRequest->id}/respond?action=approve");
        $rejectUrl = url("/return-requests/{$this->returnRequest->id}/respond?action=reject");

        return (new MailMessage)
            ->subject("Return Request for {$item->name}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("{$borrower->name} has requested to return the item: {$item->name}")
            ->line("This item was borrowed on {$lending->lent_at->format('F j, Y')}")
            ->action('View Details', url("/lendings/{$lending->id}"))
            ->line('You can approve or reject this return request by clicking the buttons below:')
            ->line('<div style="display: flex; gap: 10px; margin-top: 15px;">
                <a href="'.$approveUrl.'" class="button button-primary" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Approve Return</a>
                <a href="'.$rejectUrl.'" class="button button-secondary" style="background-color: #f44336; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Reject Return</a>
                </div>')
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
