# gulp-getting-started

# 🚀 Getting Started tutorial for Gulp 🚀

https://github.com/coding-to-music/gulp-getting-started

From / By https://gulpjs.com/docs/en/getting-started/quick-start

https://github.com/gulpjs/gulp/tree/master/docs/getting-started

## Environment variables:

```java

```

## GitHub

```java
git init
git add .
git remote remove origin
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:coding-to-music/gulp-getting-started.git
git push -u origin main
```

<!-- front-matter
id: quick-start
title: Quick Start
hide_title: true
sidebar_label: Quick Start
-->

# Quick Start

If you've previously installed gulp globally, run `npm rm --global gulp` before following these instructions. For more information, read this [Sip][sip-article].

## Check for node, npm, and npx

```sh
node --version
```

![Output: v8.11.1][img-node-version-command]

```sh
npm --version
```

![Output: 5.6.0][img-npm-version-command]

```sh
npx --version
```

![Output: 9.7.1][img-npx-version-command]

If they are not installed, follow the instructions [here][node-install].

## Install the gulp command line utility

```sh
npm install --global gulp-cli
```

## Create a project directory and navigate into it

```sh
npx mkdirp my-project
```

```sh
cd my-project
```

## Create a package.json file in your project directory

```sh
npm init
```

This will guide you through giving your project a name, version, description, etc.

## Install the gulp package in your devDependencies

```sh
npm install --save-dev gulp
```

## Verify your gulp versions

```sh
gulp --version
```

Ensure the output matches the screenshot below or you might need to restart the steps in this guide.

![Output: CLI version 2.0.1 & Local version 4.0.0][img-gulp-version-command]

## Create a gulpfile

Using your text editor, create a file named gulpfile.js in your project root with these contents:

```js
function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask;
```

## Test it

Run the gulp command in your project directory:

```sh
gulp
```

To run multiple tasks, you can use `gulp <task> <othertask>`.

## Result

The default task will run and do nothing.
![Output: Starting default & Finished default][img-gulp-command]

[sip-article]: https://medium.com/gulpjs/gulp-sips-command-line-interface-e53411d4467
[node-install]: https://nodejs.org/en/
[img-node-version-command]: https://gulpjs.com/img/docs-node-version-command.png
[img-npm-version-command]: https://gulpjs.com/img/docs-npm-version-command.png
[img-npx-version-command]: https://gulpjs.com/img/docs-npx-version-command.png
[img-gulp-version-command]: https://gulpjs.com/img/docs-gulp-version-command.png
[img-gulp-command]: https://gulpjs.com/img/docs-gulp-command.png

<!-- front-matter
id: javascript-and-gulpfiles
title: JavaScript and Gulpfiles
hide_title: true
sidebar_label: JavaScript and Gulpfiles
-->

# JavaScript and Gulpfiles

Gulp allows you to use existing JavaScript knowledge to write gulpfiles or to use your experience with gulpfiles to write plain JavaScript. Although a few utilities are provided to simplify working with the filesystem and command line, everything else you write is pure JavaScript.

## Gulpfile explained

A gulpfile is a file in your project directory titled `gulpfile.js` (or capitalized as `Gulpfile.js`, like Makefile), that automatically loads when you run the `gulp` command. Within this file, you'll often see gulp APIs, like `src()`, `dest()`, `series()`, or `parallel()` but any vanilla JavaScript or Node modules can be used. Any exported functions will be registered into gulp's task system.

## Transpilation

You can write a gulpfile using a language that requires transpilation, like TypeScript or Babel, by changing the extension on your `gulpfile.js` to indicate the language and install the matching transpiler module.

- For TypeScript, rename to `gulpfile.ts` and install the [ts-node][ts-node-module] module.
- For Babel, rename to `gulpfile.babel.js` and install the [@babel/register][babel-register-module] module.

