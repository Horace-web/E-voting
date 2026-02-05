<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Vérification de compte</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">

        <h2 style="color: #2c3e50;">Bienvenue {{ $user->nom }}</h2>

        <p>
            Un compte a été créé pour vous sur la plateforme de
            <strong>Vote Électronique</strong>.
        </p>

        <p>
            Cliquez sur le bouton ci-dessous pour <strong>vérifier votre email et définir votre mot de passe</strong> :
        </p>

        <p style="text-align: center;">
            <a href="{{ config('app.frontend_url') }}/verify-account/{{ $token }}"
               style="display: inline-block; background-color: #3498db; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                Activer mon compte
            </a>
        </p>

        <p style="color: #e74c3c; margin-top: 20px;">
            ⚠ Ce lien est valide pendant <strong>30 minutes</strong>.
        </p>

        <p>
            Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
        </p>

        <hr>

        <p style="font-size: 12px; color: #7f8c8d;">
            Système de Vote Électronique – Université
        </p>
    </div>
</body>
</html>
