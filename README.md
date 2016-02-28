# trails-example-express-gulp
Trails example project to use express4 and gulp as asset manager 

## Gulp configuration
All tasks can be configured in https://github.com/jaumard/trails-example-express-gulp/blob/master/config/gulp.js
In this example this tasks are included : 
- clean build directories
- compile sass files into `assets/css`
- concat js and css files into `assets/concat`
- minify js and css files into `assets/min`
- copy assets into www public dir `.tmp/public`
- compile view templates to include css and js automaticaly
- watch assets directory to rebuild asset on any changes

There two main tasks `default` use for development (don't concat and minify and enable watch) and `production` who doesn't watch for assets changes

## Express configuration
Express4 can be configured in https://github.com/jaumard/trails-example-express-gulp/blob/master/config/web.js

## View configuration
This example use `ejs` template and be configured in https://github.com/jaumard/trails-example-express-gulp/blob/master/config/views.js