**Most new versions of node support most features that TypeScript or Babel provide, except the `import`/`export` syntax. When only that syntax is desired, rename to `gulpfile.esm.js` and install the [esm][esm-module] module.**

For a more advanced dive into this topic and the full list of supported extensions, see our [gulpfile transpilation][gulpfile-transpilation-advanced] documentation.

## Splitting a gulpfile

Many users start by adding all logic to a gulpfile. If it ever grows too big, it can be refactored into separate files.

Each task can be split into its own file, then imported into your gulpfile for composition. Not only does this keep things organized, but it allows you to test each task independently or vary composition based on conditions.

Node's module resolution allows you to replace your `gulpfile.js` file with a directory named `gulpfile.js` that contains an `index.js` file which is treated as a `gulpfile.js`. This directory could then contain your individual modules for tasks. If you are using a transpiler, name the folder and file accordingly.

[gulpfile-transpilation-advanced]: ../documentation-missing.md
[ts-node-module]: https://www.npmjs.com/package/ts-node
[babel-register-module]: https://www.npmjs.com/package/@babel/register
[esm-module]: https://www.npmjs.com/package/esm

<!-- front-matter
id: creating-tasks
title: Creating Tasks
hide_title: true
sidebar_label: Creating Tasks
-->

# Creating Tasks

Each gulp task is an asynchronous JavaScript function - a function that accepts an error-first callback or returns a stream, promise, event emitter, child process, or observable ([more on that later][async-completion-docs]). Due to some platform limitations, synchronous tasks aren't supported, though there is a pretty nifty [alternative][using-async-await-docs].

## Exporting

Tasks can be considered **public** or **private**.

- **Public tasks** are exported from your gulpfile, which allows them to be run by the `gulp` command.
- **Private tasks** are made to be used internally, usually used as part of `series()` or `parallel()` composition.

A private task looks and acts like any other task, but an end-user can't ever execute it independently. To register a task publicly, export it from your gulpfile.

```js
const { series } = require("gulp");

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
  // body omitted
  cb();
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function build(cb) {
  // body omitted
  cb();
}

exports.build = build;
exports.default = series(clean, build);
```

![ALT TEXT MISSING][img-gulp-tasks-command]

<small>In the past, `task()` was used to register your functions as tasks. While that API is still available, exporting should be the primary registration mechanism, except in edge cases where exports won't work.</small>

## Compose tasks

Gulp provides two powerful composition methods, `series()` and `parallel()`, allowing individual tasks to be composed into larger operations. Both methods accept any number of task functions or composed operations. `series()` and `parallel()` can be nested within themselves or each other to any depth.

To have your tasks execute in order, use the `series()` method.

```js
const { series } = require("gulp");

function transpile(cb) {
  // body omitted
  cb();
}

function bundle(cb) {
  // body omitted
  cb();
}

exports.build = series(transpile, bundle);
```

For tasks to run at maximum concurrency, combine them with the `parallel()` method.

```js
const { parallel } = require("gulp");

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

exports.build = parallel(javascript, css);
```

Tasks are composed immediately when either `series()` or `parallel()` is called. This allows variation in the composition instead of conditional behavior inside individual tasks.

```js
const { series } = require("gulp");

function minify(cb) {
  // body omitted
  cb();
}

function transpile(cb) {
  // body omitted
  cb();
}

function livereload(cb) {
  // body omitted
  cb();
}

if (process.env.NODE_ENV === "production") {
  exports.build = series(transpile, minify);
} else {
  exports.build = series(transpile, livereload);
}
```

`series()` and `parallel()` can be nested to any arbitrary depth.

```js
const { series, parallel } = require("gulp");

function clean(cb) {
  // body omitted
  cb();
}

function cssTranspile(cb) {
  // body omitted
  cb();
}

function cssMinify(cb) {
  // body omitted
  cb();
}

function jsTranspile(cb) {
  // body omitted
  cb();
}

function jsBundle(cb) {
  // body omitted
  cb();
}

function jsMinify(cb) {
  // body omitted
  cb();
}

function publish(cb) {
  // body omitted
  cb();
}

exports.build = series(
  clean,
  parallel(cssTranspile, series(jsTranspile, jsBundle)),
  parallel(cssMinify, jsMinify),
  publish
);
```

