import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private afs: AngularFirestore) { }

  // User
  getUser(id){
    return this.afs.doc('users/'+id).valueChanges();
  }

  getAllUsers(){
    return this.afs.collection('users', ref => ref.where('type','==','user')).snapshotChanges();
  }

  getUsers(){
    return this.afs.collection('users').snapshotChanges();
  }

  createUser(id,data){
    return this.afs.doc('users/'+id).set(data);
  }

  deleteUser(id){
    return this.afs.doc('users/'+id).delete();
  }

  updateUser(id,data){
    return this.afs.doc('users/'+id).update(data);
  }

  // Calls

  getUserCallStatus(id){
    return this.afs.doc('calls/'+id).snapshotChanges();
  }

  addUserCallStatus(id,data){
    return this.afs.doc('calls/'+id).set(data);
  }

  updateUserCallStatus(id,data){
    return this.afs.doc('calls/'+id).update(data);
  }

  // Rooms

  getAllRooms(){
    return this.afs.collection('rooms').snapshotChanges();
  }

  addRoom(data){
    return this.afs.collection('rooms').add(data);
  }

  deleteRooms(id){
    return this.afs.doc('rooms/'+id).delete();
  }

  updateRoom(id,data){
    return this.afs.doc('rooms/'+id).update(data);
  }

}
