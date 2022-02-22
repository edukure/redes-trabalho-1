const parseHttpRequest = (data: Buffer) => {
  // separar o buffer da requesição em um array de strings
  const request = data.toString().split('\r\n');

  /* primeira linha (requisicao)
  exemplo: GET / HTTP/1.1, 
  método recurso tipo-http
  */
  const firstLine = request[0];
  // separando os dados da requisição em variaveis
  const [method, path, httpVersion] = firstLine.split(' ');

  const endOfHeader = request.indexOf('');
  const headerLines = request.slice(1, endOfHeader);

  const headers = parseHeaders(headerLines);
  const body = request.slice(endOfHeader);

  return {
    method,
    path,
    httpVersion,
    headers,
    body,
  };
};

/*
    Retorna um objeto contendo pares chave-valor da request
    ex:
    {
      Host: ' localhost',
      Connection: ' keep-alive',
      'sec-ch-ua': ' " Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
      'sec-ch-ua-mobile': ' ?0',
      'sec-ch-ua-platform': ' "Windows"',
      'Upgrade-Insecure-Requests': ' 1',
      'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      Accept: ' text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng;q=0.8,application/signed-exchange;v=b3;q=0.9',
      Referer: ' http',
      'Accept-Encoding': ' gzip, deflate, br',
      'Accept-Language': ' pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
    }   
*/
const parseHeaders = (headerLines: string[]) => {
  // para cada linha dos headers
  // retornar nome-header: valor
  return headerLines.reduce((acc, current) => {
    const [key, value] = current.trim().split(':');

    acc = {
      ...acc,
      [key]: value,
    };

    return acc;
  }, {});
};

export type HttpRequest = ReturnType<typeof parseHttpRequest>;

export default parseHttpRequest;
