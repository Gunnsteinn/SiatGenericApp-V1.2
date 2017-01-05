angular.module('app.controllers', [])
  
.controller('inicioCtrl', ['$scope','localstorageFactory','$state', function ($scope,localstorageFactory,$state) {

}])
   
.controller('seleccioneUsuarioCtrl', ['$scope', 'localstorageFactory', '$state', function ($scope, localstorageFactory, $state) {
    if (localstorageFactory.getlogUser() !== 'undefined') {
        console.log("$state: " + localstorageFactory.getlogUser().type);
        if (localstorageFactory.getlogUser().type === 'medic') {
            $state.go('pacientes');
        } else {
            $state.go('pacienteMenu'); 
        } 
    }
}])
   
.controller('loginPacienteCtrl', ['$scope', '$http', '$state', 'localstorageFactory', 'LoginPatientService', '$ionicPopup', function ($scope, $http, $state, localstorageFactory, LoginPatientService, $ionicPopup) {
    //----------------------------------- Variables ------------------------------------------
    $scope.data = {};
    $scope.errorLoginPatient = false;

    //----------------------------------- Functions ------------------------------------------
    $scope.loginPatient = function () {
        console.log('pass ' + $scope.data.usernamePatient + $scope.data.passwordPatient);
        LoginPatientService.loginUser($scope.data.usernamePatient, $scope.data.passwordPatient)
            .success(function (data) {
                if (typeof data !== 'string' && data[0] !== null && data[0] !== "") {
                    $state.go('pacienteMenu');
                    $scope.data.type = "patient";
                    localstorageFactory.setlogUser($scope.data);
                    localstorageFactory.setPatientData(data);
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login Error!',
                        template: 'Usuario o Contraseña Incorrectos!'
                    });
                }
            })
            .error(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login Error!',
                    template: 'Usuario o Contraseña Incorrectos!'
                });
            });
    }
}])
   
.controller('loginEspecialistaCtrl', ['$scope', '$http', '$state', 'localstorageFactory', 'LoginMedicService', '$ionicPopup', function ($scope, $http, $state, localstorageFactory, LoginMedicService, $ionicPopup) {
    //----------------------------------- Variables ------------------------------------------
    $scope.data = {};
    $scope.errorLoginMedic = false;

    //----------------------------------- Functions ------------------------------------------
    $scope.loginMedic = function () {
        console.log('pass ' + $scope.data.usernameMedic + $scope.data.passwordMedic);
        LoginMedicService.loginUser($scope.data.usernameMedic, $scope.data.passwordMedic)
            .success(function (data) {
                if (typeof (data[0]) !== 'undefined' && data[0] !== null) {
                    $state.go('pacientes');
                    $scope.data.type = "medic";
                    localstorageFactory.setlogUser($scope.data);
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login Error!',
                        template: 'Usuario o Contraseña Incorrectos!'
                    });
                }     
            })
            .error(function (data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login Error!',
                    template: 'Usuario o Contraseña Incorrectos!'
                });
            });
    }
}])
   
.controller('mensajes', ['$scope', 'msjService', 'localstorageFactory', '$http', '$window', '$ionicScrollDelegate', function ($scope, msjService, localstorageFactory, $http, $window, $ionicScrollDelegate) {
    //----------------------------------- Variables ------------------------------------------
    var usersId = localstorageFactory.getIdUser();
    $scope.chatResult = [];
    $scope.sendMessage = "";

    //----------------------------------- Functions ------------------------------------------
    msjService.msjUser(usersId.medico)
        .success(function (data) {
            $scope.dataChat = data[0].MESSAGES_object;
            var isMedico, userFoto;
            for (var i = 0; i < $scope.dataChat.length; i++) {
                if($scope.dataChat[i].from === usersId.medico){
                    esMedico = true;
                    userFoto = usersId.medicoFoto;
                }else {
                    esMedico = false;
                    userFoto = usersId.pacienteFoto;
                }
                if (usersId.paciente === $scope.dataChat[i].to || usersId.paciente === $scope.dataChat[i].from) {
                    $scope.chatResult.push({
                        msj: $scope.dataChat[i].mensaje,
                        userFoto: userFoto,
                        esMedico: esMedico
                    });
                }
            }
            $ionicScrollDelegate.scrollBottom();
        })
        .error(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login Error!',
                template: 'Usuario o Contraseña Incorrectos!'
            });
        });

    $scope.isMedicClass = function (esMedico) {
        return esMedico ? 'leftSide.html' : 'rightSide.html';
    };

    $scope.sendMsj = function (sendMessage) {
        var info = "id_from=" + usersId.medico + "&id_to=" + usersId.paciente + "&mensaje=" + sendMessage;

        $http({
            url: "http://www.e-siat.net/siat_webservice_test/index.php/mensajes/setMessage",
            method: "POST",
            data: info,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function (data, status, headers, config) {
            $scope.chatResult.push({
                msj     : sendMessage,
                userFoto: usersId.medicoFoto,
                esMedico: true
            });
            $ionicScrollDelegate.scrollBottom();
        });
        $scope.sendMessage = "";
        $scope.$apply;
    }
}])
   
