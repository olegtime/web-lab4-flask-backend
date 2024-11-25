document.getElementById('clear-button').addEventListener('submit', async function(event) {
    event.preventDefault();

    const response = await fetch('/clear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    hitPoints.length = 0;
    missPoints.length = 0;
    points.length = 0;

    chart.update();

    document.querySelector('.attempts-table tbody').innerHTML = '';
});