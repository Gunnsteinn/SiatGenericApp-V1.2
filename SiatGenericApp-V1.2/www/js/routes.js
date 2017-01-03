angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('inicio', {
    url: '/inicio',
    templateUrl: 'templates/inicio.html',
    controller: 'inicioCtrl'
  })

  .state('seleccioneUsuario', {
    url: '/select-user',
    templateUrl: 'templates/seleccioneUsuario.html',
    controller: 'seleccioneUsuarioCtrl'
  })

  .state('loginPaciente', {
    url: '/paciente-login',
    templateUrl: 'templates/loginPaciente.html',
    controller: 'loginPacienteCtrl'
  })

  .state('loginEspecialista', {
    url: '/especialista-login',
    templateUrl: 'templates/loginEspecialista.html',
    controller: 'loginEspecialistaCtrl'
  })

  .state('men', {
    url: '/paciente-menu',
    templateUrl: 'templates/men.html',
    controller: 'menCtrl'
  })

  .state('mensajesEspecialista', {
    url: '/mensajesEspecialista',
    templateUrl: 'templates/mensajesEspecialista.html',
    controller: 'mensajesEspecialistaCtrl'
  })

  .state('pacientes', {
    url: '/especialista-patients',
    templateUrl: 'templates/pacientes.html',
    controller: 'pacientesCtrl'
  })

  .state('turnos', {
    url: '/especialista-turns',
    templateUrl: 'templates/turnos.html',
    controller: 'turnosCtrl'
  })

$urlRouterProvider.otherwise('/inicio')

  

});