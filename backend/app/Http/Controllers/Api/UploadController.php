<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class UploadController extends Controller
{
    #[OA\Post(
        path: '/api/upload/photo',
        summary: 'Uploader une photo de candidat',
        security: [['sanctum' => []]],
        tags: ['Upload'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['photo'],
                    properties: [
                        new OA\Property(
                            property: 'photo',
                            type: 'string',
                            format: 'binary',
                            description: 'Photo du candidat (jpeg, jpg, png - max 2Mo)'
                        ),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Photo uploadée avec succès',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'photo_url', type: 'string', example: 'http://localhost:8000/storage/candidats/photo.jpg'),
                        new OA\Property(property: 'photo_path', type: 'string', example: 'candidats/photo.jpg'),
                    ]
                )
            ),
            new OA\Response(response: 422, description: 'Fichier invalide ou manquant'),
            new OA\Response(response: 401, description: 'Non autorisé'),
        ]
    )]
    public function storePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,jpg,png|max:2048'
        ]);

        $path = $request->file('photo')->store('candidats', 'public');

        return response()->json([
            'success' => true,
            'photo_url' => asset('storage/' . $path),
            'photo_path' => $path
        ]);
    }
}