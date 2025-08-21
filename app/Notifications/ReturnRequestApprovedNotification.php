<?php

namespace App\Notifications;

use App\Models\ReturnRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReturnRequestApprovedNotification extends Notification implements ShouldBroadcast
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
        return ['App.Models.User.'.$this->returnRequest->lending->borrower_id];
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
        $lender = $lending->lender;

        $imageHtml = '';

        // Add item image if available
        if ($item->image_path) {
            $imageUrl = url('storage/'.$item->image_path);
            $imageHtml = '<div style="text-align: center; margin-bottom: 15px;">
                <img src="'.$imageUrl.'" alt="'.$item->name.'" style="max-width: 300px; max-height: 200px; object-fit: contain;">
                <p style="margin-top: 5px; color: #718096; font-size: 14px;">Item: '.$item->name.'</p>
            </div>';
        }

        return (new MailMessage)
            ->subject("Return Request Approved for {$item->name}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("{$lender->name} has approved your request to return the {$item->name}.")
            ->when($imageHtml, function ($message) use ($imageHtml) {
                return $message->line($imageHtml);
            })
            ->line("Please meet with {$lender->name} to hand over the item as soon as possible.")
            ->line("This item was borrowed on {$lending->lent_at->format('F j, Y')} and will be marked as returned once the handover is complete.")
            ->action('View Details', url("/lendings/{$lending->id}"))
            ->line('Thank you for using our application!');
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
        $lender = $lending->lender;

        return [
            'type' => 'return_request_approved',
            'return_request_id' => $this->returnRequest->id,
            'lending_id' => $lending->id,
            'item_id' => $item->id,
            'item_name' => $item->name,
            'lender_id' => $lender->id,
            'lender_name' => $lender->name,
            'title' => 'Return Request Approved',
            'body' => "{$lender->name} has approved your request to return the {$item->name}",
            'url' => '/lendings/'.$lending->id,
        ];
    }
}
