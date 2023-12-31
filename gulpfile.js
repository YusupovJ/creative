let project_folder = "build";
let source_folder = "app";

let fs = require("fs");

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		icons: project_folder + "/media/icons/",
		js: project_folder + "/js/",
		img: project_folder + "/media/images/",
		fonts: project_folder + "/fonts/",
		webfonts: project_folder + "/media/webfonts/",
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/script.js",
		icons: source_folder + "/media/icons/iconsfont.css",
		img: source_folder + "/media/images/**/*.+(png|jpg|gif|ico|webp|svg)",
		fonts: source_folder + "/fonts/*.ttf",
		webfonts: source_folder + "/media/webfonts/*.+(ttf|woff2)",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/media/images/**/*.+(png|jpg|gif|ico|webp|svg)",
		icons: source_folder + "/media/icons/iconsfont.css",
	},
	clean: "./" + project_folder + "/",
};

let { src, dest } = require("gulp"),
	gulp = require("gulp"),
	browser_sync = require("browser-sync").create(),
	file_include = require("gulp-file-include"),
	remove = require("del"),
	scss = require("gulp-sass")(require("sass")),
	autoprifixer = require("gulp-autoprefixer"),
	group_media = require("gulp-group-css-media-queries"),
	clean_css = require("gulp-clean-css"),
	reName = require("gulp-rename"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin"),
	webp = require("gulp-webp"),
	webp_html = require("gulp-webp-html"),
	svg_sprite = require("gulp-svg-sprite"),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2"),
	fonter = require("gulp-fonter"),
	htmlbeautify = require("gulp-html-beautify");

function browserSync() {
	browser_sync.init({
		server: {
			baseDir: "./" + project_folder + "/",
		},
		port: 3000,
		notify: false,
	});
}

function html() {
	return src(path.src.html)
		.pipe(file_include())
		.pipe(webp_html())
		.pipe(
			htmlbeautify({
				eol: "\n",
				indent_level: 0,
				indent_with_tabs: false,
				preserve_newlines: true,
				max_preserve_newlines: 10,
				jslint_happy: false,
				space_after_anon_function: false,
				brace_style: "collapse",
				keep_array_indentation: false,
				keep_function_indentation: false,
				space_before_conditional: true,
				break_chained_methods: false,
				eval_code: false,
				unescape_strings: false,
				wrap_line_length: 0,
				wrap_attributes: "auto",
				wrap_attributes_indent_size: 4,
				end_with_newline: false,
			})
		)
		.pipe(dest(path.build.html))
		.pipe(browser_sync.stream());
}

function css() {
	return src(path.src.css)
		.pipe(scss({ outputStyle: "expanded" }).on("error", scss.logError))
		.pipe(group_media())
		.pipe(
			autoprifixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true,
			})
		)
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			reName({
				extname: ".min.css",
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browser_sync.stream());
}

function js() {
	return src(path.src.js)
		.pipe(file_include())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			reName({
				extname: ".min.js",
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browser_sync.stream());
}

function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 2 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: true }],
				}),
			])
		)
		.pipe(dest(path.build.img))
		.pipe(browser_sync.stream());
}

function fonts() {
	src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
	return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

function icons() {
	src(path.src.icons)
		.pipe(clean_css())
		.pipe(
			reName({
				extname: ".min.css",
			})
		)
		.pipe(dest(path.build.icons));
}

function webfont() {
	src(path.src.webfonts).pipe(dest(path.build.webfonts));
}

gulp.task("otfTottf", function () {
	return src([source_folder + "/fonts/*.otf"])
		.pipe(
			fonter({
				formats: ["ttf"],
			})
		)
		.pipe(dest(source_folder + "/fonts/"));
});

gulp.task("svg_sprite", function () {
	return gulp
		.src([source_folder + "/iconsprite/*.svg"])
		.pipe(
			svg_sprite({
				mode: {
					stack: {
						sprite: "../icons/icons.svg",
					},
				},
			})
		)
		.pipe(dest(path.build.img));
});

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
	gulp.watch([path.watch.icons], icons);
}

function clean() {
	return remove(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, js, html, images, fonts, icons, webfont));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.webfont = webfont;
exports.icons = icons;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
