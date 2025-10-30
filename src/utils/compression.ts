import pako from 'pako';

/**
 * Converte Uint8Array para base64 processando em chunks para evitar stack overflow
 */
const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  const CHUNK_SIZE = 0x8000; // 32KB chunks
  let result = '';
  
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
    result += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(result);
};

/**
 * Comprime dados JSON usando gzip
 * @param data - Dados a serem comprimidos
 * @returns String base64 com dados comprimidos
 */
export const compressData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const compressed = pako.gzip(jsonString);
    return uint8ArrayToBase64(compressed);
  } catch (error) {
    console.error('Erro ao comprimir dados:', error);
    throw new Error('Falha ao comprimir dados para salvamento');
  }
};

/**
 * Descomprime dados comprimidos com gzip
 * @param compressedData - String base64 com dados comprimidos
 * @returns Dados originais descomprimidos
 */
export const decompressData = (compressedData: string): any => {
  try {
    const binaryString = atob(compressedData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decompressed = pako.ungzip(bytes, { to: 'string' });
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('Erro ao descomprimir dados:', error);
    throw new Error('Falha ao descomprimir dados');
  }
};

/**
 * Calcula o tamanho dos dados em MB
 * @param data - Dados para calcular o tamanho
 * @returns Tamanho em MB
 */
export const getDataSizeInMB = (data: any): number => {
  const jsonString = JSON.stringify(data);
  const bytes = new Blob([jsonString]).size;
  return bytes / (1024 * 1024);
};
