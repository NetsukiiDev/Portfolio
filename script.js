
document.addEventListener('DOMContentLoaded', function () {
    var discordLink = document.getElementById('discordLink');

    discordLink.addEventListener('click', function (event) {
        event.preventDefault();

        var dummyTextArea = document.createElement('textarea');
        dummyTextArea.value = 'netsukii';
        document.body.appendChild(dummyTextArea);
        dummyTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(dummyTextArea);

        Swal.fire({
            icon: 'success',
            title: 'Nome Utente Copiato!',
            showConfirmButton: false,
            timer: 1500,
            position: 'top',
            toast: true,
            animation: true,
            customClass: {
                popup: 'animated bounceIn custom-dark-background custom-light-text',
                backdrop: 'swal2-backdrop-show',
            }
        });
    });
});
