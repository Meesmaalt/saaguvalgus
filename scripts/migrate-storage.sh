#!/usr/bin/env bash
set -euo pipefail
umask 077

backup_dir=${1:?Usage: bash scripts/migrate-storage.sh /absolute/backup/path [container-name]}
source_container=${2:-saaguvalgus_web}
case "$backup_dir" in /*) ;; *) echo 'Backup path must be absolute.' >&2; exit 1;; esac
if [ -e "$backup_dir" ]; then
  echo 'Choose a new backup directory; existing backups are never overwritten.' >&2
  exit 1
fi
# Fetch the helper image before interrupting the application.
docker image inspect alpine:3.22 >/dev/null 2>&1 || docker pull alpine:3.22
for storage_volume in saaguvalgus-data saaguvalgus-uploads; do
  docker volume create "$storage_volume" >/dev/null
  docker run --rm -v "$storage_volume:/target" alpine:3.22 sh -c 'test -z "$(ls -A /target)"' || {
    echo "Volume $storage_volume is not empty; migration stopped without changing its files." >&2
    exit 1
  }
done
mkdir -p "$backup_dir/data" "$backup_dir/uploads"
was_running=$(docker inspect -f '{{.State.Running}}' "$source_container")
restart_source() {
  if [ "$was_running" = true ]; then docker start "$source_container" >/dev/null; fi
}
trap restart_source EXIT
if [ "$was_running" = true ]; then docker stop "$source_container" >/dev/null; fi
docker cp "$source_container:/app/data/." "$backup_dir/data/"
docker cp "$source_container:/app/uploads/." "$backup_dir/uploads/"
if [ ! -f "$backup_dir/data/db.json" ]; then
  echo 'No existing db.json found. Inspect the current storage paths before proceeding.' >&2
  exit 1
fi
docker run --rm -v "$backup_dir:/backup:ro" -v saaguvalgus-data:/data -v saaguvalgus-uploads:/uploads alpine:3.22 sh -c \
  'test -z "$(ls -A /data)" && test -z "$(ls -A /uploads)" && cp -a /backup/data/. /data/ && cp -a /backup/uploads/. /uploads/'
echo "Migration complete. Independent backup: $backup_dir"
echo 'Now redeploy the updated Portainer stack and verify the public PDFs.'
