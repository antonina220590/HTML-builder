const fs = require("fs");
const path = require("path");

(async () => {
  try {
    const stylesFilePath = path.join(__dirname, "styles");
    const foldersFiles = await fs.promises.readdir(stylesFilePath, {
      withFileTypes: true,
    });
    const bundle = fs.createWriteStream(
      path.join(__dirname, "project-dist", "bundle.css"),
      "utf-8"
    );
    const checkFiles = foldersFiles.filter((file) => file.isFile());
    for (let file of checkFiles) {
      const filePath = path.join(stylesFilePath, file.name);
      const fileExtention = path.extname(filePath).replace('.', '');
       console.log(fileExtention)
      if (fileExtention === "css") {
        const resultFiles = await fs.promises.readFile(
          path.join(stylesFilePath, file.name),
          "utf-8"
        );
        bundle.write(`${resultFiles}\n`);
      }
    }
    console.log("styles are bundled");
  } catch (error) {
    console.log("Error");
  }
})();
