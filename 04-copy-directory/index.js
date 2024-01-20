const fs = require('fs');
const path = require('path');

async function makeCopy() {
  const newCopyPath = path.join(__dirname, 'files-copy');
  await fs.promises.mkdir(newCopyPath, {
    recursive: true,
  });
  const originalFilesPath = path.join(__dirname, 'files');
  const foldersFiles = await fs.promises.readdir(originalFilesPath, {
    withFileTypes: true,
  });
  for (file of foldersFiles) {
    console.log(file.name);
    if (file.isFile()) {
      fs.copyFile(
        path.join(__dirname, 'files', file.name),
        path.join(__dirname, 'files-copy', file.name),
        (err) => {
          if (err) throw err;
        },
      );
    }
  }
}
try {
  const newFiles = path.join(__dirname, 'files-copy');
  fs.rm(newFiles, { recursive: true, force: true }, (err) => {
    if (err) {
      console.log(error);
    }
    makeCopy();
    console.log('Files are succesfully copied');
  });
} catch (error) {
  console.log(error);
}
