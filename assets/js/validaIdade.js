function limitaIdade(input) {
    if (input.value.length > 3) {
        // Extrai os primeiros 3 dígitos do valor inserido
        input.value = input.value.slice(0, 3);
    }
}