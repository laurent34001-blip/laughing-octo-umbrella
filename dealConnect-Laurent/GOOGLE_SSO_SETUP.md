# Configuration SSO Google avec Supabase

## Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez l'API Google+ dans la section "APIs et services"

### 2. Créer les identifiants OAuth

1. Allez à "Identifiants" > "Créer identifiants" > "ID client OAuth"
2. Choisissez "Application Web"
3. Ajoutez les URI autorisées de redirection :
   - `https://votre-projet.supabase.co/auth/v1/callback`
   - `http://localhost:5173/` (pour le développement local)
   - `http://localhost:3000/` (alternative local)

4. Copiez l'**ID client** et le **Secret client**

### 3. Configurer dans Supabase

1. Allez à votre [Dashboard Supabase](https://app.supabase.com/)
2. Sélectionnez votre projet
3. Allez à **Authentication** > **Providers**
4. Activez **Google**
5. Collez l'**ID client** et le **Secret client** de Google
6. Cliquez sur "Save"

### 4. Ajouter les variables d'environnement

Dans `frontend-vite/.env.local` (créez le fichier s'il n'existe pas) :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon
```

### 5. Tester localement

Assurez-vous que votre URL locale correspond à celle configurée dans Google Cloud :
- Développement : `http://localhost:5173`
- Production : l'URL de votre domaine

## Fichiers modifiés

- **[AuthForm.jsx](frontend-vite/src/components/AuthForm.jsx)** : Ajout du bouton Google SSO et de la fonction `handleGoogleSignIn()`

## Flux d'authentification

1. L'utilisateur clique sur "Continuer avec Google"
2. Supabase redirige vers l'écran de connexion Google
3. Après authentification, l'utilisateur est redirigé vers l'application
4. Le hook `useAuth()` détecte automatiquement l'authentification et met à jour l'état utilisateur

## Notes importantes

- Supabase gère automatiquement la création/mise à jour du profil utilisateur
- Les données de session sont stockées localement
- Le bouton Google s'affiche sur les pages de login ET de register

## Dépannage

**Erreur "Invalid redirect_uri"** : Vérifiez que l'URL locale/prod est correctement configurée dans Google Cloud

**Bouton Google ne fonctionne pas** : Vérifiez que le provider Google est activé dans Supabase et que les clés sont correctement copiées
