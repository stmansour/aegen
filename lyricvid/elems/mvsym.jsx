// Initialize the mvApp object with settings
var mvApp = {
    direction: "random", // Initialize to random, you can change this to "left", "right", "up", "down" as needed
};

// Set random seed based on system time
var seed = new Date().getTime();
Math.seedrandom(seed);

// Get the active composition
var comp = app.project.activeItem;
if (comp && comp instanceof CompItem) {
    // Get the duration of the composition
    var duration = comp.duration;

    // Loop through all layers in the composition
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);

        // Check if the layer's name contains "mvsym"
        if (layer.name.indexOf("mvsym") !== -1) {

            // Delete all existing position keyframes
            layer.property("Position").removeAllKeys();

            // Initialize variables for keeping track of the layer's position and time
            var posX = 0;
            var posY = 0;
            var currentTime = 0;

            // Handle different movement directions
            switch (mvApp.direction) {
                case "right":
                    posY = Math.random() * comp.height;
                    posX = 0;
                    while (currentTime < duration) {
                        layer.property("Position").setValueAtTime(currentTime, [posX, posY]);
                        var timeToMove = Math.random() * 10 + 2; // Random time to move across screen, between 2 to 12 seconds
                        currentTime += timeToMove;
                        posX = comp.width;
                        layer.property("Position").setValueAtTime(currentTime, [posX, posY]);
                        currentTime += 0.001; // Move to next frame
                        posX = 0; // Reset position to left side
                    }
                    break;
                case "random":
                    // Initialize to a random position
                    posX = Math.random() * comp.width;
                    posY = Math.random() * comp.height;
                    while (currentTime < duration) {
                        layer.property("Position").setValueAtTime(currentTime, [posX, posY]);
                        var timeToMove = Math.random() * 5 + 1; // Random time for this segment
                        currentTime += timeToMove;

                        // New random position
                        posX = Math.random() * comp.width;
                        posY = Math.random() * comp.height;

                        layer.property("Position").setValueAtTime(currentTime, [posX, posY]);
                    }
                    break;
                // You can add cases for "left", "up", "down" here following a similar pattern to "right"
            }
        }
    }
}
