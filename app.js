$(function() {


  var c = document.getElementById("hyperblob"),
      ctx = c.getContext("2d"),
      node_count = 500,
      canvas_height = $("#hyperblob").innerHeight(),
      canvas_width = $("#hyperblob").innerWidth(),
      max_count = canvas_width / 2,
      nodes = [],
      fuzz_factor = node_count / 500,
      target_interval = node_count / 100,
      zoom = 500 / node_count,
      defaults = {
        x: x_origin(),
        y: y_origin(),
        vx: 1,
        vy: 1,
        radius: 3,
        node_color: "#FFB536",
        background_color: "#FFB536",
        scale: 1,
        mass: 1,
        opacity: 1,
        viscocity: 0.9,
        speed_limit: 100,
        dimensions: ["color", "size"]
      };

  function build_nodes() {
    for (var i = node_count - 1; i >= 0; i--) {
      var color = "";
      var size = 1;

      switch(i % 3) {
        case 1:
          color = "#3AA5A5";
          break;
        case 2:
          color = "#EFD548";
          break;
        case 3:
          color = "#3F2A3F";
          break;
        default:
          color = "#000000";
      }

      switch(i % 4) {
        case 1:
          size = 2;
          break;
        case 2:
          size = 3;
          break;
        case 3:
          size = 4;
          break;
        case 4:
          size = 5;
          break;
      }

      switch(i % 5) {
        case 1:
          size = 1;
          break;
        case 2:
          size = 2;
          break;
        case 3:
          size = 3;
          break;
        case 4:
          size = 4;
          break;
        case 5:
          size = 5;
          break;
        default:
          size = "#000000";
      }

      nodes.push({
        x: defaults.x,
        y: defaults.y,
        vx: getRandomArbitrary(-1, 1),
        vy: getRandomArbitrary(-1, 1),
        tick: i*3,
        color: color,
        size: size,
        opacity: 1
      });
    }
  }

  function redraw_nodes() {
    for (var i = nodes.length - 1; i >= 0; i--) {
      var node = nodes[i];

      node.x = node.x + node.vx;
      node.y = node.y + node.vy;
      draw_node(node.x, node.y, node.size, node.color, defaults.scale);
    }
  }

  function draw_node(x, y, radius, color, scale) {
    ctx.beginPath();
    ctx.arc(x,y,radius,0,2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function timer() {
    "use strict";
    var radius = defaults.radius,
        dimensions = defaults.dimensions,
        speed = defaults.speed_limit,
        viscocity = defaults.viscocity;

    setInterval( function(){
      ctx.clearRect( 0, 0, 2000, 2000);
      calculate_forces(radius, dimensions, speed, viscocity);
      redraw_nodes(nodes);
    }, target_interval );
  }

  function calculate_forces(radius, dimensions, speed, viscocity) {
    "use strict";
    var length = nodes.length;

    for (var i = length - 1; i >= 0; i--) {
      var a = nodes[i],
          v;
      for (var j = length - 1; j >= 0; j--) {
        if(i !== j) {
          var b = nodes[j],
              distance = line_distance(a, b),
              gc = match_factor(a, b, dimensions);
          if (distance > radius) {
            if(distance > (40 * radius)) {
              v = gravitate(a, b, distance, gc);
            } else {
              v = repel(a, b, distance);
            }
            a.vx = v.vx;
            a.vy = v.vy;
          }
        }
      }
      speed_limit(a, speed);
      friction(a, viscocity);
    }
  }

  function gravitate(a, b, distance, gc) {
    var force = gc / (distance*distance),
        vx = a.vx + ((b.x - a.x) * force),
        vy = a.vy + ((b.y - a.y) * force);
    return {vx: vx, vy: vy};
  }

  function repel(a, b, distance) {
    var force = 2 / (distance*distance),
        vx = a.vx + ((a.x - b.x) * force),
        vy = a.vy + ((a.y - b.y) * force);
    return {vx: vx, vy: vy};
  }

  function friction(node, viscocity) {
    node.vx = node.vx * viscocity;
    node.vy = node.vy * viscocity;
  }

  function speed_limit(node, max) {
    node.vx = (node.vx >= max || node.vx <= -max) ? node.vx / 2 : node.vx;
    node.vy = (node.vy >= max || node.vy <= -max) ? node.vy / 2 : node.vy;
  }

  function match_factor(a, b, dimensions) {
    factor = 0.1;
    for (var i = dimensions.length - 1; i >= 0; i--) {
      var dimension = dimensions[i];
      if(a[dimension] === b[dimension]) {
        factor = factor + 1;
      }
    };
    return factor;
  }

  function y_origin() {
    return (canvas_height / 2);
  }

  function x_origin() {
    return (canvas_width / 2);
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  function fuzz(factor) {
    return Math.floor(getRandomArbitrary(1, factor));
  }

  function line_distance( point1, point2 ) {
    var xs = 0,
        ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
  }

  $("#hyperblob").attr("height", canvas_height).attr("width",canvas_width);
  build_nodes();
  timer();
});
