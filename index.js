#! /usr/bin/env node
var sharp = require('sharp');
var path = require('path');
var fs = require('fs');
var program = require('commander');

var char_list = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`\'. ';

var get_char = (gray) => {
    var unit = (256+1) / char_list.length;

    return char_list[parseInt(gray/unit)];
};

var img2char = (param) => {
    console.log(param);

    var width = param.width || '';
    var input = param.input || '';
    var output = param.output || '';

    if (!input) {
        return console.log(new Error('no input path specified.'));
    }

    var isExist = fs.existsSync(input);

    if (!isExist) {
        return console.log(new Error('file not exist.'));
    }

    var image = sharp(input);

    image
        .metadata()
        .then(meta => {
            if (!width) {
                width = meta.width;
            }
            var text = '';

            image
                .resize(width, null, {
                    interpolator: sharp.interpolator.nearest
                })
                .greyscale()
                .raw()
                .toBuffer()
                .then(rs => {
                    for (var i = 0; i < rs.length; i ++) {
                        text += get_char(rs[i]);

                        if (i % width == 0 ){
                            text += '\n';
                        }
                    }

                    if (!output) {
                        console.log(text);
                    } else {
                        var isDirectory;
                        try {

                            isDirectory = fs.lstatSync(output).isDirectory();
                        } catch (e) {
                            isDirectory = false;
                        } finally {
                            if (isDirectory) {
                                fs.writeFileSync(path.join(output, 'output.txt'), text, 'utf-8');
                            } else {
                                fs.writeFileSync(output, text, 'utf-8');
                            }
                        }

                    }
                });

        });

};

program
    .version('0.0.1')
    .usage('[options] <file ...> \n  Convert file to char. \n\n  file can be a buffer or a string. \n  Buffer containing JPEG, PNG, WebP, GIF, SVG, TIFF or raw pixel image data, or \n  String containing the path to an JPEG, PNG, WebP, GIF, SVG or TIFF image file.')
    .option('-i, --input <path>', 'input image path')
    .option('-o, --output <path>', 'output txt path, default to standard out')
    .option('-w, --width <width>', 'resize picture width, default to the origin width')
    .parse(process.argv);

var param = {
    input: program.input || null,
    output: program.output || null,
    width: ~~program.width || null,

};

if (!param.input && !param.output && !param.width) {
    console.log('use --help to check out usage.');
} else {
    img2char(param);
}
