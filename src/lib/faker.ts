import { faker } from "@faker-js/faker";

const leadSources = [
  "Website Form",
  "LinkedIn",
  "Referral",
  "Cold Email",
  "Trade Show",
  "Google Ads",
  "Webinar",
  "Partner",
  "Direct Mail",
];

const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Unqualified",
  "Nurturing",
  "Lost",
];

function generateLead() {
  const name = faker.person.fullName();
  return {
    id: faker.string.uuid(),
    name,
    company: faker.company.name(),
    email: faker.internet.email({
      firstName: name.split(" ")[0].toLowerCase(),
      lastName: name.split(" ")[1].toLowerCase(),
    }),
    source: faker.helpers.arrayElement(leadSources),
    score: faker.number.int({ min: 300, max: 850 }),
    status: faker.helpers.arrayElement(leadStatuses),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const generateLeads = (count: number) => {
  return Array.from({ length: count }, generateLead);
};

export { generateLeads };
