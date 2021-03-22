#!/bin/bash

for file in *.png; do
    mv "$file" "${file/\-dunplab\-manifest\-45322/}"
done
mogrify -transparent white *.png
