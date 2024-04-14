#!/usr/bin/env bash
#
# This script assumes a linux environment

set -e

echo "*** amazonRedirectPlus.chromium: Creating web store package"

DES=dist/build/amazonRedirectPlus.chromium
rm -rf $DES
mkdir -p $DES

echo "*** amazonRedirectPlus.chromium: Copying common files"
bash ./tools/copy-common-files.sh $DES

# Chromium-specific
echo "*** amazonRedirectPlus.chromium: Copying chromium-specific files"
cp platform/chromium/*.json $DES/

if [ "$1" = all ]; then
    echo "*** amazonRedirectPlus.chromium: Creating plain package..."
    pushd $(dirname $DES/) > /dev/null
    zip amazonRedirectPlus.chromium.zip -qr $(basename $DES/)/*
    popd > /dev/null
elif [ -n "$1" ]; then
    echo "*** amazonRedirectPlus.chromium: Creating versioned package..."
    pushd $(dirname $DES/) > /dev/null
    zip amazonRedirectPlus_"$1".chromium.zip -qr $(basename $DES/)/*
    popd > /dev/null
fi

echo "*** amazonRedirectPlus.chromium: Package done."
