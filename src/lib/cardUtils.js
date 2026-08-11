export function getCardSystem(cardNumber) {
  const sanitized = String(cardNumber).replace(/\D/g, '');
  if (!sanitized) return null;
  
  const firstTwo = parseInt(sanitized.slice(0, 2), 10);
  const firstOne = parseInt(sanitized[0], 10);
  const firstFour = parseInt(sanitized.slice(0, 4), 10);
  const firstSix = parseInt(sanitized.slice(0, 6), 10);

  // Visa
  if (firstOne === 4) return 'visa';
  // Mastercard (новые и старые диапазоны)
  if ((firstTwo >= 51 && firstTwo <= 55) || (firstFour >= 2221 && firstFour <= 2720)) return 'mastercard';
  // МИР (основные диапазоны)
  if (firstFour >= 2200 && firstFour <= 2204) return 'mir';
  // American Express
  if (firstTwo === 34 || firstTwo === 37) return 'amex';
  // JCB
  if (firstFour >= 3528 && firstFour <= 3589) return 'jcb';
  // UnionPay
  if (firstTwo === 62) return 'unionpay';

  return null;
}


export function luhnCheck(cardNumber) {
  const sanitized = String(cardNumber).replace(/\D/g, '');
  if (!sanitized.length) return false;
  
  let sum = 0;
  let shouldDouble = false;
  // Проходим справа налево
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10);
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}