When a composed operation is run, each task will be executed every time it was referenced. For example, a `clean` task referenced before two different tasks would be run twice and lead to undesired results. Instead, refactor the `clean` task to be specified in the final composition.

If you have code like this:

```js
// This is INCORRECT
const { series, parallel } = require("gulp");

const clean = function (cb) {
  // body omitted
  cb();
};

const css = series(clean, function (cb) {
  // body omitted
  cb();
});

const javascript = series(clean, function (cb) {
  // body omitted
  cb();
});

exports.build = parallel(css, javascript);
```

Migrate to this:

```js
const { series, parallel } = require("gulp");

function clean(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

exports.build = series(clean, parallel(css, javascript));
```

[async-completion-docs]: ../getting-started/4-async-completion.md
[using-async-await-docs]: ../getting-started/4-async-completion.md#using-async-await
[img-gulp-tasks-command]: https://gulpjs.com/img/docs-gulp-tasks-command.png
[async-once]: https://github.com/gulpjs/async-once

<!-- front-matter
id: async-completion
title: Async Completion
hide_title: true
sidebar_label: Async Completion
-->

# Async Completion

Node libraries handle asynchronicity in a variety of ways. The most common pattern is [error-first callbacks][node-api-error-first-callbacks], but you might also encounter [streams][stream-docs], [promises][promise-docs], [event emitters][event-emitter-docs], [child processes][child-process-docs], or [observables][observable-docs]. Gulp tasks normalize all these types of asynchronicity.

## Signal task completion

When a stream, promise, event emitter, child process, or observable is returned from a task, the success or error informs gulp whether to continue or end. If a task errors, gulp will end immediately and show that error.

When composing tasks with `series()`, an error will end the composition and no further tasks will be executed. When composing tasks with `parallel()`, an error will end the composition but the other parallel tasks may or may not complete.

### Returning a stream

```js
const { src, dest } = require("gulp");

function streamTask() {
  return src("*.js").pipe(dest("output"));
}

exports.default = streamTask;
```

### Returning a promise

```js
function promiseTask() {
  return Promise.resolve("the value is ignored");
}

exports.default = promiseTask;
```

### Returning an event emitter

```js
const { EventEmitter } = require("events");

function eventEmitterTask() {
  const emitter = new EventEmitter();
  // Emit has to happen async otherwise gulp isn't listening yet
  setTimeout(() => emitter.emit("finish"), 250);
  return emitter;
}

exports.default = eventEmitterTask;
```

### Returning a child process

```js
const { exec } = require("child_process");

function childProcessTask() {
  return exec("date");
}

exports.default = childProcessTask;
```

### Returning an observable

```js
const { Observable } = require("rxjs");

function observableTask() {
  return Observable.of(1, 2, 3);
}

exports.default = observableTask;
```

### Using an error-first callback

If nothing is returned from your task, you must use the error-first callback to signal completion. The callback will be passed to your task as the only argument - named `cb()` in the examples below.

```js
function callbackTask(cb) {
  // `cb()` should be called by some async work
  cb();
}

exports.default = callbackTask;
```

To indicate to gulp that an error occurred in a task using an error-first callback, call it with an `Error` as the only argument.

```js
function callbackError(cb) {
  // `cb()` should be called by some async work
  cb(new Error("kaboom"));
}

exports.default = callbackError;
```

However, you'll often pass this callback to another API instead of calling it yourself.

```js
const fs = require("fs");

function passingCallback(cb) {
  fs.access("gulpfile.js", cb);
}

exports.default = passingCallback;
```

## No synchronous tasks

Synchronous tasks are no longer supported. They often led to subtle mistakes that were hard to debug, like forgetting to return your streams from a task.

