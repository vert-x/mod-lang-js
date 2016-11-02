# Vert.x 2.x is **deprecated** - use instead https://github.com/vert-x3/vertx-lang-js

## Javascript Language Module for Vert.x

[![Build Status](https://travis-ci.org/vert-x/mod-lang-js.png?branch=master "Build Status")](https://travis-ci.org/vert-x/mod-lang-js)

This is the Javascript language module used by 
[mod-lang-dynjs](https://github.com/vert-x/mod-lang-dynjs) and
[mod-lang-rhino](https://github.com/vert-x/mod-lang-rhino). 
This module is not typically used directly, but rather both `mod-lang-rhino`
and `mod-lang-dynjs` have a dependency on this module which provides
the core Javascript API for Vert.x.

### Documentation

- [User Manual](http://vertx.io/core_manual_js.html)
- [1.1.0 API Documentation](http://vertx.io/mod-lang-js/docs/1.1.0/index.html)
- [HEAD API Documentation](https://vertx.ci.cloudbees.com/view/Javascript/job/vert.x-mod-lang-js/lastSuccessfulBuild/artifact/target/docs/index.html)

### Continuous Integration

The module is built on our 
[Cloudbees CI server](https://vertx.ci.cloudbees.com/view/Javascript/job/vert.x-mod-lang-js/),
as well as on [Travis CI](https://travis-ci.org/vert-x/mod-lang-js) with each push to GitHub.

### Running the tests

You'll need to have Maven and JDK7 or better installed. If you don't, do that
first. Then you can clone and build.

    $ git clone https://github.com/vert-x/mod-lang-js.git
    $ cd mod-lang-js
    $ mvn verify

This will run all of the integration tests against both `mod-lang-rhino` and `mod-lang-dynjs`.

If you're hacking on this code and want to install this module locally:

    $ mvn install

Now your local vert.x installation will pick up the local version when
testing against `mod-lang-dynjs` or `mod-lang-rhino`.

By default, vert.x runs Javascript verticles and modules with Rhino. Change
this by creating a `langs.properties` file at the root of your project that
looks like this for dynjs.

    dynjs=io.vertx~lang-dynjs~1.0.1:org.dynjs.vertx.DynJSVerticleFactory
    .js=dynjs

Or if you want to use the experimental nashorn module, do this.

    nashorn=io.vertx~lang-nashorn~1.0.0-beta2-SNAPSHOT:org.vertx.java.platform.impl.NashornVerticleFactory
    .js=nashorn


Enjoy. And if you have any problems, hit us on on freenode at #dynjs or #vertx.