.controller('pacientesCtrl', ['$scope', '$http', 'localstorageFactory', function ($scope, $http, localstorageFactory) {
    //----------------------------------- Variables ------------------------------------------
    $scope.loading = true;
    $scope.usersRef = [];
    $scope.activeUser = localstorageFactory.getlogUser();
    var info = "usuario=" + $scope.activeUser.usernameMedic + "&contrasenia=" + $scope.activeUser.passwordMedic;

    //--------------------------------- XMLHttpRequest ---------------------------------------
    $http({
        url: "http://www.e-siat.net/siat_webservice_test/index.php/logIn/inicioEspecialista",
        method: "POST",
        data: info,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function (data, status, headers, config) {
        $scope.idUsuario = data[0].idUsuario;
        var info = "idEspecialista=" + data[0].idEspecialista;
        $http({
            url: "http://www.e-siat.net/siat_webservice_test/index.php/logIn/getPacientes",
            method: "POST",
            data: info,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function (data, status, headers, config) {
            console.log("hola" + data[0].pacientes);
            $scope.loading = false;
            $scope.result = data[0].pacientes;
            var j = 0, x = 0;
            for (var i = 0; i < $scope.result.length; i++) {
                console.log($scope.result[i].idUsuario);
                var info = "idPaciente=" + $scope.result[i].idPaciente;
                $http({
                    url: "http://www.e-siat.net/siat_webservice_test/index.php/logIn/getTratamiento",
                    method: "POST",
                    data: info,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    $scope.result[j].comercial = data[0].comercial;
                    console.log("result: " + j + $scope.result[j].comercial);
                    var info = "idUsuario=" + $scope.result[j].idPaciente;
                    $http({
                        url: "http://www.e-siat.net/siat_webservice_test/index.php/logIn/getPacienteInfo",
                        method: "POST",
                        data: info,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .success(function (data, status, headers, config) {
                        $scope.result[x].imagen_perfil = "http://e-siat.net/siat/profilepicture/" + data[0].imagen_perfil;
                        console.log("imagen_perfil: " + $scope.result[x].imagen_perfil);
                                        
                        $scope.usersRef.push({
                            name        : $scope.result[x].nombre,
                            lastName    : $scope.result[x].apellido,
                            userFoto    : $scope.result[x].imagen_perfil,
                            idUsuario   : $scope.result[x].idUsuario,
                            idPaciente  : $scope.result[x].idPaciente
                            });
                        x++;
                    });
                    j++;
                });
            }
        });
    });

    //----------------------------------- Functions ------------------------------------------
    $scope.itemClick = function (index , idUsuarioPaciente) {
        var pacienteFoto = $scope.result[index].imagen_perfil;
        var idUsuario = {
                            paciente    : idUsuarioPaciente,
                            pacienteFoto: pacienteFoto,
                            medico      : $scope.idUsuario,
                            medicoFoto  : "http://image.flaticon.com/icons/svg/204/204225.svg"
                        };
        localstorageFactory.setIdUser(idUsuario);
    }

    $scope.turnos = function () {
        localstorageFactory.setUsersRef($scope.usersRef);
    }

    $scope.logOut = function () {
        localstorageFactory.remove();
    }

}])
   
.controller('turnosCtrl', ['$scope', '$http', 'localstorageFactory','$filter', function ($scope, $http, localstorageFactory, $filter) {
    //----------------------------------- Variables ------------------------------------------
    $scope.turnosInfo = localstorageFactory.getUsersRef();
    $scope.turnosInfoSem = [];
    $scope.turnosInfoProx = [];
    var j = 0, p = 0, x = 0;

    //--------------------------------- XMLHttpRequest ---------------------------------------
    for (var i = 0; i < $scope.turnosInfo.length; i++) {
        var info = "idUsuario=" + $scope.turnosInfo[i].idUsuario;
        $http({
            url: "http://www.e-siat.net/siat_webservice_test/index.php/logIn/update",
            method: "POST",
            data: info,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function (data, status, headers, config) {
            d = new Date(data[8].hora);
            var day = d.getDay();
            if (diff = d.getDate() - day + (day == 0 ? -6 : 1) <= 6) {
                $scope.turnosInfoSem.push($scope.turnosInfo[x]);
                $scope.turnosInfoSem[j].turno = data[8].hora;
                j++;
            } else {
                $scope.turnosInfoProx.push($scope.turnosInfo[x]);
                $scope.turnosInfoProx[p].turno = data[8].hora;
                p++;
            }
            x++;
        });
    }

}])
 
.controller('pacienteMenuCtrl', ['$scope', '$http', 'localstorageFactory', function ($scope, $http, localstorageFactory) {
    //----------------------------------- Variables ------------------------------------------
    $scope.loading = true;
    var aux = localstorageFactory.getPatientData();
    var info = "idUsuario=" + aux[2].idPaciente;
 

    //--------------------------------- XMLHttpRequest ---------------------------------------
    $http({
        url: "http://www.e-siat.net/siat_webservice_test/index.php/logIn/getPacienteInfo",
        method: "POST",
        data: info,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function (data) {
       $scope.imagen_perfil = "http://e-siat.net/siat/profilepicture/" + data[0].imagen_perfil;                             
       $scope.patientInfo= {
                            espName         :   aux[5].nombre,
                            espLastName     :   aux[5].apellido,
                            espPhoto        :   "http://image.flaticon.com/icons/svg/204/204225.svg",
                            espturn         :   dateConvert(aux[8].hora.split(" ")),
                            espTel          :   "tel:+" + aux[5].telefono,
                            patName         :   aux[2].nombre,
                            patLastName     :   aux[2].apellido,
                            patPhoto        :   $scope.imagen_perfil,
                            patturn         :   dateConvert(proxDosis().next),
                            percentTodosis  :   $scope.percentTodosis,
                            dosisPeriod     :   $scope.dosisPeriod
        };
        $scope.loading = false;
    });
    

    //----------------------------------- Functions ------------------------------------------
    function dateConvert(auxDate) {
        var auxDate1 = auxDate[0].split("-");
        var date = auxDate1[2] + "/" + auxDate1[1];

        var auxhour1 = auxDate[1].split(":");
        var hour = auxhour1[0] + ":" + auxhour1[1];
        return date + " " + hour
    }

    function proxDosis() {
        var auxd = aux[6].dosis;
        var divd = {};
        var j = -1;
        for (var i = 0; i < auxd.length; i++) {
            if (j >= 0) {
                divd.before = auxd[j].fechaHoraPrevisto.split(" ");
            } else {
                divd.before = auxd[0].fechaHoraPrevisto.split(" ");
            }
            divd.next = auxd[i].fechaHoraPrevisto.split(" "); 
            if (diffDate(divd.before, divd.next) !== -1) {
                $scope.percentTodosis = 100 - ($scope.dosisPeriod - $scope.todosis) * 100 / $scope.dosisPeriod;
                console.log($scope.percentTodosis + "    " + $scope.dosisPeriod);
                return divd;
            }
            j++;
        } 
    }

    function diffDate(dateB, dateN) {
        var divd1 = dateN[0].split("-");
        var today1 = (divd1[1] + '/' + divd1[2] + '/' + divd1[0]).toString();

        var divd2 = dateB[0].split("-");
        var today2 = (divd2[1] + '/' + divd2[2] + '/' + divd2[0]).toString();

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        
        var date1 = new Date((mm + '/' + dd + '/' + yyyy).toString());
        var date2 = new Date(today1);
        var date3 = new Date(today2);

        $scope.dosisPeriod = date2.getTime() - date3.getTime();
        $scope.todosis = date2.getTime() - date1.getTime();

        if (date1 <= date2) {
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        } else {
            return -1;
        }
    }

    $scope.logOut = function () {
        localstorageFactory.remove();
    }

    $scope.chatInfo = function () {
        console.log("imagen_perfil: " + $scope.imagen_perfil);
        var idUsuario = {
            paciente        : aux[0].idUsuario,
            pacienteFoto    : $scope.imagen_perfil,
            medico          : aux[4].idUsuario,
            medicoFoto      : "http://image.flaticon.com/icons/svg/204/204225.svg"
        };
        localstorageFactory.setIdUser(idUsuario);
    }
}])