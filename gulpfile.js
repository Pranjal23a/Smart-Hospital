const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify-es').default;
const revPromise = import('gulp-rev').then(module => module.default);
const imageminPromise = import('gulp-imagemin').then(module => module.default);
const del = require('del');

gulp.task('css', async () => {
    console.log('Minifying CSS');
    gulp.src('./assets/sass/**/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('./public/assets/css'));
    console.log('Minified CSS');

    const revModule = await revPromise;
    const rev = revModule();

    return gulp.src('./public/assets/css/**/*.css')
        .pipe(rev)
        .pipe(gulp.dest('./public/assets/css'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets/css'));
});

// gulp.task('js', async () => {
//     console.log('Minifying JS');
//     const revModule = await revPromise;
//     const rev = revModule();

//     return gulp.src('./assets/js/**/*.js')
//         .pipe(uglify())
//         .pipe(rev)
//         .pipe(gulp.dest('./public/assets/js'))
//         .pipe(rev.manifest({
//             cwd: 'public',
//             merge: true
//         }))
//         .pipe(gulp.dest('./public/assets/js'));
// });

// gulp.task('images', async () => {
//     console.log('Compressing Images');
//     const imageminModule = await imageminPromise;
//     const imagemin = imageminModule();
//     const revModule = await revPromise;
//     const rev = revModule();

//     return gulp.src('./assets/img/**/*.+(png|jpg|gif|svg|jpeg)')
//         .pipe(imagemin)
//         .pipe(rev)
//         .pipe(gulp.dest('./public/assets/img'))
//         .pipe(rev.manifest({
//             cwd: 'public',
//             merge: true
//         }))
//         .pipe(gulp.dest('./public/assets/img'));
// });

gulp.task('clean:assets', async () => {
    console.log('Emptying the public/assets directory');
    await del(['./public/assets'], { force: true });
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images', (done) => {
    console.log('Building assets');
    done();
}));
