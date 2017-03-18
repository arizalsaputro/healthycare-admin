angular.module('healthy.services', [])

.factory("Auth",['$firebaseAuth',function($firebaseAuth) {
  var usersRef = new Firebase("https://easyhealthy.firebaseio.com/users");
  return $firebaseAuth(usersRef);
}])


.factory('Klinik', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/klinik');
  return $firebaseArray(itemsRef);
}])

.factory('Asuransi', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/asuransi');
  return $firebaseArray(itemsRef);
}])

.factory('Laporan', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/laporan');
  return $firebaseArray(itemsRef);
}])

.factory('Rekam', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/rekam');
  return $firebaseArray(itemsRef);
}])

.factory('Pendapatan', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/keuangan');
  return $firebaseArray(itemsRef);
}])


.factory('Dokter', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/dokter');
  return $firebaseArray(itemsRef);
}])

.factory('User', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/users');
  return $firebaseArray(itemsRef);
}])

.factory('Pegawai', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/pegawai');
  return $firebaseArray(itemsRef);
}])




.service('LoginSer',['Auth','$q',function(Auth,$q){
  this.loginApp = function(user){
    var deferred = $q.defer();
      Auth.$authWithPassword({
                email: user.email,
                password: user.pass
      }).then(function (authData) {
         if(authData.uid == '016e39d6-d8e3-430c-a531-be1234ad96cf'){
           window.localStorage.setItem("adminemail", user.email);
           deferred.resolve(true);
         }
         else{
           Auth.$unauth();
           deferred.resolve(false);
         }
        
         
       }).catch(function (error) {
                if (error) {
                     deferred.reject(error);
                  } 
        });
    return deferred.promise;
  }

  this.cekAuth = function(){
    var deferred = $q.defer();
    Auth.$onAuth(function (authData) {
            if (authData) {
               deferred.resolve(true);
            }else{
              deferred.resolve(false);
            }
    });
    return deferred.promise;
  }
}])

.service('Notify',['webNotification','Global',function(webNotification,Global){
  this.makenotify = function(){
          Global.playsound();
          webNotification.showNotification('Example Notification', {
                body: 'Notification Text...',
                icon: 'img/icon.png',
                onClick: function onNotificationClicked() {
                    console.log('Notification clicked.');
                },
                autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
            }, function onShow(error, hide) {
                if (error) {
                    window.alert('Unable to show notification: ' + error.message);
                } else {
                    console.log('Notification Shown.');

                    setTimeout(function hideNotification() {
                        console.log('Hiding notification....');
                        hide(); //manually close the notification (you can skip this if you use the autoClose option)
                    }, 5000);
                }
            });
  }
}])

.service('Global',['$q','Auth','$state','$filter','Laporan','Pendapatan',function($q,Auth,$state,$filter,Laporan,Pendapatan){
  this.hapussemualaporan=function(){
    for (var i = Laporan.length - 1; i >= 0; i--) {
      Laporan.$remove(Laporan[i]);
    };
  }

  this.hapussemuapendapatan=function(){
    for (var i = Pendapatan.length - 1; i >= 0; i--) {
      Pendapatan.$remove(Pendapatan[i]);
    };
  }

  this.getRandom = function(){
    return Math.floor((Math.random() * 10) + 1);
  }

  this.playsound = function(){
    var sound = new Audio('sound/pling.mp3');
    sound.play();
  }

  this.showDialog=function(tag){
    var dialog = document.querySelector('#'+tag);
    try{
      dialog.showModal();
    }catch(error){
      dialogPolyfill.registerDialog(dialog);
      dialog.showModal();
    }
  }

  this.hideDialog=function(tag){
    var dialog = document.querySelector('#'+tag);
     dialog.close();
  }

  this.getIndoname = function(day){
    var indo = $filter('date')(day, 'EEEE');
      switch(indo){
      case 'Monday' :
              indo='Senin';
              break;
       case 'Tuesday' :
            indo='Selasa';
            break;
      case 'Wednesday' :
              indo='Rabu';
              break;
       case 'Thursday' :
            indo='Kamis';
            break;
        case 'Friday' :
            indo='Jumat';
            break;
      case 'Saturday' :
              indo='Sabtu';
              break;
       case 'Sunday' :
            indo='Minggu';
            break;
       default :
            indo='Error';
      }
      return indo;
  }

  this.showpassword = function(inuser){
    var deferred = $q.defer();
    var ref = new Firebase("https://easyhealthy.firebaseio.com/");
    ref.changePassword({
    email       : window.localStorage.getItem("adminemail"),
    oldPassword : inuser,
    newPassword : inuser
    }, function(error) {
        if (error === null) {
         deferred.resolve(true);
        } else {
         deferred.reject(error);
        }
    });
    return deferred.promise;
  }

  this.deleteacount = function(usremail,usrpass){
    var deferred = $q.defer();
    var ref = new Firebase("https://easyhealthy.firebaseio.com/");
        ref.removeUser({
          email    : usremail,
          password : usrpass
        }, function(error) {
          if (error === null) {
            deferred.resolve(true);
          } else {
            deferred.reject(error);
          } 
        });
       return deferred.promise;
  }

  this.resetpass = function(user){
        var deferred = $q.defer();
        var ref = new Firebase("https://easyhealthy.firebaseio.com/");
        ref.resetPassword({
          email : user
        }, function(error) {
          if (error === null) {
            deferred.resolve(true);
          } else {
            deferred.reject(error);
          }
        });
        return deferred.promise;
     }
  this.keluarapp = function(){
     Auth.$unauth();
     window.localStorage.removeItem("adminemail");
     $state.go('login');
  }
}])

