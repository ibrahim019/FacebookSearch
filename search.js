$(function() {
  var q = decodeURIComponent(document.location.search.split(/=/)[1] || 'rectal surgery').replace(/\+/g,' ');

  var ROW_HTML=['',
  '<tr>',
  '  <td class="person">',
  '    <a href="http://www.facebook.com/profile.php?id=ID&v=wall" target="_blank"><div class="profile"><img src="http://graph.facebook.com/ID/picture?type=large"/></div></a>',
  '  </td>',
  '<td class="msg">',
  '  <a href="http://www.facebook.com/profile.php?id=ID&v=wall" target="_blank">NAME</a>',
  '  SEX FROM <p><q>MSG</q></q>',
  '</td>',
  '</tr>'].join('\n');

  $('#q').attr('value',q);

  $(window).scroll(function(){
    var page_remaining = $(document).height() - ($(window).height() + $(window).scrollTop());
    if  (page_remaining < 1000){
      fetchNextPage();
    }
  });

  var nextPage = false;
  function fetchNextPage() {
    if (nextPage) {
      $.getJSON(nextPage + "&callback=?", handleSearchResults);
      nextPage = false;
    }
  }

  $.getJSON( 'http://graph.facebook.com/search?callback=?', {'q':q, 'type':'post'}, handleSearchResults);

  function handleSearchResults(response, textStatus) {
    //console.warn(response);

    if (response.paging && response.paging.next) {
      nextPage = response.paging.next;
    } else {
      $(".waitloading").hide();
    }
    $.each(response.data,function(_,post) {
      $.getJSON("http://graph.facebook.com/" + post.from.id + "?callback=?", function(user) {
        var html = ROW_HTML
        .replace(/ID/g,  post.from.id)
        .replace(/NAME/g,post.from.name)
        .replace(/MSG/g, post.message||'')
        .replace(/SEX/g, user.gender ? '('+user.gender+')' : '')
        .replace(/FROM/g,(user.location && user.location.name) || '');
        $(html).appendTo($('table'));
      });
    });
  }
});