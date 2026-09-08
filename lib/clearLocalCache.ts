// Vide tout le cache local (localStorage) qui peut contenir des données
// propres à un compte : loyers, baux, quittances, logo personnalisé, etc.
//
// Ce cache "de confort" (fallback hors-ligne) n'est PAS scopé par utilisateur
// ni par organisation — il vit au niveau de l'appareil/navigateur. Sans ce
// nettoyage, un utilisateur qui se connecte avec un autre compte sur le même
// téléphone/navigateur voit les données laissées par la session précédente
// (locataires, loyers, logo...), mélangées ou à la place des siennes.
//
// À appeler : (1) juste après une connexion réussie, avant d'afficher le
// dashboard, et (2) à la déconnexion.
export function clearLocalAccountCache() {
  if (typeof window === "undefined") return;

  const keysToRemove = [
    "lokka_leases_cache",
    "lokka_ledger_cache",
    "lokka_receipts_cache",
    "lokka_loyers_cache",
    "lokka_custom_logo",
    "lokka_dev_plan",
    "lokka_dev_role",
    "lokka:sidebar_devRole",
  ];

  for (const key of keysToRemove) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
