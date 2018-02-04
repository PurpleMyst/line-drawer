/* jshint esnext: true, browser: true */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const CANVAS_WIDTH  = 300;
  const CANVAS_HEIGHT = 300;

  const ARROW_SIZE = 5;

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
    context.fillStyle = "#000";

    /* x axis */
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);

    /* x arrow */
    context.lineTo(canvas.width - ARROW_SIZE, canvas.height / 2 - ARROW_SIZE);
    context.moveTo(canvas.width, canvas.height / 2);
    context.lineTo(canvas.width - ARROW_SIZE, canvas.height / 2 + ARROW_SIZE);

    /* y axis */
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);

    /* y arrow */
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2 - ARROW_SIZE, ARROW_SIZE);
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2 + ARROW_SIZE, ARROW_SIZE);

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

    context.beginPath();
    context.font = "bold 8px serif";
    for (let mathX = OUTPUT_DOMAIN_START; mathX <= OUTPUT_DOMAIN_END; ++mathX) {
      const screenX = mapRange(mathX,
                               OUTPUT_DOMAIN_START, OUTPUT_DOMAIN_END,
                               0, canvas.width - 1);
      context.fillText("|", screenX, canvas.height / 2 + 2);
      context.fillText(mathX, screenX + 2, canvas.height / 2 - 8 + 16);
    }
    context.stroke();

    context.font = "bold 16px serif";
    context.fillStyle = "#000";

    context.fillText("y", canvas.width / 2 - 16, 16);
    context.fillText("x", canvas.width - 16, canvas.height / 2 - 5);


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

    context.fillStyle = "#00F";
    context.fillText(message, 5, 16);
  };

  $slope.addEventListener("change", graph);
  $constant.addEventListener("change", graph);
  graph();
});