.service('AdminSer',['$q',function($q){
  this.ubahemail = function(baru,pass){
         var deferred = $q.defer();
         var ref = new Firebase("https://easyhealthy.firebaseio.com/");
         ref.changeEmail({
          oldEmail : window.localStorage.getItem("adminemail"),
          newEmail : baru,
          password : pass
        },  function(error) {
          if (error === null) {
               window.localStorage.setItem("adminemail", baru);
               deferred.resolve(true);
          } else {
             deferred.reject(error);
          }
       });
      return deferred.promise;
  }
  this.ubahpassword = function(item){
    var deferred = $q.defer();
    var ref = new Firebase("https://easyhealthy.firebaseio.com/");
    ref.changePassword({
    email       : window.localStorage.getItem("adminemail"),
    oldPassword : item.lama,
    newPassword : item.baru
    }, function(error) {
      if (error === null) {
       deferred.resolve(true);
      } else {
        deferred.reject(error);
      }
    });
    return deferred.promise;
  }
}])

.service('KlinikSer',['$q','Klinik','$firebaseArray',function($q,Klinik,$firebaseArray){

  this.resetsemuaanalitiklinik=function(){
    for (var i = Klinik.length - 1; i >= 0; i--) {
      resetanalkli(Klinik[i].$id);
    };
  }

  this.hapussemuaklinik=function(){
    for (var i = Klinik.length - 1; i >= 0; i--) {
      resetanalkli(Klinik[i].$id);
      hapusklinikk(Klinik[i]);
    };
  }

  this.getlineKlinik = function(){
    var refgra = new Firebase("https://easyhealthy.firebaseio.com/history/klinik/");
    return $firebaseArray(refgra);
  }

  function resetanalkli(uid){
    var refgra = new Firebase("https://easyhealthy.firebaseio.com/history/klinik/"+uid);
    refgra.remove();
  }

  this.resetanalitikklinik=function(uid){
    resetanalkli(uid);
  }

  this.getgrafikklinik=function(uid){
    var deferred = $q.defer();
    var refgra = new Firebase("https://easyhealthy.firebaseio.com/history/klinik/"+uid);
    var listpasienperbulan = $firebaseArray(refgra);
    deferred.resolve(listpasienperbulan);
    return deferred.promise;
  }


  this.tambahklinik = function(itemdesc){
     var refkli = new Firebase("https://easyhealthy.firebaseio.com/");
     
     var clinik = refkli.child("klinik");
     var addforklikik = clinik.push();
     addforklikik.set({
        'nama' : itemdesc.nama,
        'desc' : itemdesc.desc,
        'gambar': itemdesc.linkgambar || '',
        'listdokter':''
     });  

     var antrian = refkli.child("antrian").child(addforklikik.key());
     antrian.set({
      'regis':-1
     });

  }
  this.editklinik = function(klinik){
      var ref = new Firebase("https://easyhealthy.firebaseio.com/klinik/"+klinik.$id);
      ref.update({
        desc : klinik.desc || '',
        gambar: klinik.gambar || '',
        nama : klinik.nama || ''
      });
  }
  function hapusklinikk(klinik){
    Klinik.$remove(klinik);
    var ref = new Firebase("https://easyhealthy.firebaseio.com/antrian/"+klinik.$id);
    ref.remove();
  }
  this.hapusklinik = function(klinik){
    resetanalkli(klinik.$id);
    hapusklinikk(klinik);
  }
  
  this.isanotavailable=function(id,datalist){
     var tmp = true;
      for (var i = 0; i < datalist.length; i++) {
        if(datalist[i] == id){
          tmp = false;
        }
      };
      return tmp;
  }

  function getElementbyID(id,list){
      var element;
      for (var i = 0; i < list.length; i++) {
        if(list[i] == id){
          element = i;
        }
      };
      return element;
  }

 this.removelistavailable=function(id,list){
      var el = getElementbyID(id,list);
      list.splice(el,1);
      return list;
  }

  this.tambahkandokterbarudiklinik=function(id,list){
     var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/klinik/'+id);
      itemsRef.update({
        listdokter: list
      });
  }


}])


