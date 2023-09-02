// For any layer whose name contains "mvsym" we do two things.  First, we delete all keyframes that
// affect its position. This will allow us to run the script multiple times and see different results
// and we can stop running it when we have generated something we like.  Second, we will create keyframes
// for the layer’s position to move it as we have been trying to do above.  But let's define how we create
// keyframes in a bit more detail.First of all, we'll need some attributes that control the operation,
// please keep all the global attributes in a variable called mvApp. One attribute should be "direction"
// which can be used to specify one of these  options:  left, right, up, down, or random.  Every "mvsym"
// layer should be moving from the first frame to the last frame of the project. It may have multiple paths,
// but it must constantly be moving.  Use the project duration to figure out how long that is.  The
// direction value applies to all “mvsym” layers.  That is, if direction = “right” then all mvsym layers
// will move “right”.  Let’s go through the details for how it should work if direction is “right”.
// The requirements for “left”, “up” and “down” will be similar, and you should be able to figure them
// out based on how we handle “right”.   For “right” moving layers,  set a keyframe for the starting point
// will be on the left side of the screen, at a random vertical position. Then pick a random amount of time
// for the layer to move across the screen and set another keyframe at that time where the position’s y value
// is the same and the x value places it at the right side of the screen. The amount of time it takes to
// cross the screen should be random.  It can move from slow to reasonably fast. The speed at which it moves
// should be randomly chosen, so that all the layers are moving at different rates. If a layer’s position
// has moved all the way to the right side of the screen and there’s still more duration of the video, set
// its position back to the left side of the screen in the next frame, choose another duration, and have
// it move across the screen again. Repeat this until the project duration has completed.
//
// Now let’s go through how we handle direction = “random”.  Initialize each mvsym layer to a random
// position on the screen at frame 0 and set a position keyframe there.  Then choose another random
// location on the screen, chose a random amount of time and place another keyframe at that location.
// If there is still time remaining, choose another random location on the screen and another amount
// of time and create another keyframe to move the layer’s position to that point. Repeat this process
// until the duration of the project timeline is covered.
//---------------------------------------------------------------------------------------------------------

// Initialize the mvApp object with settings
var mvApp = {
    direction: "random" // Initialize to random, you can change this to "left", "right", "up", "down" as needed
};

// var directions = ["right", "left", "up", "down", "random"];
// var randomIndex = Math.floor(Math.random() * directions.length);
// mvApp.direction = directions[randomIndex];

// Get the active composition
var comp = app.project.activeItem;
if (comp && comp instanceof CompItem) {
    // Get the duration of the composition
    var duration = comp.duration;
    var duration = comp.duration;

    // Loop through all layers in the composition
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);

        // Check if the layer's name contains "mvsym"
        if (layer.name.indexOf("mvsym") !== -1) {

            // Remove all existing position keyframes
            var prop = layer.property("Position");
            for (var j = prop.numKeys; j >= 1; j--) {
                prop.removeKey(j);
            }

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
                        var timeToMove = Math.random() * 10 + 3; // Random time to move across screen, between 2 to 12 seconds
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
                        var timeToMove = Math.random() * 20 + 3; // Random time for this segment
                        currentTime += timeToMove;

                        // New random position
                        posX = Math.random() * comp.width;
                        posY = Math.random() * comp.height;

                        layer.property("Position").setValueAtTime(currentTime, [posX, posY]);
                    }
                    break;

 
                case "left":
                   var currentTime = 0;
                    while (currentTime < duration) {
                        var startX = comp.width;
                        var startY = Math.random() * comp.height;
                        var endX = 0;
                        var moveDuration = Math.random() * 20 + 3; // 1 to 11 seconds
                        var endTime = currentTime + moveDuration;

                        if (endTime > duration) {
                            endTime = duration;
                        }

                        layer.property("Position").setValueAtTime(currentTime, [startX, startY]);
                        layer.property("Position").setValueAtTime(endTime, [endX, startY]);

                        currentTime = endTime + 0.01; // Move to next frame
                    }
                    break;

                case "down":
                    var currentTime = 0;
                    while (currentTime < duration) {
                        var startX = Math.random() * comp.width;
                        var startY = 0;
                        var endY = comp.height;
                        var moveDuration = Math.random() * 20 + 3; // 1 to 11 seconds
                        var endTime = currentTime + moveDuration;

                        if (endTime > duration) {
                            endTime = duration;
                        }

                        layer.property("Position").setValueAtTime(currentTime, [startX, startY]);
                        layer.property("Position").setValueAtTime(endTime, [startX, endY]);

                        currentTime = endTime + 0.01; // Move to next frame
                    }
                    break;

                case "up":
                    var currentTime = 0;
                    while (currentTime < duration) {
                        var startX = Math.random() * comp.width;
                        var startY = comp.height;
                        var endY = 0;
                        var moveDuration = Math.random() * 20 + 3; // 1 to 11 seconds
                        var endTime = currentTime + moveDuration;

                        if (endTime > duration) {
                            endTime = duration;
                        }

                        layer.property("Position").setValueAtTime(currentTime, [startX, startY]);
                        layer.property("Position").setValueAtTime(endTime, [startX, endY]);

                        currentTime = endTime + 0.01; // Move to next frame
                    }
                    break;


            }
        }
    }
}
