'use strict';
/* AngularJS controller */
var beehiveControllers = angular.module('beehiveControllers', []);

/* Init signalR */
$.connection.hub.url = "http://localhost:9999/signalr";
var hub = $.connection.arniaVirtualeHub;

var punti = 0;          //Total score
var faseDelGioco;       //Attuale fase del gioco
var nDomandeDaFare;     //Domande da fare
var domandeFatte;       //Domande fatte
var domandeCaricate;    //Vettore con le domande
var devoRispondere;     //Indica il comportamento dei pulsanti base
var gruppetti;          //Vettore con i grupetti
var faseVideo = 1;      //Indica il prossimo video
var saltaQ1 = false;
var pallineGiocoC = 1;
var pallineGiocoE = 1;
var numeroTotaleGiocatori;
var classe = [];

/* Modalità di gioco in base al numero di giocatori */
var GESTIONEGRUPPI = [[], [], [], [], []];

GESTIONEGRUPPI[0] = [ 5, 2, 3, 2, 3, 5 ];
GESTIONEGRUPPI[1] = [ 5, 2, 3, 2, 2, 5 ];
GESTIONEGRUPPI[2] = [ 4, 2, 2, 2, 2, 4 ];
GESTIONEGRUPPI[3] = [ 4, 4, 3, 3, 4, 4 ];
GESTIONEGRUPPI[4] = [ 3, 3, 3, 3, 3, 3 ];


/* Home page TID */
beehiveControllers.controller('tid', ['$scope', '$location', '$rootScope',
function ($scope, $location, $rootScope) 
{
    $rootScope.bodyClass = 'tid_back';

    //Quando arriva l'evento del click
    $scope.eduBeehive = function () 
    {
        //Interrompo la connessione signalR (migliora l'efficienza)
        $.connection.hub.stop();

        $rootScope.bodyClass = '';
        //Vado nella pagina successiva
        $location.path('video');
        $scope.$apply();
    }

    //Quando arriva l'evento  registrazioneGiocatori passo alla pagina successiva
    hub.client.registrazioneGiocatori = function (name) 
    {
        $.connection.hub.stop();
        $rootScope.bodyClass = '';
        saltaQ1 = true;
        $location.path('video');
        $scope.$apply();
    };

    //Riprendo la connessione
    $.connection.hub.start();
}]);


/* Edu Beehive */
beehiveControllers.controller('eduBeehive', ['$scope', '$location', '$rootScope',
function ($scope, $location, $rootScope) 
{
    $scope.statoQuadro = "Inserire quadro numero 1";

    //Quadro Errato
    hub.client.quadroErrato = function () { $scope.statoQuadro = "Inserito quadro errato!"; $scope.$apply(); };
    hub.client.qualcosaConnesso = function () { $scope.statoQuadro = "Connessione quadro in corso..."; $scope.$apply(); };
    hub.client.qualcosaSconnesso = function () { $scope.statoQuadro = "Inserire quadro numero 1"; $scope.$apply(); };

    hub.client.registrazioneGiocatori = function (name) 
    {
        $.connection.hub.stop();
        $location.path('newbee');
        $scope.$apply();
    };

    $.connection.hub.start();
}]);


