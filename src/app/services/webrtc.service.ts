import { Injectable } from '@angular/core';
declare var RTCMultiConnection: any;

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {

  connection;
  focusVideo;
  joined = false;

  constructor() {

    this.focusVideo = false;
    this.connection = new RTCMultiConnection();
    this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    this.connection.session = {
      audio: true,
      video: true
    };

    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };

    this.connection.bandwidth = {
      audio: 128,
      video: 1024,
      screen: 1024
    };

    var users = [];
    
    var con = this.connection;


    this.connection.onleave = this.connection.streamended = this.connection.onclose = function(event) {
      con.onUserStatusChanged({
          userid: event.userid,
          extra: event.extra,
          status: 'offline'
      });
      count = count -1;
  };
  var count = 0;
  this.connection.onUserStatusChanged = function(status) {
    let focus = document.getElementById('currentVideo');
    let myVideo = document.getElementById('otherVideos');
    if(status.status === 'offline'){
      let x = users.findIndex(data => data === status.userid );
      if(x > -1){
        users.splice(x,1);
        if(users.length === 1){
          con.getAllParticipants().forEach(function(participantId) {
            con.disconnectWith(participantId);
          });
          if(confirm(`All Users Disconnected. System is Ending call.`))
            location.reload();
          else
            location.reload();
        }
      }
    }
  };

  
    this.connection.onstream = function (event) {

      con.onUserStatusChanged({
        userid: event.userid,
        extra: event.extra,
        status: 'online'
    });

    
      let x = users.findIndex(data => data === event.userid )
      if(x === -1)
        users.push(event.userid);
      let focus = document.getElementById('currentVideo');

      function addToSide(element) {
        let id = element.id;

        let myVideo = document.getElementById('otherVideos');
        myVideo.appendChild(element);
        let addStyle = document.getElementById(id);
        // addStyle.style.pointerEvents = "none";
        addStyle.style.width = "250px";
        addStyle.style.height = "250px";
        addStyle.removeAttribute("controls");
        let myFunc = function () {
          console.log('coming');
          if (focus.childNodes.length > 0) {
            let myVideo = document.getElementById('currentVideo');
            let replace = myVideo.getElementsByTagName('video')[0];
            myVideo.removeChild(myVideo.getElementsByTagName('video')[0]);
            addStyle.style.width = "680px";
            addStyle.style.height = "480px";
            addStyle.removeEventListener('click', myFunc, false);
            myVideo.appendChild(addStyle);
            addToSide(replace);
          }
        }
        addStyle.addEventListener('click', myFunc, false);
      };


      if (event.type === 'local') {
        // let id = event.mediaElement.id;

        // let myVideo = document.getElementById('otherVideos');
        // myVideo.appendChild( event.mediaElement );
        // let addStyle = document.getElementById(id);
        // addStyle.style.pointerEvents = "none";
        // addStyle.style.width = "250px";
        // addStyle.style.height = "250px";
        // addStyle.addEventListener('click', function(eventt){
        //   if(focus.childNodes.length > 0){
        //     let myVideo = document.getElementById('currentVideo');
        //     let replace = myVideo.getElementsByTagName('video')[0];
        //     myVideo.removeChild(myVideo.getElementsByTagName('video')[0]);
        //     myVideo.appendChild( addStyle );

        //   }
        // });
        addToSide(event.mediaElement)
      }
      else if (event.type === 'remote' && focus.childNodes.length === 0) {
        users.push(event.userid);
        let id = event.mediaElement.id;
        let myVideo = document.getElementById('currentVideo');
        myVideo.appendChild(event.mediaElement);
        this.focusVideo = true;
        let addStyle = document.getElementById(id);
        addStyle.removeAttribute("controls");
      }
      else if (event.type === 'remote' && focus.childNodes.length > 0) {
        // let id = event.mediaElement.id;

        // let myVideo = document.getElementById('otherVideos');
        // myVideo.appendChild( event.mediaElement );
        // let addStyle = document.getElementById(id);
        // // addStyle.style.pointerEvents = "none";
        // addStyle.style.width = "250px";
        // addStyle.style.height = "250px";
        // addStyle.removeAttribute("controls");
        // addStyle.addEventListener('click', function(eventt){

        // });
        addToSide(event.mediaElement)
      }

    };
  }

  open(id) {
    this.connection.open(id);
  }

  join(id) {
    this.connection.join(id);
  }

  onStream() {
    this.connection.onStream = function (event) {
      let x = document.getElementById('remote');
      x.appendChild(event.mediaElement);
    }
  }

  setFocus(value: boolean) {
    this.focusVideo = value;
  }

  getConnection() {
    return this.connection;
  }
}
