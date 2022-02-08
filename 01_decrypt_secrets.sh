#!/bin/sh

gpg \
  --quiet \
  --batch \
  --yes \
  --decrypt \
  --passphrase="$GHS_JWT_KEY_GPG_PASSPHRASE" \
  --output .secrets/private.key \
  .secrets/private.key.gpg
