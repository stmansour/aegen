
function initInterface() {
    styler.window = new Window("palette", "My Buttons", undefined, { closeButton: false });
    styler.randStylerButton = styler.window.add("button", undefined, "Random Style");
    styler.changeFontButton = styler.window.add("button", undefined, "Change Font");
    styler.changeFontStrokeButton = styler.window.add("button", undefined, "Change Font Stroke");
    styler.resetButton = styler.window.add("button", undefined, "Reset");
    styler.fadeInButton = styler.window.add("button", undefined, "Fade In");
    styler.fadeOutButton = styler.window.add("button", undefined, "Fade Out");
    styler.doneButton = styler.window.add("button", undefined, "Done");

    styler.randStylerButton.onClick = function () {
        stylizeVid();
    };
    styler.changeFontButton.onClick = function () {
        showChangeFontDialog();
    };
    styler.changeFontStrokeButton.onClick = function () {
        showChangeFontStrokeDialog();
    };
    styler.resetButton.onClick = function () {
        resetLayers();
    };
    styler.fadeInButton.onClick = function () {
        fadeIn();
    };
    styler.fadeOutButton.onClick = function () {
        fadeOut();
    };
    styler.doneButton.onClick = function () {
        styler.window.close();
    };
}

// Define function to validate input as numbers only
function validateNumeric(input) {
    var regex = /[^\d]/g;
    var validated = input.replace(regex, '');
    return validated;
}
  
// Define function to create and show the dialog window
function showChangeFontDialog() {
	styler.fontDialog = new Window("dialog", "Font Styler");
	var fontDropdown = styler.fontDialog.add("dropdownlist", undefined, fontList);

    var fontSizeInput = styler.fontDialog.add("edittext", undefined, styler.fontSize);
	fontSizeInput.characters = 5;
	fontSizeInput.active = true;
	fontSizeInput.onChange = function () {
		this.text = validateNumeric(this.text);
	}

    var applyButton = styler.fontDialog.add("button", undefined, "Apply Font");
	fontDropdown.selection = fontDropdown.find(styler.fontName);
	applyButton.onClick = function () {
		styler.fontName = fontDropdown.selection.text;
		styler.fontSize = parseInt(fontSizeInput.text);
		changeAllTextFonts(styler.fontName,styler.fontSize);
		styler.fontDialog.close();
	};


	styler.fontDialog.show();
}

// Define function to validate input as hex numbers only (ex: 0xffed56)
function validateHex(input) {
    var regex = /[^\d0-9abcdefx]/g;
    var validated = input.replace(regex, '');
    return validated;
}

// Define function to create and show the text stroke change dialog
//--------------------------------------------------------------------
function showChangeFontStrokeDialog() {
	styler.fontStrokeDialog = new Window("dialog", "Font Stroke Styler");

    var fontStrokeSizeInput = styler.fontStrokeDialog.add("edittext", undefined, styler.fontStrokeSize);
	fontStrokeSizeInput.characters = 8;
	fontStrokeSizeInput.active = true;
	fontStrokeSizeInput.onChange = function () {
		this.text = validateNumber(this.text);
	}

    var strokeColorInput = styler.fontStrokeDialog.add("edittext", undefined, styler.fontStrokeColor);
	strokeColorInput.characters = 8;
	strokeColorInput.active = true;
	strokeColorInput.onChange = function () {
		this.text = validateHex(this.text);
	}

    var applyButton = styler.fontStrokeDialog.add("button", undefined, "Apply Stroke");
    var cancelButton = styler.fontStrokeDialog.add("button", undefined, "Cancel");

    applyButton.onClick = function () {
        alert("Entered Font Stroke handler!");
        alert("fontStrokeSizeInput.text = " + fontStrokeSizeInput.text)
		var n = Number(fontStrokeSizeInput.text);
        alert("n = " + n);
        var newColor = hexToColor(n);
        alert("newColor.length = " + newColor.length);
		styler.fontStrokeSize = parseInt(fontStrokeSizeInput.text);
        alert("styler.fontStrokeSize = " + styler.fontStrokeSize + "typeof styler.fontStrokeSize = " + typeof styler.fontStrokeSize);
		setAllTextStroke(newColor,styler.fontStrokeSize);
		styler.fontStrokeDialog.close();
	};


    styler.cancelButton.onClick = function () {
        styler.fontStrokeDialog.close();
    };
    styler.fontStrokeDialog.show();
}
