<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Réinitialisation de mot de passe</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Bonjour {{ $user->nom }}</h2>

        <p>Vous avez demandé la réinitialisation de votre mot de passe sur la plateforme <strong>E-Voting</strong>.</p>

        <p>Voici votre code de vérification :</p>

        <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: #3498db; color: white; padding: 20px 40px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                {{ $code }}
            </div>
        </div>

        <p style="color: #e74c3c; margin-top: 20px;">
            ⚠ Ce code est valide pendant <strong>10 minutes</strong>.
        </p>

        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Votre mot de passe ne sera pas modifié.</p>

        <hr>

        <p style="font-size: 12px; color: #7f8c8d;">
            Système de Vote Électronique – Université
        </p>
    </div>
</body>
</html>
