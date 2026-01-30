const fs = require('fs');
const path = require('path');

const routeFiles = [
  'src/routes/account.tsx',
  'src/routes/children/[id]/edit.tsx',
  'src/routes/children/[id]/index.tsx',
  'src/routes/children/index.tsx',
  'src/routes/expenses/index.tsx',
  'src/routes/families/[id]/children/[childId]/edit.tsx',
  'src/routes/families/[id]/children/[childId]/index.tsx',
  'src/routes/families/[id]/edit.tsx',
  'src/routes/families/[id]/index.tsx',
  'src/routes/families/[id]/schedules/[id]/edit.tsx',
  'src/routes/families/[id]/schedules/[id]/index.tsx',
  'src/routes/families/[id]/sessions/[sessionId]/edit.tsx',
  'src/routes/families/[id]/sessions/[sessionId]/index.tsx',
  'src/routes/families/[id]/sessions/[sessionId]/reports/new.tsx',
  'src/routes/families/index.tsx',
  'src/routes/payments/index.tsx',
  'src/routes/reports/calendar.tsx',
  'src/routes/reports/income.tsx',
  'src/routes/reports/index.tsx',
  'src/routes/reports/year-end.tsx',
  'src/routes/services/index.tsx',
  'src/routes/unavailability/index.tsx',
];

routeFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has ssr: false
  if (content.includes('ssr: false')) {
    console.log(`Skipping ${file} - already has ssr: false`);
    return;
  }
  
  // Add info: { ssr: false } before } satisfies RouteDefinition
  content = content.replace(
    /(\s+)\},(\s+)satisfies RouteDefinition;/,
    '$1},\n$1info: {\n$1  ssr: false, // Disable SSR for authenticated pages\n$1},$2satisfies RouteDefinition;'
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});

console.log('Done!');
