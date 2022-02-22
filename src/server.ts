import net from 'net';
import type { Socket } from 'net';
import fs from 'fs';

import { FileExtension } from './utils/types';
import createHttpResponse from './utils/createHttpResponse';
import parseHttpRequest, { HttpRequest } from './utils/parseHttpRequest';
import extensionToContentTypeMap from './utils/extensionsToContentTypeMap';
import availableResources from './utils/availableResources';

const server = net.createServer();
const SERVER_PORT = 8000;

const handleConnection = (socket: Socket) => {
  socket.setDefaultEncoding('utf8');

  let request: HttpRequest;

  socket.on('data', async (data) => {
    request = parseHttpRequest(data);

    if (request.path === '/') {
      return fs.readFile(`./public/index.html`, (error, file) => {
        socket.write(
          createHttpResponse({
            body: file,
            headers: {
              'Content-Type': 'text/html',
            },
          })
        );
        socket.end();
      });
    }

    const isResourceAvailable = availableResources.includes(
      request.path.substring(1) // remover o / do caminho
    );

    if (isResourceAvailable) {
      // transforma "nome.do.arquivo.extensao"
      // em: "extensao"
      const extensionName = request.path.split('.').pop();

      // como temos certeza que o recurso existe, podemos fazer o
      // explicit cast de ".extensionName" como FileExtension
      // para que o typescript não reclame
      const resourceExtension = ('.' + extensionName) as FileExtension;
      const contentType = extensionToContentTypeMap[resourceExtension];

      console.log('serving', request.path);
      return fs.readFile(`./public/${request.path}`, (error, file) => {
        socket.write(
          createHttpResponse({
            body: file,
            headers: {
              'Content-Type': contentType,
            },
          })
        );
        socket.end();
      });
    }

    return fs.readFile(`./public/404.html`, (error, file) => {
      socket.write(
        createHttpResponse({
          body: file,
          statusCode: 404,
          statusMessage: 'Not Found',
          headers: {
            'Content-Type': 'text/html',
          },
        })
      );
      socket.end();
    });
  });

  socket.on('close', () => {
    console.log('socket closed', request?.path);
  });
};

server.on('connection', handleConnection);

server.listen(SERVER_PORT, function () {
  console.log(`Server listening at port ${SERVER_PORT}`);
});
