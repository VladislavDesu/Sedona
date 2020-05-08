"use strict"

let gulp = require("gulp"),
    sass = require("gulp-sass"),
    plumber = require("gulp-plumber"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    server = require("browser-sync"),
    mqpacker = require("css-mqpacker"),
    minify = require("gulp-csso"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin"),
    svgmin = require("gulp-svgmin"),
    svgstore = require("gulp-svgstore"),
    clean = require("gulp-clean");

gulp.task("style", function() {
    return gulp.src("app/scss/style.scss")
        .pipe(plumber())
        .pipe(sass({
            outputStyle: "expanded"
        }).on("error", sass.logError))
        .pipe(postcss([autoprefixer({
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
            })
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.reload({
            stream: true
        }));
});

gulp.task("normalize", function() {
    return gulp.src("app/scss/normalize.scss")
        .pipe(sass({
            outputStyle: "expanded"
        }).on("error", sass.logError))
        .pipe(minify())
        .pipe(rename("normalize.min.css"))
        .pipe(gulp.dest("build/css"));
});

gulp.task("images", function() {
    return gulp.src("build/img/**/*.{png,jpg,gif}")
        .pipe(imagemin([
            imagemin.optipng({
                optimizationLevel: 3
            }),
            imagemin.mozjpeg({
                progressive: true
            })
        ]))
        .pipe(gulp.dest("build/img"));
});

gulp.task("symbols", function() {
    return gulp.src("build/img/icons/*.svg")
        .pipe(svgmin())
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("symbols.svg"))
        .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function() {
    return gulp.src([
            "app/fonts/**/*.{woff,woff2,ttf}",
            "app/img/**",
            "app/js/**",
            "app/*.html"
        ], {
            base: "app"
        })
        .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
    return gulp.src("build", {allowEmpty: true})
        .pipe(clean());
});

gulp.task("serve", function() {
    server.init({
        server: "build"
    });

    gulp.watch("app/scss/**/*.scss", gulp.series("style"));
    gulp.watch("app/*.html").on("change", gulp.series("html"));
    gulp.watch("app/js/**/*.js").on("change", gulp.series("js"));
});

gulp.task("html", function() {
    return gulp.src("app/**/*.html")
        .pipe(gulp.dest("build"))
        .pipe(server.reload({
            stream: true
    }));
});

gulp.task("js", function() {
    return gulp.src("app/js/**/*.js")
        .pipe(gulp.dest("build/js"))
        .pipe(server.reload({
            stream: true
    }));
});

gulp.task("build", gulp.series(
    "clean",
    "copy",
    "style",
    "normalize",
    "images",
    "symbols"
));
