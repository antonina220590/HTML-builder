const fs = require('fs');
const path = require('path');
const newFolderPath = path.join(__dirname, 'project-dist');
const originalAssets = path.join(__dirname, 'assets');
const newAssets = path.join(__dirname, 'project-dist', 'assets');
const template = path.join(__dirname, 'template.html');

async function createProjectFolder() {
  await fs.promises.mkdir(newFolderPath, {
    recursive: true,
  });
}
createProjectFolder();

async function copyAssets(originalAssets, newAssets) {
  const foldersFiles = await fs.promises.readdir(originalAssets, {
    withFileTypes: true,
  });
  for (const file of foldersFiles) {
    const originalPath = path.join(originalAssets, file.name);
    const newPath = path.join(newAssets, file.name);
    if (file.isFile()) {
      await fs.promises.copyFile(originalPath, newPath);
    } else {
      await fs.promises.mkdir(newPath, { recursive: true });
      await copyAssets(originalPath, newPath);
    }
  }
}

try {
  fs.rm(newAssets, { recursive: true, force: true }, (err) => {
    if (err) {
      console.log(err);
    }
    copyAssets(originalAssets, newAssets);
    console.log('Files are succesfully copied');
  });
} catch (error) {
  console.log(error);
}

(async () => {
  try {
    const stylesFilePath = path.join(__dirname, 'styles');
    const foldersFiles = await fs.promises.readdir(stylesFilePath, {
      withFileTypes: true,
    });
    const bundleCss = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css'),
      'utf-8',
    );
    const checkFiles = foldersFiles.filter((file) => file.isFile());
    for (let file of checkFiles) {
      const filePath = path.join(stylesFilePath, file.name);
      const fileExtention = path.extname(filePath).replace('.', '');
      if (fileExtention === 'css') {
        const resultFiles = await fs.promises.readFile(
          path.join(stylesFilePath, file.name),
          'utf-8',
        );
        bundleCss.write(`${resultFiles}\n`);
      }
    }
    console.log('styles are bundled');
  } catch (error) {
    console.log('Error');
  }
})();

(async () => {
  try {
    let templateFile = await fs.promises.readFile(template, 'utf8');
    const componentsPath = path.join(__dirname, 'components');
    const foldersFiles = await fs.promises.readdir(componentsPath, {
      withFileTypes: true,
    });
    const regexTag = /{{(.*?)}}/g;
    let templateFileTags = templateFile.match(regexTag);

    for (const file of foldersFiles) {
      const filePath = path.join(componentsPath, file.name);
      const fileName = path.basename(filePath).split('.')[0];
      const tempFileName = `{{${fileName}}}`;
      const componentFilesPath = path.join(componentsPath, `${fileName}.html`);

      for (const tag of templateFileTags) {
        if (tempFileName === tag) {
          const readComponentFiles = await fs.promises.readFile(
            componentFilesPath,
            'utf-8',
          );
          templateFile = templateFile.replace(tag, readComponentFiles);
        }
      }
    }
    fs.createWriteStream(path.join(newFolderPath, 'index.html')).write(
      templateFile,
    );
    console.log('html is bundled');
  } catch (err) {
    console.log(err);
  }
})();
