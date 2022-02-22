/*
não pega pastas recursivamente
*/
// const availableResources = fs
//   .readdirSync('./public', { withFileTypes: true })
//   .filter((item) => !item.isDirectory())
//   .map((item) => item.name);

import fs from 'fs';
import path from 'path';
const availableResources: string[] = [];

// peguei de https://stackoverflow.com/a/63111390
/*
  lista arquivos, inclusive os que estão dentro de outras pastas
  isso é necessário porque temos o /dist do app react dentro de /public/react
*/
function ThroughDirectory(directory: string) {
  fs.readdirSync(directory).forEach((File) => {
    const absolute = path.join(directory, File);
    if (fs.statSync(absolute).isDirectory()) return ThroughDirectory(absolute);
    else
      return availableResources.push(
        absolute.split('\\').join('/').replace('public/', '')
      );
  });
}

ThroughDirectory('./public');

export default availableResources;
