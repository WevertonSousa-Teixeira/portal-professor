let dadosTurmas = JSON.parse(localStorage.getItem('iema_dados_turmas')) || {};

if (Object.keys(dadosTurmas).length === 0) {
    for (let i = 1; i <= 12; i++) {
        dadosTurmas[`turma-${i}`] = {
            nome: `Turma ${200 + i} - IEMA Pleno`,
            aviso: "Atenção aos prazos das atividades práticas laboratoriais e entrega dos roteiros.",
            trabalhos: [
                { titulo: "Desenvolvimento de Aplicação Web / Sistema", data: "2026-10-25" },
                { titulo: "Entrega da Documentação do Projeto Prático", data: "2026-11-05" }
            ],
            materiais: [
                { titulo: "Slides e Guia de Aprendizagem (PDF)", link: "https://drive.google.com/file/d/SEU_LINK_DO_DRIVE_AQUI/view", novo: true },
                { titulo: "Repositório de Códigos / Atividades", link: "https://github.com/seu-usuario/seu-repositorio", novo: false }
            ]
        };
    }
    localStorage.setItem('iema_dados_turmas', JSON.stringify(dadosTurmas));
}

let turmaAtualID = null;

function renderizarHome() {
    const gridTurmas = document.getElementById('gridTurmas');
    if (!gridTurmas) return;
    gridTurmas.innerHTML = '';
    
    for (let i = 1; i <= 12; i++) {
        const id = `turma-${i}`;
        const turma = dadosTurmas[id];
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-4 col-xl-3';
        col.innerHTML = `
            <div class="turma-card" onclick="abrirTurma('${id}')">
                <div class="turma-card-icon">
                    <i class="fa-solid fa-code"></i>
                </div>
                <h3 class="h5 fw-bold mb-1">${turma.nome}</h3>
                <p class="text-muted small mb-0">${turma.trabalhos.length} atividades • Materiais no Drive</p>
                <div class="turma-card-footer">
                    <span>Acessar painel</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </div>
            </div>
        `;
        gridTurmas.appendChild(col);
    }
    popularSelectAdmin();
}
renderizarHome();

