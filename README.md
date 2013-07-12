# Javascript Language Module for Vert.x

[![Build Status](https://travis-ci.org/vert-x/mod-lang-js.png?branch=master)](https://travis-ci.org/vert-x/mod-lang-js)

This is the Javascript language module used by 
[mod-lang-dynjs](https://github.com/vert-x/mod-lang-dynjs) and
[mod-lang-rhino](https://github.com/vert-x/mod-lang-rhino). 
This module is not typically used directly, but rather both `mod-lang-rhino`
and `mod-lang-dynjs` have a dependency on this module which provides
the core Javascript API for Vert.x.

## API Documentation

The [API docs](https://projectodd.ci.cloudbees.com/view/DynJS/job/lang-js/lastSuccessfulBuild/artifact/target/docs/index.html)
are on the CI server.

## Continuous Integration

The module is built on our [Cloudbees CI server](https://projectodd.ci.cloudbees.com/view/DynJS/job/lang-js/),
as well as on [Travis CI](https://travis-ci.org/vert-x/mod-lang-js) with each push to GitHub.

## Running the tests

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
looks like this.

    dynjs=io.vertx~lang-dynjs~1.0.0-SNAPSHOT:org.dynjs.vertx.DynJSVerticleFactory
    .js=dynjs

Enjoy. And if you have any problems, hit us on on freenode at #dynjs or #vertx.
