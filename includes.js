'use strict';

(function (document, window) {

    window.CSSLoader = new Loader(parse_styles(window.resources.styles),
                                  attach_css);
    window.JSLoader = new Loader(parse_scripts(window.resources.scripts),
                                 attach_js);

    function parse_styles(styles, prefix) {
        var i, key, list = [];
        if (typeof(prefix) === 'undefined') prefix = 'styles/';
        if (!styles) return [];
        for (key in styles) {
            if (key != 'main') {
                if (Array.isArray(styles[key])) {
                    for (i in styles[key]) {
                        list.push(prefix + styles[key] + '.css');
                    }
                } else {
                    list.concat(parse_styles(styles[key], prefix + key + '/'));
                }
            }
        }
        if (styles.main) {
            for (key in styles.main) {
                list.push(prefix + styles.main[key] + '.css')
            }
        }
        return list;
    }

    function parse_scripts(scripts) {
        var mod, prefix, suffix, key, s, js_files = [], mod_files = [];
        if (!scripts) return [];
        if (scripts.vendor) {
            for (key in scripts.vendor) {
                for (s in scripts.vendor[key]) {
                    suffix = (window.ENV == 'dev') ? '.js' : '.min.js';
                    js_files.push('scripts/vendor/' + key + '/' +
                                  scripts.vendor[key][s] + suffix);
                }
            }
        }
        if (scripts.main) {
            for (s in scripts.main) {
                js_files.push('scripts/' + scripts.main[s] + '.js');
            }
        }
        if (scripts.modules) {
            for (key in scripts.modules) {
                prefix = 'scripts/modules/' + key + '/';
                mod = scripts.modules[key];
                js_files.push(prefix + key + '.module.js');
                if (mod.services) {
                    for (s in mod.services) {
                        mod_files.push(
                            prefix + 'services/' + mod.services[s] +
                            '.service.js');
                    }
                }
                if (mod.factories) {
                    for (s in mod.factories) {
                        mod_files.push(
                            prefix + 'factories/' + mod.factories[s] +
                            '.factory.js');
                    }
                }
                if (mod.controllers) {
                    for (s in mod.controllers) {
                        mod_files.push(
                            prefix + 'controllers/' + mod.controllers[s] +
                            '.controller.js');
                    }
                }
                if (mod.directives) {
                    for (s in mod.directives) {
                        mod_files.push(
                            prefix + 'directives/' + mod.directives[s] +
                            '.directive.js');
                    }
                }
            }
        }
        js_files.concat(mod_files);
        return js_files;
    }

    function attach_js (file) {
        var ref = document.createElement('script');
        ref.setAttribute("type", "text/javascript");
        ref.setAttribute("src", file);
        document.getElementsByTagName("body")[0].appendChild(ref)
    }

    function attach_css (file) {
        var ref = document.createElement('link');
        ref.setAttribute("rel", "stylesheet");
        ref.setAttribute("type", "text/css");
        ref.setAttribute("href", file);
        document.getElementsByTagName("head")[0].appendChild(ref)
    }

    function Loader (files, attach_method) {
        this.files = files;
        this.attach = attach_method;
        this.load = function () {
            for (var i in this.files) {
                this.attach(this.files[i])
            }
        };
    }

}(document, window));