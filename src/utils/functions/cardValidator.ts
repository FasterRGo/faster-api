import cardValidator from 'card-validator';

const cardInfoValidator = (number: any, cvv: any, expirationDate: any): { isValid: boolean, error: string | null } => {
    const numberValidation = cardValidator.number(number);
    if (!numberValidation.isValid) {
        return { isValid: false, error: 'Número do cartão inválido.' };
    }

    // Validação do CVV
    const cvvValidation = cardValidator.cvv(cvv, numberValidation.card ? numberValidation.card.code.size : 3);
    if (!cvvValidation.isValid) {
        return { isValid: false, error: 'CVV inválido.' };
    }

    // Validação da data de expiração
    const expirationValidation = cardValidator.expirationDate(expirationDate);
    if (!expirationValidation.isValid) {
        return { isValid: false, error: 'Data de validade inválida.' };
    }

    // Se todas as validações forem bem-sucedidas
    return { isValid: true, error: null };
};

export { cardInfoValidator }