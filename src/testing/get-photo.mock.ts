import { getFileToBuffer } from './file-to-buffer';
import { join } from 'path';

export const getPhoto = async () => {
  const { buffer, stream } = await getFileToBuffer(
    join(__dirname, 'photo.png'),
  );

  const photo: Express.Multer.File = {
    fieldname: 'file',
    originalname: ' photo.png',
    encoding: '7 bit',
    mimetype: 'image/png',
    size: 1024 * 50,
    stream,
    destination: '',
    filename: 'file-name',
    path: 'file-path',
    buffer,
  };

  return photo;
};
