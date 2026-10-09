# Kirjastus Saagu Valgus

React/Vite frontend and an Express server for content, public PDF publications, orders and contact messages. The full site needs the Node server: hosting only `dist/` cannot support the administrator panel.

## Development and validation

```sh
npm ci --legacy-peer-deps
npm run dev
```

```sh
npm run lint
npm run build
npm test
```

`npm start` runs the compiled production server after `npm run build`. Integration tests use temporary storage and replace the server process to verify that PDFs, edited content, passwords, orders and message states survive. Tests also cover invalid PDFs, unavailable APIs, authentication and actual filesystem write failures.

## Portainer deployment

Use `docker-compose.yml` from this repository. The external port stays **3002**, mapped to HTTP port 80 in the container. The reverse proxy for `saaguvalgus.eu` must forward **all paths**, including `/api/` and `/uploads/`, to that port. Configure a request body limit of at least 50 MB on the proxy (PDF uploads are limited to 10 MB; JSON backups include base64 file data).

The Compose file uses these explicitly named Docker volumes:

| Volume | Container path | Contents |
| --- | --- | --- |
| `saaguvalgus-data` | `/var/lib/saaguvalgus/data` | `db.json` and the previous committed version `db.json.bak` |
| `saaguvalgus-uploads` | `/var/lib/saaguvalgus/uploads` | Public PDFs |

Names stay the same when Portainer creates a new Git checkout or changes the stack name. Pulling, rebuilding and replacing the container retains these volumes. Deleting the volumes, running `docker compose down -v`, or moving to another Docker host does not retain them. Run a single application instance; the JSON database is intended for one process on one host.

Set `ADMIN_PASSWORD` in Portainer for a new installation. It only initializes a new database; existing passwords are preserved. Change the initial password in the panel. Server sessions expire on restart, so log in again after redeployment.

## First upgrade: preserve existing data before redeploying

The previous Compose used `./data:/app/data` and `./uploads:/app/uploads`. Changing to named volumes does **not** automatically move those old files. Run this migration on the Docker host **before replacing the old container**. The script stops `saaguvalgus_web` briefly for a consistent snapshot, makes an independent backup, copies data into empty named volumes, and restarts the old container. It refuses to overwrite volumes that already contain data.

```sh
bash scripts/migrate-storage.sh /absolute/path/saaguvalgus-backup
```

After the migration succeeds, update the Portainer stack with the new Compose file and redeploy. Check that your existing text and publications are present, open a PDF in a private browser window, and verify again after another redeploy. Keep the backup directory until this is confirmed. If your current container uses another name, supply it as a second argument to the script.

If a PDF only existed in browser storage because an old server upload failed, it will not be in the old uploads directory. Upload its original file again after deploying this fix. Old locally edited text may likewise need to be saved again through the working server.

## Saving and backups

Admin autosaves show `Salvestan…`, `Salvestatud`, or an error with a retry button. A failed API call does not create a browser-only publication or claim to save a message/order. Read-only site content uses bundled defaults if the server is unavailable; admin writes always require the server.

The admin JSON backup now exports server data **and PDF bytes**. Restore validates PDF files, writes them under new names, then commits the database. Passwords are excluded, and restore preserves the current server password. Legacy JSON backups with only PDF URLs need their original uploads directory as well. JSON backups must fit the server/proxy body limit; for larger installations, back up both Docker volumes together while the application is stopped.

Existing database files are never overwritten with seed content when parsing or disk access fails. The server reports the failure instead. `db.json.bak` is the immediately previous committed database, not a replacement for regular independent backups. Custom `DATA_DIR` and `UPLOADS_DIR` can also be used outside Docker. Seed data remains part of the application image and only initializes a missing database.

## Public-site design settings

Admin → **Kujundus** controls desktop/mobile/footer logo sizes, body and heading sizes, the hero title size, font choices, line spacing, content/reading widths, section spacing and card corners. Changes autosave into the existing content database and JSON backups, apply in both languages, and survive redeploys with the existing persistent volumes. Older content without settings uses the defaults. The panel includes a live style sample, three presets, a full-page preview button and a reset that only restores design settings. Mobile logo sizes adapt to available screen space; use the PDF reader zoom for text inside an uploaded PDF.