/* Primo Quadro */
beehiveControllers.controller('newbee', ['$scope', '$location',
function ($scope, $location) 
{
    classe = [];
    document.getElementById("nomeApe").focus();

    $scope.AddNew = function () 
    {
        if (classe.length < 10) 
        {
            var n_bee = $scope.nomeApe;

            if (n_bee == "" || n_bee == null) 
            {
                $scope.errore = "Inserire un nome valido!";
                setTimeout(function () 
                {
                    $scope.errore = "";
                    $scope.$apply();
                }, 2000); //timeout
                document.getElementById("nomeApe").focus();
                return false;
            }

        classe.push(n_bee);

        if ($scope.giocatori == "" || $scope.giocatori == null)
            $scope.giocatori = n_bee;
        else 
            $scope.giocatori += ', ' + n_bee;

        $scope.nomeApe = "";
        document.getElementById("nomeApe").focus();
        }
        else 
        {
            alert("Non si possono inserire più di 10 nomi!");
            document.getElementById("btn1").focus();
        }
    }

    $scope.End = function () 
    {
        if (classe.length > 5) 
        {
            numeroTotaleGiocatori = classe.length;
            creaGruppetti(classe);
            $.connection.hub.stop();
            faseVideo = 2;
            $location.path('video');
            $scope.$apply();
        }
        else 
        {
            $scope.errore = "Inserire minimo 6 nomi!";
            setTimeout(function () 
            {
                $scope.errore = "";
                $scope.$apply();
            }, 2000); //timeout

            document.getElementById("nomeApe").focus();
        }
    }
}]);


/* Chiusura celle */
beehiveControllers.controller('cellclose', ['$scope', '$location',
function ($scope, $location) 
{
    hub.client.risposta0 = function () 
    {
        $.connection.hub.stop();
        faseVideo = 3;
        $location.path('video');
        $scope.$apply();
    };

    hub.client.risposta1 = function () 
    {
        $.connection.hub.stop();
        faseVideo = 3;
        $location.path('video');
        $scope.$apply();
    };

    $.connection.hub.start()
}]);


/* Secondo Quadro */
beehiveControllers.controller('quadro2', ['$scope', '$location',
function ($scope, $location) 
{
    $scope.statoQuadro = "Inserire quadro numero 2";
    hub.client.quadroErrato = function () { $scope.statoQuadro = "Inserito quadro errato!"; $scope.$apply(); };
    hub.client.qualcosaConnesso = function () { $scope.statoQuadro = "Connessione quadro in corso..."; $scope.$apply(); };
    hub.client.qualcosaSconnesso = function () { $scope.statoQuadro = "Inserire quadro numero 2"; $scope.$apply(); };

    hub.client.avvioVideo2 = function () 
    {
        $.connection.hub.stop();
        faseVideo = 4;
        $location.path('video');
        $scope.$apply();
    };

    $.connection.hub.start()
}]);


/* Gioco secondo quadro */
beehiveControllers.controller('giocoC', ['$scope', '$location', '$http',
function ($scope, $location, $http) 
{
    faseDelGioco = 3
    var nBambiniCheDevonoGiocare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];

    $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);
    $scope.pallineRimanenti = pallineGiocoC;
    var tentativi = pallineGiocoC;
    var div = document.getElementById('fiori');

    hub.client.puntoGiocoC = function () 
    {
        $scope.esitoTiro = "preso un fiore!";
        pallineGiocoE += 1;

        div.innerHTML = div.innerHTML + '<img class="fiore" src="../img/fiore.png" />';//aggiungo un fiore
        $scope.$apply();

        setTimeout(function () 
        {
            $scope.esitoTiro = "";
            $scope.$apply();
        }, 1500); //timeout
    };

    hub.client.finePallinaGiocoC = function () 
    {
        $scope.pallineRimanenti--;

        if ($scope.pallineRimanenti == 0 && nBambiniCheDevonoGiocare > 1) 
        {
            setTimeout(function () 
            {
                $scope.esitoTiro = "";
                $scope.cambio = "CAMBIO TURNO!";
                setTimeout(function () 
                {
                    $scope.cambio = "";
                    $scope.$apply();
                }, 1500); //timeout


                //Cambio giocatore
                $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);

                //Resetto scritte
                div.innerHTML = "<p class='testomedio' style='margin-bottom:1px'>Fiori presi:</p>";
                $scope.pallineRimanenti = pallineGiocoC;

                $http.get('api/invio/2/' + pallineGiocoC).success(function () { });//invio lo start all'arduino
                nBambiniCheDevonoGiocare--;
                $scope.$apply();
            }, 2000);
        }
        $scope.$apply();

        if ($scope.pallineRimanenti == 0 && nBambiniCheDevonoGiocare - 1 == 0) 
        {
            pallineGiocoE = Math.round(Math.round(pallineGiocoE / tentativi) / 3);
            $.connection.hub.stop();
            $location.path('quadro3');
            $scope.$apply();
        }   
    };
    $.connection.hub.start()
}]);


