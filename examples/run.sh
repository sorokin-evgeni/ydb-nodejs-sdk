#!/bin/bash

SA_JSON_FILE="/Users/40in/.ssh/service-account-key-lb-preprod.json" IAM_ENDPOINT="iam.api.cloud-preprod.yandex.net" YDB_SSL_ROOT_CERTIFICATES_FILE="/Users/40in/dev/cloud-events-notify-proxy/YandexInternalRootCA.crt" node dist/logbroker --db /pre-prod_ydb_public/aoepam019k1ftomm3f5f/cc803q344u5gggsdqsv3 --endpoint grpcs://ydb.serverless.cloud-preprod.yandex.net:2135
