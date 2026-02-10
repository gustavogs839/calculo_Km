document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    atualizarRelatorio();
    // Adiciona o event listener para o dropdown
    document.getElementById('nomeFunc').addEventListener('change', atualizarRelatorio);
});

function salvarDia() {
    const dataInput = document.getElementById('data');
    const kmInput = document.getElementById('kmDia');
    const data = dataInput.value;
    const km = parseFloat(kmInput.value);

    if (!data || isNaN(km) || km <= 0) {
        alert("Por favor, insira uma data válida e uma quilometragem maior que zero.");
        return;
    }

    let lancamentos = JSON.parse(localStorage.getItem('kmLancamentos')) || [];
    // Adiciona uma verificação para não duplicar datas
    if (lancamentos.some(l => l.data === data)) {
        alert("Já existe um lançamento para esta data. Remova o antigo se quiser adicionar um novo.");
        return;
    }

    lancamentos.push({ data, km });
    lancamentos.sort((a, b) => new Date(a.data) - new Date(b.data));
    localStorage.setItem('kmLancamentos', JSON.stringify(lancamentos));

    dataInput.value = '';
    kmInput.value = '';
    
    // Limpa a tabela antes de recarregar para evitar duplicação visual
    document.querySelector('#tabela-lancamentos tbody').innerHTML = '';
    carregarDados();
    atualizarRelatorio();
}

function carregarDados() {
    const lancamentos = JSON.parse(localStorage.getItem('kmLancamentos')) || [];
    const nome = localStorage.getItem('nomeFunc') || 'Eduardo Gonçalves';
    document.getElementById('nomeFunc').value = nome;

    const tabelaBody = document.querySelector('#tabela-lancamentos tbody');
    tabelaBody.innerHTML = ''; // Limpa a tabela antes de carregar
    lancamentos.forEach(l => adicionarLinhaTabela(l.data, l.km));
}

function adicionarLinhaTabela(data, km) {
    const tabelaBody = document.querySelector('#tabela-lancamentos tbody');
    const newRow = tabelaBody.insertRow();
    const valorDia = km * 0.60;
    newRow.dataset.data = data; // Armazena a data no elemento da linha para facilitar a remoção

    newRow.innerHTML = `
        <td>${new Date(data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
        <td>${km.toFixed(1)}</td>
        <td>R$ ${valorDia.toFixed(2).replace('.', ',')}</td>
        <td><button class="btn-delete" onclick="removerLinha('${data}')">Remover</button></td>
    `;
}

function removerLinha(data) {
    let lancamentos = JSON.parse(localStorage.getItem('kmLancamentos')) || [];
    lancamentos = lancamentos.filter(l => l.data !== data);
    localStorage.setItem('kmLancamentos', JSON.stringify(lancamentos));

    // Recarrega os dados e o relatório
    carregarDados();
    atualizarRelatorio();
}

function limparDados() {
    if (confirm("Tem certeza que deseja limpar todos os lançamentos e resetar o funcionário?")) {
        localStorage.removeItem('kmLancamentos');
        localStorage.removeItem('nomeFunc');
        carregarDados(); // Recarrega, que irá limpar a tabela e resetar o nome
        atualizarRelatorio();
    }
}

function atualizarRelatorio() {
    const nomeSelect = document.getElementById('nomeFunc');
    const nome = nomeSelect.value; // Usar .value é mais seguro
    localStorage.setItem('nomeFunc', nome);
    
    const lancamentos = JSON.parse(localStorage.getItem('kmLancamentos')) || [];

    let totalKm = 0;
    let dataIni = null;
    let dataFim = null;

    if (lancamentos.length > 0) {
        totalKm = lancamentos.reduce((acc, l) => acc + l.km, 0);
        dataIni = new Date(lancamentos[0].data);
        dataFim = new Date(lancamentos[lancamentos.length - 1].data);
    }
    
    const valorTotal = totalKm * 0.60;

    document.getElementById('outNome').innerText = nome || "__________";
    
    if(dataIni && dataFim){
        document.getElementById('outPeriodo').innerText = 
            `${dataIni.toLocaleDateString('pt-BR', {timeZone: 'UTC'})} a ${dataFim.toLocaleDateString('pt-BR', {timeZone: 'UTC'})}`;
    } else {
        document.getElementById('outPeriodo').innerText = "Aguardando dados...";
    }

    document.getElementById('outTotalKm').innerText = totalKm.toFixed(1);
    document.getElementById('outValorTotal').innerText = "R$ " + valorTotal.toFixed(2).replace('.', ',');
}

function gerarPDF() {
    // Chama a atualização para garantir que os dados no DOM estão corretos
    atualizarRelatorio();

    // Adiciona um pequeno delay para garantir que o DOM foi atualizado antes do html2pdf rodar
    setTimeout(() => {
        const elemento = document.getElementById('relatorio');
        const nome = document.getElementById('nomeFunc').value;
        const opcoes = {
            margin: 10,
            filename: `relatorio-km-${nome || 'funcionario'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opcoes).from(elemento).save();
    }, 150); // Delay de 150ms
}
