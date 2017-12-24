var canvasId = "canvas";
var tableId = "form:pointTable";

function drawCanvas() {
    var canvas = document.getElementById(canvasId);
    if (canvas && canvas.getContext) {
        var context = canvas.getContext('2d');
        context.fillStyle = "#225DAB";
        context.font = '12.5px "Tahoma"';

        // border
        context.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);

        // 3th quarter
        context.fillRect(75.5, 125.5, 50.5, 100.5);

        // 2nd quarter
        context.beginPath();
        context.moveTo(75.5, 125.5);
        context.lineTo(125.5, 75.5);
        context.lineTo(125.5, 125.5);
        context.fill();

        // 4st quarter
        context.beginPath();
        context.moveTo(125.5, 125.5);
        context.lineTo(125.5, 225.5);
        context.arcTo(225.5, 225.5, 225.5, 25.5, 100);
        context.fill();

        // Ox
        context.fillStyle = "#000";
        context.beginPath();
        context.moveTo(10.5, 125.5);
        context.lineTo(240.5, 125.5);
        context.stroke();
        context.moveTo(230.5, 120.5);
        context.lineTo(240.5, 125.5);
        context.lineTo(230.5, 130.5);
        context.stroke();

        context.moveTo(25.5, 120.5);
        context.lineTo(25.5, 130.5);
        context.stroke();
        context.moveTo(75.5, 120.5);
        context.lineTo(75.5, 130.5);
        context.stroke();
        context.moveTo(175.5, 120.5);
        context.lineTo(175.5, 130.5);
        context.stroke();
        context.moveTo(225.5, 120.5);
        context.lineTo(225.5, 130.5);
        context.stroke();

        context.fillText("-R", 15.5, 115.5);
        context.fillText("-R/2", 60.5, 115.5);
        context.fillText("R/2", 165.5, 115.5);
        context.fillText("R", 220.5, 115.5);

        // Oy
        context.moveTo(125.5, 10.5);
        context.lineTo(125.5, 240.5);
        context.stroke();
        context.moveTo(120.5, 20.5);
        context.lineTo(125.5, 10.5);
        context.lineTo(130.5, 20.5);
        context.stroke();

        context.moveTo(120.5, 25.5);
        context.lineTo(130.5, 25.5);
        context.stroke();
        context.moveTo(120.5, 75.5);
        context.lineTo(130.5, 75.5);
        context.stroke();
        context.moveTo(120.5, 175.5);
        context.lineTo(130.5, 175.5);
        context.stroke();
        context.moveTo(120.5, 225.5);
        context.lineTo(130.5, 225.5);
        context.stroke();

        context.fillText("-R", 100.5, 30.5);
        context.fillText("-R/2", 90.5, 80.5);
        context.fillText("R/2", 95.5, 180.5);
        context.fillText("R", 105.5, 230.5);
    }
}

function addPoints() {
    drawCanvas();

    var table = document.getElementById(tableId);
    var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        var x = cells[0].innerHTML.trim();
        if (x != "x") {
            var y = cells[1].innerHTML.trim();
            var r = cells[2].innerHTML.trim();
            var in_range = (cells[3].innerHTML.trim() == 'true');
            if (in_range) {
                drawRawPoint(x, y, r, "green");
            } else {
                drawRawPoint(x, y, r, "red");
            }
        }
    }
}

function drawRawPoint(x, y, r, color) {
    var dot_x = 125 + x / r * 100;
    var dot_y = 125 - y / r * 100;
    drawPointByCoordinates(dot_x, dot_y, color);
}

function drawPointByCoordinates(dot_x, dot_y, color) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext('2d');
    context.fillStyle = color;
    context.beginPath();
    context.arc(dot_x, dot_y, 2, 0, 2 * Math.PI);
    context.fill();
}

function add_point_on_click(e) {
    var canvas = document.getElementById("canvas");
    var x = document.getElementById("form:xValue").value;
    var y = document.getElementById("form:yValue").value;
    var r = document.getElementById("form:rValue").value;
    if (canvas != null) {
        if (isNumber(r)) {
            var point = getMousePos(canvas, e);
            var color;
            if (in_range(point.x, point.y, r)) {
                color = "green";
            } else {
                color = "red";
            }
            drawPointByCoordinates(point.x, point.y, color);
            document.getElementById("form:xValue").value = x;
            document.getElementById("form:xValue").innerHTML = x;
            document.getElementById("form:yValue").value = y;
            document.getElementById("form:submit").click();
        } else {
            document.getElementById("form:rWarning").innerHTML = "*Set the \"R\" parameter";
        }
    } else
        alert("Canvas is null");
}

function draw_point_on_submit() {
    var canvas = document.getElementById("canvas");
    var r = document.getElementById(tableId).value;
    if (canvas != null) {
        if (isNumber(x) && isNumber(y) && isNumber(r)) {
            var color;
            if (in_range(x, y, r)) {
                color = "green";
            } else {
                color = "red";
            }
            drawRawPoint(x, y, r, color);
        } else {
            document.getElementById("form:rWarning").innerHTML = "Set the \"R\" value";
        }
    } else
        alert("Canvas is null");
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x : evt.clientX - rect.left,
        y : evt.clientY - rect.top
    };
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function in_range(x, y, r) {
    if (x > 0) {
        if (y > 0) { // 1 quarter
            return false;
        } else { // 4 quarter
            return (x*x + y*y) <= r;
        }
    } else {
        if (y > 0) { // 2 quarter
            return ((-x)/2 + y/2) <= r;
        } else { // 3 quarter
            return ((-x)/2 <= r) && ((-y) <= r);
        }
    }
}