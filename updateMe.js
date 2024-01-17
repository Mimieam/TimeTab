/**
    This should be a tiny npm package :)
    updateMe
    - will update any json file that have a version property .. or not :D
    
2 ways use masking - can increment arbitr
node updateMe.js ./manifestmv3.json --x x.x.+3

simple verbose - only increment by one
node updateMe.js ./manifestmv3.json --bump major                       
node updateMe.js ./manifestmv3.json --bump minor
node updateMe.js ./manifestmv3.json --bump patch

lazy way - increment by one with a rolling increment - not hooked 
    node updateMe.js ./manifestmv3.json  
*/

const fs = require('fs')
function updateVersion(fileName, default_inc = 1, minor_rollover = 10, patch_rollover = 10) {
    // Read the manifest file
    const manifest = require(fileName);
    

    let version = manifest.version;
    if (!version){
        version = '0.0.0'
    }
    let [major, minor, patch] = version.split('.').map(Number);

    patch += default_inc;

    if (patch > patch_rollover) {
        patch = 0;
        minor += 1;
        if (minor > minor_rollover) {
            minor = 0;
            major += 1
        }
    }

    const newVersion = `${major}.${minor}.${patch}`;
    console.log(`Updating ${fileName}: ${manifest.version} => ${newVersion}`)

    manifest.version = newVersion;

    // Stringify the updated manifest with pretty-printing
    const manifest_JSON = JSON.stringify(manifest, null, 2);

    // Write the updated manifest back to the file
    fs.writeFileSync(fileName, manifest_JSON, { encoding: 'utf8', flag: 'w' });

    return manifest_JSON;
}

function updateVersionWithMask(fileName, mask){
    const manifest = require(fileName);
    let version = manifest.version;
    if (!version){
        version = '0.0.0'
    }
    const newVersion = maskVersion(version, mask)
    console.log(`Updating ${fileName}: ${manifest.version} => ${newVersion}`)
    
    if (Number.isNaN(newVersion)){
        throw new Error (`Could NOT update version of ${fileName} to ${newVersion}`)
    }
    
    manifest.version = newVersion;
    const manifest_JSON = JSON.stringify(manifest, null, 2);
    fs.writeFileSync(fileName, manifest_JSON, { encoding: 'utf8', flag: 'w' });
    return manifest_JSON;
}

function maskVersion(version, mask) {
    const versionArray = version.split('.').map(Number)
    console.log(mask)
    const maskArray = mask.split('.').map(part => {
        if (part === 'x' | 'X' ) return null;
        if (part.startsWith('+')) return '+' + (parseInt(part.substring(1)) || 0);
        return parseInt(part);
    });

    const maskedVersion = maskArray.map((maskPart, index) => {
        const versionPart = versionArray[index];

        if (maskPart === null) {
            return versionPart !== null ? versionPart.toString() : 0;
        } else if (maskPart.toString().startsWith('+')) {
            if (versionPart === null) {
                return maskPart;
            } else {
                return versionPart + parseInt(maskPart);
            }
        } else {
            return maskPart.toString();
        }
    });
    return maskedVersion.join('.');
}


try {
    const args = process.argv.slice(2);

    let default_inc = 1;
    let minor_rollover = 10;
    let patch_rollover = 10;
    let mask = null
    
    let [filename, subcmd, subcmd_arg, ...rest] = args;
    // console.log({filename, subcmd, subcmd_arg, rest})
    
    if (!filename) {
        throw new Error('Please provide a filename. \n\tEx: updateMe.js [filename] --x [versionMask]');
    }
    
    if (subcmd === '--x') {
        console.log("Usage: node updateMe.js [filename] --x [versionMask]");
        if (!subcmd_arg || (subcmd_arg.length < 5)){
            throw new Error("Invalid versionMask, expects x.x.x syntax")
        }
        return updateVersionWithMask(filename, subcmd_arg)
        
    } else if (subcmd === '--bump') {
        
        if (!["major", "minor", "patch"].includes(subcmd_arg)){
            console.log("Usage: node updateMe.js [filename] --bump <major|minor|patch>")
            throw new Error("Invalid bump argument...")
        }
        switch (subcmd_arg) {
            case 'major': mask = "+1.x.x"; break;
            case 'minor': mask = "x.+1.x"; break;
            case 'patch': mask = "x.x.+1"; break;
        }
        return updateVersionWithMask(filename, mask)
    } else {
        throw new Error("Please use a valid option: \n\tnode updateMe.js [filename] --x [versionMask] \n\tnode updateMe.js [filename] --bump <major|minor|patch>"); 
    }
            
} catch (error) {
    console.error(`Error: ${error.message}`, error);
    process.exit(1);
}

module.exports = {
    updateVersion,  //updateVersion("./manifest.json")
    updateVersionWithMask,
    maskVersion
}

// TODO: sync multiple file to the same version
// sync and bump all files.