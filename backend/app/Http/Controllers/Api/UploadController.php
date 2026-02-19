<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePhotoRequest;

class UploadController extends Controller
{
    //
    public function storePhoto(StorePhotoRequest $request)
    {
        $path = $request->file('photo')->store('candidats', 'public');

        return response()->json([
            'success' => true,
            'photo_url' => asset('storage/' . $path),
            'photo_path' => $path
        ]);
    }
}
