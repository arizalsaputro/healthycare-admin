angular.module('healthy.controllers', [])

.controller("loginCtrl",["$scope","$state","$timeout","LoginSer","Global",function(a,e,n,s,i){function t(a){var e=document.querySelector("#demo-toast-example"),n={message:a};e.MaterialSnackbar.showSnackbar(n)}a.resetpasswd=function(e){if(e){a.showspin2=!0;var n=i.resetpass(e);n.then(function(n){a.showspin2=!1,t("Kata sandi berhasil dikirim ke alamat "+e)},function(e){a.showspin2=!1,t("Gagal mengatur ulang sandi")})}else t("Masukkan Email")},n(function(){var a=s.cekAuth();a.then(function(a){a&&e.go("dash.klinik")})},1e3),a.user={},a.doLogin=function(n){if(n.email&&n.pass){a.showspin=!0;var i=s.loginApp(n);i.then(function(n){a.showspin=!1,n?e.go("dash.klinik"):t("Anda bukan administrator")},function(e){if(a.showspin=!1,e)switch(e.code){case"INVALID_PASSWORD":t("Password salah,periksa kembali password anda");break;case"NETWORK_ERROR":t("Tidak terkoneksi dengan jaringan");break;case"INVALID_EMAIL":t("Email salah,periksa kembali email anda");break;case"INVALID_USER":t("User belum terdaftar");break;case"UNKNOWN_ERROR":t("Terjadi kesalahan yang tidak diketahui");break;default:t("Terjadi kesalahan yang tidak diketahui")}})}else n.email||t("Masukkan Email"),n.pass||t("Masukkan Password")}}])

