/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var count = 1;//pagination count
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//phonegap things
var onDeviceReady = function() {
    // alert("OnDeviceReady fired.");
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("offline", onOffline, false);
};

function init() {
    //body triggers this function
    document.addEventListener("deviceready", onDeviceReady, true);
}

function onPause() {
// On app paus clear the content
$('#theList').html('');
}

function onResume() {
// On app resume populate startpage
    $('#load').hide();
    if( $('#about').height() == 0){
    //check if you open the about or start page
        count = 1; //reset counter
        myfunction(1);            
        $('#load').removeClass('ui-disabled');
    }
}

function onOffline() {
    // Handle the offline event
    alert('No connection');
}

$(document).ready(function() {
  // Handler for .ready() called.
  $('#load').click(function(){
        count++;
        $(".spinner").css('display', 'block');
        if(count == 3) $(this).addClass("ui-disabled");
        paginate = count;
        myfunction(paginate);
    });
});

//jquerymobile things
$( document ).on( "pageinit", function( event ) {

    //fix for 100% height wrapper
    var heights = $(window).height();
    var contentHeight = heights - 42;
    $("#pageContent").css( "height", contentHeight);
    $("#pageContent2").css( "height", contentHeight);


});

$( document ).delegate("#one", "pageinit", function() {

    $('#load').hide();    
    myfunction(1);
    //first api call

    $.mobile.defaultPageTransition = 'slide';
    //default transition

     //open panel with swipe
    $("#one").on("swiperight",function(){
         $("#left-panel").panel( "open");
    });
   
});


$(document).on('pagebeforeshow', '#two', function(){       
    $("#theContentz").html(''); //empty page #two memory
});

function myfunction(page){
// content for main page

    $(function() {

        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: "http://vimeo.com/api/v2/group/ljudbildspel/videos.json?page=" + page,
            success: function(data) {

            for (var i = 0; i < 20; i++) {

                if(data[i].mobile_url && data[i].embed_privacy == "anywhere"){  

                    var str = data[i].description;  
                    var Hello = str.toString();
                    var mySplit = Hello.slice(0,45);      
                    var theID = data[i].id;     

                    $("#theList").append("<li id='" + theID + "' class='liClick' onClick='divFunction(" + theID + ")'><a href='#two'><img src='" +  data[i].thumbnail_small + "'><h2>" + data[i].title + "</h2><p>" + mySplit +"...</p></a></li>");
                }   

                    $('.spinner').css('display', 'none');
                    $("#theList").listview("refresh");

                }
                    $('#load').show();

            }
        });

    });
}

function divFunction(id){
// content for page #two

        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: "http://vimeo.com/api/v2/video/" + id +".json",
            success: function(data) {

                    var str = data[0].description;
                    var avatar = "<div style='padding:0 15px 15px 15px'><img src='" + data[0].user_portrait_medium + "' class='avatar'>";
                    var username ="<strong>" + data[0].user_name + "</strong>";
                    var theTitle = "<h3>" + data[0].title + "</h3>"; 

                    //vimeo url button. create https url - mainviewController.m will open https urls in safari    
                    var vimeoUrl = data[0].mobile_url;  
                    var theHttps = vimeoUrl.split("//");   
                    var newVurl = "https://" + theHttps[1];   
                    //

                    if($("body").width() == 320){
                        var iHeight = "height='180'";
                    }
                    else{
                        var iHeight = "height='270'";
                    } 

                    

                    $("#theContentz").html(function() {
                        var iframeSRC = "http://player.vimeo.com/video/"+ id +"?api=1&player_id=player";  
                        var emph = "<iframe id='player' src='" + iframeSRC +  "' width='100%'" + iHeight + "seamless></iframe>";
                        var desc = "<p><small>" + str +"</small><p></div>";
                        var vbutton = "<a id='vimeoButton' data-role='button' onclick=\"urlFunc('" + newVurl +"')\">View on Vimeo</a><br/><br/>";

                        return emph + avatar + theTitle + username + desc + vbutton;
                    });
                
                    $("#two").trigger("pagecreate");//this will render the button layout correctly
            }
        });
}


function urlFunc(openUrl)
{
    //this is the inappbrowser function
    var ref = window.open(openUrl, '_blank', 'location=yes');
}


function aboutFunction(shitz){
//populate page #one with content from panel = home/about 
    var aboutText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tellus urna, porttitor a lorem suscipit, ullamcorper cursus elit. Nullam iaculis leo id pretium molestie. Etiam malesuada pulvinar diam, nec auctor lacus tincidunt sit amet. Vestibulum enim lacus, lacinia id cursus eu, auctor nec lacus. Nam fringilla adipiscing quam, vel vestibulum nisl imperdiet ut. Nunc in lectus fringilla, convallis tellus a, convallis nunc. Maecenas viverra nibh ac pharetra auctor. Nam vel magna et urna tincidunt egestas sed a magna. Maecenas malesuada libero a augue pulvinar egestas. Vestibulum ultricies metus ut sollicitudin scelerisque. Quisque vitae vulputate lorem. Nam vitae nulla id mi pharetra fringilla non consectetur quam. Ut blandit massa ac scelerisque porta. Praesent gravida volutpat nulla sit amet volutpat. Vestibulum ipsum arcu, feugiat et est ut, facilisis mollis dolor. Quisque rhoncus arcu quis aliquam iaculis.";
    
    if(shitz == two){
        $('#load').hide();
        $('#pageContent').css( "background-image", "none" );
        $("#theList").html('');
        $("#about").css('padding','10px 20px 20px 20px').html('<small>' + aboutText + '</small>');
        $( "#left-panel" ).panel( "close" );
    }
     else if(shitz == one && $('#theList').length > 1) {
        $( "#left-panel" ).panel( "close" );
    }
    else{
        count = 1;
        $("#about").html('').css('padding','0');
        $('#pageContent').css({
            'background':'url(img/ajax-loader-small.gif)',
            'background-repeat': 'no-repeat',
            'background-position':'50% 15%'
        });
        $('#load').hide();
        myfunction(1);
        $( "#left-panel" ).panel( "close" );
        $('#load').removeClass('ui-disabled');
    }
}