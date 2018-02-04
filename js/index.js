/* jshint esnext: true, browser: true */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const CANVAS_WIDTH  = 512;
  const CANVAS_HEIGHT = 512;

  const STEP = 0.01;

  const INPUT_DOMAIN_START  = -10;
  const INPUT_DOMAIN_END    = 10;
  const OUTPUT_DOMAIN_START = -10;
  const OUTPUT_DOMAIN_END   = 10;

  const $inputs = document.getElementById("inputs");
  const $slope = document.getElementById("slope");
  const $constant = document.getElementById("constant");

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  document.body.insertBefore(canvas, $inputs);

  const mapRange = (input, input_start, input_end, output_start, output_end) =>
      output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start);

  const graph = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.strokeStyle = "#000";
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const slope = +$slope.value;
    const constant = +$constant.value;

    console.time("drawing");
    for (let screenX = 0; screenX < canvas.width; screenX += STEP) {
      const mathX = mapRange(screenX,
                             0, canvas.width,
                             INPUT_DOMAIN_START, INPUT_DOMAIN_END);

      const mathY = slope * mathX + constant;

      const screenY = mapRange(-mathY,
                               OUTPUT_DOMAIN_START, OUTPUT_DOMAIN_END,
                               0, canvas.height);

      const i = (Math.floor(screenY) * canvas.width + Math.floor(screenX)) * 4;
      pixels[i + 0] = 0;
      pixels[i + 1] = 0;
      pixels[i + 2] = 255;
      pixels[i + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);
    console.timeEnd("drawing");

    context.fillStyle = "#00F";
    context.font = "bold 16px arial";

    let message = "y = ";

    if (slope !== 0) {
      if (slope !== 1) {
        if (slope === -1) {
          message += "-";
        } else {
          message += slope;
        }
      }

      message += "x";

      if (constant !== 0) {
        message += " + ";
      }
    }

    if (constant !== 0) {
      message += constant;
    }

    context.fillText(message, 5, 16);
  };

  $slope.addEventListener("change", graph);
  $constant.addEventListener("change", graph);
  graph();
});
