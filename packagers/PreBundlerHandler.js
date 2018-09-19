const fs = require("fs");
const util = require("util");
const path = require("path");
const htmlParser = require("posthtml-parser");
const htmlRender = require("posthtml-render");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);

async function getPackageJson(packageJsonFile) 
{
  let content = await readFile(packageJsonFile);
  return JSON.parse(content);  
}

async function getIndexAST(indexFileName) {
  let content = await readFile(indexFileName);
  return htmlParser(content);
}

async function dumpIndexAST(indexFileName, indexAst) {
  let html = htmlRender(indexAst);
  await writeFile(indexFileName, html);
}

function findHead(htmlTree) {
  for(var el of htmlTree[0].content){
    if(el.tag === 'head'){
      return el;
    }
  }  
  return null;
}

function isExternalScriptTag(src, packageJson){
  return packageJson.externals.some((v)=> v === src);
}

function replaceScriptToPlaceHolder(head, packageJson){
  head.content.forEach((el)=>{
    if (!! el.tag && el.tag === 'script'){
      if (isExternalScriptTag(el.attrs.src, packageJson)) {
        el.tag = "script-place-holder";
      }
    }
  });
}

function hasExternals(package) {
  if (!package.externals || !Array.isArray(package.externals)) {
    console.log("no external scripts to process");
    return 0;
  }
  if (!package.entry || !package.entry) {
    console.log("please specify entry html file name");
    return 0;
  }
  return 1;
}

async function backupEntryFile(fileName) {
  await copyFile(fileName, fileName + ".bak");
}

async function preBundlerProcessor(runFolder) {
  
  console.log("----inject script placecholder for external scripts----");
  //step1: load package.json
  let packageJsonFile = path.join(runFolder, "package.json");
  let packageJson = await getPackageJson(packageJsonFile);
  if (! hasExternals(packageJson)) {
    return;
  }

  //step2: backup indexFile
  let indexFileName = path.join(runFolder, packageJson.entry);
  copyFile(indexFileName, indexFileName + ".bak");

  //step3: get AST tree;
  let htmlTree = await getIndexAST(indexFileName);

  //step4: find head section
  let head = findHead(htmlTree);

  //step5: replace externals' script tag
  replaceScriptToPlaceHolder(head, packageJson);

  //step6: write back changes
  await dumpIndexAST(indexFileName, htmlTree);

}

module.exports = preBundlerProcessor;