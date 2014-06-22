var PLIB_SOURCES = [
    "src/_pre.js",
    "src/application.js",
    "src/node.js",
    "src/object2d.js",
    "src/menu.js",
    "src/layer.js",
    "src/scene.js",
    "src/assetloadscene.js",
    "src/xhr.js",
    "src/jsonp.js",
    "src/sound.js",
    "src/soundengine.js",
    "src/sprite.js",
    "src/rect.js",
    "src/roundrect.js",
    "src/circle.js",
    "src/polygon.js",
    "src/randompolygon.js",
    "src/fighter.js",
    "src/label.js",
    "src/util.js",
    "src/http.js",
    "src/tweener.js",
    "src/action.js",
    "src/callaction.js",
    "src/tweenaction.js",
    "src/canvas.js",
    "src/nineleaputil.js",
];

var BANNER = "/*\n\
 * plib.js v<%= pkg.version %>\n\
 * http://tomcat.dev7.jp/gitbucket/daishi/plib\n\
 * \n\
 * The MIT License (MIT)\n\
 * Copyright © 2014 daishi_hmr, dev7.jp\n\
 * \n\
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and\n\
 * associated documentation files (the “Software”), to deal in the Software without restriction, including\n\
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies\n\
 * of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following\n\
 * conditions:\n\
 * \n\
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions\n\
 * of the Software.\n\
 * \n\
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n\
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n\
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n\
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n\
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n\
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n\
 * THE SOFTWARE.\n\
 */\n\
 \n";

module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            dist: {
                options: {
                    banner: BANNER
                },
                src: PLIB_SOURCES,
                dest: "build/plib.js"
            }
        },
        uglify: {
            dist: {
                options: {
                    banner: BANNER
                },
                files: {
                    "build/plib.min.js": ["build/plib.js"]
                }
            }
        },
        watch: {
            scripts: {
                files: ["src/**/*.js"],
                tasks: ["concat"]
            }
        }
    });

    grunt.registerTask("default", ["concat", "uglify"]);

};
