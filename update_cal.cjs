const fs = require('fs');

const file = 'src/components/WeekCalendar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'import { useMemo } from "react";',
  'import { useMemo, useState, useEffect } from "react";\nimport { ChevronLeft, ChevronRight } from "lucide-react";'
);

content = content.replace(
  'for (let hour = 8; hour <= 18; hour++) {',
  'for (let hour = 8; hour <= 20; hour++) {'
);

fs.writeFileSync(file, content);
