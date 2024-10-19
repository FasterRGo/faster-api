import cardValidator from 'card-validator';

const cardInfoValidator = (number: any, cvv: any, expirationDate: any): { isValid: boolean, error: string | null, flag?: string } => {
    const numberValidation = cardValidator.number(number);
    if (!numberValidation.isValid) {
        return { isValid: false, error: 'Número do cartão inválido.' };
    }

    const cvvValidation = cardValidator.cvv(cvv, numberValidation.card ? numberValidation.card.code.size : 3);
    if (!cvvValidation.isValid) {
        return { isValid: false, error: 'CVV inválido.' };
    }

    const expirationValidation = cardValidator.expirationDate(expirationDate);
    if (!expirationValidation.isValid) {
        return { isValid: false, error: 'Data de validade inválida.' };
    }

    return { isValid: true, error: null, flag: numberValidation.card?.type };
};

export { cardInfoValidator }