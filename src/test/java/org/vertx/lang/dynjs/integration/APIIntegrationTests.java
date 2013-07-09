package org.vertx.lang.dynjs.integration;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.vertx.testtools.ScriptClassRunner;
import org.vertx.testtools.TestVerticleInfo;

/*
 * Copyright 2013 Red Hat, Inc.
 *
 * Red Hat licenses this file to you under the Apache License, version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * @author <a href="http://lanceball.com">Lance Ball</a>
 */

/**
 * This is dummy JUnit test class which runs javascript files
 * as JUnit tests.
 * 
 * The scripts go in src/test/resources.
 */
@RunWith(ScriptClassRunner.class)
@TestVerticleInfo(filenameFilter = ".+_test\\.js", funcRegex = "[\\s]+(test[^\\s(]+):[\\s]+function")
public class APIIntegrationTests {

    @Test
    public void __vertxDummy() {
    }
}
