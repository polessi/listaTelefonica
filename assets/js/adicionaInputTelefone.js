    document.getElementById('addTelefone').addEventListener('click', function () {
    const container = document.getElementById('telefoneContainer');

    // Cria um novo div como contêiner para o input e o botão de remover
    const novoConteiner = document.createElement('div');
    novoConteiner.classList.add('input-group', 'mb-3');

    // Cria um novo elemento input para o telefone
    const novoInput = document.createElement('input');
    novoInput.setAttribute('type', 'text');
    novoInput.classList.add('form-control');
    novoInput.setAttribute('maxlength', '15');
    novoInput.setAttribute('oninput', 'aplicaMascaraTelefone(this)');
    novoInput.setAttribute('name', 'telefone[]');

    // Cria um botão de remover
    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.classList.add('btn', 'btn-outline-danger', 'btn-sm');
    btnRemover.textContent = '–'; // Usar um sinal de menos para indicar remoção
    btnRemover.onclick = function () {
        // Remove o contêiner do input específico
        container.removeChild(novoConteiner);
    };

    // Adiciona o input e o botão ao novo contêiner
    novoConteiner.appendChild(novoInput);
    novoConteiner.appendChild(btnRemover);

    // Adiciona o novo contêiner ao contêiner principal
    container.appendChild(novoConteiner);
});