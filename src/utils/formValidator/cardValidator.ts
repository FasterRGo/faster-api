


import * as yup from 'yup';

const cardValidator = yup.object().shape({
    number: yup.string()
        .required('O número do cartão é obrigatório'),
    cvv: yup.string()
        .required('CVV necessário'),
    expirationDate: yup.string().required("Você deve informar uma data de validade para o cartão"),
    type: yup.string().required('O tipo é obrigatório')
});




export { cardValidator }