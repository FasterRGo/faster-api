import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

interface DriverData {
  name: string;
  email: string;
  phoneNumber: string;
  car: {
    model: string;
    brand: string;
    plate: string;
    year: string;
    chassi: string;
  };
}

const driversData: DriverData[] = [
  {
    name: "Carlos Eduardo Silva",
    email: "carlos.silva.driver@gmail.com",
    phoneNumber: "11987654321",
    car: {
      model: "Civic",
      brand: "Honda",
      plate: "ABC1234",
      year: "2020",
      chassi: "9BW12345678901234",
    },
  },
  {
    name: "Maria Fernanda Santos",
    email: "maria.santos.driver@gmail.com",
    phoneNumber: "11976543210",
    car: {
      model: "Corolla",
      brand: "Toyota",
      plate: "DEF5678",
      year: "2021",
      chassi: "9BW23456789012345",
    },
  },
  {
    name: "João Pedro Oliveira",
    email: "joao.oliveira.driver@gmail.com",
    phoneNumber: "11965432109",
    car: {
      model: "Onix",
      brand: "Chevrolet",
      plate: "GHI9012",
      year: "2019",
      chassi: "9BW34567890123456",
    },
  },
  {
    name: "Ana Paula Costa",
    email: "ana.costa.driver@gmail.com",
    phoneNumber: "11954321098",
    car: {
      model: "HB20",
      brand: "Hyundai",
      plate: "JKL3456",
      year: "2022",
      chassi: "9BW45678901234567",
    },
  },
  {
    name: "Roberto Alves Pereira",
    email: "roberto.pereira.driver@gmail.com",
    phoneNumber: "11943210987",
    car: {
      model: "Argo",
      brand: "Fiat",
      plate: "MNO7890",
      year: "2020",
      chassi: "9BW56789012345678",
    },
  },
  {
    name: "Juliana Rodrigues",
    email: "juliana.rodrigues.driver@gmail.com",
    phoneNumber: "11932109876",
    car: {
      model: "208",
      brand: "Peugeot",
      plate: "PQR1234",
      year: "2021",
      chassi: "9BW67890123456789",
    },
  },
  {
    name: "Fernando Lima",
    email: "fernando.lima.driver@gmail.com",
    phoneNumber: "11921098765",
    car: {
      model: "Virtus",
      brand: "Volkswagen",
      plate: "STU5678",
      year: "2022",
      chassi: "9BW78901234567890",
    },
  },
  {
    name: "Patricia Souza",
    email: "patricia.souza.driver@gmail.com",
    phoneNumber: "11910987654",
    car: {
      model: "Kicks",
      brand: "Nissan",
      plate: "VWX9012",
      year: "2020",
      chassi: "9BW89012345678901",
    },
  },
  {
    name: "Ricardo Martins",
    email: "ricardo.martins.driver@gmail.com",
    phoneNumber: "11909876543",
    car: {
      model: "Compass",
      brand: "Jeep",
      plate: "YZA3456",
      year: "2021",
      chassi: "9BW90123456789012",
    },
  },
  {
    name: "Camila Ferreira",
    email: "camila.ferreira.driver@gmail.com",
    phoneNumber: "11998765432",
    car: {
      model: "T-Cross",
      brand: "Volkswagen",
      plate: "BCD7890",
      year: "2022",
      chassi: "9BW01234567890123",
    },
  },
];

export async function DefaultDriver() {
  const password = await hash("Ab123456@", 8);
  let createdCount = 0;
  let skippedCount = 0;

  for (const driverData of driversData) {
    const existingDriver = await prisma.driver.findFirst({
      where: {
        OR: [
          { email: driverData.email },
          { phoneNumber: driverData.phoneNumber },
        ],
      },
    });

    if (!existingDriver) {
      // Verifica se a placa já existe
      const existingCar = await prisma.car.findUnique({
        where: { plate: driverData.car.plate },
      });

      if (!existingCar) {
        await prisma.driver.create({
          data: {
            email: driverData.email,
            password,
            name: driverData.name,
            phoneNumber: driverData.phoneNumber,
            photo: "/uploads/drivers/max-verstappen.png",
            car: {
              create: {
                model: driverData.car.model,
                brand: driverData.car.brand,
                plate: driverData.car.plate,
                year: driverData.car.year,
                chassi: driverData.car.chassi,
              },
            },
          },
        });
        createdCount++;
        console.log(`✅ Motorista ${driverData.name} criado com sucesso`);
      } else {
        skippedCount++;
        console.log(
          `⏭️  Motorista ${driverData.name} pulado - placa ${driverData.car.plate} já existe`
        );
      }
    } else {
      skippedCount++;
      console.log(`⏭️  Motorista ${driverData.name} já existe`);
    }
  }

  console.log(
    `\n📊 Resumo: ${createdCount} motoristas criados, ${skippedCount} já existiam`
  );
}
