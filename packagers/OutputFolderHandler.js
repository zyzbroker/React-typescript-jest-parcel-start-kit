const fs = require("fs");
const path = require("path");
const util = require("util");

const readdir = util.promisify(fs.readdir);
const fileInfo = util.promisify(fs.stat);
const delFile = util.promisify(fs.unlink);

async function outputFolderProcessor(runFolder, outFolder){
  console.log("---clean up outputfolder generated files----");
  let folder = path.join(runFolder, outFolder);
  let files = await readdir(folder);
  let fileStat;
  let filePath;

  for(var f of files){
    filePath = path.join(folder, f);
    fileStat = await fileInfo(filePath);
    fileStat.isFile() && await delFile(filePath);
  }
}

module.exports = outputFolderProcessor;