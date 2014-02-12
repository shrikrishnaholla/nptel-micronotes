$(document).ready(function() {
    var totalcommid = 31;
    
    $(".option-reply").on("click", function() {        
        var currtxt = $(this).text();
        var curroptlink = $(this);
        var cid = $(this).parent().parent().parent().attr("id");
        var poundcid = "#link-"+cid;
        
        var htmlform = '<div id="commsubform"><label>Add Comment:</label><textarea class="commtxtfield" id="content" name="content"></textarea> <br /><br /> <input type="submit" value="submit" class="btn btn-block btn-lg btn-success" onclick="submitcmnt()"></div>';
        
        // toggle between show/hide comment form views
        if(currtxt == "Reply") {
            $(this).parent().next(".showhidecommform").html(htmlform);
            $(this).text("Hide form");
        }

        // $("#commsubform").submit(submitcmntx);
        
        if(currtxt != "Reply") {
            curroptlink.parent().next(".showhidecommform").html("&nbsp;");
            curroptlink.text("Reply");
        }
        
        // begin translating our comment
        $(poundcid).on("click", function() {
            var newcomtxt = $('textarea#thecomment').val();
            var targetcontainer = "#"+cid;
            
            var newcommhtml = '<div class="comment-thread"> <div class="comment-block" id="c'+totalcommid+'"> <a href="#" class="author-avatar"><img src="images/avatar2.png" alt="anonymous" /></a> <p class="comment-top-meta"> <strong>anonymous</strong> <span>posted 1 sec ago</span></p> <div class="comment-content"> <p class="the-comment-post">' + newcomtxt + '</p> <p class="comment-reply-options"><a class="option-reply">Reply</a></p> <div class="showhidecommform">&nbsp;</div> </div> </div> <div class="thread-replies"></div> </div>';
            
            $(targetcontainer).next(".thread-replies").hide().append(newcommhtml).fadeIn();
            
            curroptlink.trigger("click");
        });
        
        totalcommid++;
        
        return false;
    });
});


