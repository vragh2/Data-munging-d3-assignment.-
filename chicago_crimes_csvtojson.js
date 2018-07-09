const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

const instream = fs.createReadStream('chicagocrimes.csv');
const outstream = new stream();
const writeStream1 = fs.createWriteStream('chicago_crimes_graph1.json');
const writeStream2 = fs.createWriteStream('chicago_crimes_graph2.json');
const rl = readline.createInterface(instream, outstream);
let commaSeparatedVals = []; // variable for extracting and storing the comma separated values
let isheader = true;
let headers;
// REGEX TO MATCH WITH PARTICULAR COLUMNS
const theft = new RegExp('(.*)(THEFT)(.*)');
const over = new RegExp('(.*)(OVER)(.*)');
const under = new RegExp('(.*)(AND UNDER)(.*)');
const assault = new RegExp('(.*)(ASSAULT)(.*)');
let indexofyear;
let indexofprimarytype;
let indexofdescription;
let indexofarrest;
const yearObject = [];
const yearObject1 = [];
for (let i = 2001; i <= 2016; i += 1) { // array to store the year objects from 2001 to 2016
    const objTheft = {}; // creation of objects year vise for both theft and assault
    objTheft.year = i;
    objTheft.under = 0;
    objTheft.over = 0;
    yearObject.push(objTheft);
    const objAssault = {};
    objAssault.year = i;
    objAssault.arrested = 0;
    objAssault.not_arrested = 0;
    yearObject1.push(objAssault);
}
rl.on('line', (line) => {
    if (isheader) { // to calculate indexes of the headings to be able to target particular columns directly
        headers = line.split(',');
        indexofyear = headers.indexOf('Year');
        indexofprimarytype = headers.indexOf('Primary Type');
        indexofdescription = headers.indexOf('Description');
        indexofarrest = headers.indexOf('Arrest');
        isheader = false;
    } else {
        commaSeparatedVals = line.split(',');
        if (theft.test(commaSeparatedVals[indexofprimarytype]) && over.test(commaSeparatedVals[indexofdescription])) {
            for (let i = 0; i < yearObject.length; i += 1) {
                if (yearObject[i].year === parseInt(commaSeparatedVals[indexofyear], 10)) {
                    yearObject[i].over += 1;
                }
            }
        } else if (theft.test(commaSeparatedVals[indexofprimarytype]) && under.test(commaSeparatedVals[indexofdescription])) {
            for (let i = 0; i < yearObject.length; i += 1) {
                if (yearObject[i].year === parseInt(commaSeparatedVals[indexofyear], 10)) {
                    yearObject[i].under += 1;
                }
            }
        }

        if (assault.test(commaSeparatedVals[indexofprimarytype]) && commaSeparatedVals[indexofarrest] == 'true') {
            for (let i = 0; i < yearObject1.length; i += 1) {
                if (yearObject1[i].year === parseInt(commaSeparatedVals[indexofyear], 10)) {
                    yearObject1[i].arrested += 1;
                }
            }
        } else if (assault.test(commaSeparatedVals[indexofprimarytype]) && commaSeparatedVals[indexofarrest] == 'false') {
            for (let i = 0; i < yearObject1.length; i += 1) {
                if (yearObject1[i].year === parseInt(commaSeparatedVals[indexofyear], 10)) {
                    yearObject1[i].not_arrested += 1;
                }
            }
        }
    }

});
rl.on('close', () => {
    let graph1 = [];
    graph1 = JSON.stringify(yearObject);
    writeStream1.write(graph1, 'UTF-8');
    const graph2 = JSON.stringify(yearObject1);
    writeStream2.write(graph2, 'UTF-8');
});