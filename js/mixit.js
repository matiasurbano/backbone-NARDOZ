(function() {

  window.presentation = new Presentation();

  // Demoing binding with very simple jQuery on purpose ;)
  $('#binding-demo input').keyup(function() {
    $('#binding-demo span').html($(this).val());
  });

})();
