const REBOOT_SENSOR_URL = "http://opsdev.sence.io/backend/initialize_reboot_sequence.php";

var colorMap = {
  "ok" : "#006600",
  "warning" : "#ffcc00",
  "danger" : "#cc7a00",
  "down" : "#990000",
  "no data" : "#737373"
}

var deleteSensorModal;
var unpinSensorModal;
var rebootSensorModal;


$(document).ready(function() {
    deleteSensorModal = new Foundation.Reveal($('#deleteSensorModal'));
    unpinSensorModal = new Foundation.Reveal($('#unpinSensorModal'));
    rebootSensorModal = new Foundation.Reveal($('#rebootSensorModal'));
});

function scroll(action, macAddress) {

  switch(action) {
    case 'DELETE_ACTION':
        deleteSensorModal.open();
    break;
    case 'PIN_ACTION':
        unpinSensorModal.open();
    break;
    case 'REBOOT_ACTION':
        $('#rebootMAC').val(macAddress);
        rebootSensorModal.open();
    break;
    default:
        console.warn("Mayday, mayday, mayday.")
    break;
  }

  parent.window.scrollTo(0,0);
}

var socket;
var macAddress;
var pinStatus;

var data = [];
var usage = [];
var QueryString = function() {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();

macAddress = QueryString["offCanMac"];

//connect to WebSocket
const host = "ws://opsdev.sence.io:9010/SensorStatus";
try {
    socket = new WebSocket(host);
    // log('WebSocket - status ' + socket.readyState);
    socket.onopen = function(msg) {
        console.log("connected");

        send(macAddress);
        // console.log("1st send");
    };
    socket.onmessage = function(msg) {
        //console.log("here's ur response mada dawg", msg);

        var response = JSON.parse(msg.data);

        //console.log("bbq chips", response);
        pinStatus = response["watchlist"];
        updatePinButton(pinStatus);

        if (typeof response.error == "undefined") {

            document.getElementById("building").innerHTML = response["building"] + " " +response["sensor_location_level"] +response["sensor_location_id"];
            // document.getElementById("level").innerHTML = response["sensor_location_level"];
            // document.getElementById("id").innerHTML = response["sensor_location_id"];
            var status = response["status"];
            document.getElementById("status").innerHTML = status;

            if(response["port"] && response["port"].length > 0 && $('#bootyCall').hasClass('disabled')&& response["reboot_available"]) {
              $('#bootyCall').removeClass('disabled');
            }

            switch (status) {
                case "ok":
                    document.getElementById("status").style.color = colorMap['ok'];
                    break;
                case "warning":
                    document.getElementById("status").style.color = colorMap['warning'];
                    break;
                case "danger":
                    document.getElementById("status").style.color = colorMap['danger'];
                    break;
                case "down":
                    document.getElementById("status").style.color = colorMap['down'];
                    break;
                case "no data":
                    document.getElementById("status").style.color = colorMap['no data'];
                    break;
                default:
                    break;
            }
            document.getElementById("last_reboot").innerHTML = "Up since<br>" + response["last_reboot"];

            document.getElementById("uptime").innerHTML = response["uptime_percentage"];
            document.getElementById("temperature").innerHTML = response["temperature"];
            document.getElementById("cpu").innerHTML = response["cpu"];
            document.getElementById("storage").innerHTML = response["storage"];
            document.getElementById("ram").innerHTML = response["ram"];
            document.getElementById("flapping").innerHTML = response["flapping"];

            document.getElementById("top1").innerHTML = response["top_5_processes"]["1"]["process"];
            document.getElementById("top2").innerHTML = response["top_5_processes"]["2"]["process"];
            document.getElementById("top3").innerHTML = response["top_5_processes"]["3"]["process"];
            document.getElementById("top4").innerHTML = response["top_5_processes"]["4"]["process"];
            document.getElementById("top5").innerHTML = response["top_5_processes"]["5"]["process"];


            data = [response["top_5_processes"]["1"]["process"],
                response["top_5_processes"]["2"]["process"],
                response["top_5_processes"]["3"]["process"],
                response["top_5_processes"]["4"]["process"],
                response["top_5_processes"]["5"]["process"]
            ];

            document.getElementById("top1-usage").innerHTML = response["top_5_processes"]["1"]["usage"];
            document.getElementById("top2-usage").innerHTML = response["top_5_processes"]["2"]["usage"];
            document.getElementById("top3-usage").innerHTML = response["top_5_processes"]["3"]["usage"];
            document.getElementById("top4-usage").innerHTML = response["top_5_processes"]["4"]["usage"];
            document.getElementById("top5-usage").innerHTML = response["top_5_processes"]["5"]["usage"];

            usage = [parseFloat(response["top_5_processes"]["1"]["usage"]),
                parseFloat(response["top_5_processes"]["2"]["usage"]),
                parseFloat(response["top_5_processes"]["3"]["usage"]),
                parseFloat(response["top_5_processes"]["4"]["usage"]),
                parseFloat(response["top_5_processes"]["5"]["usage"])
            ];

            if (response["diagnosis"] == "nil") {
                $(".diagnosis").hide();
            } else {
                document.getElementById("diagnosis").innerHTML = response["diagnosis"]["result"];

                //console.log("fields to color: ", response["diagnosis"]["fields"]);
                var fields = response["diagnosis"]["fields"];

                //uncolor table rows
                $("#tableaux-mini").find(".table-row-highlight").removeClass("table-row-highlight");

                for (var i = 0; i < fields.length; i++) {
                    // console.log("field: ", fields[i]);
                    // console.log("painting the walls red");
                    document.getElementById(fields[i]).parentNode.className = "table-row-highlight";
                }

                if (response["status"].toLowerCase() == "down") {
                    document.getElementById("itsDeadJim").innerHTML = "<b>Data last collected at<br> " + response["latest_timestamp"] + "</b>";
                    document.getElementById("last_reboot").innerHTML = "";
                } else {
                    document.getElementById("itsDeadJim").innerHTML = "";
                }
            }
            //updatePinButton(response["watchlist"]);

        } else {

            //updatePinButton(response["watchlist"]);

            document.getElementById("status").innerHTML = "no data";
            document.getElementById("last_reboot").innerHTML = "";
        }

        // send(macAddress);

        setTimeout(function() {
            send(macAddress);
        }, 5000);

    };
    socket.onclose = function(msg) {
        console.log("Disconnected");
    };

} catch (ex) {
    console.warn(ex);
}

document.getElementById("mac_address").innerHTML = macAddress;

$("#reboot-modal-submit").on('submit', function (e) {

    console.log($(this).serialize());

    e.preventDefault();

    var form = $(this);

    $.ajax({
        type: "POST",
        url: REBOOT_SENSOR_URL,
        data: $(this).serialize(),
        success: function (response) {
          // console.log("success", response);

          if(response.error) {
            document.getElementById('rebootSensorMessage').innerHTML = response.error;
          } else {
            document.getElementById('rebootSensorMessage').innerHTML = response.message;
          }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            var data = JSON.parse(xhr.responseText);

            console.console.log("error", data);
        }
    });
});

function updatePinButton(isPinned) {
  if(isPinned) {

      document.getElementById('pinTitle').innerHTML = 'Un-pin sensor?';
      document.getElementById('pinMessage').innerHTML = 'Unpin this sensor, you would like to?';
      document.getElementById('pinBtn').innerHTML = 'Un-pin Sensor';
      document.getElementById('pinBtnMain').innerHTML = 'Un-pin Sensor';

  } else {
      document.getElementById('pinTitle').innerHTML = 'Pin sensor?';
      document.getElementById('pinMessage').innerHTML = 'pin this sensor, you would like to?';
      document.getElementById('pinBtn').innerHTML = 'Pin Sensor';
      document.getElementById('pinBtnMain').innerHTML = 'Pin Sensor';
  }
}

function send(msg) {
    // console.log("sent: " + msg);
    try {
        socket.send(msg);
        // console.log('Sent');
    } catch (ex) {
        console.warn(ex);
    }
}

function quit() {
    if (socket != null) {
        log("Goodbye!");
        socket.close();
        socket = null;
    }
}

function deleteSensor(macAddress) {

    const DELETE_SENSOR_URL = "http://opsdev.sence.io/backend/delete-sensor.php";

    var data = {
        "MAC": macAddress
    }

    $.ajax({
        type: "POST",
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        url: DELETE_SENSOR_URL,
        data: data,
        success: function(msg) {
            console.log("Que pasar?", msg);
            deleteSensorModal.close();
        },
        error: function(e) {
            console.warn("Remove sensor", e);
        }
    });

    oEvent = document.createEvent("HTMLEvents");
    oEvent.initEvent("click", true, true);
    parent.document.getElementsByClassName("js-off-canvas-exit")[0].dispatchEvent(oEvent);
}


$(document).on('closed.zf.reveal', function() {
  document.getElementById('rebootSensorMessage').innerHTML = "";
});

function pinToWatchList(macAddress, pin) {
    const PIN_TO_WATCHLIST_URL = "http://opsdev.sence.io/backend/sensor-watchlist-pin.php";

    // console.log("Hola", macAddress);
    // console.log("Hola", pin);

    var data = {
        "MAC": macAddress,
        "pin_status": pin
    }

    $.ajax({
        type: "POST",
        beforeSend: function(request) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        },
        url: PIN_TO_WATCHLIST_URL,
        data: data,
        success: function(msg) {
            console.log("Que pasar?", msg);
            unpinSensorModal.close();
        },
        error: function(e) {
            console.warn("Remove sensor", e);
        }
    });
}
