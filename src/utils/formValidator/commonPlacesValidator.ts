


import * as yup from 'yup';

const commonPlacesValidator = yup.object().shape({
    latitude: yup.string()
        .required('A latitude inicial é obrigatória')
        .typeError('A latitude inicial deve ser um número')
        .min(-90, 'A latitude inicial deve estar entre -90 e 90')
        .max(90, 'A latitude inicial deve estar entre -90 e 90'),
    longitude: yup.string()
        .required('A latitude inicial é obrigatória')
        .typeError('A latitude inicial deve ser um número')
        .min(-90, 'A latitude inicial deve estar entre -90 e 90')
        .max(90, 'A latitude inicial deve estar entre -90 e 90'),
    icon: yup.string().required("Você precisa informar um ícone"),
    name: yup.string().required("Você precisa informar um nome para esse local")
});




export { commonPlacesValidator }