/* Terzo Quadro */
beehiveControllers.controller('quadro3', ['$scope', '$location',
function ($scope, $location) 
{
    $scope.statoQuadro = "Inserire quadro numero 3";
    hub.client.quadroErrato = function () { $scope.statoQuadro = "Inserito quadro errato!"; $scope.$apply(); };
    hub.client.qualcosaConnesso = function () { $scope.statoQuadro = "Connessione quadro in corso..."; $scope.$apply(); };
    hub.client.qualcosaSconnesso = function () { $scope.statoQuadro = "Inserire quadro numero 3"; $scope.$apply(); };

    hub.client.avvioVideo3 = function () 
    {
        $.connection.hub.stop();
        faseVideo = 6;
        $location.path('video');
        $scope.$apply();
    };

    $.connection.hub.start()
}]);


/* Gioco terzo quadro*/
beehiveControllers.controller('giocoE', ['$scope', '$location', '$http',
function ($scope, $location, $http) 
{
    faseDelGioco = 5;
    var nBambiniCheDevonoGiocare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];
    var pallineRim = pallineGiocoE;

    $scope.puntiFatti = 0;
    $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);
    nBambiniCheDevonoGiocare--;
    $scope.pallineRimanenti = pallineRim;
    $scope.$apply();

    hub.client.pallaGiocoE = function () 
    {
        pallineRim--;
        $scope.pallineRimanenti = pallineRim;
        $scope.$apply();

        if (pallineRim <= 0)
        {
            $scope.cambio = "CAMBIO TURNO!";
            
            $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);
            $scope.puntiFatti = 0;
            pallineRim = pallineGiocoE;
            $scope.pallineRimanenti = pallineRim;
            nBambiniCheDevonoGiocare--;
            $scope.$apply();

            setTimeout(function () 
            {
                $scope.cambio = "";
                $scope.$apply();
            }, 4000); //timeout	
        }
        else if (nBambiniCheDevonoGiocare <= 0) 
        {
            $.connection.hub.stop();
            faseDelGioco = 6;
            $location.path('quiz');
            $scope.$apply();
            $.connection.hub.start();
        }
    };

    hub.client.puntoGiocoE = function () 
    {
        punti += 1;
        $scope.puntiFatti += 1;
        $scope.$apply();
    };

    $.connection.hub.start();
}]);


/* Risultati */
beehiveControllers.controller('risultato', ['$scope', '$location', '$http',
function ($scope, $location, $http) 
{
    if ($location.url() == "/risultato") 
    {
        var currentPercent = 0;
        var puntiPerc = ((punti/40)*100);

        window.setInterval(function() 
        {
            if(currentPercent < puntiPerc)
                currentPercent += 1;
            else
                document.getElementById('honey').style.MozAnimationPlayState = "paused";
        }, 100);

        setTimeout(function () 
        {
            Reset();
            $.connection.hub.stop();
            $http.get('api/reset/0').success(function () { });
            $location.path('home');
            $scope.$apply();
        }, 60000); //timeout
    }

    $scope.BtnReset = function () 
    {
        Reset();
        $.connection.hub.stop();

        $http.get('api/reset/0').success(function () { });
        $location.path('home');
        $scope.$apply();
    }

    $scope.BtnReturn = function () { window.history.back(); }
}]);


