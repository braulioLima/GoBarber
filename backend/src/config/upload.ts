import { resolve } from 'path';
import { randomBytes } from 'crypto';
import { diskStorage } from 'multer';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  uploadsFolder: resolve(tmpFolder, 'uploads'),

  storage: diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
