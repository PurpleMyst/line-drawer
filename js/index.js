/* jshint esnext: true, browser: true */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const CANVAS_WIDTH  = 300;
  const CANVAS_HEIGHT = 300;

  const ARROW_SIZE = 5;
  const TICK_SIZE = 3;

  const STEP = 0.01;

  const INPUT_DOMAIN_START  = -5;
  const INPUT_DOMAIN_END    = 5;
  const OUTPUT_DOMAIN_START = -5;
  const OUTPUT_DOMAIN_END   = 5;

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

    context.font = "bold 9px serif";
    context.beginPath();

    /* draw grid */
    context.strokeStyle = "#1113";

    for (let mathY = OUTPUT_DOMAIN_START; mathY <= OUTPUT_DOMAIN_END; ++mathY) {
      const screenY = mapRange(-mathY,
                               OUTPUT_DOMAIN_START, OUTPUT_DOMAIN_END,
                               0, canvas.height - 1);
      const nextScreenY = mapRange(-(mathY + 1),
                                   OUTPUT_DOMAIN_START, OUTPUT_DOMAIN_END,
                                   0, canvas.height - 1);

      for (let mathX = INPUT_DOMAIN_START; mathX <= INPUT_DOMAIN_END; ++mathX) {
        const screenX = mapRange(mathX,
                                 INPUT_DOMAIN_START, INPUT_DOMAIN_END,
                                 0, canvas.width - 1);
        const nextScreenX = mapRange(mathX + 1,
                                     INPUT_DOMAIN_START, INPUT_DOMAIN_END,
                                     0, canvas.width - 1);

        /* left to right */
        context.moveTo(screenX, screenY);
        context.lineTo(nextScreenX, screenY);

        /* up to down */
        context.moveTo(screenX, screenY);
        context.lineTo(screenX, nextScreenY);
      }
    }

    context.stroke();

    context.beginPath();
    context.strokeStyle = "#000";
    context.fillStyle = "#000";

    /* draw x numbers */
    for (let mathX = INPUT_DOMAIN_START; mathX <= INPUT_DOMAIN_END; ++mathX) {
      if (mathX === 0) continue;
      const screenX = mapRange(mathX,
                               INPUT_DOMAIN_START, INPUT_DOMAIN_END,
                               0, canvas.width - 1);
      context.moveTo(screenX, canvas.height / 2 - TICK_SIZE);
      context.lineTo(screenX, canvas.height / 2 + TICK_SIZE);
      context.fillText(mathX, screenX + 2, canvas.height / 2 - 8 + 16);
    }

    /* draw y numbers */
    for (let mathY = OUTPUT_DOMAIN_START; mathY <= OUTPUT_DOMAIN_END; ++mathY) {
      if (mathY === 0) continue;
      const screenY = mapRange(-mathY,
                               OUTPUT_DOMAIN_START, OUTPUT_DOMAIN_END,
                               0, canvas.height - 1);

      context.moveTo(canvas.width / 2 - TICK_SIZE, screenY);
      context.lineTo(canvas.width / 2 + TICK_SIZE, screenY);
      context.fillText(mathY, canvas.width / 2 + 4, screenY + 2);
    }
    context.stroke();

    context.font = "bold 16px serif";
    context.fillStyle = "#000";

    context.fillText("y", canvas.width / 2 - 16, 16);
    context.fillText("x", canvas.width - 16, canvas.height / 2 - 5);

    context.stroke();
    context.beginPath();

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
        message += constant > 0 ? " + " : " - ";
      }
    }

    if (constant !== 0) {
      message += Math.abs(constant);
    } else if (slope === 0) {
      message += "0";
    }

    context.fillStyle = "#00F";
    context.fillText(message, 5, 16);
  };

  $slope.addEventListener("input", graph);
  $constant.addEventListener("input", graph);
  graph();
});
