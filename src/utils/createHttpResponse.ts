import { ContentType } from './types';

interface HttpResponseOptions {
  statusMessage?: string;
  statusCode?: number;
  protocol?: string;
  headers?: { ['Content-Type']: ContentType; [key: string]: string };
  body: Buffer | string;
}

const createHttpResponse = ({
  body,
  headers = { 'Content-Type': 'text/plain' },
  protocol = 'HTTP/1.0',
  statusMessage = 'OK',
  statusCode = 200,
}: HttpResponseOptions) => {
  const firstLine = `${protocol} ${statusCode} ${statusMessage}`;

  const formatedHeaders = formatResponseHeaders(headers);
  const response = Buffer.from(
    [firstLine, formatedHeaders, '\r\n'].join('\r\n')
  );

  return Buffer.concat([response, Buffer.from(body)]);
};

/*
  Para cada linha do objeto header,
  retornar uma linha com: "chave: valor"
  e juntar todas as linhas com "\r\n"
  
  ex:
  input: {
    "Content-Type": "application/json",
  }
  
  output: 
  "Content-Type: application/json
  "
*/
const formatResponseHeaders = (headers: { [key: string]: string }) => {
  const headerKeys = Object.keys(headers);

  return `${headerKeys.map((key) => `${key}: ${headers[key]}`).join('\r\n')}`;
};

export default createHttpResponse;
