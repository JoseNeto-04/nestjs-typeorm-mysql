import { createReadStream, ReadStream } from 'fs';

export const getFileToBuffer = (filename: string) => {
  const readStream = createReadStream(filename);
  const chunks: Buffer[] = [];

  return new Promise<{
    buffer: Buffer;
    stream: ReadStream;
  }>((resolve, reject) => {
    readStream.on('data', (chunk) => {
      chunks.push(Buffer.from(chunk));
    });

    readStream.on('error', (error) => reject(error));

    readStream.on('end', () => {
      resolve({
        buffer: Buffer.concat(chunks),
        stream: readStream,
      });
    });
  });
};
