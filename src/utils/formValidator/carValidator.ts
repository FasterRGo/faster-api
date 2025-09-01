import * as yup from "yup";

const carValidator = yup.object().shape({
  model: yup
    .string()
    .required("O modelo é obrigatória")
    .typeError("O modelo deve ser uma string"),
  plate: yup
    .string()
    .required("A placa é obrigatória")
    .typeError("A placa deve ser uma string"),

  year: yup
    .string()
    .required("O ano é obrigatório")
    .typeError("O ano deve ser um número"),
  chassi: yup
    .string()
    .required("O chassi é obrigatório")
    .typeError("O chassi deve ser uma string"),
  brand: yup
    .string()
    .required("A marca é obrigatória")
    .typeError("A marca deve ser um texto"),
});

export { carValidator };
