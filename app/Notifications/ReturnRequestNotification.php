<?php

namespace App\Notifications;

use App\Models\ReturnRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReturnRequestNotification extends Notification implements ShouldBroadcast
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
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return ['App.Models.User.'.$this->returnRequest->lending->lender_id];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastAs()
    {
        return 'notification';
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

        $imageHtml = '';

        // Add item image if available
        if ($item->image_path) {
            $imageUrl = url('storage/'.$item->image_path);
            $imageHtml = '<div style="text-align: center; margin-bottom: 15px;">
                <img src="'.$imageUrl.'" alt="'.$item->name.'" style="max-width: 300px; max-height: 200px; object-fit: contain;">
                <p style="margin-top: 5px; color: #718096; font-size: 14px;">Item: '.$item->name.'</p>
            </div>';
        }

        $message = (new MailMessage)
            ->subject("Return Request for {$item->name}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("{$borrower->name} has requested to return the item: {$item->name}")
            ->when($imageHtml, function ($message) use ($imageHtml) {
                return $message->line($imageHtml);
            })
            ->line("This item was borrowed on {$lending->lent_at->format('F j, Y')}")
            ->action('View Details', url("/lendings/{$lending->id}"))
            ->line('You can approve or reject this return request by clicking the buttons below:')
            ->line('<div style="display: flex; gap: 10px; margin-top: 15px;">
                <a href="'.$approveUrl.'" class="button button-primary" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Approve Return</a>
                <a href="'.$rejectUrl.'" class="button button-secondary" style="background-color: #f44336; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Reject Return</a>
                </div>');

        // Add notes if provided
        if ($this->returnRequest->notes) {
            $message->line('Message from borrower:')
                ->line('"'.$this->returnRequest->notes.'"');
        }

        return $message->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $lending = $this->returnRequest->lending;
        $item = $lending->item;
        $borrower = $lending->borrower;

        return [
            'type' => 'return_request',
            'return_request_id' => $this->returnRequest->id,
            'lending_id' => $lending->id,
            'item_id' => $item->id,
            'item_name' => $item->name,
            'borrower_id' => $borrower->id,
            'borrower_name' => $borrower->name,
            'notes' => $this->returnRequest->notes,
            'requested_at' => $this->returnRequest->requested_at->toIso8601String(),
            'url' => '/lendings/'.$lending->id,
        ];
    }
}
