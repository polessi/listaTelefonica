document.addEventListener('DOMContentLoaded', function () {
    var contatoParaEditar = JSON.parse(localStorage.getItem('contatoParaEditar'));

    if (contatoParaEditar) {
        document.getElementById('idContato').value = contatoParaEditar.id;
        document.getElementById('nomeContato').value = contatoParaEditar.nome;
        document.getElementById('campoIdade').value = contatoParaEditar.idade;

        // Primeiro, limpa os campos de telefone existentes, exceto o template ou o input inicial
        const container = document.getElementById('telefoneContainer');
        const inputsExistentes = container.querySelectorAll('.input-group');
        if (inputsExistentes.length > 1) {
            inputsExistentes.forEach((element, index) => {
                if (index !== 0) { // Mantém o primeiro input-group
                    element.remove();
                }
            });
        }

        const primeiroInputExistente = container.querySelector('input[type="text"]');
        // Verifica se existem telefones e os adiciona aos inputs
        if (contatoParaEditar.telefones && contatoParaEditar.telefones.length > 0) {
            contatoParaEditar.telefones.forEach((telefone, index) => {
                if (index === 0 && primeiroInputExistente) {
                    // Preenche o primeiro input existente com o primeiro número de telefone
                    primeiroInputExistente.value = telefone.numero;
                } else {
                    // Cria novos inputs para os telefones adicionais
                    adicionaCampoTelefone(telefone.numero);
                }
            });
        }
    }
});

function adicionaCampoTelefone(numero) {
    const container = document.getElementById('telefoneContainer');

    // Cria um novo div como contêiner para o input e o botão de remover
    const novoConteiner = document.createElement('div');
    novoConteiner.classList.add('input-group', 'mb-3');

    const novoInput = document.createElement('input');
    novoInput.type = 'text';
    novoInput.classList.add('form-control');
    novoInput.setAttribute('maxlength', '15');
    novoInput.setAttribute('name', 'telefone[]');
    novoInput.value = numero; // Preenche o input com o número de telefone
    novoInput.oninput = function() { aplicaMascaraTelefone(this); }; // Adiciona evento de input para aplicar a máscara

    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.classList.add('btn', 'btn-outline-danger', 'btn-sm');
    btnRemover.textContent = '–';
    btnRemover.addEventListener('click', function () {
        novoConteiner.remove();
    });

    novoConteiner.appendChild(novoInput);
    novoConteiner.appendChild(btnRemover);

    container.appendChild(novoConteiner);

    aplicaMascaraTelefone(novoInput);
}

document.getElementById('btnAtualizar').addEventListener('click', function (e) {
    e.preventDefault(); // Impede o envio do formulário de maneira tradicional

    // Captura os valores dos campos
    const id = document.getElementById('idContato').value.trim();
    const nome = document.getElementById('nomeContato').value.trim();
    const idade = document.getElementById('campoIdade').value.trim();

    console.log(id);

    // Captura todos os números de telefone
    const inputsTelefone = document.querySelectorAll('#telefoneContainer input');
    const telefones = Array.from(inputsTelefone).map(input => input.value.trim()).filter(value => value);

    // Verifica se algum campo obrigatório está vazio ou se não há telefones válidos
    if (!id || !nome || !idade || telefones.length === 0) {
        Swal.fire({
            title: 'Atenção!',
            text: 'Por favor, preencha todos os campos.',
            icon: 'info',
            confirmButtonText: 'Fechar'
        });
        return; // Interrompe a função
    }

    // Cria um objeto com os dados do formulário incluindo todos os telefones
    const dadosDoFormulario = {
        nome,
        idade,
        telefones // Aqui telefones é um array
    };

    console.log(dadosDoFormulario);

    fetch(`http://localhost:8080/atualizarContato/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosDoFormulario),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Sucesso:', data);
            Swal.fire({
                title: 'Atualizado!',
                text: 'Seu contato foi atualizado com sucesso',
                icon: 'success',
                confirmButtonText: 'Fechar'
            }).then((result) => {
                if (result.isConfirmed || result.dismiss) {
                    // Limpa os dados específicos do Local Storage
                    localStorage.removeItem('dadosDoContato');
        
                    // Redireciona para a página de contatos
                    window.location.href = './page-contatos.html';
                }
            });
        })

    .catch((error) => {
        console.error('Erro:', error);
        Swal.fire({
            title: 'Falhou!',
            text: 'Seu contato não foi atualizado! Tente novamente',
            icon: 'error',
            confirmButtonText: 'Fechar'
        });
    });
});
