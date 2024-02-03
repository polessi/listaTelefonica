document.getElementById('btnLimpar').addEventListener('click', function (e) {
    e.preventDefault(); // Impede o comportamento padrão do botão, se necessário

    // Limpa os valores dos campos do formulário originais
    document.getElementById('nomeContato').value = '';
    document.getElementById('campoIdade').value = '';
    document.getElementById('telefone').value = '';

    // Seleciona e limpa todos os inputs de telefone dentro do contêiner
    const inputsTelefone = document.querySelectorAll('#telefoneContainer input');
    inputsTelefone.forEach(function(input) {
        input.value = ''; // Limpa o valor de cada input de telefone
    });
});