/* Quiz generico */
beehiveControllers.controller('quiz', ['$scope', '$location', '$http',
function ($scope, $location, $http) 
{
    nDomandeDaFare = 0;
    domandeFatte = 0;
    devoRispondere = true;

    faseDelGioco = faseDelGioco != null ? faseDelGioco : 1;
    nDomandeDaFare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];

    $http.get('/domande/' + calcolaDomandeDaFare(faseDelGioco) + '.json').success(function (domandeQuizCorrente) {
    
    //Mischio le domande
    domandeCaricate = shuffle(domandeQuizCorrente);

    //Seleziono il giocatore
    $scope.nomeBimbo = prendiProssimoGiocatore(faseDelGioco);
    
    //Estraggo la domanda
    $scope.domandaCorrente = domandeCaricate.pop();
});

    //Evento che viene chiamato se il giocatore ha premuto il bottone 0
    hub.client.risposta0 = function () { gestioneRisposta($scope, $location, 0); };
    //Evento che viene chiamato se il giocatore ha premuto il bottone 1
    hub.client.risposta1 = function () { gestioneRisposta($scope, $location, 1); };

    $.connection.hub.start();
}]);


/* Video generico */
beehiveControllers.controller('video', ['$scope', '$location', '$http', '$rootScope',
function ($scope, $location, $http, $rootScope) 
{
    /*
    v1	 intro
    v2	 spiegazione larve celle
    v3	 video api1

    v4	 video api2
    v5	 spiegazione gioco1

    v6	 video api3
    v7 	 spiegazione gioco2

    v8	 conclusione
    */

    var video = document.getElementsByTagName('video')[0];

    video.setAttribute('src', '../video/v' + faseVideo + '.mp4');

    video.focus();
    video.play();

    video.onended = function () 
    {
        $.connection.hub.stop();

        switch (faseVideo) 
        {
            case 1:
            {
                if (saltaQ1)
                    $location.path('newbee');
                else
                    $location.path('edu_beehive');
                break;
            }
            case 2:
            {
                $location.path('cellclose');
                break;
            }
            case 3:
            {
                $http.get('api/invio/1/a').success(function () { });//invio lo start all'arduino
                faseDelGioco = 1;
                $location.path('quiz');
                break;
            }
            case 4:
            {
                faseDelGioco = 2;
                $location.path('quiz');
                break;
            }
            case 5:
            {
                $location.path('giocoC');
                break;
            }
            case 6:
            {
                faseDelGioco = 4;
                $location.path('quiz');
                break;
            }
            case 7:
            {
                $location.path('giocoE');
                break;
            }
            case 8:
            {
                $location.path('risultato');
                break;
            }
            default:
            {
                $location.path('home');
                break;
            }

        $.connection.hub.start();
        }

    $scope.$apply();
    }
}]);



/* Utility */
//Gestisce i pulsanti della base
function gestioneRisposta($scope, $location, risp) 
{
    var correct = document.getElementById("correct");
    var wrong = document.getElementById("wrong");

    if (devoRispondere) 
    {
        if ($scope.domandaCorrente.corretta == risp + 1) 
        {
            //Risposta corretta
            correct.play();
            document.getElementById("risp" + risp).style.backgroundColor = "green";
            rispostaGiustaAlQuiz(faseDelGioco);
        }
        else 
        {
            //Risposta sbagliata
            wrong.play();
            document.getElementById("risp" + risp).style.backgroundColor = "red";
        };

        document.getElementById("prossimo").style.display = "block";
        devoRispondere = false;
    }
    else 
    {
        //La pressione del pulsante corrisponde al caricamento della prossima domanda
        document.getElementById("risp0").style.backgroundColor = "#FFE70A";
        document.getElementById("risp1").style.backgroundColor = "#FFE70A";
        document.getElementById("prossimo").style.display = "none";

        domandeFatte++;
        if (domandeFatte < nDomandeDaFare) 
        {
            //Cambio domanda e giocatore
            $scope.nomeBimbo = prendiProssimoGiocatore(faseDelGioco);
            $scope.domandaCorrente = domandeCaricate.pop();
            $scope.$apply();
        }
        else 
        {
            //ho finito le domande
            $.connection.hub.stop();
            var schermataSuccessiva = calcolaPaginaSuccessivaAlQuiz(faseDelGioco);
            $location.path(schermataSuccessiva);
            $scope.$apply();
        }
        devoRispondere = true;
    }
}


