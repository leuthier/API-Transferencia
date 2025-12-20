import faker from 'k6/x/faker';

export function generateRandomEmail() {
  return faker.person.email();
}

export function generateRandomName() {
  return faker.person.firstName();
}

export function generateRandomPassword() {
  return faker.internet.password();
}

export function generateRandomUser() {
  return {
    email: generateRandomEmail(),
    name: generateRandomName(),
    password: generateRandomPassword()
  };
}