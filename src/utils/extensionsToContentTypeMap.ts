import { ContentType, FileExtension } from './types';

// Cada "extension" terá como valor obrigatoriamente um ContentType
export type ExtensionToContentTypeMap = {
  [Extension in FileExtension]: ContentType;
};

const extensionToContentTypeMap: ExtensionToContentTypeMap = {
  '.html': 'text/html',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
};

export default extensionToContentTypeMap;