When you see the _"Did you forget to signal async completion?"_ warning, none of the techniques mentioned above were used. You'll need to use the error-first callback or return a stream, promise, event emitter, child process, or observable to resolve the issue.

## Using async/await

When not using any of the previous options, you can define your task as an [`async` function][async-await-docs], which wraps your task in a promise. This allows you to work with promises synchronously using `await` and use other synchronous code.

```js
const fs = require("fs");

async function asyncAwaitTask() {
  const { version } = JSON.parse(fs.readFileSync("package.json", "utf8"));
  console.log(version);
  await Promise.resolve("some result");
}

exports.default = asyncAwaitTask;
```

[node-api-error-first-callbacks]: https://nodejs.org/api/errors.html#errors_error_first_callbacks
[stream-docs]: https://nodejs.org/api/stream.html#stream_stream
[promise-docs]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
[event-emitter-docs]: https://nodejs.org/api/events.html#events_events
[child-process-docs]: https://nodejs.org/api/child_process.html#child_process_child_process
[observable-docs]: https://github.com/tc39/proposal-observable/blob/master/README.md
[async-await-docs]: https://developers.google.com/web/fundamentals/primers/async-functions

<!-- front-matter
id: working-with-files
title: Working with Files
hide_title: true
sidebar_label: Working with Files
-->

# Working with Files

The `src()` and `dest()` methods are exposed by gulp to interact with files on your computer.

`src()` is given a [glob][explaining-globs-docs] to read from the file system and produces a [Node stream][node-streams-docs]. It locates all matching files and reads them into memory to pass through the stream.

The stream produced by `src()` should be returned from a task to signal async completion, as mentioned in [Creating Tasks][creating-tasks-docs].

```js
const { src, dest } = require("gulp");

exports.default = function () {
  return src("src/*.js").pipe(dest("output/"));
};
```

The main API of a stream is the `.pipe()` method for chaining Transform or Writable streams.

```js
const { src, dest } = require("gulp");
const babel = require("gulp-babel");

exports.default = function () {
  return src("src/*.js").pipe(babel()).pipe(dest("output/"));
};
```

`dest()` is given an output directory string and also produces a [Node stream][node-streams-docs] which is generally used as a terminator stream. When it receives a file passed through the pipeline, it writes the contents and other details out to the filesystem at a given directory. The `symlink()` method is also available and operates like `dest()`, but creates links instead of files (see [`symlink()`][symlink-api-docs] for details).

Most often plugins will be placed between `src()` and `dest()` using the `.pipe()` method and will transform the files within the stream.

## Adding files to the stream

`src()` can also be placed in the middle of a pipeline to add files to the stream based on the given globs. The additional files will only be available to transformations later in the stream. If [globs overlap][overlapping-globs-docs], the files will be added again.

This can be useful for transpiling some files before adding plain JavaScript files to the pipeline and uglifying everything.

```js
const { src, dest } = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

exports.default = function () {
  return src("src/*.js")
    .pipe(babel())
    .pipe(src("vendor/*.js"))
    .pipe(uglify())
    .pipe(dest("output/"));
};
```

## Output in phases

`dest()` can be used in the middle of a pipeline to write intermediate states to the filesystem. When a file is received, the current state is written out to the filesystem, the path is updated to represent the new location of the output file, then that file continues down the pipeline.

This feature can be useful to create unminified and minified files with the same pipeline.

```js
const { src, dest } = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

exports.default = function () {
  return src("src/*.js")
    .pipe(babel())
    .pipe(src("vendor/*.js"))
    .pipe(dest("output/"))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest("output/"));
};
```

## Modes: streaming, buffered, and empty

`src()` can operate in three modes: buffering, streaming, and empty. These are configured with the `buffer` and `read` [options][src-options-api-docs] on `src()`.

