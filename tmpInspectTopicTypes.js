const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/data/topicQuestionTypes.json', 'utf8'));
const unique = new Set();
for (const subject of Object.values(data)) {
  if (subject && typeof subject === 'object') {
    for (const arr of Object.values(subject)) {
      if (Array.isArray(arr)) {
        arr.forEach((v) => unique.add(v));
      }
    }
  }
}
console.log('unique types count', unique.size);
console.log([...unique].sort().join('\n'));
