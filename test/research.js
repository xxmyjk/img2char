var sharp = require('sharp');

var img = sharp('dora.png');

var char_list = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`\'. ';


var text = '';

var get_char = (gray) => {
    var unit = (256+1) / char_list.length;

    return char_list[parseInt(gray/unit)];
};

var width = 80;
// var height = 100;


img
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

        console.log(text);
    });
