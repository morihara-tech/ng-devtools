#!/bin/bash
set -e

cd "$(dirname "$0")"

yarn run build
npx http-server dist/ng-devtools/browser -p 6200 --proxy http://localhost:6200?
