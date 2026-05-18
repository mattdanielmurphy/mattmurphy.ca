#!/bin/bash
# Copies the generated preview HTML files from the School directory into the Next.js public directory

echo "Copying physics labs..."

# Map the paths to nicer slugs
cp "/Users/matthewmurphy/School/physics-12/u4-momentum/PH12 U4 Lab/PH12 U4 Lab A - Collision Forensics.preview.html" public/physics-labs/collision-forensics.html
cp "/Users/matthewmurphy/School/physics-12/u5-electricity/u5-lab-colombs-law/PH12 U5: Coulomb’s Law Virtual Lab.preview.html" public/physics-labs/coulombs-law.html

echo "Done!"
