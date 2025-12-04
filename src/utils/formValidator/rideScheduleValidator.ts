import * as yup from "yup";

const locationSchema = yup.object().shape({
  latitude: yup
    .number()
    .required("A latitude inicial é obrigatória")
    .typeError("A latitude inicial deve ser um número")
    .min(-90, "A latitude inicial deve estar entre -90 e 90")
    .max(90, "A latitude inicial deve estar entre -90 e 90"),
  longitude: yup
    .number()
    .required("A latitude inicial é obrigatória")
    .typeError("A latitude inicial deve ser um número")
    .min(-90, "A latitude inicial deve estar entre -90 e 90")
    .max(90, "A latitude inicial deve estar entre -90 e 90"),
});

const scheduleRideValidator = yup.object().shape({
  from: locationSchema.required(),
  to: locationSchema.required(),
  scheduledDate: yup
    .string()
    .required("A data e hora agendada é obrigatória")
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
      "A data deve estar no formato YYYY-mm-DDTHH:mm:ssZ"
    ),
  maxPassengers: yup
    .number()
    .integer("O número máximo de passageiros deve ser um número inteiro")
    .min(1, "O número máximo de passageiros deve ser pelo menos 1")
    .max(3, "O número máximo de passageiros não pode exceder 3")
    .required("O número máximo de passageiros é obrigatório"),
});

export { scheduleRideValidator };
