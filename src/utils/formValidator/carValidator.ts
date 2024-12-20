import * as yup from "yup";

const carValidator = yup.object().shape({
  model: yup
    .string()
    .required("A latitude inicial é obrigatória")
    .typeError("A latitude inicial deve ser um número"),
  plate: yup
    .string()
    .required("A latitude inicial é obrigatória")
    .typeError("A latitude inicial deve ser um número"),

  year: yup
    .string()
    .required("A latitude inicial é obrigatória")
    .typeError("A latitude inicial deve ser um número"),
  chassi: yup
    .string()
    .required("A latitude inicial é obrigatória")
    .typeError("A latitude inicial deve ser um número"),
  brand: yup
    .string()
    .required("A latitude inicial é obrigatória")
    .typeError("A latitude inicial deve ser um número"),
});

export { carValidator };
