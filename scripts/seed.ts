const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Data Science" },
        { name: "Microsoft" },
        { name: "Web Development" },
        { name: "Graphics" },
        { name: "Accounting" },
        { name: "Engineering" },
        { name: "Videography and Photography" },
      ],
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
