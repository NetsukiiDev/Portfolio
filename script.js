document.addEventListener('DOMContentLoaded', function() {
    const discordLink = document.getElementById('discordLink');
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const body = document.body;
  
    discordLink.addEventListener('click', function(event) {
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
  
    // Carica il tema corrente al caricamento della pagina
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
      body.classList.toggle('dark-mode', currentTheme === 'dark');
      body.classList.toggle('light-mode', currentTheme === 'light');
      toggleSwitch.checked = currentTheme === 'dark';
    }
  
    // Cambia il tema al cambio dell'interruttore
    function switchTheme(e) {
      const isDarkTheme = e.target.checked;
      body.classList.toggle('dark-mode', isDarkTheme);
      body.classList.toggle('light-mode', !isDarkTheme);
      localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }
  
    toggleSwitch.addEventListener('change', switchTheme, false);
  });
  