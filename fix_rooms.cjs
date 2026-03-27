const fs = require('fs');
const file = 'src/data/tutorials.ts';
let content = fs.readFileSync(file, 'utf8');

const replacements = {
  "https://nav.tum.de/room/0606": "https://nav.tum.de/room/0506.EG.606",
  "https://nav.tum.de/room/1100": "https://nav.tum.de/room/0501.01.100",
  "https://nav.tum.de/room/2750": "https://nav.tum.de/room/0507.03.750",
  "https://nav.tum.de/room/1070": "https://nav.tum.de/room/0101.Z1.070",
  "https://nav.tum.de/room/0670": "https://nav.tum.de/room/0506.Z1.670",
  "https://nav.tum.de/room/0880": "https://nav.tum.de/room/0509.EG.980",
  "https://nav.tum.de/room/0360": "https://nav.tum.de/room/0503.EG.360",
};

for (const [oldUrl, newUrl] of Object.entries(replacements)) {
    // Escape string for regex if necessary or just use string replace global
    content = content.replaceAll(oldUrl, newUrl);
}

fs.writeFileSync(file, content);
console.log("Room URLs patched nicely.");
