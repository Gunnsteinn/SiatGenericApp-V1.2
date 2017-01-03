angular.module('app.controllers', [])
  
.controller('inicioCtrl', ['$scope','localstorageFactory','$state', function ($scope,localstorageFactory,$state) {

}])
   
.controller('seleccioneUsuarioCtrl', ['$scope', 'localstorageFactory', '$state', function ($scope, localstorageFactory, $state) {
    if (localstorageFactory.getlogUser() !== 'undefined') {
        console.log("$state: " + localstorageFactory.getlogUser().type);
        if (localstorageFactory.getlogUser().type === 'medic') {
            $state.go('pacientes');
        } else {
            $state.go('men');
        } 
    }
}])
   
.controller('loginPacienteCtrl', ['$scope', '$http', '$state', 'localstorageFactory', 'LoginPatientService', '$ionicPopup', function ($scope, $http, $state, localstorageFactory, LoginPatientService, $ionicPopup) {
    $scope.data = {};
    $scope.errorLoginPatient = false;
    $scope.loginPatient = function () {
        console.log('pass ' + $scope.data.usernamePatient + $scope.data.passwordPatient);
        LoginPatientService.loginUser($scope.data.usernamePatient, $scope.data.passwordPatient)
            .success(function (data) {
                console.log('data ' + typeof data);
                if (typeof data !== 'string' && data[0] !== null && data[0] !== "") {
                    $state.go('men');
                    $scope.data.type = "patient";
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
   
.controller('loginEspecialistaCtrl', ['$scope', '$http', '$state', 'localstorageFactory', 'LoginMedicService', '$ionicPopup', function ($scope, $http, $state, localstorageFactory, LoginMedicService, $ionicPopup) {
    $scope.data = {};
    $scope.errorLoginMedic = false;
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
   
.controller('menCtrl', ['$scope', '$http', 'localstorageFactory', function ($scope, $http, localstorageFactory) {
    $scope.logOut = function () {
        localstorageFactory.remove();
    }
}])
   
.controller('mensajesEspecialistaCtrl', ['$scope', 'msjService', 'localstorageFactory', '$http', '$window', '$ionicScrollDelegate', function ($scope, msjService, localstorageFactory, $http, $window, $ionicScrollDelegate) {
    var usersId = localstorageFactory.getIdUser();
    $scope.chatResult = [];
    $scope.sendMessage = "";
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
    $scope.loading = true;
    $scope.usersRef = [];
    $scope.activeUser = localstorageFactory.getlogUser();
    var info = "usuario=" + $scope.activeUser.usernameMedic + "&contrasenia=" + $scope.activeUser.passwordMedic;
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
    $scope.turnosInfo = localstorageFactory.getUsersRef();
    $scope.turnosInfoSem = [];
    $scope.turnosInfoProx = [];

    var j = 0, p = 0, x= 0;
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
 

.controller('chatWeaCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.loading = true;
    var info = "usuario=medicoapp&contrasenia=guille1234";
    $http({
        url: "http://www.e-siat.net/siat_webservice_test/index.php/logIn/inicioEspecialista",
        method: "POST",
        data: info,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function (data, status, headers, config) {
        console.log(data[0].idEspecialista);
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

            for (var i = 0; i < $scope.result.length; i++) {
                console.log("idPaciente" + $scope.result[i].idPaciente);
                var info = "idPaciente=" + $scope.result[i].idPaciente;
                $http({
                    url: "http://www.e-siat.net/siat_webservice_test/index.php/logIn/getTratamiento",
                    method: "POST",
                    data: info,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    console.log("droga" + data[0].droga);
                    //$scope.result[i].droga = data[0].droga;
                })
                .error(function (data, status, headers, config) {
                    console.log("error");
                });
                console.log("droga" + $scope.result[i].idPaciente);
            }
        })
        .error(function (data, status, headers, config) {
            console.log("error");
        });
    })
    .error(function (data, status, headers, config) {
        console.log(data);
        console.log("error");
    });
}])