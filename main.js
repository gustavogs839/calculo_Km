let lancamentos = [];

// Função principal disparada pelo botão "+ Adicionar Lançamento"
function salvarDia() {
    const nome = document.getElementById('nomeFunc').value;
    const dataInput = document.getElementById('data').value;
    const kmInput = document.getElementById('kmDia').value;
    const km = parseFloat(kmInput);

    // Validação para garantir que o código não pare por falta de dados
    if (!dataInput || isNaN(km)) {
        alert("Por favor, preencha a data e os quilómetros corretamente.");
        return;
    }

    // Adiciona os dados ao array
    lancamentos.push({ data: dataInput, km: km });

    // Atualiza a tabela e os cálculos
    atualizarInterface(nome);
    
    // Limpa o campo de KM para facilitar a próxima inserção
    document.getElementById('kmDia').value = "";
}

// Transforma a data do sistema em formato por extenso: Terça-feira, 11 de Fevereiro de 2026
function formatarDataExtenso(dataString) {
    const dataObjeto = new Date(dataString + 'T12:00:00');
    let dataFormatada = dataObjeto.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    // Coloca a primeira letra da frase em maiúsculo
    return dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
}

function atualizarInterface(nome) {
    const tbody = document.getElementById('corpo-tabela');
    if (!tbody) return; // Segurança caso o ID no HTML esteja errado
    
    tbody.innerHTML = "";
    let totalKm = 0;

    lancamentos.forEach((item, index) => {
        const valorDia = item.km * 0.60;
        totalKm += item.km;
        
        // Criando a linha com alinhamento centralizado para KM e Valor
        tbody.innerHTML += `
            <tr>
                <td style="text-align: left; padding-left: 15px;">${formatarDataExtenso(item.data)}</td>
                <td style="text-align: center;">${item.km.toLocaleString('pt-BR')} km</td>
                <td style="text-align: center;">R$ ${valorDia.toFixed(2).replace('.', ',')}</td>
                <td class="no-print" style="text-align: center;">
                    <button class="btn-remove" onclick="removerDia(${index})">Remover</button>
                </td>
            </tr>`;
    });

    // Atualiza o resumo de valores
    const valorTotal = totalKm * 0.60;
    const nomeAtual = nome || "__________";

    document.querySelectorAll('.out-nome').forEach(el => el.innerText = nomeAtual);
    document.getElementById('outTotalKm').innerText = totalKm.toLocaleString('pt-BR');
    document.getElementById('outValorTotal').innerText = "R$ " + valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2});

    // Atualiza o período no cabeçalho (Data inicial e final)
    let periodoTexto = "--/-- até --/--";
    if (lancamentos.length > 0) {
        const datasSorted = lancamentos.map(l => l.data).sort();
        periodoTexto = `${formatarDataExtenso(datasSorted[0])} até ${formatarDataExtenso(datasSorted[datasSorted.length-1])}`;
    } else {
        const dataSelecionada = document.getElementById('data').value;
        if (dataSelecionada) {
            periodoTexto = formatarDataExtenso(dataSelecionada);
        }
    }

    document.querySelectorAll('.out-periodo').forEach(el => el.innerText = periodoTexto);
}

// Mantém o cabeçalho atualizado ao mudar nome ou data (antes de gravar entradas)
document.getElementById('nomeFunc').addEventListener('change', () => {
    atualizarInterface(document.getElementById('nomeFunc').value);
});

document.getElementById('data').addEventListener('change', () => {
    atualizarInterface(document.getElementById('nomeFunc').value);
});

function removerDia(index) {
    lancamentos.splice(index, 1);
    atualizarInterface(document.getElementById('nomeFunc').value);
}

function limparDados() {
    if(confirm("Deseja apagar todos os lançamentos?")) {
        lancamentos = [];
        atualizarInterface("");
        document.getElementById('kmDia').value = "";
    }
}

// Função para gerar o documento PDF
function gerarPDF() {
    const elemento = document.getElementById('relatorio');
    
    // Nome do arquivo baseado no funcionário selecionado
    const nomeMotorista = document.getElementById('nomeFunc').value || 'Relatorio';

    // Aplica classe temporária para esconder itens que não devem ir para o PDF
    document.body.classList.add('pdf-export');

    const opcoes = {
        margin: [10, 10, 10, 10], // Margens da folha
        filename: `Relatorio_KM_${nomeMotorista}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2, // Melhora a qualidade do texto
            useCORS: true,
            scrollY: 0, // Garante captura completa do elemento, mesmo se houver scroll
            windowWidth: document.body.scrollWidth,
            windowHeight: document.body.scrollHeight,
            backgroundColor: null
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    // Gera o PDF
    html2pdf()
        .set(opcoes)
        .from(elemento)
        .save()
        .finally(() => {
            document.body.classList.remove('pdf-export');
        });
}

// Atualiza os cabeçalhos na primeira carga (para ter nome/período desde o início)
atualizarInterface(document.getElementById('nomeFunc').value);
