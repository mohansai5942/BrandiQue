# Firebase migration readiness and cutover plan

This runbook records the code-side audit of `main` at commit `0a1f74e19411c46810b1184bea83369647355dbb`. It is a plan only: it does not switch Firebase projects, publish rules, move data, or change hosting.

## Current state verified in the repository

- The app initializes Firebase from the tracked `firebase-applet-config.json`. It currently points to project `intense-racer-xvrbg` and the named Firestore database `ai-studio-brandiquewebsolu-5b78f5e0-1a41-459e-9cab-6eede2ce5392`.
- The migration destination requested by the owner is Firebase project `brandique-web-solutions`, region `asia-south1`. Create the destination Firestore database in that region and preserve the current database ID unless a deliberate code change to the database ID is approved.
- The app reads/writes these Firestore paths: `messages`, `projects`, `settings/contact`, `websites`, `n8n_projects`, and `n8n_project_forms`. The same six top-level collections appear in `firestore.rules`; the blueprint describes only the first four, so it is not a complete schema inventory.
- Project and website image uploads in the Admin UI use `FileReader.readAsDataURL`; those data URLs are stored in Firestore documents. The repo does not use Firebase Storage SDK for these uploads. Export/import therefore carries those inline image strings with the documents. Do not delete or rewrite image fields during migration.
- The current Firestore rules deny by default, then grant unconditional read/create/update/delete on all six collections. This means anonymous visitors can read and change submissions, site settings, project records, and workflow data.
- The current admin authentication code accepts a localStorage fallback and hard-coded fallback credentials, and `ProtectedRoute` relies on the client-side auth context. A localStorage flag is not server-verifiable authorization. Do not replace the broad Firestore rules with authenticated-only rules until the admin authentication and authorization model has been fixed and the actual public read/write needs have been mapped and tested.
- `vercel.json` and Cloudflare Pages files are present in the repo; no Cloudflare Pages configuration or Firebase environment bindings were found. Hosting choice and dashboard values must be confirmed in the Cloudflare account. Today Firebase config is compiled from the tracked JSON file at build time.
- The repository has TypeScript, production-build, and SEO validation workflows. The Admin panel and Projects page implementations are explicitly out of scope for this migration work.

## Required gates before any project switch or deployment

1. **Identify and protect the source.** In Firebase/Google Cloud Console, confirm the source project and named database above. Confirm access, billing, database location, current usage, and the exact source account. Do not infer that the project ID in GitHub is proof of live production ownership.
2. **Make a recoverable backup.** Freeze writes for the cutover window (or plan a final delta export), then export the entire source database to a dedicated Cloud Storage bucket. Preserve the export folder and metadata file unchanged. Record operation completion, timestamp, document counts by collection, and the bucket path. Keep a second independent backup before import.
3. **Prepare the destination.** Confirm the project is exactly `brandique-web-solutions`; create Firestore in `asia-south1` with the intended database ID; enable the required APIs/billing; and grant only the temporary import/export service-agent access required to the export bucket. Confirm the destination is empty before import.
4. **Import and verify data.** Import the Firestore export into the destination database. Compare source and destination counts for all six collections, inspect representative documents and large image data URLs, and verify document IDs and key fields. A managed export is not an exact point-in-time snapshot while writes continue; use a write freeze or reconcile a final delta. Imports overwrite matching document IDs and do not remove unrelated destination documents, so do not import into a database containing unapproved data.
5. **Resolve auth and security before cutover.** Firestore export/import does not migrate Firebase Authentication users or project settings. Decide whether users can be recreated/reset or whether Auth users can be imported using the supported Admin SDK process. Remove local-only authentication fallback in a separately reviewed auth change, establish a server-verifiable admin authorization design, inventory public reads and visitor submissions, and create least-privilege Firestore rules. Test allowed and denied operations in the Firebase Emulator Suite before publishing rules.
6. **Validate hosting and project settings.** In Cloudflare Pages, confirm the linked repository/production branch, build command `npm run build`, output directory `dist`, Node version compatibility with `.nvmrc`, preview deployment settings, custom domains, redirects/headers, and environment scope. There are no Firebase env vars today: changing the tracked Firebase JSON changes the project at build time. Do not edit it before gates 1–5 pass. Add build-time variables only as a deliberate follow-up that works for production and preview without exposing server secrets.
7. **Cut over under a rollback plan.** Only after all preceding gates pass: deploy the reviewed security rules; switch Firebase config in a separate, reviewed change; deploy first to a preview; verify login, public inquiry submissions, admin reads/writes, image rendering, and error logs; then schedule production cutover. Keep the old project and backup untouched and retain a documented rollback to the old config until production checks and data reconciliation finish.

## What needs owner access

The following actions require the owner's Firebase/Google Cloud or Cloudflare Console access (or appropriately scoped account access): identify/confirm source project and live database; export/retain the backup; create the destination database and choose its location; enable billing/APIs; grant temporary bucket permissions; import data; export/import or recreate Auth users; publish rules; and set Cloudflare Pages project/build/environment/domain settings. Never paste passwords, service-account private keys, API secrets, or recovery codes into chat.

## Official procedure references

- [Firebase: Move data between Cloud Firestore projects](https://firebase.google.com/docs/firestore/manage-data/move-data)
- [Firebase: Export and import Cloud Firestore data](https://firebase.google.com/docs/firestore/manage-data/export-import)
- [Firebase: Import Authentication users](https://firebase.google.com/docs/auth/admin/import-users)
- [Firebase: Understand Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloudflare Pages: Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
