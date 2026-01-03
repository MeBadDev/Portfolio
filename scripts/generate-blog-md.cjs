// Generate a markdown blog template with all metadatas

const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, ans => resolve(ans)));
    }



async function main() {
    const title = await askQuestion("Enter blog title: ");
    const description = await askQuestion("Enter blog description: ");
    const tags = await askQuestion("Enter blog tags (comma separated): ");
    const slug = await askQuestion("Enter blog slug (optional, leave blank to auto-generate): ");
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const unix_time = Math.floor(now.getTime() / 1000);
    
    const filename = (slug || title.toLowerCase().replace(/\s+/g, '-')).replace(/[^a-z0-9\-]/g, '') + '.md';
    const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    
    const content = `---
title: "${title}"
description: "${description}"
date: "${dateStr}"
unix_time: ${unix_time}
tags: [${tagsArray.map(t => `"${t}"`).join(', ')}]
${slug ? `slug: "${slug}"\n` : ''}---`;

    // Write to file
    const outputPath = `./public/raw-blogs/${filename}`;
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`Blog template generated: ${outputPath}`);

    
    rl.close();
}

main().catch(err => {
    console.error('Error:', err);
    rl.close();
})
