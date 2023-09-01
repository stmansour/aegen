var CPallete = [
    [ 0x00a878, 0xd8f1a0, 0xf3c178, 0xfe5e41, 0x0b0500],
    [ 0x01161e, 0x124559, 0x598392, 0xaec3b0, 0xeff6e0],
    [ 0x3c1518, 0x69140e, 0xa44200, 0xd58936, 0xf2f3ae],
    [ 0x04080f, 0x507dbc, 0xa1c6ea, 0xbbd1ea, 0xdae3e5],
    [ 0x27213c, 0x5a352a, 0xa1c6ea, 0xa33b20, 0xa47963],
    [ 0xef476f, 0xffd166, 0x06d6a0, 0x118ab2, 0x073b4c],
    [ 0x5d576b, 0x8884ff, 0xd7bce8, 0xe8cee4, 0xfde2ff],
    [ 0x9ba2ff, 0xa499be, 0x9e8576, 0x7a542e, 0x2a2e45],
    [ 0xfff05a, 0xffd25a, 0xffaa5a, 0xff785a, 0x191919],
    [ 0xa31621, 0xfcf7f8, 0xced3dc, 0x4e8098, 0x90c2e7],
    [ 0x072ac8, 0x1e96fc, 0xa2d6f9, 0xfcf300, 0xffc600],
    [ 0x9046cf, 0xcc59d2, 0xf487b6, 0xfff3f0, 0xfde12d],
    [ 0x957186, 0xd9b8c4, 0x703d57, 0x402a2c, 0x241715],
    [ 0x484041, 0x434371, 0x79aea3, 0x70ee9c, 0xb5f44a],
    [ 0xbfd7ea, 0x91aec1, 0x508ca4, 0x0a8754, 0x004f2d],
    [ 0xdf9a57, 0xfc7a57, 0xfcd757, 0xeefc57, 0x5e5b52],
    [ 0x2d3142, 0x4f5d75, 0xbfc0c0, 0xffffff, 0xef8354],
    [ 0x313628, 0x595358, 0x857f74, 0xa4ac96, 0xcadf9e],
    [ 0xa1e8af, 0x94c595, 0x747c92, 0x372772, 0x3a2449],
    [ 0xdcd6f7, 0xa6b1e1, 0xb4869f, 0x985f6f, 0x4e4c67],
    [ 0xc9ddff, 0xecb0e1, 0xde6c83, 0xc1aac0, 0x2cf6b3],
];


// luminosity
//    returns the luminosity of the supplied color
function luminosity(c) {
    var r = ((c >> 16) & 0xFF) / 255;
    var g = ((c >> 8) & 0xFF) / 255;
    var b = (c & 0xFF) / 255;
    var l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return l;
}

// colorContrast
// The function takes two colors as input, represented
// as 24-bit integers in RRGGBB format. It first extracts
// the red, green, and blue components of each color and
// converts them to floating point values between 0 and 1.
// 
// It then computes the relative luminance of each color
// using the ITU-R BT.709 formula: 
// 
//     Y = 0.2126R + 0.7152G + 0.0722*B.
// 
// Finally, it computes the contrast ratio between the two
// colors using the formula
// 
//     (max(L1, L2) + 0.05) / (min(L1, L2) + 0.05),
// 
// where L1 and L2 are the relative luminances of the
// two colors, and 0.05 is a small offset used to prevent
// division by zero.
// 
// The contrast ratio is a value between 1 and 21, where
// higher values indicate better contrast between the two
// colors. A ratio of 1 indicates that the two colors are
// identical, while a ratio of 21 indicates maximum contrast
// between two colors.
//-----------------------------------------------------------------
function colorContrast(c1, c2) {
    var l1 = luminosity(c1);
    var l2 = luminosity(c2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// findHighestContrast
// returns the two colors from array colors with the highest contrast.
//---------------------------------------------------------------------
function findHighestContrast(colors) {
    var maxContrast = 0;
    var maxPair = [];

    for (var i = 0; i < colors.length - 1; i++) {
        for (var j = i + 1; j < colors.length; j++) {
            const contrastRatio = colorContrast(colors[i], colors[j]);
            if (contrastRatio > maxContrast) {
                maxContrast = contrastRatio;
                maxPair = [colors[i], colors[j]];
            }
        }
    }

    return maxPair;
}
