import fs from 'fs';
import path from 'path';
import multer, { StorageEngine } from 'multer';

const uploadDirectory = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    cb(null, uploadDirectory); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const datePrefix = Date.now();
    cb(null, `${datePrefix}-${file.originalname}`); 
  },
});

const upload = multer({ storage });

export default upload;
