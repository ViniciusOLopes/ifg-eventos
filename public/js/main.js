
const modalMapa = document.getElementById("modal-mapa");

const botaoAbrirMapa = document.getElementById("abrir-mapa");
const botaoFecharMapa = document.getElementById("fechar-mapa");
const botaoCancelarMapa = document.getElementById("cancelar-mapa");
const botaoConfirmarMapa = document.getElementById("confirmar-mapa");

const campoLocal = document.getElementById("local");
const campoLatitude = document.getElementById("latitude");
const campoLongitude = document.getElementById("longitude");

let mapa = null;
let marcador = null;
let localizacaoSelecionada = null;

// Inicializa o mapa
function inicializarMapa() {
    if (mapa !== null) {
        mapa.invalidateSize();
        return;
    }

    // Centro inicial do mapa: Brasil
    mapa = L.map("mapa").setView([-15.78, -47.93], 5);

    // Carrega os mapas do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);

    // Evento executado quando o usuário clica no mapa
    mapa.on("click", function(evento) {
        selecionarLocalizacao(evento.latlng);
    });
}

// Seleciona uma localização
function selecionarLocalizacao(coordenadas) {
    const latitude = coordenadas.lat;
    const longitude = coordenadas.lng;

    localizacaoSelecionada = {
        latitude: latitude,
        longitude: longitude
    };

    // Se já existe um marcador, apenas muda sua posição
    if (marcador === null) {
        marcador = L.marker(coordenadas, {
            draggable: true
        }).addTo(mapa);

        // Permite arrastar o marcador
        marcador.on("dragend", function(evento) {
            const novaPosicao = evento.target.getLatLng();
            selecionarLocalizacao(novaPosicao);
        });

    } else {
        marcador.setLatLng(coordenadas);
    }

    botaoConfirmarMapa.disabled = false;
}

// Abre a janela do mapa
function abrirMapa() {
    modalMapa.classList.add("aberto");

    inicializarMapa();

    setTimeout(function() {
        mapa.invalidateSize();
    }, 100);
}

// Fecha a janela do mapa
function fecharMapa() {
    modalMapa.classList.remove("aberto");
}

// Confirma a localização selecionada
function confirmarLocalizacao() {
    if (localizacaoSelecionada === null) {
        return;
    }

    const latitude = localizacaoSelecionada.latitude;
    const longitude = localizacaoSelecionada.longitude;

    campoLatitude.value = latitude;
    campoLongitude.value = longitude;

    // Por enquanto, mostramos as coordenadas no campo.
    campoLocal.value = `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;

    fecharMapa();
}

// Eventos dos botões
botaoAbrirMapa.addEventListener("click", abrirMapa);
botaoFecharMapa.addEventListener("click", fecharMapa);
botaoCancelarMapa.addEventListener("click", fecharMapa);
botaoConfirmarMapa.addEventListener("click", confirmarLocalizacao);

// Fecha ao clicar fora da janela
modalMapa.addEventListener("click", function(evento) {
    if (evento.target === modalMapa) {
        fecharMapa();
    }
});

// Envio de teste do formulário
document.getElementById("form-evento").addEventListener("submit", function(evento) {
    evento.preventDefault();

    alert("Formulário funcionando! O cadastro será implementado posteriormente.");
});
