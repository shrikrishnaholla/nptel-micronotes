$(function() {
  $(document.body).on('appear', '.card', function(e, $affected) {
    // add class called “appeared” for each appeared element
    $(this).addClass("appeared");
  });
  $('.card').appear({force_process: true});
  
  $( ".container" ).bind( "mousedown", function ( e ) {
      e.metaKey = true;
  } ).selectable({
        cancel: 'a,.rating'
    });

  $( ".container" ).on( "selectablestart", function( event, ui ) {$('.download').css({'display':'block'})} );
  $( ".container" ).on( "selectableunselecting", function( event, ui ) {
  	var num_selected = $('.ui-selected').toArray().length
  	if (num_selected == 0) {
  		$('.download').css({'display' : 'none'});
  	};
  } );

  $('.download').click(function(event) {
  	event.preventDefault();
  	var selected = $('.ui-selected span');
  	var ids = [];
  	selected.each(function(index, value) {
  		ids.push(value.innerHTML);
  		if (ids.length == selected.length) {
  			$.fileDownload('/download?' + $.param({ids:ids}));
  		};
  	});
  	// $.get( "/download", { "ids[]": ids } );
  });

  function rate(e) {
        if (!e) {
            e = window.event;
        }
        var target = e.target || e.srcElement;
        var nid = $(e.target).parent().parent().attr("id");
        var rating = parseInt($(e.target).attr("id"));
        $.ajax({
            url : 'rate_note',
            type : 'POST',
            data : {pid : nid, rate:rating},
            success : function() {
                location.reload();
            },
            /*error : fucntion() {
                alert('failed');
            }*/
        });
        
    }
});
