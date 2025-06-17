<?php

use App\Http\Controllers\BorrowRequestController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Group\GroupSearchItems;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupUserController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\LendingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReturnRequestController;
use App\Http\Controllers\StoreItemController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// CSRF token refresh route
Route::get('/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
})->middleware('web');

// CSRF token test route
Route::post('/csrf-test', function () {
    return response()->json(['message' => 'CSRF token is valid']);
})->middleware('web');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/image', [ProfileController::class, 'updateImage'])->name('profile.update-image');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');

    // Items routes
    Route::resource('items', ItemController::class);
    Route::post('/items', StoreItemController::class)->name('items.store');
    Route::get('/groups/{group}/items', [ItemController::class, 'groupItems'])->name('groups.items.index');

    // Groups routes
    Route::resource('groups', GroupController::class);
    Route::post('/groups/{group}/join', [GroupUserController::class, 'store'])->name('groups.join');
    Route::delete('/groups/{group}/leave', [GroupUserController::class, 'destroy'])->name('groups.leave');
    Route::post('/groups/{group}/users/{user}/approve', [GroupController::class, 'approve'])->name('groups.approve');
    Route::get('/groups/{group}/search-items', GroupSearchItems::class)->name('groups.search-items');
    Route::get('/my-groups', \App\Http\Controllers\Group\MyGroups::class)->name('groups.my-groups');

    // Borrow Requests routes
    Route::resource('borrow-requests', BorrowRequestController::class)->except(['edit', 'update', 'destroy']);
    Route::post('/borrow-requests/{borrowRequest}/approve', [BorrowRequestController::class, 'approve'])->name('borrow-requests.approve');
    Route::post('/borrow-requests/{borrowRequest}/deny', [BorrowRequestController::class, 'deny'])->name('borrow-requests.deny');
    Route::post('/borrow-requests/{borrowRequest}/verify-code', [BorrowRequestController::class, 'verifyHandoverCode'])->name('borrow-requests.verify-code');

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/api/notifications', [NotificationController::class, 'getLatestNotifications']);
    Route::get('/api/notifications/count', [NotificationController::class, 'getUnreadCount']);

    Route::get('/notifications/count', [NotificationController::class, 'getUnreadCount'])->name('notifications.count');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    // Lendings routes
    Route::resource('lendings', LendingController::class);
    Route::post('/lendings/{lending}/return', [LendingController::class, 'return'])->name('lendings.return');
    Route::get('/items/{item}/borrow', [LendingController::class, 'requestBorrow'])->name('lendings.borrow');
    Route::post('/items/{item}/borrow', [LendingController::class, 'storeBorrowRequest'])->name('lendings.borrow.store');

    // Return Request routes
    Route::post('/lendings/{lending}/return-request', [ReturnRequestController::class, 'store'])->name('return-requests.store');
    Route::get('/return-requests/{returnRequest}/respond', [ReturnRequestController::class, 'respond'])->name('return-requests.respond');
});

require __DIR__.'/auth.php';
