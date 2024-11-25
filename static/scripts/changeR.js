R = 1;
updateScales(R);

document.querySelectorAll('.form-check-input').forEach((input) => {
    input.addEventListener('change', (event) => {
        const newR = Number(event.target.value);
        R = newR;
        updateScales(newR);
    });
});

function updateScales(newR) {
    chart.options.scales.x.min = -2 * newR;
    chart.options.scales.x.max = 2 * newR;
    chart.options.scales.y.min = -2 * newR;
    chart.options.scales.y.max = 2 * newR;

    hitPoints.length = 0;
    missPoints.length = 0;

    att.forEach(attempt => {
        const newX = attempt[0] * newR / attempt[2];
        const newY = attempt[1] * newR / attempt[2];
        const hit = attempt[3];

        addPoint(newX, newY, hit);
    });

    chart.update();
}