export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  let nums = digits;
  if (nums.startsWith("8")) nums = "7" + nums.slice(1);
  if (!nums.startsWith("7")) nums = "7" + nums;
  nums = nums.slice(0, 11);

  const part1 = nums.slice(1, 4);
  const part2 = nums.slice(4, 7);
  const part3 = nums.slice(7, 9);
  const part4 = nums.slice(9, 11);

  let result = "+7";
  if (nums.length > 1) result += ` (${part1}`;
  if (nums.length >= 4) result += `)`;
  if (nums.length >= 5) result += ` ${part2}`;
  if (nums.length >= 8) result += `-${part3}`;
  if (nums.length >= 10) result += `-${part4}`;
  return result;
}

export function isPhoneValid(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11;
}
