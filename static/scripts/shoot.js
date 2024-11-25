window.shoot = async function shoot(data) {
    const response = await fetch('/shoot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    addPoint(result.x * R / result.r, result.y * R / result.r, result.hit);
    points.push({ x: result.x, y: result.y, r: result.r, hit: result.hit });

    const tableBody = document.querySelector('.attempts-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${result.x}</td>
        <td>${result.y}</td>
        <td>${result.r}</td>
        <td>${result.hit.toString().replace(/^./, c => c.toUpperCase())}</td>
    `;
    tableBody.appendChild(newRow);
}