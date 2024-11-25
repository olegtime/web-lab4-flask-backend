const ctx = document.getElementById('canvas').getContext('2d');

R = 1;

const hitPoints = [];
const missPoints = [];
const points = [];

const data = {
    datasets: []
};

const config = {
    type: 'scatter',
    data: data,
    options: {
        plugins: {
            tooltip: {
                enabled: false
            }
        },
        scales: {
            x: {
                grid: {
                    drawBorder: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                    tickColor: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    stepSize: R >= 1 ? 1 : 0.5,
                    precision: 2
                }
            },
            y: {
                grid: {
                    drawBorder: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                    tickColor: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    stepSize: R >= 1 ? 1 : 0.5,
                    precision: 2
                }
            }
        }
    },
    plugins: [
        {
            id: 'field',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;

                ctx.save();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'black';


                ctx.beginPath();
                ctx.moveTo(chartArea.left, (chartArea.top + chartArea.bottom) / 2);
                ctx.lineTo(chartArea.right, (chartArea.top + chartArea.bottom) / 2);
                ctx.stroke();


                ctx.beginPath();
                ctx.moveTo((chartArea.left + chartArea.right) / 2, chartArea.top);
                ctx.lineTo((chartArea.left + chartArea.right) / 2, chartArea.bottom);
                ctx.stroke();
                ctx.restore();


                const xScale = chart.scales.x;
                const yScale = chart.scales.y;


                ctx.save();
                ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';



                ctx.beginPath();
                ctx.moveTo(xScale.getPixelForValue(0), yScale.getPixelForValue(0));
                ctx.lineTo(xScale.getPixelForValue(R), yScale.getPixelForValue(0));
                ctx.lineTo(xScale.getPixelForValue(0), yScale.getPixelForValue(0.5 * R));
                ctx.closePath();
                ctx.fill();


                ctx.fillRect(
                    xScale.getPixelForValue(-R),
                    yScale.getPixelForValue(R / 2),
                    xScale.getPixelForValue(0) - xScale.getPixelForValue(-R),
                    yScale.getPixelForValue(0) - yScale.getPixelForValue(R / 2)
                );


                const centerX = xScale.getPixelForValue(0);
                const centerY = yScale.getPixelForValue(0);
                const radius = xScale.getPixelForValue(R) - centerX;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);

                ctx.arc(centerX, centerY, radius, Math.PI * 0.5, Math.PI);

                ctx.closePath();
                ctx.fill();


                const marks = [
                    { value: R, label: 'R' },
                    { value: -R, label: '-R' },
                    { value: 0.5 * R, label: '0.5R' },
                    { value: -0.5 * R, label: '-0.5R' }
                ];

                ctx.save();
                ctx.font = '12px Arial';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';

                marks.forEach(mark => {
                    const x = xScale.getPixelForValue(mark.value);
                    const yAxisCenter = (chartArea.top + chartArea.bottom) / 2;

                    ctx.beginPath();
                    ctx.moveTo(x, yAxisCenter - 5);
                    ctx.lineTo(x, yAxisCenter + 5);
                    ctx.stroke();

                    ctx.fillText(mark.label, x, yAxisCenter + 15);
                });

                ctx.textAlign = 'right';
                marks.forEach(mark => {
                    const y = yScale.getPixelForValue(mark.value);
                    const xAxisCenter = (chartArea.left + chartArea.right) / 2;

                    ctx.beginPath();
                    ctx.moveTo(xAxisCenter - 5, y);
                    ctx.lineTo(xAxisCenter + 5, y);
                    ctx.stroke();

                    ctx.fillText(mark.label, xAxisCenter - 10, y + 3);
                });

                ctx.restore();
            }
        },

        {
            id: 'hit',
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const xScale = chart.scales.x;
                const yScale = chart.scales.y;

                ctx.save();
                ctx.fillStyle = 'blue';
                hitPoints.forEach(point => {
                    const x = xScale.getPixelForValue(point.x);
                    const y = yScale.getPixelForValue(point.y);

                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                });

                ctx.restore();
            }
        },

        {
            id: 'miss',
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const xScale = chart.scales.x;
                const yScale = chart.scales.y;

                ctx.save();
                ctx.fillStyle = 'red';
                missPoints.forEach(point => {
                    const x = xScale.getPixelForValue(point.x);
                    const y = yScale.getPixelForValue(point.y);

                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                });

                ctx.restore();
            }
        }
    ]
};

const chart = new Chart(ctx, config);

function addPoint(x, y, hit) {
    if (hit) {
        hitPoints.push({ x, y });
    }
    else {
       missPoints.push({ x, y });
    }

    chart.update();
}

canvas.addEventListener('click', async (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - 308;
    const mouseY = rect.bottom - event.clientY - 310;

    const graphX = mouseX / 142 * R;
    const graphY = mouseY / 140 * R;

    const data = {
        x: graphX.toFixed(5),
        y: graphY.toFixed(5),
        r: R
    };

    shoot(data);
});