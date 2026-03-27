const fs = require('fs');

const file = 'src/data/tutorials.ts';
let content = fs.readFileSync(file, 'utf8');

const mappings = {
  "Theresianum; 0606, Hörsaal": "https://nav.tum.de/room/0606",
  "1100, Hörsaal": "https://nav.tum.de/room/1100",
  "2750, Karl Max von Bauernfeind Hörsaal": "https://nav.tum.de/room/2750",
  "N 1070 ZG, Lothar-Rohde-Hörsaal": "https://nav.tum.de/room/1070",
  "0670ZG, Hör-Lehrsaal": "https://nav.tum.de/room/0670",
  "0880, Audimax": "https://nav.tum.de/room/0880",
  "H.103, CIP-Raum": "https://nav.tum.de/room/2910.01.103",
  "0360, Theodor-Fischer-Hörsaal": "https://nav.tum.de/room/0360"
};

for (const [loc, url] of Object.entries(mappings)) {
    // Regex to match the object with this location and the campus.tum.de URL
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const locRegex = new RegExp(`location:\\s*"${escapeRegExp(loc)}",\\s*locationUrl:\\s*"https:\\/\\/campus\\.tum\\.de\\/"`, 'g');
    content = content.replace(locRegex, `location: "${loc}", locationUrl: "${url}"`);
}

fs.writeFileSync(file, content);
console.log("Replaced URLs");
