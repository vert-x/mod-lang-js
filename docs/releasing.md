# Releasing lang-js

First, commit and push all changes.

## SNAPSHOT

If this is a SNAPSHOT release:

    mvn clean deploy
    
This will release a SNAPSHOT version to sonatype. Each CI build does this
already, so there is rarely a reason to do it manually.

## Versioned Release 

1. `mvn release:clean`
2. `mvn release:prepare` - Use the version number (ex: '0.3.0') as the tag, and
   use the next minor version + SNAPSHOT for the next dev version (ex:
   '0.4.0-SNAPSHOT' instead of '0.3.1-SNAPSHOT')
3. `mvn release:perform`
4. Log into <http://oss.sonatype.org>
5. Browse to 'Staging Repositories', find the correct 'io.vertx' repo,
   and select it 
6. Close the repo, then release it (you may need to refresh the list 
   for the release button to become active).
7. Update the ChangeLog.
8. Update README with the version number
9. Wait for several hours until sonatype syncs to central. You can
    check <http://search.maven.org> to know when this has completed.
10. Announce it: twitter, dynjs@, vertx@
11. Register it in the [module registry](http://modulereg.vertx.io/)
12. Update API documentation
    * 12.1 `git checkout gh-pages`
    * 12.2 `mv target/docs docs/<version-number>`
    * 12.3 Update link in index.html
    * 12.4 `git add docs/<version-number> index.html`
    * 12.5 `git push origin gh-pages`

For reference:

<https://docs.sonatype.org/display/Repository/Sonatype+OSS+Maven+Repository+Usage+Guide>
<http://wickedsource.org/2013/09/23/releasing-your-project-to-maven-central-guide/>

