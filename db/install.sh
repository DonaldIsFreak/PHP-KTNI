#!/bin/bash

SQLITE=/usr/bin/sqlite3
SCHEMA=schema.sql
TARGET=ktni.db
CHOICE=Y

# Check the SQLite3 package is installed.
if [ ! -e $SQLITE ]; then
	echo "Install SQLite3 package."
	exit 1
fi

# Check the sqlscript file.
if [ ! -e $SCHEMA ]; then
	echo "Can't find the schema.sql file. Retry download this file."
	exit 1
fi

if [ -e $TARGET ]; then
	while [ -z "$check" ]; do 
		read -p "The db had created. Do you want recreated?[y/n]" choice
		check=`echo "$choice" | grep '^[ynYN]$'`

		if [ -z "$check" ]; then
			echo "Invaild answer. (y or n)"
			continue
		fi
	done

	check=`echo "$choice" | grep '^[yY]$'`
	if [ -z $check ]; then
		choice=0
	else
		choice=1
	fi
fi

if [ ! -e $TARGET ] || [ $choice -eq 1 ]; then
	`sqlite3 "$TARGET" < "$SCHEMA"`
fi

echo "install end."
