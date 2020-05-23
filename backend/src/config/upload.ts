import { resolve } from 'path';
import { randomBytes } from 'crypto';
import { diskStorage, StorageEngine } from 'multer';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  config: {
    aws: {
      bucket: string;
    };
    disk: {};
  };
  driver: 's3' | 'disk';
  multer: {
    storage: StorageEngine;
  };
  tmpFolder: string;
  uploadsFolder: string;
}

export default {
  config: {
    aws: {
      bucket: 'app-gobarber',
    },
    disk: {},
  },
  driver: process.env.STORAGE_DRIVER,
  multer: {
    storage: diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = randomBytes(10).toString('HEX');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },
  tmpFolder,
  uploadsFolder: resolve(tmpFolder, 'uploads'),
} as IUploadConfig;
