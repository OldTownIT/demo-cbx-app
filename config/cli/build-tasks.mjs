import fs from 'fs';
import path from 'path';
import userName from 'git-user-name';
import getCurrentBranchName from 'node-git-current-branch';
import nunjucks  from'nunjucks';
import { rimraf } from 'rimraf';
import { mkdirp } from 'mkdirp';

nunjucks.configure('./config/templates', {
    autoescape: true,
    express: null
});

const n = '\n';
const nn = '\n\n';


const isDST = (today) => {
	// borrowed from here: http://www.mresoftware.com/simpleDST.htm
	const yr = today.getFullYear();
	const dst_start = new Date('March 14, ' + yr + ' 02:00:00');
	// 2nd Sunday in March can't occur after the 14th
	const dst_end = new Date('November 07, ' + yr + ' 02:00:00');
	// 1st Sunday in November can't occur after the 7th
	let day = dst_start.getDay(); // day of week of 14th
	dst_start.setDate(14 - day); // Calculate 2nd Sunday in March of this year
	day = dst_end.getDay(); // day of the week of 7th
	dst_end.setDate(7 - day); // Calculate first Sunday in November of this year
	if (today >= dst_start && today < dst_end) {
		//does today fall inside of DST period?
		return true; //if so then return true
	}
	return false; //if not then return false
};

const getESTDate = () => {
	const minutesToMS = 60 * 1000;
	const date = new Date();

	const offsetHere = date.getTimezoneOffset() * minutesToMS;
	const easternHours = isDST(date) ? 4 : 5;
	const offsetEastern = easternHours * 60 * minutesToMS;
	const offset = offsetHere - offsetEastern;
	date.setTime(date.getTime() + offset);
	return date;
};

const save = async (filePath, contents) => {
    try {
        // Write data to the file
        await fs.promises.writeFile(filePath, contents);
        return true;
    } catch (error) {
        console.error('Error writing to file:', error);
        return false;
    }
}

const deleteDir = async (directoryPath) => {
    const result = await rimraf(directoryPath);
    return result;
};

const dateOptions = {
	weekday: 'long',
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	hour12: true,
};
const fileOptions = {
	year: 'numeric',
    month: 'short',
	hour12: false,
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
};

const dateString = () => 
    getESTDate().toLocaleTimeString('en-GB', dateOptions)
    .replace(/ 0:/g, ' 12:');

const fileString = () => 
    'BUILD_' + getESTDate().toLocaleTimeString('en-GB', fileOptions)
	.replace(/,/g, '')
	.replace(/:/g, '')
	.replace(/ /g, '_')
	.toUpperCase();

const composeDetails = (dateLine) => 
    'BUILD TIMESTAMP:' + n + dateLine + ' ' + 'EASTERN' + nn +
	'GIT_USER:   ' + userName() + n +
	'GIT_BRANCH: ' + (getCurrentBranchName() || 'main');

const buildStamp = () => nn + 'LOCAL ' + composeDetails(dateString()) + nn;
const deployStamp = () => nn + 'DEPLOYED ' + composeDetails(dateString()) + nn;


const setBuildTarget = async (buildType) => {
    const targetDirectory = buildType === 'deploy' ? 'build-deploy' : 'build-local';
    const rendered = nunjucks.render(
        'build-settings.js.njk', 
        { targetDirectory }
    );
    const current = process.cwd();
    const targetPath = path.join(current, 'config', 'env', 'build-settings.js');
    const result = await save(targetPath, rendered);
    return result;
}

const stampIndexHtml = async (buildType) => {

    const isDeploy = buildType === 'deploy';

    const rendered = nunjucks.render(
        'index.html.njk', 
        { buildStamp: isDeploy ? deployStamp() : buildStamp() }
    );

    const current = process.cwd();
    const srcPath = path.join(current, 'index.html');
    const builtIndex = await save(srcPath, rendered);
    return builtIndex;
};

export const clean = async (buildType) => {
    const isDeploy = buildType === 'deploy';
    const pathName = isDeploy ? 'build-deploy' : 'build-local';

    const current = process.cwd();
    const directoryPath = path.join(current, pathName);

    await deleteDir(directoryPath)
    await mkdirp(directoryPath);

    return true;
};

export const buildLog = async (buildType) => {

    const isDeploy = buildType === 'deploy';
    const pathName = isDeploy ? 'build-deploy' : 'build-local';

    const current = process.cwd();
    const directoryPath = path.join(current, pathName);

	const filePath = path.join(directoryPath, fileString() + '.txt');
	const details = isDeploy ? deployStamp() : buildStamp();

    await save(filePath, details);
    return true;
};


export const buildMain = async (buildType, followUp) => {
    if (followUp !== 'followUp') {
        await clean(buildType);
        await setBuildTarget(buildType);
        await stampIndexHtml(buildType);
    } else {
        await buildLog(buildType);
    }
    return true;
};

// ============== TESTING ============================

export const buildLogTest = () => {
	const fileDate = dateString();
	const testDate = fileString();
    const details = composeDetails(dateString());

    console.log(' ');
    console.log('git user:    ' + userName());
    console.log('git branch:  ' + getCurrentBranchName());
    console.log(' ');

	console.log('FILE:  ', fileDate);
	console.log('DATE:  ', testDate);
    console.log(' ');
	console.log(details);
    console.log(' ');
    console.log(' ');
};
