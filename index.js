"use strict"

const cryptonger = require("cryptonger")
    , caesarCrypter = require("caesar-crypter")
    , text = process.argv[2]
    , readline = require('readline')
    , events = require('events')
    , EventEmitter = require('events')
    , fs = require('fs')
    ;

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

function chooseEncryption () {
    let result = getRandomInt(0,1);
    if (result == 0) {
        // CAESAR-CRYPTER MODULE SELECTED
        console.log("Caesar Module Selected");
        var step, direction, alphabet, file;
        alphabet = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";

        // get text to be encrypted
        myEmitter.on('getText', function() {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter the text you want to encrypt: ', (inputText) => {
                text = inputText;
                rl.close();
                myEmitter.emit('getSteps');
            });
        });

        // get steps for encryption
        myEmitter.on('getSteps', function() {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter the number of steps to be used for encryption: ', (inputText) => {
                step = inputText;
                rl.close();
                myEmitter.emit('getDirection');
            });
        });

        // get direction for encryption
        myEmitter.on('getDirection', function() {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Direction > 0 right OR direction < 0 left ', (inputText) => {
                direction = inputText;
                rl.close();
                myEmitter.emit('getFileName');
            });
        });

        // get filename name for encryption
        myEmitter.on('getFileName', function() {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter a filename name: ', (inputText) => {
                file = inputText;
                file = file + ".cae"
                rl.close();
                myEmitter.emit('encryptCaesar');
            });
        });

        // encrypt text using caesar-crypter
        myEmitter.on('encryptCaesar', function() {
            // TODO direction bug
            fs.writeFile(file, caesarCrypter.encrypt(step, -1, alphabet, text), (err) => {
                if(err) {
                    return err;
                } else {
                    console.log("The " + file + " file was saved on disk!")
                }
            })
        });

        myEmitter.emit("getText");

    } else {

        // CRYPTONGER MODULE SELECTED
        console.log("Professional module selected");
        var text, password, file;

        // get text to be encrypted
        myEmitter.on('getText', function() {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter the text you want to encrypt: ', (inputText) => {
                text = inputText;
                rl.close();
                myEmitter.emit('showText');
                myEmitter.emit('getPassword');
            });

        });

        // get password to be used for encryption
        myEmitter.on('getPassword', function() {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter the password for encryption: ', (inputText) => {
                password = inputText;
                rl.close();
                myEmitter.emit('chooseFileName');
            });
        });

        // get filename in which the message will be saved
        myEmitter.on('chooseFileName', function() {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter a filename name: ', (inputText) => {
                file = inputText;
                file = file + ".aes"
                rl.close();
                myEmitter.emit('encryptPro');
            });
        });

        // Encrypt text using aes-256-ctr algorithm
        myEmitter.on('encryptPro', function() {
            fs.writeFile(file, cryptonger.encrypt(text, password), (err) => {
                if(err) {
                    return err;
                } else {
                    console.log("The " + file + " file was saved on disk!")
                }
            })
        });

        myEmitter.emit('getText');
    }

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

chooseEncryption();
