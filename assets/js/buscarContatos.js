$(document).ready(function () {
    // Carregar os dados ao iniciar
    fetch('http://localhost:8080/buscaContatos')
        .then(response => response.json())
        .then(data => {
            // Inicializa o DataTable com os dados recebidos
            $('#contatos').DataTable({
                data: data,
                columns: [
                    { data: 'id' },
                    { data: 'nome' },
                    { data: 'idade' },
                    {
                        data: null,
                        render: function (data, type, row) {
                            // Adiciona uma classe e um atributo de dado personalizado ao ícone
                            return `<span title="Lista Dos Números" class="mdi mdi-phone-log abrirModalTelefones" data-dados='${JSON.stringify(data)}'></span>`;
                        }
                    },
                    {
                        data: null,
                        render: function (data, type, row) {
                            return `<span title="Editar Contato" class="mdi mdi-account-edit editarContato" data-dados='${JSON.stringify(data)}'></span>`;
                        }
                    },
                    {
                        data: null,
                        render: function (data, type, row) {
                            // return '<span title="Excluir Contato" class="mdi mdi-delete"></span>';
                            return `<span title="Excluir Contato" class="mdi mdi-delete abrirModalExcluir" data-dados='${JSON.stringify(data)}'></span>`;
                        }
                    }
                ]
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    //Abre o modal da lista de telefones
    $(document).on('click', '.abrirModalTelefones', function () {
        var dados = $(this).data('dados'); // Recupera os dados do atributo personalizado, incluindo os telefones

        // Preparando o conteúdo HTML para os detalhes do contato
        var conteudoHtml = ``;
        dados.telefones.forEach(function (telefone) {
            conteudoHtml += `<li><i class="mdi mdi-cellphone"></i> ${telefone.numero}</li>`;
        });
        conteudoHtml += "</ul>";

        // Alterando o título do modal para incluir o nome do contato
        $('#telefonesModalLabel').text(`${dados.nome} (${dados.id})`);

        // Preenchendo o modal com os dados e abrindo-o
        $('#telefonesModal .modal-body').html(conteudoHtml);
        $('#telefonesModal').modal('show');
    });

    // Adiciona um ouvinte de eventos para o clique nos ícones de edição
    $('#contatos tbody').on('click', '.editarContato', function () {
        var data = $(this).data('dados');

        // Salva os dados do contato no Local Storage
        localStorage.setItem('contatoParaEditar', JSON.stringify(data));

        // Redireciona para a página de atualização de contato
        window.location.href = './page-atualizaContato.html';
    });

    var linhaAtual;
    //Abre o modal de excluir contato
    $(document).on('click', '.abrirModalExcluir', function () {
        var dados = $(this).data('dados'); // Recupera os dados do atributo personalizado

        $('#confirmarExclusao').data('id', dados.id);
        $('#confirmarExclusao').data('nome', dados.nome);
        $('#confirmarExclusao').data('idade', dados.idade);

        linhaAtual = $(this).closest('tr');

        // Preparando o conteúdo HTML para os detalhes do contato
        var conteudoHtml = `<h4 class="danger">Deseja realmente excluir este contato?</h4>`;

        // Alterando o título do modal para incluir o nome do contato
        $('#excluirContatoModalLabel').text(`${dados.nome} (${dados.id})`);

        // Preenchendo o modal com os dados e abrindo-o
        $('#excluirContatoModal .modal-body').html(conteudoHtml);
        $('#excluirContatoModal').modal('show');

        // Aqui, armazenamos o ID do contato no botão "Sim"
        document.getElementById('confirmarExclusao').setAttribute('data-id', dados.id);
        document.getElementById('confirmarExclusao').setAttribute('data-nome', dados.nome);
        document.getElementById('confirmarExclusao').setAttribute('data-idade', dados.idade);
    });

    // Evento de clique no botão "Sim" para confirmar a exclusão
    document.getElementById('confirmarExclusao').addEventListener('click', function () {
        var idContato = this.getAttribute('data-id');
        var nomeContato = this.getAttribute('data-nome');
        var idadeContato = this.getAttribute('data-idade');

        fetch(`http://localhost:8080/deletarContato`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: idContato,
                nome: nomeContato,
                idade: idadeContato,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao deletar o contato');
                }
                return response.json();
            })
            .then(data => {

                // Fechar o modal
                $('#excluirContatoModal').modal('hide');

                // Remove a linha armazenada
                if (linhaAtual) {
                    $('#contatos').DataTable().row(linhaAtual).remove().draw();
                }

                // Mensagem de sucesso ou atualização da UI conforme necessário
                Swal.fire({
                    title: 'Excluído!',
                    text: 'Seu contato foi excluído com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'Fechar'
                });
            })
            .catch(error => {
                console.error('Erro:', error);
                Swal.fire({
                    title: 'Falhou!',
                    text: 'Seu contato não foi excluído! Tente novamente',
                    icon: 'error',
                    confirmButtonText: 'Fechar'
                });
            });
    });
});



