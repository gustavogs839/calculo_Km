# 🚗 Gestão de Quilometragem

Sistema web desenvolvido sob demanda para automatizar o registro de deslocamentos e a geração de relatórios de reembolso.

[**Acesse a aplicação aqui**](https://gustavogs839.github.io/calculo_Km/)

## 📋 Sobre o Projeto

Este projeto foi desenvolvido para atender a uma solicitação específica de gestão de frotas e reembolsos. O foco principal é a padronização e agilidade no fechamento de contas semanais de motoristas e funcionários.

### ⚙️ Regra de Negócio Customizada
Conforme solicitado pelo cliente, o sistema utiliza um **cálculo padrão fixo** para o reembolso:
* **Valor por KM rodado:** $R\$ 0,60$.
* O cálculo é processado automaticamente assim que a quilometragem é inserida, garantindo que não haja erros manuais no fechamento do relatório.

### Principais Funcionalidades
* **Cálculo Automatizado:** Multiplicação instantânea da quilometragem pelo valor de $R\$ 0,60$.
* **Geração de Relatório PDF:** Layout formatado para impressão, incluindo campos de assinatura e identificação da empresa (**Doce Mistura**).
* **Gestão de Lançamentos:** Adição e limpeza de dados de forma intuitiva.
* **Interface Limpa:** Foco na usabilidade para preenchimento rápido em ambiente de trabalho.

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3:** Estruturação e design responsivo.
* **JavaScript (Vanilla):** Lógica de cálculo, manipulação do DOM e geração do espelho do relatório.
* **Google Fonts:** Utilização da fonte *Inter* para máxima legibilidade.

## 🚀 Como utilizar

1. **Funcionário:** Selecione o nome do colaborador no campo correspondente.
2. **Dados da Viagem:** Insira a data e a quilometragem total percorrida no dia.
3. **Registro:** Clique em "Adicionar lançamento". O sistema exibirá o valor de $R\$ 0,60 \times KM$ na tabela.
4. **Exportação:** Após concluir os lançamentos da semana, clique em "Baixar Relatório" para gerar o documento oficial de reembolso.

---

### 👨‍💻 Desenvolvedor
**Gustavo Gonçalves** - Desenvolvido como solução personalizada para controle de quilometragem.

