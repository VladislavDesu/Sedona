"use strict"

let gulp = require("gulp"),
   scss = require("gulp-sass"),
   plumber = require("gulp-plumber"),
   postcss = require("gulp-postcss"),
   autoprefixer = require("autoprefixer"),
   browserSync = require("browser-sync"),
   htmlmin = require("gulp-htmlmin"),
   mqpacker = require("css-mqpacker"),
   minify = require("gulp-csso"),
   rename = require("gulp-rename"),
   imagemin = require("gulp-imagemin"),
   webp = require("gulp-webp"),
   svgmin = require("gulp-svgmin"),
   svgstore = require("gulp-svgstore"),
   ttf2woff = require("gulp-ttf2woff"),
   ttf2woff2 = require("gulp-ttf2woff2"),
   uglify = require("gulp-uglify"),
   clean = require("gulp-clean");

const paths = {
   src: {
      html: "src/**/*.html",
      css: "src/css",
      styles: "src/styles/**/*.+(scss|sass|less)",
      images: "src/images/**/*.{png,jpg}",
      icons: "src/icons/**/*.svg",
      scripts: "src/scripts/**/*.js",
      fonts: "src/fonts/**/*.ttf",
   },

   build: {
      root: "docs/",
      css: "docs/css/",
      images: "docs/images/",
      icons: "docs/icons/",
      scripts: "docs/scripts/",
      fonts: "docs/fonts/",
   },
};

gulp.task("css", () => {
   return gulp.src(paths.src.styles)
      .pipe(plumber())
      .pipe(scss({
         outputStyle: "expanded"
      }).on("error", scss.logError))
      .pipe(postcss([
         autoprefixer({
            overrideBrowserslist: [
               "last 1 version",
               "last 2 Chrome versions",
               "last 2 Firefox versions",
               "last 2 Opera versions",
               "last 2 Edge versions"
            ]
         }),
         mqpacker({
            sort: true
         }),
      ]))
      .pipe(gulp.dest(paths.src.css))
      .pipe(minify())
      .pipe(rename({
         // dirname: "",
         // basename: "",
         prefix: "",
         suffix: ".min",
         // extname: ""
      }))
      .pipe(gulp.dest(paths.build.css))
      .pipe(browserSync.reload({
         stream: true
      }));
});

gulp.task("images", () => {
   return gulp.src(paths.build.images, {
         allowEmpty: true
      })
      .pipe(clean())
      .pipe(gulp.src(paths.src.images))
      .pipe(imagemin([
         imagemin.optipng({
            optimizationLevel: 3,
         }),
         imagemin.mozjpeg({
            quality: 70,
            progressive: true,
         }),
      ]))
      .pipe(gulp.dest(paths.build.images))
      .pipe(gulp.src(paths.src.images))
      .pipe(webp())
      .pipe(gulp.dest(paths.build.images))
      .pipe(browserSync.reload({
         stream: true
      }));
});

gulp.task("icons", () => {
   return gulp.src(paths.build.icons, {
         allowEmpty: true
      })
      .pipe(clean())
      .pipe(gulp.src(paths.src.icons))
      .pipe(svgmin())
      .pipe(gulp.dest(paths.build.icons))
      .pipe(svgstore({
         inlineSvg: true
      }))
      .pipe(rename("symbols.svg"))
      .pipe(gulp.dest(paths.build.icons))
      .pipe(browserSync.reload({
         stream: true
      }));
});

gulp.task("html", () => {
   return gulp.src(paths.src.html)
      .pipe(htmlmin({
         collapseWhitespace: true
      }))
      .pipe(gulp.dest(paths.build.root))
      .pipe(browserSync.reload({
         stream: true
      }));
});

gulp.task("scripts", () => {
   return gulp.src(paths.build.scripts, {
         allowEmpty: true
      })
      .pipe(clean())
      .pipe(gulp.src(paths.src.scripts))
      // .pipe(uglify())
      .pipe(gulp.dest(paths.build.scripts))
      .pipe(browserSync.reload({
         stream: true
      }));
});

gulp.task("fonts", () => {
   return gulp.src(paths.build.fonts, {
         allowEmpty: true
      })
      .pipe(clean())
      .pipe(gulp.src(paths.src.fonts))
      .pipe(ttf2woff())
      .pipe(gulp.dest(paths.build.fonts))
      .pipe(gulp.src(paths.src.fonts))
      .pipe(ttf2woff2())
      .pipe(gulp.dest(paths.build.fonts))
      .pipe(browserSync.reload({
         stream: true
      }));
});

gulp.task("server", () => {
   browserSync.init({
      server: paths.build.root,
   });

   gulp.watch(paths.src.html, gulp.series("html"));
   gulp.watch(paths.src.styles, gulp.series("css"));
   gulp.watch(paths.src.images, gulp.series("images"));
   gulp.watch(paths.src.icons, gulp.series("icons"));
   gulp.watch(paths.src.scripts, gulp.series("scripts"));
   gulp.watch(paths.src.fonts, gulp.series("fonts"));
});

gulp.task("build", gulp.series("html", "css", "images", "icons", "fonts", "scripts", ))