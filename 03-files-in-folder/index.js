const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const secretFolderPath = path.join(__dirname, 'secret-folder');
    const foldersFiles = await fs.promises.readdir(secretFolderPath, {
      withFileTypes: true,
    });
    foldersFiles.forEach(async (file) => {
      if (!file.isDirectory()) {
        const filePath = path.join(secretFolderPath, file.name);
        const fileName = path.basename(filePath).split('.')[0];
        const fileExtention = path.extname(filePath).replace('.', '');
        const fileStat = await fs.promises.stat(filePath);
        const fileStatSize = fileStat.size;

        if (fileName && fileExtention && fileStatSize) {
          console.log(`${fileName} - ${fileExtention} - ${fileStatSize}b`);
        }
      }
    });
  } catch (error) {
    console.log('Error');
  }
})();