/* Restituisce le pagina corretta da visualizzare una volta terminato il quiz */
function calcolaPaginaSuccessivaAlQuiz(quadroCorrente) 
{
    switch (quadroCorrente) 
    {
        case 1:
           return 'quadro2';
           break;
        case 2:
        {
            faseVideo = 5;
            return 'video';
        }
        case 4:
        {
            faseVideo = 7;
            return 'video';
        }
        case 6:
        {
            faseVideo = 8;
            return 'video';
        }
    }
}

/* Restituisce il file json da reperire contenente le domande */
function calcolaDomandeDaFare(quadroCorrente) 
{
    switch (quadroCorrente) 
    {
        case 1:
            return 'quizA';
        case 2:
            return 'quizB';
        case 4:
            return 'quizD';
        case 6:
            return 'quizF';
    }
}

/* Aggiorna il punteggio in base al gioco */
function rispostaGiustaAlQuiz(quizCorrente) 
{
    if (quizCorrente == 1) 
        punti += 1;

    if (quizCorrente == 2) 
        pallineGiocoC += 1;

    if (quizCorrente == 4) 
        punti += 1;

    if (quizCorrente == 6) 
        punti += 1;
}



/* Genera i gruppetti */
function creaGruppetti(classe) 
{
    if (classe.length < 8) 
       gruppetti = [shuffle(classe.slice()), shuffle(classe.slice()), shuffle(classe.slice())];     //3 gruppetti
    else 
        gruppetti = [shuffle(classe.slice()), shuffle(classe.slice())];                             //2 gruppetti
}

/* Randomizza gli elementi */
function shuffle(array) 
{
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) 
    {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* Prende il prossimo giocatore */
function prendiProssimoGiocatore(gioco) 
{
    var giocatore;
    switch (numeroTotaleGiocatori) 
    {
        case 6:
        {
            switch (gioco) 
            {
                case 1: 
                {
                    giocatore = gruppetti[0].pop();
                    break;
                }
                case 2: 
                {
                    giocatore = gruppetti[1].pop();
                    break;
                }
                case 3: 
                {
                    giocatore = gruppetti[2].pop();
                    break;
                }
                case 4: 
                {
                    giocatore = gruppetti[2].pop();
                    break;
                }
                case 5: 
                {
                    giocatore = gruppetti[1].pop();
                    break;
                }
                case 6: 
                {
                    giocatore = gruppetti[0].pop();
                    break;
                }
            }
            break;
        }
        case 7:
        {
            switch (gioco) 
            {
                case 1: 
                {
                    giocatore = gruppetti[0].pop();
                    break;
                }
                case 2: 
                {
                    giocatore = gruppetti[1].pop();
                    break;
                }
                case 3: 
                {
                    giocatore = gruppetti[2].pop();
                    break;
                }
                case 4: 
                {
                    giocatore = gruppetti[1].pop();
                    break;
                }
                case 5: 
                {
                    giocatore = gruppetti[2].pop();
                    break;
                }
                case 6: 
                {
                    giocatore = gruppetti[0].pop();
                    break;
                }
            }
            break;
        }
        default:
        {
            switch (gioco) 
            {
                case 1: 
                {
                    giocatore = gruppetti[0].pop();
                    break;
                }
                case 6: 
                {
                    giocatore = gruppetti[0].pop();
                    break;
                }
                default: 
                {
                    giocatore = gruppetti[1].pop();
                    break;
                }
            }
            break;
        }
    }

    return giocatore;
}

/* Azzera le var */
function Reset()
{
    punti = 0;         
    faseDelGioco = null; 
    nDomandeDaFare = null;
    domandeFatte = null;  
    domandeCaricate = null;
    devoRispondere = null;
    gruppetti = null; 
    numeroTotaleGiocatori = null;
    saltaQ1 = false;
    faseVideo = 1;     
    pallineGiocoC = 1;
    pallineGiocoE = 1;
    classe = [];
}
