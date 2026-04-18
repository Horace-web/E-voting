# Guide de Navigation - E-Vote

## ⚠️ IMPORTANT : Utilisation du Hook de Navigation

### ❌ NE PAS FAIRE

```javascript
import { useNavigate } from "react-router-dom";

const MyComponent = () => {
  const navigate = useNavigate();
  // ...
};
```

### ✅ À FAIRE

```javascript
import { useAppNavigate } from "../hooks/useAppNavigate";

const MyComponent = () => {
  const navigate = useAppNavigate();
  // ...
};
```

## 🎯 Pourquoi ?

Le hook `useAppNavigate` résout les problèmes de rendu lors des transitions de route :

- Évite les pages blanches nécessitant un refresh
- Garantit que le DOM est synchronisé avant la navigation
- Gère proprement le démontage des composants

## 📝 Utilisation

Utilisez-le exactement comme `useNavigate` de React Router :

```javascript
// Navigation simple
navigate("/admin");

// Navigation avec options
navigate("/otp", { state: { email }, replace: true });

// Navigation programmatique
const handleClick = () => {
  navigate("/elections");
};
```

## 🔧 Fonctionnement Technique

Le hook utilise `requestAnimationFrame` (double RAF) pour :

1. Attendre que React termine son cycle de rendu
2. S'assurer que le DOM est complètement synchronisé
3. Puis effectuer la navigation

Cela élimine les race conditions entre le démontage et le montage des composants.

## 📦 Fichiers Modifiés

Tous les composants suivants utilisent déjà `useAppNavigate` :

- `src/pages/Login.jsx`
- `src/pages/Otp.jsx`
- `src/components/AdminLayout.jsx`

**Pour tout nouveau composant** : Utilisez toujours `useAppNavigate` au lieu de `useNavigate`.
