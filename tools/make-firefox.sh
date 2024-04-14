#!/usr/bin/env bash
#
# This script assumes a linux environment

set -e

echo "*** amazonRedirectPlus.firefox: Creating web store package"

BLDIR=dist/build
DES="$BLDIR"/amazonRedirectPlus.firefox
mkdir -p $DES
rm -rf $DES/*

echo "*** amazonRedirectPlus.firefox: Copying common files"
bash ./tools/copy-common-files.sh $DES

# Firefox-specific
echo "*** amazonRedirectPlus.firefox: Copying firefox-specific files"
cp platform/firefox/manifest.json $DES/

if [ "$1" = all ]; then
    echo "*** amazonRedirectPlus.firefox: Creating package..."
    pushd $DES > /dev/null
    zip ../$(basename $DES).xpi -qr *
    popd > /dev/null
elif [ -n "$1" ]; then
    echo "*** amazonRedirectPlus.firefox: Creating versioned package..."
    pushd $DES > /dev/null
    zip ../$(basename $DES).xpi -qr *
    popd > /dev/null
    mv "$BLDIR"/amazonRedirectPlus.firefox.xpi "$BLDIR"/amazonRedirectPlus_"$1".firefox.xpi
fi

echo "*** amazonRedirectPlus.firefox: Package done."