.service('DokterSer',['Dokter','$q','Auth','$firebaseArray','Global',function(Dokter,$q,Auth,$firebaseArray,Global){
  function hapussingledokter(i){
        Global.deleteacount(Dokter[i].email,Dokter[i].pass).then(function(bisa){
            resetanalitdok(Dokter[i].$id);
            Dokter.$remove(Dokter[i]);
        },function(error){
          
        });
  }

  this.hapusSemuadokter=function(){
      for (var i = Dokter.length - 1; i >= 0; i--) {
        hapussingledokter(i);
      };
  }

  this.getlineDokter = function(){
     var refgra = new Firebase("https://easyhealthy.firebaseio.com/history/dokter/");
     return $firebaseArray(refgra);
  }

  this.resetsemuaanalitikdokter=function(){
    for (var i = Dokter.length - 1; i >= 0; i--) {
      resetanalitdok(Dokter[i].$id);
    };
  }

  function resetanalitdok(uid){
    var refgra = new Firebase("https://easyhealthy.firebaseio.com/history/dokter/"+uid);
    refgra.remove();
  }

  this.resetanalitikdokter=function(uid){
    resetanalitdok(uid);
  }

  this.getgrafikpasien=function(uid){
    var deferred = $q.defer();
    var refgra = new Firebase("https://easyhealthy.firebaseio.com/history/dokter/"+uid);
    var listpasienperbulan = $firebaseArray(refgra);
    deferred.resolve(listpasienperbulan);
    return deferred.promise;
  }


  this.getTgl = function(indek){
    var tgl;
    switch(indek){
      case 0: 
        tgl = new Date(2016,1,1,0,0);
        break;
      case 1:
        tgl = new Date(2016,1,2,0,0);
      
        break;
      case 2 :
        tgl = new Date(2016,1,3,0,0);

        break;
      case 3 :
       tgl = new Date(2016,1,4,0,0);
     
        break;
      case 4 :
       tgl = new Date(2016,1,5,0,0);
      
        break;
      case 5 :
        tgl =  new Date(2016,1,6,0,0);
    
        break;
      case 6 :
         tgl =  new Date(2016,1,7,0,0);
       
        break;
     };
     return tgl;
  }

  this.savejadwalpratekdokter=function(dokter,listjadwalasli){
        var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/dokter/'+dokter.$id);
        itemsRef.update({
          listjadwal: listjadwalasli
        });
  }

  this.getRecord=function(a,b){
      for (var i = 0; i < b.length; i++) {
        a[i].hari = b[i].hari;
        a[i].start = b[i].start;
        a[i].end = b[i].end;
      };
     return a;
  }

  this.getlistday = function(){
    var listday = [{hari:'Monday',start:'',end:''},
          {hari:'Tuesday',start:'',end:''},
          {hari:'Wednesday',start:'',end:''},
          {hari:'Thursday',start:'',end:''},
          {hari:'Friday',start:'',end:''},
          {hari:'Saturday',start:'',end:''},
          {hari:'Sunday',start:'',end:''}];
    return listday;
  }

  this.tambahdokter = function(user){
            var deferred = $q.defer();
           Auth.$createUser({
                email: user.email,
                password: user.pass
            }).then(function (userData) {
                var userRef = new Firebase('https://easyhealthy.firebaseio.com/dokter');
                userRef.child(userData.uid).set({
                    'nama': user.nama || '',
                    'spesialis':user.spesialis || '',
                    'alamat': user.alamat || '',
                    'nomor_telp' : user.nomor_telp || '',
                    'email': user.email,
                    'photo' : '',
                    'kelamin': user.kelamin || '',
                    'pass' :user.pass,
                    'tarif' : user.tarif
                });
                deferred.resolve(true);
                
            }).catch(function (error) {
                  if (error) {
                    deferred.reject(error);
                  }    
            });
            return deferred.promise;
  }

  this.editDokter=function(pas){
    var ref = new Firebase("https://easyhealthy.firebaseio.com/dokter/"+pas.$id );
    ref.update({
      alamat:pas.alamat,
      nama: pas.nama,
      kelamin: pas.kelamin,
      nomor_telp: pas.nomor_telp,
      spesialis : pas.spesialis,
      tarif : pas.tarif
    });
  }
  this.hapusdokter=function(user){
    resetanalitdok(user.$id);
    Dokter.$remove(user);
  }
  this.ubahemail=function(user,baru){
    var deferred = $q.defer();
    var ref = new Firebase("https://easyhealthy.firebaseio.com/dokter/"+user.$id );
    ref.changeEmail({
        oldEmail : user.email,
        newEmail : baru.ulang,
        password : user.pass
      }, function(error) {
        if (error === null) {
            ref.update({
                email:baru.email
             });
            deferred.resolve(true);
        } else {
          deferred.reject(error);      
        }
      });
    return deferred.promise;
  }
  this.ubahpassword = function(tmp,baru){
     var deferred = $q.defer();
    var ref = new Firebase("https://easyhealthy.firebaseio.com/dokter/"+tmp.$id );
      ref.changePassword({
        email       : tmp.email,
        oldPassword : tmp.pass,
        newPassword : baru
      }, function(error) {
        if (error === null) {
          ref.update({
            pass:baru
          });
          deferred.resolve(true);
        } else {
          deferred.reject(error);
        }
      });
    return deferred.promise;
  }

}])


