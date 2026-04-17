const AUTH_ERROR_MESSAGES = {
  "auth/wrong-password": "Email ou mot de passe incorrect.",
  "auth/user-not-found": "Email ou mot de passe incorrect.",
  "auth/invalid-credential": "Email ou mot de passe incorrect.",
  "auth/invalid-email": "Adresse email invalide.",
  "auth/user-disabled": "Ce compte est désactivé. Contactez le support.",
  "auth/too-many-requests": "Trop de tentatives. Réessayez dans quelques minutes.",
  "auth/network-request-failed": "Problème réseau. Vérifiez votre connexion.",
  "auth/email-already-in-use": "Cet email est déjà utilisé.",
  "auth/weak-password": "Le mot de passe est trop faible.",
  "auth/operation-not-allowed": "La création de compte est momentanément indisponible.",
};

export function getAuthErrorMessage(error, fallback) {
  return AUTH_ERROR_MESSAGES[error?.code] ?? fallback;
}
