import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { WebrtcService } from 'src/app/services/webrtc.service';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {Howl, Howler} from 'howler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  status;
  users;
  selectedUser = '';
  callUsers=[];
  showSpinner=true;
  rooms=[];
  public ifCall=false;
  processCount = 0;
  calling = false;
  sound;

  constructor(private rtc: WebrtcService, public api: ApiService, private toastr: ToastrService) { 
  }

  ngOnInit() {

    this.api.getUserCallStatus(localStorage.getItem('rid'))
      .pipe(map(a =>{
        const data = a.payload.data();
        const did = a.payload.id;
        return {did, ...data};
      }))
        .subscribe( res =>{
          console.log(res)
          this.status = res;
        });
      
    this.api.getUsers()
        .pipe(map(actions => actions.map(a =>{
          const data = a.payload.doc.data();
          const did = a.payload.doc.id;
          return {did, ...data};
        })))
        .subscribe((res: Array<any>) =>{
          this.users =res.filter(data => data.did !== localStorage.getItem('rid'));
          this.showSpinner = false;
        })
    this.api.getAllRooms()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe((res: Array<any>) =>{
        this.rooms = res;
        let x = this.rooms.filter(data => data.roomId === localStorage.getItem('rid'));
        if(x.length > 0){
          const connection = this.rtc.getConnection();
          var checker = this;
          var myroomId = x[0].did;
          setTimeout( () =>{
            connection.checkPresence(x[0].roomId, function(isRoomEists, roomid) {
              if(!isRoomEists) {
                checker.api.deleteRooms(myroomId);
              }
            });
          }, 5000);
        
        }
        this.checkIfChanges();
      });
  }

  tempId;
  caller;
  isJoined;

  checkIfChanges(){
    let id = localStorage.getItem('rid');
    let x = this.rooms.filter(data => data.users.indexOf(id) > -1);
    if(x.length > 0){
      this.tempId = x;
      const connection = this.rtc.getConnection();
      var that = this;

      setTimeout( () =>{
        connection.checkPresence(x[0].roomId, function(isRoomEists, roomid) {
          if(isRoomEists) {
            if(Date.now() - that.tempId[0].date <= 20000){
              that.sound = new Howl({
                src: ['./assets/assets/audio/call.mp3'],
                autoplay: true,
                loop: true,
                volume: 1
              });
                that.showSpinner = true;
                that.calling = true;
                that.sound.play();
            }
            else{
              that.calling = false;
              that.showSpinner = false;
              that.ifCall = true;
              localStorage.setItem('callId',that.tempId[0].did);
              that.rtc.join(that.tempId[0].roomId);
            }

          }
          else {
            that.api.deleteRooms(that.tempId.did)
            .then( res =>{
              that.ifCall = false;
              that.processCount = 0;
              that.calling = false;
              that.showSpinner = false;
            });
          }
        });
      },2000);



      // if(Date.now() - x[0].date <= 60000){
      //   this.sound.play();
      //   this.tempId = x[0];
      //   this.caller = x;
      //   this.isJoined = isJoined;
      //   setTimeout(() =>{
      //     if(this.calling){
      //       this.rejectCall();
      //     }
      //   }, 15000);
      // }
      // else{
      //   this.caller = x;
      //   this.acceptCall();
      // }
      
    }
  }

  acceptCall(){
    this.sound.stop();
    this.calling = false;
    this.showSpinner = false;
    this.ifCall = true;
    // this.setRoomStatus(this.caller,this.isJoined);
    console.log(this.tempId);
    localStorage.setItem('callId',this.tempId[0].did);
    this.rtc.join(this.tempId[0].roomId);
  }

  rejectCall(){
    this.sound.stop();
    let y = this.tempId.users.findIndex(data => data.indexOf(localStorage.getItem('rid')) >-1 );
    if(y>-1){
      let id = this.tempId.did;
      delete this.tempId['did'];
      this.tempId.users.splice(y,1);
      this.api.updateRoom(id,this.tempId)
        .then(res =>{
          this.ifCall = false;
          this.calling = false;
          this.showSpinner = false;
        }, err =>{
          console.log(err)
        });
    }
  }

  setRoomStatus(x,isJoined){
    const connection = this.rtc.getConnection();
    var checker = false;
    this.processCount = 0;
    let date = Date.now();
    var that = this;
      connection.checkPresence(x[0].roomId, function(isRoomEists, roomid) {
        if(isRoomEists) {
          localStorage.setItem('callId',x[0].did);
          isJoined = true;
          connection.join(roomid);
        }
        else {
          isJoined = false;
          checker = true;
          that.api.deleteRooms(that.tempId.did)
          .then( res =>{
            that.ifCall = false;
            that.processCount = 0;
          });
        }
      });

    // let processInterval = setInterval( () =>{
    //   console.log('comingggggggggggggg');
    //   if(checker === false && this.processCount < 5){
    //     this.processCount++;
    //   }
    //   else if( this.processCount >= 5){
    //     clearInterval(processInterval);
    //   }
    //   else if(checker=== true){
    //     this.ifCall = false;
    //     isJoined = false;
    //     this.api.deleteRooms(x[0].did)
    //     .then( res =>{
    //       clearInterval(processInterval);
    //       this.processCount = 0;
    //     })
    //   }
    // }, 5000);
  }

  ngOnDestroy(){
    // this.api.addUserCallStatus({status: 'junaid Offline'});
    if(this.ifCall)
      this.endCall();
  }

  addUser(){
    if(this.selectedUser !== ''){
      let x = this.callUsers.findIndex(data => data === this.selectedUser);
      if(x === -1){
        let y = this.rooms.filter(data => data.users.indexOf(this.selectedUser) > -1);
        console.log(y);
        if(y.length > 0)
        {
          if( Date.now() - y[0].date > 3600000){
            this.callUsers.push(this.selectedUser);
          }
          else if(Date.now() - y[0].date < 600000){
            this.toastr.warning('The user is on another call, please try later.','Cannot add this user.');
          }
          else{
            this.toastr.warning('This user Maybe on a Call.');
            this.callUsers.push(this.selectedUser);
          }
        }
        else
          this.callUsers.push(this.selectedUser);
      }
      else {
        this.callUsers.splice(x,1);
      }
    }
  }

  getUserName(val){
    let x = this.users.filter(data => data.did === val);
    return x[0].address;
  }

  startCall(){
    let id = this.rooms.findIndex(data => data.roomId === localStorage.getItem('rid'));
    if(id > -1){
      this.api.deleteRooms(this.rooms[id].did).then(res =>{
        let data = {
          date: Date.now(),
          roomId: localStorage.getItem('rid'),
          users: this.callUsers
        }
       this.openRoom(data);
      })
    }
    else{
      let data = {
        roomId: localStorage.getItem('rid'),
        users: this.callUsers,
        date: Date.now()
      }
     this.openRoom(data);
    }
  }

   openRoom(data){
    this.rtc.open(data.roomId);
    this.api.addRoom(data)
    .then(res =>{
      localStorage.setItem('myRoom',res.id);
      this.ifCall = true;
    }, err=>{
      this.toastr.error(err.message,'Error Starting Call.');
    })
  }

  endCall(){
    // var myNode = document.getElementById("otherVideos");
    // while (myNode.firstChild) {
    //     myNode.removeChild(myNode.firstChild);
    // }

    // var myNode = document.getElementById("currentVideo");
    // while (myNode.firstChild) {
    //     myNode.removeChild(myNode.firstChild);
    // }
    this.ifCall = false;
    if(localStorage.getItem('myRoom'))
        this.api.deleteRooms(localStorage.getItem('myRoom'))  
        .then(res =>{
          // const connnection = this.rtc.getConnection();
          // connnection.getAllParticipants().forEach(function(participantId) {
          //   connnection.disconnectWith(participantId);
          // });
          localStorage.removeItem('myRoom');
          location.reload();
        });
    else{
      let x = this.rooms.filter(data => data.did === localStorage.getItem('callId'));
      if(x.length > 0){
        let me = x[0].users.findIndex(data => data  === localStorage.getItem('rid'));
        if(me > -1){
          x[0].users.splice(me,1);
          let id = x[0].did;
          delete x[0]['did'];
          this.api.updateRoom(id,x[0])
            .then(res =>{
              // const connnection = this.rtc.getConnection();
              // connnection.getAllParticipants().forEach(function(participantId) {
              //   connnection.disconnectWith(participantId);
              // });
              localStorage.removeItem('callId');
              location.reload();
            });
        }
      }
    }
        
  }

}
