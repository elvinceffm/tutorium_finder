const fs = require('fs');

const file = 'src/data/tutorials.ts';
let content = fs.readFileSync(file, 'utf8');

async function processUrls() {
    console.log("Analyzing tutorials for missing TUM Navigator links...");
    let newContent = content;

    const matches = [...content.matchAll(/location:\s*"(.*?)",\s*locationUrl:\s*"(.*?)"/g)];
    
    for (const match of matches) {
        const fullMatch = match[0];
        const locationStr = match[1];
        let currentUrl = match[2];
        let newUrl = currentUrl;
        
        const roomMatch = locationStr.match(/\(([^)]+)\)$/); 
        
        if (roomMatch && roomMatch[1] && roomMatch[1].includes('.')) { 
             newUrl = `https://nav.tum.de/room/${roomMatch[1]}`;
        } else {
             if (locationStr.startsWith("H.")) {
                  const code = locationStr.split(',')[0].trim();
                  try {
                      const res = await fetch(`https://nav.tum.de/api/search?q=${encodeURIComponent(code)}`);
                      const data = await res.json();
                      let found = null;
                      if (data.sections) {
                          const rms = data.sections.find(s => s.facet === 'rooms');
                          if (rms && rms.entries.length) {
                              const best = rms.entries.find(e => e.id.startsWith("2910")) || rms.entries[0];
                              found = best.id;
                          }
                      }
                      if (found) {
                          newUrl = `https://nav.tum.de/room/${found}`;
                          const updatedMatchString = `location: "${locationStr}", locationUrl: "${newUrl}"`;
                          newContent = newContent.replace(fullMatch, updatedMatchString);
                          continue;
                      }
                  } catch(e) {}
             }

             // We will query the name parts (e.g., "Audimax", "Karl Max von Bauernfeind") first, as they are safer than generic numbers like "0880"
             const parts = locationStr.replace(/;/g, ',').split(',').map(s => s.trim());
             // Query order: [ "Audimax", "0880, Audimax", "0880" ]
             let queries = [];
             if (parts.length > 1) queries.push(parts[1]); 
             queries.push(locationStr);
             queries.push(parts[0]);

             let foundId = null;

             for (const q of queries) {
                 if (foundId) break;
                 if (q === "Hörsaal" || q === "Seminarraum" || q === "CIP-Raum") continue; 

                 try {
                     const res = await fetch(`https://nav.tum.de/api/search?q=${encodeURIComponent(q)}`);
                     const data = await res.json();
                     
                     if (data && data.sections) {
                         const roomsSection = data.sections.find(sec => sec.facet === 'rooms');
                         if (roomsSection && roomsSection.entries && roomsSection.entries.length > 0) {
                             // Force strict stammgelände matching for ambiguous shortcodes
                             let bestMatch = roomsSection.entries.find(e => e.subtext && e.subtext.toLowerCase().includes('stammgelände'));
                             
                             // If no stammgelände but we got a result, just use the first result
                             if (!bestMatch) {
                                 bestMatch = roomsSection.entries[0];
                             }
                             
                             if (bestMatch) {
                                 foundId = bestMatch.id;
                             }
                         }
                     }
                 } catch (err) {}
             }

             if (foundId) {
                 newUrl = `https://nav.tum.de/room/${foundId}`;
             } else {
                 newUrl = "https://campus.tum.de/";
             }
        }
        
        const updatedMatchString = `location: "${locationStr}", locationUrl: "${newUrl}"`;
        newContent = newContent.replace(fullMatch, updatedMatchString);
    }

    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log("Updated URLs actively from TUM Nav API.");
    } else {
        console.log("No URL updates were necessary.");
    }
}

processUrls();
