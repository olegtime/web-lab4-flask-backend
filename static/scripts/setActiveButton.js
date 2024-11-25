document.querySelectorAll('.x-button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelector('input[name="x"]').value = this.getAttribute('data-value');
        document.querySelectorAll('.x-button').forEach(btn => {
            btn.classList.remove('active');
        });

        this.classList.add('active');
    });
});