.service('PegawaiSer',['$q','Auth','Pegawai','Global',function($q,Auth,Pegawai,Global){
      function hapussinglepegawai(i){
         Global.deleteacount(Pegawai[i].email,Pegawai[i].pass).then(function(bisa){
            Pegawai.$remove(Pegawai[i]);
        },function(error){
          
        });
      }
      this.hapussemuapegawai = function(){
        for (var i = Pegawai.length - 1; i >= 0; i--) {
         hapussinglepegawai(i);
        };
      }

      this.savejadwalkerja=function(pegawai,listjadwalasli){
         var itemsRef = new Firebase('https://easyhealthy.firebaseio.com/pegawai/'+pegawai.$id);
        itemsRef.update({
          listjadwal: listjadwalasli
        });
      }

      this.tambahpegawai = function(user){
          var deferred = $q.defer();
           Auth.$createUser({
                email: user.email,
                password: user.pass
            }).then(function (userData) {
                var userRef = new Firebase('https://easyhealthy.firebaseio.com/pegawai');
                userRef.child(userData.uid).set({
                    'nama': user.nama || '',
                    'alamat': user.alamat || '',
                    'nomor_telp' : user.nomor_telp || '',
                    'email': user.email,
                    'photo' : '',
                    'kelamin': user.kelamin || '',
                    'status' : 'pegawai',
                    'pass' :user.pass
                });
                deferred.resolve(true);
                
            }).catch(function (error) {
                  if (error) {
                    deferred.reject(error);
                  }    
            });
            return deferred.promise;
     }

       this.ubahpassword = function(tmp,baru){
         var deferred = $q.defer();
        var ref = new Firebase("https://easyhealthy.firebaseio.com/pegawai/"+tmp.$id );
          ref.changePassword({
            email       : tmp.email,
            oldPassword : tmp.pass,
            newPassword : baru
          }, function(error) {
            if (error === null) {
              ref.update({
                pass:baru
              });
              deferred.resolve(true);
            } else {
              deferred.reject(error);
            }
          });
        return deferred.promise;
      }

        this.ubahemail=function(user,baru){
          var deferred = $q.defer();
          var ref = new Firebase("https://easyhealthy.firebaseio.com/pegawai/"+user.$id );
          ref.changeEmail({
              oldEmail : user.email,
              newEmail : baru.ulang,
              password : user.pass
            }, function(error) {
              if (error === null) {
                  ref.update({
                      email:baru.email
                   });
                  deferred.resolve(true);
              } else {
                deferred.reject(error);      
              }
            });
          return deferred.promise;
        }

        this.hapuspegawai=function(user){
          Pegawai.$remove(user);
        }

        this.editPegawai=function(pas){
          var ref = new Firebase("https://easyhealthy.firebaseio.com/pegawai/"+pas.$id );
          ref.update({
            alamat:pas.alamat || '',
            nama: pas.nama || '',
            nomor_telp: pas.nomor_telp || '',
            kelamin:pas.kelamin || ''
          });
        }
}])

