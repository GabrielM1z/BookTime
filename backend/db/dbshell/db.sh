#!/bin/bash
set -e
export PGPASSWORD=postgres123;
psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "booktime" <<-EOSQL
  CREATE DATABASE booktime;
  GRANT ALL PRIVILEGES ON DATABASE booktime TO "postgres";
EOSQL