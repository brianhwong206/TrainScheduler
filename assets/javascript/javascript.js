$( document ).ready(function() {
    console.log( "ready!" );

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCIWI5K_w7Uu-J-cPhkFESMANH_-bWTR60",
    authDomain: "briantrainscheduler.firebaseapp.com",
    databaseURL: "https://briantrainscheduler.firebaseio.com",
    projectId: "briantrainscheduler",
    storageBucket: "briantrainscheduler.appspot.com",
    messagingSenderId: "161684726302"
  };
  firebase.initializeApp(config);

    // Variable created to reference the database.
    var database = firebase.database();

    // Initial Values
    var trainName = "";
    var destinationName = "";
    var firstTrainTime = "";
    var frequency = "";

    // AddTrain Button Click
    $("#addTrain").on("click", function(event) {
        event.preventDefault();
  
        // Extract values from input boxes from HTML page
        trainName = $("#trainNameInput").val().trim();
        destinationName = $("#destinationNameInput").val().trim();
        firstTrainTime = $("#firstTrainTimeInput").val().trim().format("HH:mm");
        frequency = $("#frequencyInput").val().trim();

        console.log(trainName);
        console.log(destinationName);
        console.log(firstTrainTime);
        console.log(frequency);

        database.ref().push({ 
            trainName: trainName, // syntax (declared var:database match)
            destinationName: destinationName,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
          });

        //  Clears textboxes for next entry
        $("#trainNameInput").val("");
        $("#destinationNameInput").val("");
        $("#firstTrainTimeInput").val("");
        $("#frequencyInput").val("");

    });

    // Firebase watcher .on("child_added"
    database.ref().on("child_added", function(snapshot) {
        // console log the snapshot.val() to doublecheck
        console.log(snapshot.val());
  
        // Console.logging the last user's data
        console.log("----Sucessful Input!----");
        console.log("Train Name: " + snapshot.val().trainName);
        console.log("Destination Name: " + snapshot.val().destinationName);
        console.log("First Train Time: " + snapshot.val().firstTrainTime);
        console.log("Frequency: " + snapshot.val().frequency);

        // store database values into local variables to be added into table.
        var newTrainName = snapshot.val().trainName;
        var newDestinationName = snapshot.val().destinationName;
        var newFirstTrainTime = snapshot.val().firstTrainTime;
        var newFrequency = snapshot.val().frequency;

        // time calculation for frequency column
        var currentTime = moment(); // variable declared to capture the converted current time
        var format = "HH:mm"; // format is assigned
        var convertedCurrentTime = moment(currentTime, format);
        var convertedNewFirstTrainTime = moment(newFirstTrainTime, format);
        // console.log("Current Time: " + convertedCurrentTime);
        // console.log("First Train Time: " + convertedNewFirstTrainTime);
        var timeDiff = (moment(convertedCurrentTime).diff(convertedNewFirstTrainTime)); //???
        var duration = moment.duration(timeDiff);
        // console.log(duration); displays the duration in milliseconds
        var timeDiffMins = Math.floor(duration.asMinutes()); // convert time difference into minutes
        //console.log(" Minutes Since First Train: " + timeDiffMins); // time elasped since first train in minutes
        var remainerFromFrequency = timeDiffMins % newFrequency; // uncover the remainder
        //console.log(newFreq);
        var timeToNextTrain = newFrequency - remainerFromFrequency; // minutes until next train
        console.log("Minutes Until Next Train: " + timeToNextTrain);

        var nextTrain = moment().add(timeToNextTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
        var convertedNextTrain = moment(nextTrain).format("HH:mm"); // converted in to HH:mm

        convertedCurrentTime = moment(currentTime).format("HH:mm"); // converted in to HH:mm

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(newTrainName),
            $("<td>").text(newDestinationName),
            $("<td>").text(newFirstTrainTime),
            $("<td>").text(newFrequency),
            $("<td>").text(convertedCurrentTime),
            $("<td>").text(convertedNextTrain),
            $("<td>").text(timeToNextTrain)
        );

        //append newly created row to exising table
        $("#trainSchedule > tbody").append(newRow);
    
        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });


      // Clear Button Click
    $("#clearTrain").on("click", function(event) {
        event.preventDefault();

        // clears values from input boxes from HTML
        $("#trainNameInput").val("");
        $("#destinationNameInput").val("");
        $("#firstTrainTimeInput").val("");
        $("#frequencyInput").val("");

        console.log("Cleared Current Text Fields");
    });

});