.service('AsuransiSer',['Asuransi','$q',function(Asuransi,$q){
    this.hapussemuaasuransi = function(){
      for (var i = Asuransi.length - 1; i >= 0; i--) {
        Asuransi.$remove(Asuransi[i]);
      };
    }

    this.tambahasuransibaru = function(newitem){
       Asuransi.$add({
        'nama' : newitem.nama,
        'penyelenggara' : newitem.penyelenggara,
        'gambar': newitem.linkgambar || ''
      });
     }
    this.hapusasuransi=function(asuransi){
      Asuransi.$remove(asuransi);
    }
    this.editasuransi = function(baru){
      var ref = new Firebase('https://easyhealthy.firebaseio.com/asuransi/'+baru.$id);
      ref.update({
        nama : baru.nama,
        penyelenggara:baru.penyelenggara,
        gambar:baru.gambar || ''
      });
    }
}])


.service('PasienSer',['Auth','User','$q','Rekam','Global',function(Auth,User,$q,Rekam,Global){
    function hapussinglepasi(i){
        Global.deleteacount(User[i].profile.email,User[i].profile.pass).then(function(bisa){
            Rekam.$remove(Rekam.$getRecord(User[i].$id));
            User.$remove(User[i]);
        },function(error){
          
        });
    }

    this.hapussemuapasien=function(){
      for (var i = User.length - 1; i >= 0; i--) {
        hapussinglepasi(i);
      };
    }

    this.gethistory = function(uid){
      return Rekam.$getRecord(uid);
    }

   this.hapuspasien = function(user){
    Rekam.$remove(Rekam.$getRecord(user.$id));
    User.$remove(user);
   }  

  this.tambahpasienbaru = function(user){
    var deferred = $q.defer();
       Auth.$createUser({
                email: user.email,
                password: user.pass
       }).then(function (userData) {
                var userRef = new Firebase('https://easyhealthy.firebaseio.com/users');
                userRef.child(userData.uid).child('profile').set({
                    'nama': user.nama,
                    'ktp' : user.ktp,
                    'kelamin':  user.kelamin,
                    'umur' : ''+user.umur+'',
                    'alamat': user.alamat,
                    'nomor_telp' : user.nomor_telp,
                    'email': user.email,
                    'photo' : '',
                    'lengkap':true ,
                    'pass' :user.pass
                });
               deferred.resolve(true);
            }).catch(function (error) {
                  if (error) {
                    deferred.reject(error);
                  }
            });
         return deferred.promise;
  }



  this.editpasien=function(pas,tgl){
          var ref = new Firebase("https://easyhealthy.firebaseio.com/users/"+pas.$id +"/profile");
          ref.update({
            alamat:pas.profile.alamat,
            kelamin:pas.profile.kelamin,
            ktp : pas.profile.ktp,
            nama: pas.profile.nama,
            nomor_telp: pas.profile.nomor_telp,
            umur : tgl
          });
  }
  this.ubahemail = function(user,baru){
    var deferred = $q.defer();
    var ref = new Firebase("https://easyhealthy.firebaseio.com/users/"+user.$id +"/profile");
     ref.changeEmail({
        oldEmail : user.profile.email,
        newEmail : baru.ulang,
        password : user.profile.pass
      }, function(error) {
        if (error === null) {
            ref.update({
                email:baru.email
            });
            deferred.resolve(true);
               
        } else {
           deferred.reject(error);
        }
      });
     return deferred.promise;
  }

  this.ubahpassword=function(tampungpasien,baru){
    var deferred = $q.defer();
    var ref = new Firebase("https://easyhealthy.firebaseio.com/users/"+tampungpasien.$id +"/profile");
      ref.changePassword({
        email       : tampungpasien.profile.email,
        oldPassword : tampungpasien.profile.pass,
        newPassword : baru
      }, function(error) {
        if (error === null) {
          ref.update({
            pass:baru
          });
          deferred.resolve(true);
        } else {
          deferred.reject(error);
        }
      });
    return deferred.promise;
  }
}])

;
