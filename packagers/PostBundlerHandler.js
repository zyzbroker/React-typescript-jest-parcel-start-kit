const fs = require("fs");
const util = require("util");
const path = require("path");
const htmlParser = require("posthtml-parser");
const htmlRender = require("posthtml-render");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);

async function getPackageJson() {
  let packageJsonFile = process.cwd() + "/package.json";
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

function rollbackScriptPlaceHolder(head, packageJson){
  head.content.forEach((el)=>{
    if (!! el.tag && el.tag === 'script-place-holder'){
        el.tag = "script";
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

async function rollbackChangesOnEntryFile(fileName) {
  await copyFile(fileName + ".bak", fileName);
}

async function postBundlerProcessor(runFolder, outputFolder, outFile) {
  
    console.log("---rollback injected script placeholder for external scripts----");
   //step1: load package.json
   let packageJsonFile = path.join(runFolder, "pacakge.json");
   let packageJson = await getPackageJson(packageJsonFile);
   if (! hasExternals(packageJson)) {
     return;
   }
   outputFolder = outputFolder.replace(".","");
 
   //step2: get ast tree
   let indexFileName = path.join(runFolder, outputFolder, outFile);

   let htmlTree = await getIndexAST(indexFileName);
 
   //step3: find head section
   let head = findHead(htmlTree);
 
   //step4: replace externals' script tag
   rollbackScriptPlaceHolder(head, packageJson);
 
   //step5: write back changes
   await dumpIndexAST(indexFileName, htmlTree);

   //step6: rollback original entryfile changes
   let orginalIndexFile = path.join(runFolder, packageJson.entry);
   await rollbackChangesOnEntryFile(orginalIndexFile).then(()=>{
    fs.unlinkSync(orginalIndexFile + ".bak");
   });
 }
 
 module.exports = postBundlerProcessor;