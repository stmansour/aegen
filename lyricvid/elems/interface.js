
function initInterface() {
    styler.window = new Window("palette", "My Buttons", undefined, { closeButton: false });
    styler.randStylerButton = styler.window.add("button", undefined, "Random Style");
    styler.changeFontButton = styler.window.add("button", undefined, "Change Font");
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

// Define function to create and show the dialog window
function showChangeFontDialog() {
	styler.fontDialog = new Window("dialog", "Font Styler");
	var fontDropdown = styler.fontDialog.add("dropdownlist", undefined, fontList);
	var fontSizeInput = styler.fontDialog.add("edittext", undefined, styler.fontSize);
	fontSizeInput.characters = 5;
	fontSizeInput.active = true;
	fontSizeInput.onChange = function () {
		this.text = validate(this.text);
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
