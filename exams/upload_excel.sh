#!/usr/bin/env bash
set -euo pipefail

########################################
# CONFIG – CHANGE THESE VALUES
########################################

# The endpoint that accepts your upload
API_URL="http://localhost:1337/api/students/import-excel"

# If your API uses a token (Bearer, etc.), set it here.
# Leave empty ("") if not needed.
API_TOKEN=""

# Optional: extra headers, e.g. for custom auth or tenant IDs
# Example: EXTRA_HEADERS=(-H "X-Tenant: my-tenant")
EXTRA_HEADERS=()

########################################
# FIND EXCEL FILE
########################################

# You can pass the file as first argument, or it will auto-pick the first .xlsx / .xls in the folder.
FILE_PATH="${1:-}"

if [[ -z "$FILE_PATH" ]]; then
  # Prefer .xlsx, fall back to .xls
  if ls *.xlsx >/dev/null 2>&1; then
    FILE_PATH="$(ls *.xlsx | head -n1)"
    MIME_TYPE="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  elif ls *.xls >/dev/null 2>&1; then
    FILE_PATH="$(ls *.xls | head -n1)"
    MIME_TYPE="application/vnd.ms-excel"
  else
    echo "No Excel file (.xlsx or .xls) found in the current folder."
    echo "Usage: $0 <file.xlsx>"
    exit 1
  fi
else
  # Determine mime type by extension
  if [[ "$FILE_PATH" == *.xlsx ]]; then
    MIME_TYPE="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  elif [[ "$FILE_PATH" == *.xls ]]; then
    MIME_TYPE="application/vnd.ms-excel"
  else
    echo "Unknown file extension for '$FILE_PATH'. Expected .xlsx or .xls."
    exit 1
  fi
fi

if [[ ! -f "$FILE_PATH" ]]; then
  echo "File not found: $FILE_PATH"
  exit 1
fi

echo "Uploading file: $FILE_PATH"
echo "To API:        $API_URL"
echo

########################################
# BUILD CURL COMMAND
########################################

# Base curl arguments
curl_args=(
  -X POST
  "$API_URL"
  -F "file=@${FILE_PATH};type=${MIME_TYPE}"
)

# Add Authorization header if token is set
if [[ -n "$API_TOKEN" ]]; then
  curl_args+=(-H "Authorization: Bearer ${API_TOKEN}")
fi

# Add any extra headers
curl_args+=("${EXTRA_HEADERS[@]}")

########################################
# EXECUTE REQUEST
########################################

curl "${curl_args[@]}"
echo
echo "Upload finished."
