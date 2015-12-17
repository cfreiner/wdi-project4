$(function() {
  $('.nav-link').click(function(e) {
    e.stopPropagation();
    console.log('in click listener');
    $(this).toggleClass('active');
  });
});
