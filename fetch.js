// mapquest URL and KEY
const URL = "http://www.mapquestapi.com/directions/v2/route";
const KEY = "REPLACE_WITH_KEY";

// php REST API URLs
const PUT_URL = "http://3.16.140.115/final.php?method=setLookup";
const GET_URL = "http://3.16.140.115/final.php?method=getLookup&date=";

// elevation chart URLs
const EL_URL_1 = "http://open.mapquestapi.com/elevation/v1/chart?key=";
const EL_URL_2 = "&shapeFormat=raw&width=400&height=300&latLngCollection=";

function formatPlaces() {
    // get first location data
    var city1 = $("#city-1").val();
    var state1 = $("#state-1").val();
    var zip1 = $("#zip-1").val();
    var num1 = $("#address-1").val();
    var street1 = $("#street-1").val();

    // get second location data
    var city2 = $("#city-2").val();
    var state2 = $("#state-2").val();
    var zip2 = $("#zip-2").val();
    var num2 = $("#address-2").val();
    var street2 = $("#street-2").val();

    // sanitize inputs
    city1 = city1.trim();
    city1 = city1.replace(" ", "%20")
    city1 = city1.trim();
    street1 = street1.replace(" ", "%20")

    city2 = city2.trim();
    city2 = city2.replace(" ", "%20")
    city2 = city2.trim();
    street2 = street2.replace(" ", "%20")

    var locationA = num1 + "%20" + street1 + ",%20" + city1 + ",%20" + state1 + "%20" + zip1;
    var locationB = num2 + "%20" + street2 + ",%20" + city2 + ",%20" + state2 + "%20" + zip2;

    return { place_one: locationA, place_two: locationB };
}

function directions() {
    var places = formatPlaces();

    api_call = $.ajax({
        url: URL + '?key=' + KEY + "&from=" + places.place_one + "&to=" + places.place_two,
        method: "GET"
    }).done(function (data) {
        var steps = data.route.legs[0].maneuvers;

        $(".route-column").empty();

        var number = 0;

        for (var i = 0; i < steps.length - 1; i++) {
            element = steps[i];
            number = number + 1;
            $(".route-column").append("<div class='step'><div class='step-text'><p><b>STEP " + number + ": </b>" + element.narrative + "</p></div><p><b>DISTANCE: </b>" + element.distance + "mi</p><p><b>DURATION: </b>" + element.formattedTime + "</p> <img src='" + element.mapUrl + "'></div>");
        }
        elevation(data);
        save(data);
    }).fail(function (data) {
        $(".route-column").empty();
        $(".route-column").append("<h1>NO AVAILABLE ROUTE</h1>");
    });
}

function save(obj) {
    var obj_string = JSON.stringify(obj);

    api_call = $.ajax({
        url: PUT_URL,
        type: "POST",
        data: { "location": "45056", "sensor": "web", "value": obj_string },
        dataType: "json"
    }).done(function (data) {
        console.log("Completed your request.");
    }).fail(function (data) {
        console.log("Failed on route: " + obj.route.formattedTime);
    });
}

function history() {
    var month = $("#month").val();
    var day = $("#day").val();
    var year = $("#year").val();

    api_call = $.ajax({
        url: GET_URL + year + "-" + month + "-" + day,
        method: "GET"
    }).done(function (data) {
        $(".results-container").empty();
        $(".route-column").empty();
        localStorage.removeItem("history");

        var entries = data.result;
        if (entries.length == 0) {
            console.log("No results.");
            $(".results-container").append("<div class='row history-row'><div class='col-11 hist-break'><hr></div></div>");
            $(".results-container").append("<div class='row history-row'><div class='col-11 hist-break'><h3>NO RESULTS</h3></div></div>");
        } else {
            var i = 0;
            var storage = [];
            for (const entry of entries) {
                var date_time = entry.date;
                var date = date_time.substring(0, 10);
                var time = date_time.substring(11);

                var obj_str = entry.value;
                var obj = JSON.parse(obj_str);
                storage.push(obj);

                var from = obj.route.locations[0].street;
                var to = obj.route.locations[1].street;

                var maneuvers = obj.route.legs[0].maneuvers;
                var num_maneuvers = maneuvers.length;

                $(".results-container").append("<div class='row history-row'><div class='col-11 hist-break'><hr></div></div>");
                $(".results-container").append("<div class='row history-row'><div class='col-md-2 col-sm-4 col-12 entry'><p><b>DATE: </b>" + date + "</p></div><div class='col-md-2 col-sm-4 col-12 entry'><p><b>TIME: </b>" + time + "</p></div><div class='col-md-2 col-sm-4 col-12 entry'><p><b>FROM: </b>" + from + "</p></div><div class='col-md-2 col-sm-4 col-12 entry'><p><b>T0: </b>" + to + "</p></div><div class='col-md-2 col-sm-4 col-12 entry'><p><b>MANEUVERS: </b>" + num_maneuvers + "</p></div><div class='col-md-2 col-sm-4 col-12 entry' style='padding-top:0px;'><button type='button' class='btn btn-primary' onClick='displayRoute(" + i + ");'>GET DIRECTIONS</button></div></div>");
                i = i + 1;
            }
            localStorage.setItem("history", JSON.stringify(storage));
        }
    }).fail(function (data) {
        console.log("request failed");
    });
}

function elevation(obj) {
    var lat1 = obj.route.locations[0].latLng.lat;
    var lng1 = obj.route.locations[0].latLng.lng;
    var lat2 = obj.route.locations[1].latLng.lat;
    var lng2 = obj.route.locations[1].latLng.lng;

    var source = EL_URL_1 + KEY + EL_URL_2 + lat1 + "," + lng1 + "," + lat2 + "," + lng2;
    $(".elevation-column").empty();
    $(".elevation-column").append("<img src='" + source + "'>");
}

function displayRoute(index) {
    var history = localStorage.getItem("history");
    var list = JSON.parse(history);
    var data = list[0];

    var steps = data.route.legs[0].maneuvers;

    $(".route-column").empty();

    var number = 0;

    for (var i = 0; i < steps.length - 1; i++) {
        element = steps[i];
        number = number + 1;
        $(".route-column").append("<div class='step'><div class='step-text'><p><b>STEP " + number + ": </b>" + element.narrative + "</p></div><p><b>DISTANCE: </b>" + element.distance + "mi</p><p><b>DURATION: </b>" + element.formattedTime + "</p> <img src='" + element.mapUrl + "'></div>");
    }
    elevation(data);
}