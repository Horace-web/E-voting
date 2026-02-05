<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-email', function () {
    Mail::to('horaceodounlami2006@gmail.com')
        ->send(new OtpMail('horaceodounlami2006@gmail.com', '123456'));

    return 'Email envoyé !';
});
