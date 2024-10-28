export class Cpf {
  static validate(cpf: string): boolean {
    // Remove non-numeric characters
    const cpfOnlyNumber = cpf.replace(/\D/g, '');

    // Check if CPF has 11 digits
    if (cpfOnlyNumber.length !== 11) {
      return false;
    }

    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cpfOnlyNumber)) {
      return false;
    }

    // Validate first digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpfOnlyNumber.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpfOnlyNumber.charAt(9))) {
      return false;
    }

    // Validate second digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpfOnlyNumber.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpfOnlyNumber.charAt(10))) {
      return false;
    }

    return true;
  }
}
