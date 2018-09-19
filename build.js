const Bundler = require("parcel-bundler");
const Path = require("path");
const preBundlerHandler = require("./packagers/PreBundlerHandler");
const postBundlerHandler = require("./packagers/PostBundlerHandler");
const outputFolderHandler = require("./packagers/OutputFolderHandler");
const entryFiles = Path.join(__dirname, "./index.html");
const distPath = "./dist";

const options = {
  outDir: distPath, // The out directory to put the build files in, defaults to dist
  outFile: "index.html", // The name of the outputFile
  publicUrl: "", // The url to server on, defaults to dist
  watch: true, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: true, // Enabled or disables caching, defaults to true
  cacheDir: ".cache", // The directory cache gets put in, defaults to .cache
  contentHash: false, // Disable content hash from being included on the filename
  minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  target: "browser", // browser/node/electron, defaults to browser
  // https: { // Define a custom {key, cert} pair, use true to generate one or false to use http
  //   cert: './ssl/c.crt', // path to custom certificate
  //   key: './ssl/k.key' // path to custom key
  // },
  logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
  hmr: true, //Enable or disable HMR while watching
  hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
  hmrHostname: "", // A hostname for hot module reload, default to ''
  detailedReport: true // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
};

async function runBundle() {

  //step1: clean up the output folder except the folder created by developers
  await outputFolderHandler(__dirname, options.outDir);

  //step 2: preprocessing the externals
  await preBundlerHandler(__dirname);

  //step1: Initializes a bundler using the entrypoint location and options provided
  const bundler = new Bundler(entryFiles, options);

  //step4: Run the bundler, this returns the main bundle
  // Use the events if you're using watch mode as this promise will only trigger once and not for every rebuild
  const bundle = await bundler.bundle();

  //step5: postprocessing the externals
  await postBundlerHandler(__dirname, options.outDir, options.outFile);
}

runBundle().then(() => {
  console.log("---bundle completed----");
  process.exit(0);
});