function abrirTurma(idTurma) {
    turmaAtualID = idTurma;
    const turma = dadosTurmas[idTurma];
    
    document.getElementById('tituloTurma').innerText = turma.nome;
    document.getElementById('textoAvisoTurma').innerText = turma.aviso;

    renderizarTrabalhos(turma.trabalhos);
    renderizarMateriais(turma.materiais);

    document.getElementById('secao-home').style.display = 'none';
    document.getElementById('secao-turma').style.display = 'block';
    document.getElementById('btnVoltar').style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderizarTrabalhos(trabalhos) {
    const tbody = document.getElementById('tabelaTrabalhos');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const hoje = new Date();

    trabalhos.forEach(t => {
        const dataLimite = new Date(t.data + 'T23:59:59');
        const diffTempo = dataLimite - hoje;
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
        
        let textoPrazo = '';
        let classeTag = 'prazo-tag';

        if (diffDias < 0) {
            textoPrazo = 'Prazo Encerrado';
            classeTag += ' bg-secondary text-white';
        } else if (diffDias === 0) {
            textoPrazo = 'Expira HOJE!';
            classeTag += ' tag-urgente';
        } else if (diffDias <= 3) {
            textoPrazo = `Faltam ${diffDias} dias!`;
            classeTag += ' tag-urgente';
        } else {
            textoPrazo = `Entrega em ${diffDias} dias`;
        }

        tbody.innerHTML += `
            <tr>
                <td><strong>${t.titulo}</strong></td>
                <td><span class="${classeTag}"><i class="fa-regular fa-clock"></i> ${textoPrazo} (${t.data.split('-').reverse().join('/')})</span></td>
            </tr>
        `;
    });
}

function renderizarMateriais(materiais) {
    const listaMat = document.getElementById('listaMateriais');
    if (!listaMat) return;
    listaMat.innerHTML = '';
    
    materiais.forEach(m => {
        const badgeNovo = m.novo ? '<span class="badge-novo">Novo</span>' : '';
        listaMat.innerHTML += `
            <div class="material-item">
                <span><strong>${m.titulo}</strong> ${badgeNovo}</span>
                <a href="${m.link}" target="_blank"><i class="fa-solid fa-download"></i> Acessar / Baixar</a>
            </div>
        `;
    });
}

function filtrarMateriais() {
    const inputBusca = document.getElementById('inputBusca');
    if (!inputBusca) return;
    const termo = inputBusca.value.toLowerCase();
    const turma = dadosTurmas[turmaAtualID];
    const filtrados = turma.materiais.filter(m => m.titulo.toLowerCase().includes(termo));
    renderizarMateriais(filtrados);
}

function voltarHome() {
    document.getElementById('secao-turma').style.display = 'none';
    document.getElementById('secao-home').style.display = 'block';
    document.getElementById('btnVoltar').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function abrirModalAdmin() {
    const modalEl = document.getElementById('modalAdmin');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

function verificarSenha() {
    const senhaInput = document.getElementById('senhaAdmin');
    if (!senhaInput) return;
    const senha = senhaInput.value;
    if (senha === '1234') {
        const modalAdminEl = document.getElementById('modalAdmin');
        if (modalAdminEl) {
            bootstrap.Modal.getInstance(modalAdminEl).hide();
        }
        senhaInput.value = '';
        const modalGerenciarEl = document.getElementById('modalGerenciar');
        if (modalGerenciarEl) {
            const modalGerenciar = new bootstrap.Modal(modalGerenciarEl);
            modalGerenciar.show();
        }
    } else {
        alert('Senha incorreta! A senha padrão é 1234');
    }
}

function popularSelectAdmin() {
    const select = document.getElementById('selectTurmaAdmin');
    if (!select) return;
    select.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        const id = `turma-${i}`;
        select.innerHTML += `<option value="${id}">${dadosTurmas[id].nome}</option>`;
    }
}

function alternarCamposAdicao() {
    const tipoEl = document.getElementById('tipoAdicao');
    if (!tipoEl) return;
    const tipo = tipoEl.value;
    const labelTitulo = document.getElementById('labelTituloItem');
    const labelExtra = document.getElementById('labelExtraItem');
    const campoExtra = document.getElementById('inputExtraItem');

    if (tipo === 'material') {
        labelTitulo.innerText = "Título do Material";
        labelExtra.innerText = "Link do Google Drive";
        campoExtra.placeholder = "https://drive.google.com/...";
        campoExtra.type = "text";
        campoExtra.disabled = false;
    } else if (tipo === 'trabalho') {
        labelTitulo.innerText = "Nome da Atividade / Trabalho";
        labelExtra.innerText = "Data Limite de Entrega";
        campoExtra.placeholder = "";
        campoExtra.type = "date";
        campoExtra.disabled = false;
    } else if (tipo === 'aviso') {
        labelTitulo.innerText = "Novo Texto do Mural de Avisos";
        labelExtra.innerText = "Não aplicável";
        campoExtra.value = "";
        campoExtra.disabled = true;
    }
}

function salvarNovoConteudo(event) {
    event.preventDefault();
    const turmaID = document.getElementById('selectTurmaAdmin').value;
    const tipo = document.getElementById('tipoAdicao').value;
    const titulo = document.getElementById('inputTituloItem').value;
    const extra = document.getElementById('inputExtraItem').value;

    if (!titulo && tipo !== 'aviso') {
        alert('Preencha todos os campos!');
        return;
    }

    if (tipo === 'material') {
        dadosTurmas[turmaID].materiais.unshift({ titulo: titulo, link: extra, novo: true });
    } else if (tipo === 'trabalho') {
        dadosTurmas[turmaID].trabalhos.push({ titulo: titulo, data: extra });
    } else if (tipo === 'aviso') {
        dadosTurmas[turmaID].aviso = titulo;
    }

    localStorage.setItem('iema_dados_turmas', JSON.stringify(dadosTurmas));

    alert('Conteúdo publicado com sucesso!');
    const modalGerenciarEl = document.getElementById('modalGerenciar');
    if (modalGerenciarEl) {
        bootstrap.Modal.getInstance(modalGerenciarEl).hide();
    }
    const formEl = document.getElementById('formAdicionar');
    if (formEl) formEl.reset();

    if (turmaAtualID === turmaID) {
        abrirTurma(turmaID);
    }
}