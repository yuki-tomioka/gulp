var gulp = require('gulp');//gulpを使う（必須）
var sass = require('gulp-sass');//sassを使う
var autoprefixer = require('gulp-autoprefixer');//ベンダープレフィックスを自動でつける
var sourcemaps = require('gulp-sourcemaps');//ソースマップを作るのに使う
var cleancss  = require('gulp-clean-css');//cssの圧縮に使う
var concat = require('gulp-concat');//ファイルの結合
var htmlhint = require('gulp-htmlhint');//htmlの構文チェックにhtmlhintを使う
var browserSync = require('browser-sync');//ブラウザの同期にbrowser-syncを使う
var notify = require('gulp-notify');//デスクトップに通知を出すgulp-notifyを使う
var plumber = require('gulp-plumber');//エラーが出てもタスクが止まらないようにgulp-plumberを使う
var uglify = require('gulp-uglify');//jsの圧縮にgulp-uglifyを使う
var imagemin = require('gulp-imagemin'); // 画像圧縮
var pngquant = require('imagemin-pngquant'); // 画像圧縮

gulp.task('sass'/*タスク名*/, function() {//処理内容
    gulp.src(['work/shared/css/**/*.scss'/*読み込み対象をwork内のすべての.scssに指定*/])
    .pipe(plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")//エラーメッセージの通知
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
        // outputStyle: 'expanded',//オプションとして出力形式を指定(expanded,nested,compact,compressed)
    }))//sassを実行
    .pipe(autoprefixer({
        browsers: ['last 2 versions', 'ie >= 9']//対応ブラウザの指定
    }))
    .pipe(cleancss())//cssを圧縮
    .pipe(concat('style.css'))//cssをstyle.cssとして結合
    .pipe(sourcemaps.write('../maps'))//ソースマップを出力
    .pipe(gulp.dest('product/shared/css'))//出力先を指定
    .pipe(browserSync.stream())//ブラウザを再描画、リロードにしたい場合はreload()にする
    .pipe(notify({//コンパイル完了を通知
        //オプション
        title: 'Sassをコンパイルしました！',
        message: new Date(),
        sound: 'Frog',//Mac環境
        //icon: 'logo.png'
    }));
});

gulp.task('js', function(){
    gulp.src(['work/shared/js/**/*.js'/*読み込み対象をwork内のすべての.jsに指定*/])
    .pipe(plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")//エラーメッセージの通知
    }))
    .pipe(uglify())//jsの圧縮
    .pipe(gulp.dest('product/shared/js'))
    .pipe(browserSync.stream());//ブラウザを再描画、リロードにしたい場合はreload()にする
});

gulp.task('html', function(){
    gulp.src(['work/**/*.html'])
    .pipe(plumber())
    .pipe(htmlhint('htmlhintrc'))//htmlhintの実行（ルールの参照）
    .pipe(htmlhint.reporter()) //check結果をターミナルに表示（エラーでも処理を続行）
//    .pipe(htmlhint.failReporter()) //check結果をターミナルに表示（エラー時は処理を停止）
    .pipe(gulp.dest('product/'))//出力先を指定
    .pipe(browserSync.stream());//ブラウザを再描画、リロードにしたい場合はreload()にする
});

gulp.task('imgmin', function(){
    gulp.src(['work/shared/img/**/*.{png,jpg}'])
    .pipe(imagemin({
        progressive: true,
        use: [pngquant({quality: '65-80', speed: 1})]
    }))
    .pipe(gulp.dest('product/shared/img'));
})

gulp.task('default', function() {//defaultで指定したtaskはgulpコマンドだけで実行される
    browserSync.init({//ローカルサーバーの立ち上げ
        server: {
            baseDir: "product/"
        }
    });
    gulp.watch('work/**/*.scss'/*監視対象の指定*/,['sass']/*実行するタスクを指定*/);
    gulp.watch('work/**/*.html'/*監視対象の指定*/,['html']/*実行するタスクを指定*/);
    gulp.watch('work/**/*.js'/*監視対象の指定*/,['js']/*実行するタスクを指定*/);
});