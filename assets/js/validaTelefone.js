function aplicaMascaraTelefone(input) {
    // Remove tudo o que não é dígito
    let numeros = input.value.replace(/\D/g, '');

    // Limita o número de dígitos a 11 (para números de celular brasileiros)
    numeros = numeros.slice(0, 11);

    // Aplica a máscara para celular ou telefone fixo
    if (numeros.length <= 10) { // Telefone fixo
        input.value = numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else { // Celular
        input.value = numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
}