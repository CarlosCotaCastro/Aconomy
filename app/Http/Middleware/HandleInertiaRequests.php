<?php

namespace App\Http\Middleware;

use App\Helpers\PhpIniHelper;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'badges' => fn () => $this->badgesFor($request),
            'csrf_token' => csrf_token(),
            'maxImageSizeKB' => PhpIniHelper::getMaxImageSizeKB(),
        ];
    }

    /**
     * Sidebar/top-bar badge counts for the authenticated user.
     *
     * @return array<string, int>|null
     */
    protected function badgesFor(Request $request): ?array
    {
        $user = $request->user();

        if (! $user) {
            return null;
        }

        return [
            'incomingRequests' => $user->lendRequests()->where('status', 'pending')->count(),
            'activeBorrowings' => $user->lendingsAsBorrower()->whereNull('returned_at')->count(),
            'unreadMessages' => \App\Models\Message::query()
                ->whereHas('conversation', fn ($q) => $q->forUser($user->id))
                ->where('sender_id', '!=', $user->id)
                ->whereNull('read_at')
                ->count(),
            'unreadNotifications' => $user->unreadNotifications()->count(),
        ];
    }

    /**
     * Handle the incoming request.
     *
     * @return \Illuminate\Http\Response
     */
    public function handle(Request $request, \Closure $next)
    {
        $response = parent::handle($request, $next);

        // Add CSRF token to response headers for AJAX requests
        if ($request->ajax() || $request->wantsJson()) {
            $response->headers->set('X-CSRF-TOKEN', csrf_token());
        }

        return $response;
    }
}
