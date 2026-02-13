<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    //
    public function storePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,jpg,png|max:2048'
        ]);

        $path = $request->file('photo')->store('candidats', 'public');

        return response()->json([
            'success' => true,
            'photo_url' => asset('storage/' . $path), // ✅ URL complète
            'photo_path' => $path // ✅ Chemin pour la BD
        ]);
    }
}
