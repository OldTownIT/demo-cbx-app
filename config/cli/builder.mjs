#!/usr/bin/env node
import { buildMain, buildLogTest } from './build-tasks.mjs';

const args = Array.prototype.slice.call(process.argv, 2)

if (args.length) {
    buildMain(...args)
} else {
    console.log(' ');
    console.log(' ');
    console.log('BUILD LOG TEST!');
    console.log(' ');
    console.log(' ');

    buildLogTest();    

}

