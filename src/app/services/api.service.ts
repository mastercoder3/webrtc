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
}