.controller('AplCtrl',['$scope' ,'Auth' ,'$filter','$firebaseArray', '$state' ,'$location' ,'$timeout' , 'User' , 'Klinik' , 'Dokter','Laporan','LoginSer','Global','AdminSer','KlinikSer','DokterSer','PasienSer','AsuransiSer','Notify','PegawaiSer','Pegawai','Asuransi',function($scope ,Auth ,$filter,$firebaseArray, $state ,$location ,$timeout , User , Klinik , Dokter,Laporan,LoginSer,Global,AdminSer,KlinikSer,DokterSer,PasienSer,AsuransiSer,Notify,PegawaiSer,Pegawai,Asuransi) {
    
    $scope.listofKlinik = Klinik;
    $scope.listofDokter = Dokter;
    $scope.allUser = User;
    $scope.listLaporan = Laporan;
    $scope.listPegawai = Pegawai;
    $scope.listAsuransi = Asuransi;

    $scope.shownotifbox=false;


    $scope.openimageprofile=function(nama,source){
      $scope.tmpimg = {};
      $scope.tmpimg.nama = nama;
      $scope.tmpimg.img = source;
      $scope.showDialog('gambar');
    };

    $scope.makenotification=function(){
      $scope.shownotifbox=!$scope.shownotifbox;
    };

    $scope.tesnotify=function(){
      Notify.makenotify();
    };

    //check internet connection 
    var connectedRef = new Firebase("https://easyhealthy.firebaseio.com/.info/connected");
    
    $scope.preferences = [
    { name: "Laki-Laki" , id : 'L'},
    { name: "Perempuan" , id : 'P'}
  ];

    $timeout(function(){
       connectedRef.on("value", function(snap) {
        if (snap.val() === true) {
             $scope.showsnackbar = false;
        } else {
             $scope.showsnackbar = true;
        }
     });
    },1000);
     //klinikctrl
    $scope.getRandomNum=function(){
      return Global.getRandom();
    }

    $scope.tambahklinikbaru = function(itemdesc,gmbr){
       $scope.showspin = true;
       KlinikSer.tambahklinik(itemdesc);
       $scope.hideDialog('addnewklinik');
    };

    $scope.editDataKlinik =function(klinik){
      $scope.showspin = true;
      KlinikSer.editklinik(klinik);
       $scope.hideDialog('ubahklinik');
    };
     
     $scope.hapusklinik = function(klinik){
        $scope.showspin = true;
        KlinikSer.hapusklinik(klinik);
        $scope.hideDialog('hapusklinik');
        $state.go('dash.klinik');
     };

     $scope.clickdokterpilihan = function(id){
      if(KlinikSer.isanotavailable(id,listtambahdokterbaru)){
        listtambahdokterbaru.push(id);
      }
      else{
        listtambahdokterbaru=KlinikSer.removelistavailable(id,listtambahdokterbaru);
      }
    };

    $scope.tambahdokterkeklinik = function(klinik){
       KlinikSer.tambahkandokterbarudiklinik(klinik.$id,listtambahdokterbaru);
      $scope.hideDialog('kliniktambahdokter');
    };

    $scope.checkavailable =function(id){
      if(KlinikSer.isanotavailable(id,listtambahdokterbaru)){
        return false;
      }
      else
        return true
    };


    $scope.checkshowdokter = function(id,listdokter){
      if(!listdokter){
        return false;
      }
      else{
        if(KlinikSer.isanotavailable(id,listdokter)){
        return false;
        }
        else{
          return true;
        }
      }
    };

    //pasien
     $scope.editPasien = function(pas,tgl){
        $scope.showspin = true;
        PasienSer.editpasien(pas,tgl);
        $timeout(function(){
          $scope.hideDialog('ubahprofile');
        },2000);

    };
$scope.hapuspasien=function(user){
      $scope.showspin=true;
      var result = Global.deleteacount(user.profile.email,user.profile.pass);
      result.then(function(bisa){
        if(bisa){
          PasienSer.hapuspasien(user);
          $scope.hideDialog('hapuspasien');
          $state.go("dash.pasien");
        }
      },function(error){
        if(error){
          switch(error.code){
            case "NETWORK_ERROR" : makeToast("Gagal menghapus user,Periksa kembali jaringan anda.");break;
            case "UNKNOWN_ERROR" : makeToast("Gagal, terjadi kesalahan yang tidak diketahui.");break;
            default : makeToast("Gagal menghapus user,terjadi kesalahan yang tidak diketahui.");break;
          }
        }
      });
    };
$scope.ubahemailpasien = function(user,baru){
      $scope.showspin = true;
      var result = PasienSer.ubahemail(user,baru);
      result.then(function(bisa){
           $scope.showspin = false;
        if(bisa){
          $scope.hideDialog('ubahemailpasien');
        }
      },function(error){
       $scope.showspin = false;
        if(error){
          switch(error.code){
              case 'EMAIL_TAKEN' : makefailtoast("Email sudah digunakan orang lain");break;
              case 'NETWORK_ERROR':makefailtoast("Periksa kembali jaringan anda");break;
              default :makefailtoast("Terjadi kesalahan yang tidak diketahui");
          }
        }
      });
    };
 $scope.ubahpasswordpasien = function(tampungpasien,newItem){
       $scope.showspin = true;
       var result = PasienSer.ubahpassword(tampungpasien,newItem);
       result.then(function(bisa){
        $scope.showspin = false;
        if(bisa){$scope.hideDialog('ubahpassword')}
       },function(error){
         $scope.showspin = false;
         if(error){
            switch(error.code){
                case "NETWORK_ERROR" : makefailtoast("Jaringan bermasalah");break;
                case "INVALID_PASSWORD" :  makefailtoast("Password lama salah");break;
                case "INVALID_EMAIL" : makefailtoast("Email admin salah");break;
                default : makefailtoast("Terjadi kesalahan yang tidak diketahui");
              }
         }
       });
       
    };
 $scope.tambahpasienbaru = function(user){
        $scope.showspin = true;
        var result = PasienSer.tambahpasienbaru(user);
        result.then(function(bisa){
          if(bisa){
             $scope.hideDialog('tambahpasien'); 
          }
        },function(error){
          $scope.showspin = false;
          if(error){
                 switch (error.code) {
                      case "EMAIL_TAKEN": makefailtoast("Email sudah digunakan orang lain");break;
                      case "NETWORK_ERROR": makefailtoast("Tidak terkoneksi dengan jaringan.");break;
                      case "INVALID_EMAIL": makefailtoast("Email yang anda masukan tidak valid");break;
                      default:makefailtoast("Terjadi kesalahan yang tidak diketahui");
                    }
          }
        });
    };
    //dokter

    $scope.openresetanalitik=function(detail,pil){
      $scope.tmpresetanal = detail;
      $scope.pilhapus=pil;
      $scope.showDialog('hapusanal');
    }

    $scope.resetanalitik=function(uid){
      try{
        switch($scope.pilhapus){
          case 1 :    DokterSer.resetanalitikdokter(uid);break;
          case 2 : KlinikSer.resetanalitikklinik(uid);break;
        }
      }catch(error){

      }
      $scope.hideDialog('hapusanal');
      switch($scope.pilhapus){
        case 1 : $state.go('dash.dokter');break;
        case 2 : $state.go('dash.klinik');break;
      }
    }    
    $scope.editDokter = function(pas){
      $scope.showspin = true;
      DokterSer.editDokter(pas);
       $timeout(function(){
          $scope.hideDialog('ubahprofiledokter');
        },1000);
    };

    $scope.hapusdokter=function(user){
      $scope.showspin=true;
      var result = Global.deleteacount(user.email,user.pass);
      result.then(function(bisa){
        if(bisa){
          DokterSer.hapusdokter(user);
           $scope.hideDialog('hapusdokter');
           $state.go("dash.dokter");
        }
      },function(error){
          if(error){
            switch(error.code){
              case "NETWORK_ERROR" : makeToast("Gagal menghapus user,Periksa kembali jaringan anda.");break;
              case "UNKNOWN_ERROR" : makeToast("Gagal, terjadi kesalahan yang tidak diketahui.");break;
              default : makeToast("Gagal menghapus user,terjadi kesalahan yang tidak diketahui.");break;
            }
        }
      });
    };

   $scope.ubahemaildokter = function(user,baru){
    $scope.showspin=true;
    var result = DokterSer.ubahemail(user,baru);
    result.then(function(bisa){
      $scope.showspin = false;
      if(bisa){
        $scope.hideDialog('ubahemaildokter');
      }
    },function(error){
      $scope.showspin = false;
        if(error){
          switch(error.code){
              case 'EMAIL_TAKEN' : makefailtoast("Email sudah digunakan orang lain");break;
              case 'NETWORK_ERROR':makefailtoast("Periksa kembali jaringan anda");break;
              default :makefailtoast("Terjadi kesalahan yang tidak diketahui");
          }
        }
    });
   };

       $scope.showpassword = function(inuser){
           $scope.showspin = true;
           var result = Global.showpassword(inuser);
           result.then(function(bisa){
            if(bisa){
              $scope.showspin = false;
              $scope.showpasspasien1 = true;
            }
           },function(error){
             $scope.showspin = false;
             if(error){
              switch(error.code){
                case "NETWORK_ERROR" : makefailtoast("Jaringan bermasalah");break;
                case "INVALID_PASSWORD" :  makefailtoast("Password admin salah");break;
                case "INVALID_EMAIL" : makefailtoast("Email admin salah");break;
                default : makefailtoast("Terjadi kesalahan yang tidak diketahui");
              }
             }
           });
       };

        $scope.ubahpassworddokter = function(tampungdokter,newItem){
       $scope.showspin = true;
       var result = DokterSer.ubahpassword(tampungdokter,newItem);
       result.then(function(bisa){
        $scope.showspin = false;
        if(bisa){$scope.hideDialog('ubahpassworddokter')}
       },function(error){
         $scope.showspin = false;
         if(error){
            switch(error.code){
                case "NETWORK_ERROR" : makefailtoast("Jaringan bermasalah");break;
                case "INVALID_PASSWORD" :  makefailtoast("Password lama salah");break;
                case "INVALID_EMAIL" : makefailtoast("Email admin salah");break;
                default : makefailtoast("Terjadi kesalahan yang tidak diketahui");
              }
         }
       });
       
    };

    $scope.resetpass = function(user){
      var result=Global.resetpass(user);
      result.then(function(bisa){
        if(bisa){
          makeToast("Reset password berhasil dikirim ke email " + user);
        }
      },function(error){
        if(error){
          makeToast("Reset password gagal" );
        }
      });
    };
   

    $scope.tambahdokterbaru = function(user){
        $scope.showspin = true;
        var result = DokterSer.tambahdokter(user);
        result.then(function(bisa){
          if(bisa){
             $scope.hideDialog('tambahdokter');
          }
        },function(error){
          $scope.showspin = false;
          if(error){
                 switch (error.code) {
                      case "EMAIL_TAKEN": makefailtoast("Email sudah digunakan orang lain");break;
                      case "NETWORK_ERROR": makefailtoast("Tidak terkoneksi dengan jaringan.");break;
                      case "INVALID_EMAIL": makefailtoast("Email yang anda masukan tidak valid");break;
                      default:makefailtoast("Terjadi kesalahan yang tidak diketahui");
                    }
          }
        });
 
    };



    $scope.setTimelistday = function(mulai,akhir,indek){
      var tgl = DokterSer.getTgl(indek);
      $scope.listofday[indek].hari = tgl;
      $scope.listofday[indek].start = mulai;
      $scope.listofday[indek].end = akhir;
      listjadwalasli[indek].hari = tgl;
      listjadwalasli[indek].start = mulai;
      listjadwalasli[indek].end = akhir;
      $scope.hideDialog('settime');
    };

    $scope.clickaturjamprak = function(indk){
        if($scope.listofday[indk].end == ''){
          $scope.showsettimejadwal(indk);
        }else{
          $scope.listofday[indk].start='';
          $scope.listofday[indk].end='';
          listjadwalasli[indk].start = '';
          listjadwalasli[indk].end = '';
        }
    };

    
    $scope.savejadwalpratekdokter = function(dokter){
        DokterSer.savejadwalpratekdokter(dokter,listjadwalasli);
        $scope.hideDialog('aturjadwal');
    };


    //tampunf detail for while
    $scope.tampungdetail = function(det,pil){
      if(pil == 1){
        $scope.tampungpasien = det;
        $scope.realdate = new Date(det.profile.umur); 
        $scope.historyperiksa = PasienSer.gethistory(det.$id);
      
      }
      if(pil == 2){
        $scope.tampungdokter = det;
        DokterSer.getgrafikpasien($scope.tampungdokter.$id).then(function(data2){
           $scope.listpasienperbulan=data2;
        });
      }
      if(pil == 3){
        $scope.tampungklinik = det;
        KlinikSer.getgrafikklinik($scope.tampungklinik.$id).then(function(data2){
          $scope.listpasienperbulan=data2;
        })
      }
      if(pil == 4){
        $scope.tampungpegawai = det;
      }
      
    };

    function makefailtoast(txt){
      $scope.pesangagal = txt;
      $scope.gagallagi = true;
      $timeout(function(){
        $scope.gagallagi = false;
      },3000);
    };

     $scope.setCari = function(cari){
      $scope.search = cari;
      $scope.currentPage=0;
     }

      $scope.judul = "Pasien";

    $scope.changejud = function(judul){
      $scope.currentPage=0;
      $scope.judul = judul;
    };

    function makeToast(text){
     var snackbarContainer = document.querySelector('#demo-toast-example');
      var data = {
        message: text 
      };
       snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

     $timeout(function(){
        var result = LoginSer.cekAuth();
        result.then(function(bisa){
          if(!bisa){
            $state.go('login');
          }
        });
     
     },1000);

    function showAlert(){
        var dialog = document.querySelector('#dialog3');
        try{
        dialog.showModal();
       }catch(error){
        dialogPolyfill.registerDialog(dialog);
        dialog.showModal();
       }
        $timeout(function(){
          dialog.close();
       },3000);
     };
    
    $scope.emailAmin =window.localStorage.getItem("adminemail");
    $scope.ubahemailadmin = function(baru,pass){
      if(!baru || !pass){
        if(!baru){
          makeToast("Masukkan email baru admin");
        }
        if(!pass){
           makeToast("Masukkan password saat ini");
        }
      }
      else{
        $scope.showspin = true;
        var result = AdminSer.ubahemail(baru,pass);
        result.then(function(bisa){
          if(bisa){
             $scope.showspin = false;
             $scope.textberhasil = "Email administrator berhasil diperbarui.";
             $scope.emailAmin=baru;
             $scope.hideDialog('dialog2');
             showAlert();
          }
        },function(error){
          if(error){
             $scope.showspin = false;
            switch(error.code){
              case 'INVALID_PASSWORD' : makefailtoast("Kata sandi anda salah"); break;
              case 'EMAIL_TAKEN' : makefailtoast("Email sudah digunakan orang lain");break;
              default : makefailtoast("Terjadi kesalahan yang tidak diketahui");
            }
          }
        });
      }
    };

 

    $scope.ubahpasswordadmin = function(item){
      if(!item.lama || !item.baru || !item.lagi){
        if(!item.lama){
           makefailtoast("Masukkan kata sandi lama");
        }
        if(!item.baru){
           makefailtoast("Masukkan kata sandi baru");
        }
        if(!item.lagi){
           makefailtoast("Ulangi kata sandi baru lagi");
        }
      }
      else{
        if(item.baru != item.lagi){
           makefailtoast("kata sandi baru tidak cocok");
        }
        else{
           $scope.showspin = true;
           var result = AdminSer.ubahpassword(item);
            result.then(function(bisa){
              if(bisa){
                 $scope.showspin = false;
                 $scope.textberhasil = "Password administrator berhasil diperbarui.";
                 $scope.hideDialog('dialog4');
                 showAlert();
              }
            },function(error){
              if(error){
                 $scope.showspin = false;
                switch(error.code){
                  case 'INVALID_PASSWORD' : makefailtoast("Kata sandi lama anda salah"); break;
                  case 'NETWORK_ERROR' : makefailtoast("Periksa kembali jaringan anda.");break;
                  default : makefailtoast("Terjadi kesalahan yang tidak diketahui");
                }
              }
            });
        }
      }

    };

    $scope.tambahasuransibaru = function(newitem){
      $scope.showspin = true;
      AsuransiSer.tambahasuransibaru(newitem);
      $scope.hideDialog('addnewasuransi');
    };

   $scope.hapusasuransi = function(asuransi){
    $scope.showspin = true;
    AsuransiSer.hapusasuransi(asuransi);
    $scope.hideDialog('hapusasuransi');
   };

   $scope.editasuransi = function(newitem){
      AsuransiSer.editasuransi(newitem);
      $scope.hideDialog('editasuransi');
   };

  

     $scope.tambahpegawaibaru = function(user){
        $scope.showspin = true;
        var result = PegawaiSer.tambahpegawai(user);
        result.then(function(bisa){
          if(bisa){
             $scope.hideDialog('tambahpegawai');
          }
        },function(error){
          $scope.showspin = false;
          if(error){
                 switch (error.code) {
                      case "EMAIL_TAKEN": makefailtoast("Email sudah digunakan orang lain");break;
                      case "NETWORK_ERROR": makefailtoast("Tidak terkoneksi dengan jaringan.");break;
                      case "INVALID_EMAIL": makefailtoast("Email yang anda masukan tidak valid");break;
                      default:makefailtoast("Terjadi kesalahan yang tidak diketahui");
                    }
          }
        });
 
    };

       $scope.editPegawai = function(pas){
      $scope.showspin = true;
      PegawaiSer.editPegawai(pas);
       $timeout(function(){
          $scope.hideDialog('ubahprofilepegawai');
        },2000);
    };


        $scope.hapuspegawai=function(user){
          $scope.showspin=true;
        var result = Global.deleteacount(user.email,user.pass);
        result.then(function(bisa){
          if(bisa){
            PegawaiSer.hapuspegawai(user);
             $scope.hideDialog('hapuspegawai');
             $state.go("dash.pegawai");
          }
        },function(error){
            if(error){
              switch(error.code){
                case "NETWORK_ERROR" : makeToast("Gagal menghapus user,Periksa kembali jaringan anda.");break;
                case "UNKNOWN_ERROR" : makeToast("Gagal, terjadi kesalahan yang tidak diketahui.");break;
                default : makeToast("Gagal menghapus user,terjadi kesalahan yang tidak diketahui.");break;
              }
          }
        });
      };

    $scope.ubahpasswordpegawai = function(tampungpegawai,newItem){
       $scope.showspin = true;
       var result = PegawaiSer.ubahpassword(tampungpegawai,newItem);
       result.then(function(bisa){
        $scope.showspin = false;
        if(bisa){$scope.hideDialog('ubahpasswordpegawai')}
       },function(error){
         $scope.showspin = false;
         if(error){
            switch(error.code){
                case "NETWORK_ERROR" : makefailtoast("Jaringan bermasalah");break;
                case "INVALID_PASSWORD" :  makefailtoast("Password lama salah");break;
                case "INVALID_EMAIL" : makefailtoast("Email admin salah");break;
                default : makefailtoast("Terjadi kesalahan yang tidak diketahui");
              }
         }
       });
       
    };

       $scope.ubahemailpegawai = function(user,baru){
    $scope.showspin=true;
    var result = PegawaiSer.ubahemail(user,baru);
    result.then(function(bisa){
      $scope.showspin = false;
      if(bisa){
        $scope.hideDialog('ubahemailpegawai');
      }
    },function(error){
      $scope.showspin = false;
        if(error){
          switch(error.code){
              case 'EMAIL_TAKEN' : makefailtoast("Email sudah digunakan orang lain");break;
              case 'NETWORK_ERROR':makefailtoast("Periksa kembali jaringan anda");break;
              default :makefailtoast("Terjadi kesalahan yang tidak diketahui");
          }
        }
    });
   };

   //pengaturan
   $scope.hapuspengaturan = function(pilihan){
    if(pilihan){
      switch(pilihan){
      case 9 : $scope.textpengaturan = "Data semua klinik akan akan dihapus secara permanen dan data tidak bisa dikembalikan lagi.";break;
      case 1 : $scope.textpengaturan = "Data semua pasien akan akan dihapus secara permanen dan data tidak bisa dikembalikan lagi.";break;
      case 2 : $scope.textpengaturan = "Data semua dokter akan akan dihapus secara permanen dan data tidak bisa dikembalikan lagi.";break;
      case 3 : $scope.textpengaturan = "Data semua pegawai akan akan dihapus secara permanen dan data tidak bisa dikembalikan lagi.";break;
      case 4 : $scope.textpengaturan = "Semua data analitik di setiap klinik akan dihapus secara permanen dan tidak bisa dikembali lagi.";break;
      case 5 : $scope.textpengaturan = "Semua data analitik di setiap dokter akan dihapus secara permanen dan tidak bisa dikembali lagi.";break;
      case 6 : $scope.textpengaturan = "Semua data akan dikembalikan seperti semua, artinya semua data di database akan dihapus dan tidak bisa dikembalikan lagi, apa anda benar-benar yakin ?.";break;
      case 7 : $scope.textpengaturan = "Semua data asuransi akan dihapus secara permanen dan tidak bisa dikembali lagi.";break;
      case 8 : $scope.textpengaturan = "Semua data laporan masalah akan dihapus secara permanen dan tidak bisa dikembali lagi.";break;
      case 10 : $scope.textpengaturan = "Semua data pendapatan dihapus secara permanen dan tidak bisa dikembali lagi.";break;

     }
     $scope.pilatur = pilihan;
     $scope.hideDialog('pengaturan');
     $scope.showDialog('anakdialogreset');
    }
   }



   $scope.lakukanpengaturan = function(pilihan,pass){
      if(pass){
            var item = {};
            item.lama = pass;
            item.baru = pass;
            $scope.showspin=true;
            AdminSer.ubahpassword(item).then(function(bisa){
              if(bisa){
                  switch(pilihan){
                  case 9 :KlinikSer.hapussemuaklinik();break;
                  case 1 : PasienSer.hapussemuapasien();break;
                  case 2 : DokterSer.hapusSemuadokter();break;
                  case 3 : PegawaiSer.hapussemuapegawai();break;
                  case 4 : KlinikSer.resetsemuaanalitiklinik();break;
                  case 5 : DokterSer.resetsemuaanalitikdokter();break;
                  case 6 : KlinikSer.hapussemuaklinik();PasienSer.hapussemuapasien();DokterSer.hapusSemuadokter();PegawaiSer.hapussemuapegawai();KlinikSer.resetsemuaanalitiklinik();DokterSer.resetsemuaanalitikdokter();AsuransiSer.hapussemuaasuransi();Global.hapussemualaporan(); break;
                  case 7 : AsuransiSer.hapussemuaasuransi(); break;
                  case 8 : Global.hapussemualaporan(); break;
                   case 10 : Global.hapussemuapendapatan();break;
                 }
                 $state.go('dash.home');
                 $scope.hideDialog('anakdialogreset');
                 $scope.showspin=false;
              }
            },function(error){
              if(error){
                 $scope.showspin = false;
                switch(error.code){
                  case 'INVALID_EMAIL' : makefailtoast("Email Salah");break;
                  case 'INVALID_PASSWORD' : makefailtoast("Kata sandi anda salah"); break;
                  case 'NETWORK_ERROR' : makefailtoast("Periksa kembali jaringan anda.");break;
                  default : makefailtoast("Terjadi kesalahan yang tidak diketahui");
                }
              }
            });
      }

   }; 


    $scope.showDialog=function(tag){
      $scope.newItem = {};
      $scope.newItem.linkgambar = '';
      Global.showDialog(tag);
    }
    $scope.hideDialog=function(tag){
      $scope.showpasspasien1 = false;
      $scope.showspin = false;
      Global.hideDialog(tag);
    }

 
    $scope.showEditKlinik = function(klinik){
      window.localStorage.setItem("tampungsempas", JSON.stringify(klinik)); 
     $scope.tempklinik = JSON.parse(window.localStorage.getItem("tampungsempas"));
      window.localStorage.removeItem("tampungsempas");
       Global.showDialog('ubahklinik');
   };

   
   $scope.clickOutapp = function(){
     Global.showDialog('dialog');
   };

 
   $scope.showhapusklinik = function(klinik){
    $scope.tmpclinik = klinik;
     Global.showDialog('hapusklinik');
   };


    $scope.showeditAsuransi = function(asuransi){
       window.localStorage.setItem("tampungsempas", JSON.stringify(asuransi)); 
      $scope.newItem = JSON.parse(window.localStorage.getItem("tampungsempas"));
      window.localStorage.removeItem("tampungsempas");
         Global.showDialog('editasuransi');
   };

     $scope.showpaspasien = function(a){
     $scope.newItem = {};
       switch(a){
        case 1 : Global.showDialog('lihatpaspasien');break;
        case 2 :  Global.showDialog('lihatpasdokter');break;
        case 3 :  Global.showDialog('lihatpaspegwai');break;
       }
   };

     $scope.showeditrekammedik = function(){
       $scope.newItem = {};
       Global.showDialog('editrekammedik');
     };
  

       $scope.showhapusasuransi = function(asuransi){
        $scope.tampunghapus = asuransi;
        Global.showDialog('hapusasuransi');
   };


     $scope.showdetailasuransi = function(asuransi){
        $scope.tampungasur = asuransi;
         Global.showDialog('detailasuransi');
   };


   $scope.showUbahprofile = function(pasien,pil){
   
     window.localStorage.setItem("tampungsempas", JSON.stringify(pasien)); 
     $scope.pasienedit = JSON.parse(window.localStorage.getItem("tampungsempas"));
      window.localStorage.removeItem("tampungsempas");
      switch(pil){
        case 1 :  $scope.editTanggal = new Date($scope.pasienedit.profile.umur);Global.showDialog('ubahprofile');break;
        case 2 : Global.showDialog('ubahprofiledokter'); break;
        case 3 :  Global.showDialog('ubahprofilepegawai');break;
      }

   };

      $scope.showloading = function(){
        $scope.showTbl = true;
         Global.showDialog('loading');
      };

      $scope.hideloading = function(){
        $scope.showTbl = false;
        Global.hideDialog('loading');
      }


  $scope.keluarApp = function(){
    Global.keluarapp();
  
  };

  var listtambahdokterbaru = [];

     $scope.showkliniktambahdokter = function(listdokter,nama,klinik){
     
      if(!listdokter){
        listtambahdokterbaru = [];
      }else{
           window.localStorage.setItem("tampungsempas", JSON.stringify(listdokter)); 
    listtambahdokterbaru = JSON.parse(window.localStorage.getItem("tampungsempas"));
         window.localStorage.removeItem("tampungsempas");
          
      }
      $scope.cari = nama;
      $scope.tampungklinik = klinik;
      Global.showDialog('kliniktambahdokter');
   };
     

    $scope.getindoday = function(day){
      return Global.getIndoname(day);   
    };


    var listjadwalasli = DokterSer.getlistday();
    $scope.listofday = DokterSer.getlistday();

   $scope.showsettimejadwal = function(inp){

     $scope.startAt = new Date(2016,1,(inp+1),0,0);
     $scope.endAt = new Date(2016,1,(inp+1),0,0);
     $scope.tmpindex = inp;
      Global.showDialog('settime');
   };

      $scope.showAturjadwalpraktek = function(listjadwal){
        if(!listjadwal){
            listjadwalasli = DokterSer.getlistday();
            $scope.listofday = DokterSer.getlistday();

          }else{
               window.localStorage.setItem("tampungsempas", JSON.stringify(listjadwal)); 
              $scope.listofday = JSON.parse(window.localStorage.getItem("tampungsempas")); 
              listjadwalasli = DokterSer.getRecord(listjadwalasli,$scope.listofday);      
             window.localStorage.removeItem("tampungsempas"); 
          }
           Global.showDialog('aturjadwal');
   };

   $scope.savejadwalpegawai = function(pegawai){
      PegawaiSer.savejadwalkerja(pegawai,listjadwalasli);
      $scope.hideDialog('aturjadwalpegawai');
  };

   $scope.showAturjadwaljaga = function(listjadwal){
        if(!listjadwal){
            listjadwalasli = DokterSer.getlistday();
            $scope.listofday = DokterSer.getlistday();

          }else{
               window.localStorage.setItem("tampungsempas", JSON.stringify(listjadwal)); 
              $scope.listofday = JSON.parse(window.localStorage.getItem("tampungsempas")); 
              listjadwalasli = DokterSer.getRecord(listjadwalasli,$scope.listofday);      
             window.localStorage.removeItem("tampungsempas"); 
          }
           Global.showDialog('aturjadwalpegawai');
   };


    $scope.setsearchnull = function(){
      $scope.search = '';
    };

    $scope.getTangal = function(tgl){
      var t = new Date(tgl);
      return t;
    };
    $scope.getSender = function(key){
      var a = User.$getRecord(key);
      return a;
    };
    $scope.hapuslaporan = function(laporan){
      Laporan.$remove(laporan);
    };


    $scope.exporttocsv = function(ind){
      try{
            $scope.showloading();
          $timeout(function(){
            switch(ind){
              case 1 : 
                         alasql('SELECT * INTO XLSX("data_laporan_masalah.xlsx",{headers:true}) \
                        FROM HTML("#tablelaporan",{headers:true})');
                      break;
              case 2 : 
                      alasql('SELECT * INTO XLSX("data_pasien.xlsx",{headers:true}) \
                        FROM HTML("#tablepasien",{headers:true})');
                    break;

              case 3 :
                    
                     alasql('SELECT * INTO XLSX("data_dokter.xlsx",{headers:true}) \
                        FROM HTML("#tabledokter",{headers:true})');
                    break;
             case 4 :
              
               alasql('SELECT * INTO XLSX("data_klinik.xlsx",{headers:true}) \
                  FROM HTML("#tableklinik",{headers:true})');
              break;

               case 5 :
              
               alasql('SELECT * INTO XLSX("data_asuransi.xlsx",{headers:true}) \
                  FROM HTML("#tableasuransi",{headers:true})');
              break;
              case 6 : alasql('SELECT * INTO XLSX("data_pegawai.xlsx",{headers:true}) \
                  FROM HTML("#tablepegawai",{headers:true})');break;

            }
             
          },500);
      
          $timeout(function(){
            $scope.hideloading();
          },1000);
      }catch(error){
        $scope.hideloading();
      }
      
    };

    //pagging
     $scope.currentPage = 0;
    $scope.pageSize = 15;
    $scope.getData = function () {

      return $filter('filter')($scope.listofDokter,$scope.search);
    }
    $scope.numberOfPages=function(){
        return Math.ceil($scope.getData().length/$scope.pageSize);
    }
     $scope.getData2 = function () {

      return $filter('filter')($scope.allUser,$scope.search);
    }
    $scope.numberOfPages2=function(){
        return Math.ceil($scope.getData2().length/$scope.pageSize);
    }
     $scope.getData3 = function () {

      return $filter('filter')($scope.listPegawai,$scope.search);
    }
    $scope.numberOfPages3=function(){
        return Math.ceil($scope.getData3().length/$scope.pageSize);
    }

    $scope.prev=function(){
      $scope.currentPage=$scope.currentPage-1;
    }
    $scope.nexti=function(){
      $scope.currentPage=$scope.currentPage+1;
    }
    $scope.forgrafikklinik = KlinikSer.getlineKlinik();
    $scope.forgrafikfokter = DokterSer.getlineDokter();
}])
.controller("HomeCtrl",["$scope","Klinik","$timeout","Pegawai","User","Dokter","Pendapatan",function(a,e,t,n,i,l,r){function o(e){for(var t=[0,0,0,0,0,0,0,0,0,0,0,0],n=0;12>n;n++)for(var i=0;i<a.forgrafikklinik.length;i++)try{switch(e){case 1:t[n]=t[n]+a.forgrafikklinik[i][n].jum;break;case 2:t[n]=t[n]+a.forgrafikklinik[i][n].a;break;case 3:t[n]=t[n]+a.forgrafikklinik[i][n].t}}catch(l){t[n]=t[n]+0}for(var n=0;12>n;n++)switch(e){case 1:a.lineregis[0][n]=t[n];break;case 2:a.linehadir[0][n]=t[n];break;case 3:a.tidakhadir[0][n]=t[n]}}function s(){if(0!=e.length)for(var n=0;n<e.length;n++){a.labels.push(e[n].nama);try{a.data2[0].push(e[n].listdokter.length),a.data4[0].push(0)}catch(i){a.data2[0].push(0),a.data4[0].push(0)}}else t(function(){s()},1e3)}function f(){if(0!=n.length){for(var e=0,i=0,l=0;l<n.length;l++)try{"L"==n[l].kelamin&&(e+=1),"P"==n[l].kelamin&&(i+=1)}catch(r){}a.datapeg[0].push(e),a.datapeg[0].push(i)}else t(function(){f()},2e3)}function u(){if(0!=i.length){for(var e=0,n=0,l=0;l<i.length;l++)try{"L"==i[l].profile.kelamin&&(e+=1),"P"==i[l].profile.kelamin&&(n+=1)}catch(r){}a.datapas[0].push(e),a.datapas[0].push(n)}else t(function(){u()},2500)}function h(){if(0!=l.length){for(var e=0,n=0,i=0;i<l.length;i++)try{"L"==l[i].kelamin&&(e+=1),"P"==l[i].kelamin&&(n+=1)}catch(r){}a.datadok[0].push(e),a.datadok[0].push(n)}else t(function(){h()},3e3)}function c(){if(0!=a.labels.length&&0!=r.length)for(var n=0;n<a.listPendapatan.length;n++)for(var i=0;i<a.labels.length;n++)try{if(a.labels[i]==e.$getRecord(a.listPendapatan[n].klinik).nama){a.data4[0][i]=a.data4[0][i]+a.listPendapatan[n].total;break}}catch(l){}else t(function(){c()},2e3)}function g(){if(0!=r.length)for(var e=r.length-1;e>=0;e--){var n=new Date(r[e].tgl);a.uangbulan[0][n.getMonth()]=a.uangbulan[0][n.getMonth()]+r[e].total}else t(function(){g()},2e3)}function k(){s(),u(),f(),h(),o(1),o(2),o(3),c(),g()}a.labels=[],a.labels3=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],a.data2=[[]],a.labels2=["Laki-laki","Perempuan"],a.datapas=[[]],a.datapeg=[[]],a.datadok=[[]],a.listPendapatan=r,a.data4=[[]],a.lineregis=[[0,0,0,0,0,0,0,0,0,0,0]],a.linehadir=[[0,0,0,0,0,0,0,0,0,0,0]],a.tidakhadir=[[0,0,0,0,0,0,0,0,0,0,0]],a.uangbulan=[[0,0,0,0,0,0,0,0,0,0,0]],a.gettotalpendapatan=function(){for(var a=0,e=r.length-1;e>=0;e--)a+=r[e].total;return a},k()}])
.controller("KlinikCtrl",["$scope",function(a){function e(){try{for(var e=0;e<a.listpasienperbulan.length;e++)a.data1[0][a.listpasienperbulan[e].$id]=a.listpasienperbulan[e].jum||0}catch(t){}}function t(){try{for(var e=0;e<a.listpasienperbulan.length;e++)a.data2[0][a.listpasienperbulan[e].$id]=a.listpasienperbulan[e].a||0}catch(t){}}function i(){try{for(var e=0;e<a.listpasienperbulan.length;e++)a.data3[0][a.listpasienperbulan[e].$id]=a.listpasienperbulan[e].t||0}catch(t){}}a.labels=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],a.data1=[[0,0,0,0,0,0,0,0,0,0,0]],a.data2=[[0,0,0,0,0,0,0,0,0,0,0]],a.data3=[[0,0,0,0,0,0,0,0,0,0,0]],a.getGrapickli=function(){e(),t(),i()}}])
.controller("DokterCtrl",["$scope","$filter","Dokter",function(e,r,t){e.labels=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],e.data1=[[0,0,0,0,0,0,0,0,0,0,0]],e.getGrapic=function(){try{for(var r=0;r<e.listpasienperbulan.length;r++)e.data1[0][e.listpasienperbulan[r].$id]=e.listpasienperbulan[r].jum||0}catch(t){}}}])

.controller('AsuransiCtrl',['$scope',function($scope) {
 
}])

.controller('PasienCtrl',['$scope','PasienSer',function($scope,PasienSer) {

}])


.controller('Regis',['$scope','User',function($scope,User) {
  
}])


.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
})


.directive('clickAnywhereButHere', function($document){
  return {
    restrict: 'A',
    link: function(scope, elem, attr, ctrl) {
      elem.bind('click', function(e) {
        // this part keeps it from firing the click on the document.
        e.stopPropagation();
      });
      $document.bind('click', function() {
        // magic here.
        scope.$apply(attr.clickAnywhereButHere);
      })
    }
  }
})


;
