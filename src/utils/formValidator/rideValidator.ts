


import * as yup from 'yup';

const locationSchema = yup.object().shape({
    latitude: yup.number()
        .required('A latitude inicial é obrigatória')
        .typeError('A latitude inicial deve ser um número')
        .min(-90, 'A latitude inicial deve estar entre -90 e 90')
        .max(90, 'A latitude inicial deve estar entre -90 e 90'),
    longitude: yup.number()
        .required('A latitude inicial é obrigatória')
        .typeError('A latitude inicial deve ser um número')
        .min(-90, 'A latitude inicial deve estar entre -90 e 90')
        .max(90, 'A latitude inicial deve estar entre -90 e 90'),
});


const rideValidator = yup.object().shape({
    from: locationSchema.required(),
    to: locationSchema.required()
});

export { rideValidator }