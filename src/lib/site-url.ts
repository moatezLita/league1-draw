/**
 * URL absolue du site — utilisée par les métadonnées de partage, le sitemap et
 * le fichier robots.
 *
 * Ordre de résolution :
 *  1. NEXT_PUBLIC_SITE_URL, si un domaine personnalisé est configuré ;
 *  2. le domaine de production fourni automatiquement par Vercel ;
 *  3. localhost, en développement.
 *
 * Le jour où un .com remplace l'adresse vercel.app, il n'y a rien à modifier
 * dans le code : il suffit d'ajouter le domaine dans Vercel. Cette variable
 * n'est lue que côté serveur — ne pas l'importer depuis un composant client.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
