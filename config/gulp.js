'use strict'

const gulp = require('gulp')
const concat = require('gulp-concat')
const minify = require('gulp-minify')
const minifyCSS = require('gulp-minify-css')
const rename = require('gulp-rename')
const utils = require('../node_modules/trailpack-gulp/lib/utils')
const del = require('del')
const sass = require('gulp-sass')
const path = require('path')
const glob = require('glob')

const src = './assets'
const dest = './.tmp/public'
const sassDest = './assets/css'
const viewsFolder = './views'
let jsToImport = []
let cssToImport = []
let importsJS = ''
let importsCSS = ''

const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
}

const searchAssets = (next) => {
  if (jsToImport.length == 0 && cssToImport.length == 0) {
    glob('**/*.js', {
      cwd: path.join(process.cwd(), 'assets')
    }, (err, files) => {
      if (err) {
        throw err
      }
      else {
        jsToImport = files
        files.forEach((file) => {
          importsJS += '<script type="text/javascript" src="/' + file + '"></script>\n'
        })

        glob('**/*.css', {
          cwd: path.join(process.cwd(), 'assets')
        }, (err, files) => {
          if (err) {
            throw err
          }
          else {
            cssToImport = files
            files.forEach((file) => {
              importsCSS += '<link rel="stylesheet" type="text/css" href="/' + file + '">\n'
            })

            next(jsToImport, cssToImport)
          }
        })
      }
    })
  }
  else {
    next(jsToImport, cssToImport)
  }
}

module.exports = {

  defaultTaskName: 'default',

  tasks: {
    default: ['copyAssets'],
    production: ['copyAssetsProd', 'compileTemplateProd'],
    clean: (done) => {
      del([path.join(dest, '/**/*'), src + '/concat', src + '/css', src + '/min']).then(() => {
        done()
      }).catch(done)
    },
    compileCss: {
      dependsOf: ['clean'],
      task: (done) => {
        gulp.src(src + '/sass/**/*.scss')
          .pipe(sass(sassOptions))
          .on('end', done)
          .pipe(gulp.dest(sassDest))

      }
    },
    copyAssets: {
      dependsOf: ['compileTemplate'],
      task: (done) => {
        gulp.src([src + '/!(sass)/**/*'])
          .on('end', done)
          .pipe(gulp.dest(dest))
        gulp.watch(src + '/**/*', ['copyAssets'])
      }
    },
    compileTemplate: {
      dependsOf: ['compileCss'],
      task: (done) => {
        searchAssets(() => {
          utils.getFiles(viewsFolder, true, (err, files) => {
            if (err) {
              done(err)
            }
            else {
              utils.replaceInFiles(files, /<!--(\s?)SCRIPT START(\s?)-->([\s\S]*?)<!--(\s?)SCRIPT END(\s?)-->/gm,
                '<!--SCRIPT START-->\n' + importsJS + '\n<!--SCRIPT END-->', (err, results) => {
                  if (err) {
                    done(err)
                  }
                  else {
                    utils.replaceInFiles(files, /<!--(\s?)STYLES START(\s?)-->([\s\S]*?)<!--(\s?)STYLES END(\s?)-->/gm,
                      '<!--STYLES START-->\n' + importsCSS + '\n<!--STYLES END-->', (err, results) => {
                        done(err)
                      })
                  }
                })
            }
          })
        })
      }
    },
    compileTemplateProd: (done) => {
      utils.getFiles(viewsFolder, true, (err, files) => {
        if (err) {
          done(err)
        }
        else {
          importsJS = '<script type="text/javascript" src="/min/prod.min.js"></script>\n'
          importsCSS = '<link rel="stylesheet" type="text/css" href="/min/prod.min.css">\n'
          utils.replaceInFiles(files, /<!--(\s?)SCRIPT START(\s?)-->([\s\S]*?)<!--(\s?)SCRIPT END(\s?)-->/gm,
            '<!--SCRIPT START-->\n' + importsJS + '\n<!--SCRIPT END-->', (err, results) => {
              if (err) {
                done(err)
              }
              else {
                utils.replaceInFiles(files, /<!--(\s?)STYLES START(\s?)-->([\s\S]*?)<!--(\s?)STYLES END(\s?)-->/gm,
                  '<!--STYLES START-->\n' + importsCSS + '\n<!--STYLES END-->', (err, results) => {
                    done(err)
                  })
              }
            })
        }
      })
    },
    minify: {
      dependsOf: ['concat'],
      task: (done) => {
        let total = 0
        const isAllFinish = (err, type) => {
          total += type
          if (total == 3) {
            done()
          }
        }

        gulp.src(path.join(src, 'concat', 'prod.concat.js'))
          .pipe(rename('prod.js'))
          .pipe(minify({
            ext: {
              min: '.min.js'
            }
          }))
          .pipe(gulp.dest(path.join(src, 'min')))
          .on('end', (err) => {
            isAllFinish(err, 1)
          })

        gulp.src(path.join(src, 'concat', 'prod.concat.css'))
          .pipe(minifyCSS())
          .pipe(rename('prod.min.css'))
          .pipe(gulp.dest(path.join(src, 'min')))
          .on('end', (err) => {
            isAllFinish(err, 2)
          })

      }
    },
    concat: {
      dependsOf: ['compileCss'],
      task: (done) => {
        searchAssets((jsToImport, cssToImport) => {
          jsToImport = jsToImport.map((el) => {
            return path.join(src, el)
          })
          cssToImport = cssToImport.map((el) => {
            return path.join(src, el)
          })
          let total = 0
          const isAllFinish = (err, type) => {
            total += type
            if (total == 3) {
              done()
            }
          }

          gulp.src(jsToImport)
            .pipe(concat('prod.concat.js'))
            .pipe(gulp.dest(path.join(src, '/concat')))
            .on('end', (err) => {
              isAllFinish(err, 1)
            })

          gulp.src(cssToImport)
            .pipe(concat('prod.concat.css'))
            .pipe(gulp.dest(path.join(src, '/concat')))
            .on('end', (err) => {
              isAllFinish(err, 2)
            })

        })
      }
    },
    copyAssetsProd: {
      dependsOf: ['clean', 'minify'],
      task: (done) => {
        gulp.src([src + '/!(css|sass|js|concat)/**/*', '!' + src + '/min/prod.js'])
          .on('end', done)
          .pipe(gulp.dest(dest))
      }
    }
  }
}