- Buffering mode is the default and loads the file contents into memory. Plugins usually operate in buffering mode and many don't support streaming mode.
- Streaming mode exists mainly to operate on large files that can't fit in memory, like giant images or movies. The contents are streamed from the filesystem in small chunks instead of loaded all at once. If you need to use streaming mode, look for a plugin that supports it or write your own.
- Empty mode contains no contents and is useful when only working with file metadata.

[explaining-globs-docs]: ../getting-started/6-explaining-globs.md
[creating-tasks-docs]: ../getting-started/3-creating-tasks.md
[overlapping-globs-docs]: ../getting-started/6-explaining-globs.md#overlapping-globs
[node-streams-docs]: https://nodejs.org/api/stream.html
[symlink-api-docs]: ../api/symlink.md
[src-options-api-docs]: ../api/src.md#options

<!-- front-matter
id: explaining-globs
title: Explaining Globs
hide_title: true
sidebar_label: Explaining Globs
-->

# Explaining Globs

A glob is a string of literal and/or wildcard characters used to match filepaths. Globbing is the act of locating files on a filesystem using one or more globs.

The `src()` method expects a single glob string or an array of globs to determine which files your pipeline will operate on. At least one match must be found for your glob(s) otherwise `src()` will error. When an array of globs is used, they are matched in array order - especially useful for negative globs.

## Segments and separators

A segment is everything between separators. The separator in a glob is always the `/` character - regardless of the operating system - even in Windows where the path separator is `\\`. In a glob, `\\` is reserved as the escape character.

Here, the \* is escaped, so it is treated as a literal instead of a wildcard character.

```js
"glob_with_uncommon_\\*_character.js";
```

Avoid using Node's `path` methods, like `path.join`, to create globs. On Windows, it produces an invalid glob because Node uses `\\` as the separator. Also avoid the `__dirname` global, `__filename` global, or `process.cwd()` for the same reasons.

```js
const invalidGlob = path.join(__dirname, "src/*.js");
```

## Special character: \* (single-star)

Matches any amount - including none - of characters within a single segment. Useful for globbing files within one directory.

This glob will match files like `index.js`, but not files like `scripts/index.js` or `scripts/nested/index.js`

```js
"*.js";
```

## Special character: \*\* (double-star)

Matches any amount - including none - of characters across segments. Useful for globbing files in nested directories. Make sure to appropriately restrict your double-star globs, to avoid matching large directories unnecessarily.

Here, the glob is appropriately restricted to the `scripts/` directory. It will match files like `scripts/index.js`, `scripts/nested/index.js`, and `scripts/nested/twice/index.js`.

```js
"scripts/**/*.js";
```

<small>In the previous example, if `scripts/` wasn't prefixed, all dependencies in `node_modules` or other directories would also be matched.</small>

## Special character: ! (negative)

Since globs are matched in array order, a negative glob must follow at least one non-negative glob in an array. The first finds a set of matches, then the negative glob removes a portion of those results. When excluding all files within a directory, you must add `/**` after the directory name, which the globbing library optimizes internally.

```js
["scripts/**/*.js", "!scripts/vendor/**"];
```

If any non-negative globs follow a negative, nothing will be removed from the later set of matches.

```js
["scripts/**/*.js", "!scripts/vendor/**", "scripts/vendor/react.js"];
```

Negative globs can be used as an alternative for restricting double-star globs.

```js
["**/*.js", "!node_modules/**"];
```

<small>In the previous example, if the negative glob was `!node_modules/**/*.js`, the globbing library wouldn't optimize the negation and every match would have to be compared against the negative glob, which would be extremely slow. To ignore all files in a directory, only add the `/**` glob after the directory name.</small>

## Overlapping globs

Two or more globs that (un)intentionally match the same file are considered overlapping. When overlapping globs are used within a single `src()`, gulp does its best to remove the duplicates, but doesn't attempt to deduplicate across separate `src()` calls.

## Advanced resources

