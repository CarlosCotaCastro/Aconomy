<?php

namespace App\Notifications;

use App\Models\ReturnRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReturnRequestRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $returnRequest;

    protected $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct(ReturnRequest $returnRequest, ?string $reason = null)
    {
        $this->returnRequest = $returnRequest;
        $this->reason = $reason;
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

        $mail = (new MailMessage)
            ->subject("Return Request Rejected for {$item->name}")
            ->greeting("Hello {$notifiable->name}")
            ->line("{$lender->name} has declined your request to return the {$item->name}.")
            ->when($imageHtml, function ($message) use ($imageHtml) {
                return $message->line($imageHtml);
            });

        if (! empty($this->reason)) {
            $mail->line('Reason: "'.$this->reason.'"');
        }

        return $mail
            ->line("Please contact {$lender->name} directly to discuss returning the item.")
            ->action('View Details', url("/lendings/{$lending->id}"))
            ->line('Thank you for using our application.');
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
            'type' => 'return_request_rejected',
            'return_request_id' => $this->returnRequest->id,
            'lending_id' => $lending->id,
            'item_id' => $item->id,
            'item_name' => $item->name,
            'lender_id' => $lender->id,
            'lender_name' => $lender->name,
            'reason' => $this->reason,
            'title' => 'Return Request Rejected',
            'body' => "{$lender->name} has declined your request to return the {$item->name}",
            'url' => '/lendings/'.$lending->id,
        ];
    }
}
