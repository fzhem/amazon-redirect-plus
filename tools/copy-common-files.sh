#!/usr/bin/env bash
#
# This script assumes a linux environment

set -e

DES=$1

cp -r webextensions/*                        $DES/
cp    LICENSE                                $DES/
