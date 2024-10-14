


import * as yup from 'yup';

const cardValidator = yup.object().shape({
    number: yup.string()
        .required('O número do cartão é obrigatório'),
    cvv: yup.string()
        .required('O cvv é obrigatório')
        .min(3, 'O cvv deve conter 3 dígitos')
        .max(3, 'O cvv deve conter 3 dígitos'),
    expirationDate: yup.string().required("Você deve informar uma data de validade para o cartão")
});




export { cardValidator }