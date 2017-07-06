// Include gulp
var gulp = require('gulp');

// 플러그인 호출
var concat = require('gulp-concat'); // 파일합치기
var uglify = require('gulp-uglify'); // 압축
var rename = require('gulp-rename'); // 파일이름변경
var sourcemaps = require('gulp-sourcemaps'); // sourcemaps 호출
var scss = require('gulp-sass'); // sass 호출
var fileinclude = require('gulp-file-include'); // HTML 인클루드 호출

/**
 * ==============================+
 * 경로들을 담을 객체 생성
 * ==============================+
 */
var src = './src';
var dist = './dist';
var paths = {
    js : src + '/js/*.js',
    scss : src + '/scss/*.scss'
};


/**
 * ========================================+
 * @task : Script 병합, 압축, min 파일 생성
 * ========================================+
 */
gulp.task('js:combine', function() {
   return gulp.src(paths.js)
       .pipe(concat('front-end.js'))
       .pipe(gulp.dest('dist/js'));
});


/**
 * ==============================+
 * @SCSS : SCSS Config(환경설정)
 * ==============================+
 */
var scssOptions = {
    /**
     * outputStyle (Type : String, Default : nested)
     * CSS의 컴파일 결과 코드스타일 지정
     * Values : nested, expanded, compact, compressed
     */
    outputStyle : "expanded",

    /**
     * indentType (>= v3.0.0, Type : String, Default : space)
     * 컴파일 된 CSS 의 "들여쓰기"의 타입
     * Values : space, tab
     */
    indentType : "tab",

    /**
     * indentWidth (>= v3.0.0, Type : Integer, Default : 2)
     * 컴파일 된 CSS 의 "들여쓰기"의 갯수
     */
    indentWidth : 1, // outputStyle 이 nested, expanded 인 경우에 사용

    /**
     * precision (Type : Integer, Default : 5)
     * 컴파일 된 CSS 의 소수점 자리수
     */
    precision : 6,

    /**
     * sourceComments (Type : Boolean, Default : false)
     * 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시
     */
    sourceComments : true
};


/**
 * =================================+
 * @task : SCSS Compile & sourcemaps
 * =================================+
 */
gulp.task('scss:compile', function() {
   return gulp
        // SCSS 파일을 읽어온다.
       .src(paths.scss)

        // 소스맵 초기화(소스맵을 생성)
       .pipe(sourcemaps.init())

        // SCSS 함수에 옵션값을 설정, SCSS 작성시 watch 가 멈추지 않도록 logError 를 설정
       .pipe(scss(scssOptions).on('error', scss.logError))

        // 위에서 생성한 소스맵을 사용한다.
       .pipe(sourcemaps.write())

       // 파일명 변경
       .pipe(concat('codewizard.css'))

        //목적지(destination)을 설정
       .pipe(gulp.dest(dist + '/css'))
});


/**
 * ==========================+
 * @task : HTML 파일 인클루드
 * ==========================+
 */
gulp.task('file-include', function() {
    gulp.src(['src/*.html'])
        .pipe(fileinclude({
            prefix : '@@',
            basepath : '@file'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
   gulp.watch(paths.js, ['js:combine']);
   gulp.watch(paths.scss, ['scss:compile']);
});


// Default Task
gulp.task('default', ['js:combine', 'scss:compile', 'file-include', 'watch']);