Most of what you'll need to work with globs in gulp is covered here. If you'd like to get more in depth, here are a few resources.

- [Micromatch Documentation][micromatch-docs]
- [node-glob's Glob Primer][glob-primer-docs]
- [Begin's Globbing Documentation][begin-globbing-docs]
- [Wikipedia's Glob Page][wikipedia-glob]

[micromatch-docs]: https://github.com/micromatch/micromatch
[glob-primer-docs]: https://github.com/isaacs/node-glob#glob-primer
[begin-globbing-docs]: https://github.com/begin/globbing#what-is-globbing
[wikipedia-glob]: https://en.wikipedia.org/wiki/Glob_(programming)

<!-- front-matter
id: using-plugins
title: Using Plugins
hide_title: true
sidebar_label: Using Plugins
-->

# Using Plugins

Gulp plugins are [Node Transform Streams][through2-docs] that encapsulate common behavior to transform files in a pipeline - often placed between `src()` and `dest()` using the `.pipe()` method. They can change the filename, metadata, or contents of every file that passes through the stream.

Plugins from npm - using the "gulpplugin" and "gulpfriendly" keywords - can be browsed and searched on the [plugin search page][gulp-plugin-site].

Each plugin should only do a small amount of work, so you can connect them like building blocks. You may need to combine a bunch of them to get the desired result.

```js
const { src, dest } = require("gulp");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");

exports.default = function () {
  return (
    src("src/*.js")
      // The gulp-uglify plugin won't update the filename
      .pipe(uglify())
      // So use gulp-rename to change the extension
      .pipe(rename({ extname: ".min.js" }))
      .pipe(dest("output/"))
  );
};
```

## Do you need a plugin?

Not everything in gulp should use plugins. They are a quick way to get started, but many operations are improved by using a module or library instead.

```js
const { rollup } = require("rollup");

// Rollup's promise API works great in an `async` task
exports.default = async function () {
  const bundle = await rollup({
    input: "src/index.js",
  });

  return bundle.write({
    file: "output/bundle.js",
    format: "iife",
  });
};
```

Plugins should always transform files. Use a (non-plugin) Node module or library for any other operations.

```js
const del = require("delete");

exports.default = function (cb) {
  // Use the `delete` module directly, instead of using gulp-rimraf
  del(["output/*.js"], cb);
};
```

## Conditional plugins

Since plugin operations shouldn't be file-type-aware, you may need a plugin like [gulp-if][gulp-if-package] to transform subsets of files.

```js
const { src, dest } = require("gulp");
const gulpif = require("gulp-if");
const uglify = require("gulp-uglify");

function isJavaScript(file) {
  // Check if file extension is '.js'
  return file.extname === ".js";
}

exports.default = function () {
  // Include JavaScript and CSS files in a single pipeline
  return (
    src(["src/*.js", "src/*.css"])
      // Only apply gulp-uglify plugin to JavaScript files
      .pipe(gulpif(isJavaScript, uglify()))
      .pipe(dest("output/"))
  );
};
```

## Inline plugins

Inline plugins are one-off Transform Streams you define inside your gulpfile by writing the desired behavior.

There are two situations where creating an inline plugin is helpful:

- Instead of creating and maintaining your own plugin.
- Instead of forking a plugin that exists to add a feature you want.

```js
const { src, dest } = require("gulp");
const uglify = require("uglify-js");
const through2 = require("through2");

exports.default = function () {
  return (
    src("src/*.js")
      // Instead of using gulp-uglify, you can create an inline plugin
      .pipe(
        through2.obj(function (file, _, cb) {
          if (file.isBuffer()) {
            const code = uglify.minify(file.contents.toString());
            file.contents = Buffer.from(code.code);
          }
          cb(null, file);
        })
      )
      .pipe(dest("output/"))
  );
};
```

[gulp-plugin-site]: https://gulpjs.com/plugins/
[through2-docs]: https://github.com/rvagg/through2
[gulp-if-package]: https://www.npmjs.com/package/gulp-if

<!-- front-matter
id: watching-files
title: Watching Files
hide_title: true
sidebar_label: Watching Files
-->

# Watching Files

The `watch()` API connects [globs][globs-docs] to [tasks][creating-tasks-docs] using a file system watcher. It watches for changes to files that match the globs and executes the task when a change occurs. If the task doesn't signal [Async Completion][async-completion-doc], it will never be run a second time.

This API provides built-in delay and queueing based on most-common-use defaults.

```js
const { watch, series } = require("gulp");

function clean(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

exports.default = function () {
  // You can use a single task
  watch("src/*.css", css);
  // Or a composed task
  watch("src/*.js", series(clean, javascript));
};
```

## Warning: avoid synchronous

A watcher's task cannot be synchronous, like tasks registered into the task system. If you pass a sync task, the completion can't be determined and the task won't run again - it is assumed to still be running.

There is no error or warning message provided because the file watcher keeps your Node process running. Since the process doesn't exit, it cannot be determined whether the task is done or just taking a really, really long time to run.

## Watched events

By default, the watcher executes tasks whenever a file is created, changed, or deleted.
If you need to use different events, you can use the `events` option when calling `watch()`. The available events are `'add'`, `'addDir'`, `'change'`, `'unlink'`, `'unlinkDir'`, `'ready'`, `'error'`. Additionally `'all'` is available, which represents all events other than `'ready'` and `'error'`.

```js
const { watch } = require("gulp");

exports.default = function () {
  // All events will be watched
  watch("src/*.js", { events: "all" }, function (cb) {
    // body omitted
    cb();
  });
};
```

## Initial execution

Upon calling `watch()`, the tasks won't be executed, instead they'll wait for the first file change.

To execute tasks before the first file change, set the `ignoreInitial` option to `false`.

```js
const { watch } = require("gulp");

exports.default = function () {
  // The task will be executed upon startup
  watch("src/*.js", { ignoreInitial: false }, function (cb) {
    // body omitted
    cb();
  });
};
```

## Queueing

Each `watch()` guarantees that its currently running task won't execute again concurrently. When a file change is made while a watcher task is running, another execution will queue up to run when the task finishes. Only one run can be queued up at a time.

To disable queueing, set the `queue` option to `false`.

```js
const { watch } = require("gulp");

exports.default = function () {
  // The task will be run (concurrently) for every change made
  watch("src/*.js", { queue: false }, function (cb) {
    // body omitted
    cb();
  });
};
```

## Delay

Upon file change, a watcher task won't run until a 200ms delay has elapsed. This is to avoid starting a task too early when many files are being changed at once - like find-and-replace.

To adjust the delay duration, set the `delay` option to a positive integer.

```js
const { watch } = require("gulp");

exports.default = function () {
  // The task won't be run until 500ms have elapsed since the first change
  watch("src/*.js", { delay: 500 }, function (cb) {
    // body omitted
    cb();
  });
};
```

## Using the watcher instance

You likely won't use this feature, but if you need full control over changed files - like access to paths or metadata - use the [chokidar][chokidar-module-package] instance returned from `watch()`.

**Be careful:** The returned chokidar instance doesn't have queueing, delay, or async completion features.

## Optional dependency

Gulp has an optional dependency called [fsevents][fsevents-package], which is a Mac-specific file watcher. If you see an installation warning for fsevents - _"npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents"_ - it is not an issue.
If fsevents installation is skipped, a fallback watcher will be used and any errors occurring in your gulpfile aren't related to this warning.

[globs-docs]: ../getting-started/6-explaining-globs.md
[creating-tasks-docs]: ../getting-started/3-creating-tasks.md
[async-completion-doc]: ../getting-started/4-async-completion.md
[chokidar-module-package]: https://www.npmjs.com/package/chokidar
[fsevents-package]: https://www.npmjs.com/package/fsevents
